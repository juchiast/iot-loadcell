import serial

with serial.Serial('/dev/ttyUSB0', 9600) as ser:
    while True:
        byte = ser.readline()
        print(byte)
