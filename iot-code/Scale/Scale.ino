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
    state = GapCounterState::STABLE;
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
          Serial.println("changing");
          smallGapCount = 0;
          stableAverage = 0;
          state = GapCounterState::CHANGING;
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
  WAITING, UP, DOWN,
};

struct RawReader {
  float previousValue;
  float startValue;
  RawReaderState state;

  RawReader() {
    state = RawReaderState::WAITING;
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

  void newCommand(const String &buf) {
    if (buf == "close") {
      state = RawReaderState::WAITING;
      gap_counter = GapCounter();
      return;
    }

    if (state == RawReaderState::WAITING) {
      if (buf.startsWith("hi ")) {
        scale.set_scale();
        scale.tare();
        startValue = previousValue = -11111;
        state = RawReaderState::UP;
      }
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
String buf;

float calibration_factor = 2000;

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  raw_reader = RawReader();
  gap_counter = GapCounter();
  Serial.println("started");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      Serial.println(buf);
      raw_reader.newCommand(buf);
      buf = "";
    } else {
      buf += c;
    }
  }
  
  scale.set_scale(calibration_factor);
  float x = scale.get_units();
  raw_reader.newValue(x);
  
  raw_reader.stateStuffs();
  gap_counter.stateStuffs();
}
