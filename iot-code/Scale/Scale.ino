#include "HX711.h"

HX711 scale(A1, A0);

#define GAP_THRESHOLD 0.1
#define STABLE_THRESHOLD 10

enum class GapCounterState {
  CHANGING, STABLE,
};

struct GapCounter {
  int smallGapCount;
  GapCounterState state;
  float stableAverage;

  GapCounter() {
    smallGapCount = 0;
    stableAverage = 0;
    state = GapCounterState::CHANGING;
  }

  void newGap(float x, float peak) {
    switch (state) {
      case GapCounterState::CHANGING:
        if (x < GAP_THRESHOLD) {
          smallGapCount += 1;
          stableAverage += peak;
          if (smallGapCount >= STABLE_THRESHOLD) {
            Serial.println((int)(stableAverage / smallGapCount));
            state = GapCounterState::STABLE;
          }
        }
        return;
      case GapCounterState::STABLE:
        if (x >= GAP_THRESHOLD) {
          smallGapCount = 0;
          stableAverage = 0;
          state = GapCounterState::CHANGING;
          Serial.println("changing");
        }
        return;
    }
  }

  void stateStuffs() {
    static int loop_count = 0;
    if (state == GapCounterState::STABLE) {
      digitalWrite(LED_BUILTIN, LOW);
    } else {
      loop_count += 1;
      if (loop_count & 1) {
        digitalWrite(LED_BUILTIN, HIGH);
      } else {
        digitalWrite(LED_BUILTIN, LOW);
      }
    }
  }
};

GapCounter gap_counter;

enum class RawReaderState {
  UP, DOWN,
};

struct RawReader {
  float previousValue;
  float startValue;
  RawReaderState state;

  RawReader() {
    startValue = previousValue = -11111;
    state = RawReaderState::UP;
  }

  void newValue(float x) {
    switch (state) {
      case RawReaderState::UP:
        UP_newValue(x);
        return;
      case RawReaderState::DOWN:
        DOWN_newValue(x);
        return;
    }
  }

  void stateStuffs() {
  }

private:
  void UP_newValue(float x) {
    if (x >= previousValue) {
      previousValue = x;
    } else {
      float gap = previousValue - startValue;
      gap_counter.newGap(gap, previousValue);
      
      state = RawReaderState::DOWN;
      startValue = previousValue;
      previousValue = x;
    }
  }

  void DOWN_newValue(float x) {
    if (x <= previousValue) {
      previousValue = x;
    } else {
      float gap = startValue - previousValue;
      gap_counter.newGap(gap, previousValue);
      
      state = RawReaderState::UP;
      startValue = previousValue;
      previousValue = x;
    }
  }
};

RawReader raw_reader;

float calibration_factor = 2000;

void setup() {
  Serial.begin(9600);
  scale.set_scale();
  scale.tare();
  pinMode(LED_BUILTIN, OUTPUT);

  raw_reader = RawReader();
  gap_counter = GapCounter();
  Serial.println("changing");
}

void loop() {
  scale.set_scale(calibration_factor);
  float x = scale.get_units();
  raw_reader.newValue(x);
  
  raw_reader.stateStuffs();
  gap_counter.stateStuffs();
  Serial.println("");
}
