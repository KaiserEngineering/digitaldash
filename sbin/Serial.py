"""Serial handler class."""
import serial

KE_CP_OP_CODES = {
    'KE_RESERVED'                : 0x00,    # Reserved
    'KE_ACK'                     : 0x01,    # Positive acknowledgment
    'KE_NACK'                    : 0x02,    # Negative acknowledgment
    'KE_HEARTBEAT'               : 0x03,    # Heartbeat
    'KE_SYS_READY'               : 0x04,    # System ready (GUI)
    'KE_PID_STREAM_NEW'          : 0x05,    # Clear current PID request and add new PID(s)
    'KE_PID_STREAM_ADD'          : 0x06,    # Add PID request to current stream
    'KE_PID_STREAM_REMOVE'       : 0x07,    # Remove PID request from current stream
    'KE_PID_STREAM_CLEAR'        : 0x08,    # Clear all PID request from current stream
    'KE_PID_STREAM_REPORT'       : 0x09,    # Report PID Data
    'KE_LCD_ENABLE'              : 0x0A,    # Enable the LCD display
    'KE_LCD_DISABLE'             : 0x0B,    # Disable the LCD display
    'KE_LCD_POWER_CYCLE'         : 0x0C,    # Power cycle the LCD display
    'KE_LCD_FORCE_BRIGHTNESS'    : 0x0D,    # Force an LCD brightness (volatile)
    'KE_LCD_AUTO_BRIGHTNESS'     : 0x0E,    # Re-enable standard LCD brightness control
    'KE_USB_ENABLE'              : 0x0F,    # Enable the USB power
    'KE_USB_DISABLE'             : 0x10,    # Disable the USB power
    'KE_USB_POWER_CYCLE'         : 0x11,    # Power cycle the USB power
    'KE_POWER_ENABLE'            : 0x12,    # Enable Power
    'KE_POWER_DISABLE'           : 0x13,    # Disable Power
    'KE_POWER_POWER_CYCLE'       : 0x14,    # Power cycle
    'KE_FIRMWARE_REQ'            : 0x15,    # Request firmware version
    'KE_FIRMWARE_REPORT'         : 0x16,    # Report firmware version
    'KE_FIRMWARE_UPDATE'         : 0x17     # Place device in firmware update mode
}

class Serial():

    def __init__(self):
        super(Serial, self).__init__()
        self.ser = serial.Serial(
            port='/dev/ttyAMA0',
            baudrate=57600,
            parity=serial.PARITY_NONE,
            stopbits=serial.STOPBITS_ONE,
            bytesize=serial.EIGHTBITS,
	    timeout=0.1
        )
        self.ser.flush()
        self.ser_val = [0, 0, 0, 0, 0, 0]
        self.firmwareVerified = False


    def Start(self):

        if self.firmwareVerified == False:
            print("Requesting Firmware Version..")
            firmware_request = [KE_CP_OP_CODES['KE_FIRMWARE_REQ'], 0x0A]
            self.ser.write(firmware_request)
            self.firmwareVerified = True

        """Loop for checking Serial connection for data."""
        # Handle grabbing data
        data_line = ''

        try:
            data_line = self.ser.readline()
            #print(data_line)

        except Exception as e:
            print("Error occured when reading serial data: " + str(e))

        # There shall always be an opcode and EOL
        if ( len(data_line) < 2 ):
            print("Data packet of length: " + str(len(data_line)) + " received: " + str(data_line))
            return self.ser_val

        # Get the command (Always the 1st byte)
        cmd = data_line[0]

        # Remove the command byte from the payload
        data_line = data_line[1:len(data_line)-1]

        if cmd == KE_CP_OP_CODES['KE_FIRMWARE_REPORT']:
            print(">> "  + data_line.decode() + "\n")

        elif cmd == KE_CP_OP_CODES['KE_POWER_DISABLE']:
            call("sudo nohup shutdown -h now", shell=True)

        elif cmd == KE_CP_OP_CODES['KE_ACK']:
            print(">> ACK" + "\n")

        elif cmd == KE_CP_OP_CODES['KE_PID_STREAM_REPORT']:
            positive_ack = [KE_CP_OP_CODES['KE_ACK'], 0x0A]
            self.ser.write(positive_ack)
            print(data_line)
            print("<< ACK" + "\n")
            count = 0
            data_line = data_line.decode('utf-8')
            for val in data_line.split(';'):
                try:
                    val = float(val)
                    self.ser_val[count] = val
                    count = count + 1
                except ValueError:
                    print("Value error caught for: " + str(val))
                    count = count + 1
            return self.ser_val

        return self.ser_val

    def UpdateRequirements(self, requirements):
        pass
        # TODO Write byte data to micro
        # STUB string with encoding 'utf-8'
        # STUB arr = bytes(requirements, 'utf-8')
        # STUB print(arr)

        # STUB Write our data to the micro
        # STUB ser.write(arr)
