"""Serial handler class."""
import serial

class Serial():

ser = serial.Serial(
    port='/dev/tty.usbmodem14311',
    baudrate=115200,
    parity=serial.PARITY_ODD,
    stopbits=serial.STOPBITS_TWO,
    bytesize=serial.SEVENBITS
)
ser_val = [0, 0, 0, 0, 0,0]


def Start(self):
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
            count = count + 1

    return ser_val

def UpdateRequirements(self, requirements):
    # TODO Write byte data to micro
    # STUB string with encoding 'utf-8'
    # STUB arr = bytes(requirements, 'utf-8')
    # STUB print(arr)

    # STUB Write our data to the micro
    # STUB ser.write(arr)
