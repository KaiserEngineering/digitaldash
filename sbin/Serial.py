"""Serial handler class."""
import serial

ser = serial.Serial(
    port='/dev/tty.usbmodem14311',
    baudrate=115200,
    parity=serial.PARITY_ODD,
    stopbits=serial.STOPBITS_TWO,
    bytesize=serial.SEVENBITS
)
ser_val = [0, 0, 0, 0, 0,0]


def serialLoop():
    """Loop for checking Serial connection for data."""
    # Handle grabbing data
    data_line = ser.readline().decode().strip()
    count = 0
    for val in data_line.split(';'):
        try:
            float(val)
            ser_val[count] = val
            count = count + 1
        except ValueError:
            print('Null value')
            count = count + 1

    return ser_val

def updateSerial(bytes):
    """Send bytecode to firmwate for updating incoming data."""
    serial.write(bytes)
