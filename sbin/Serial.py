"""Serial handler class."""
import serial
from kivy.logger import Logger

EOL = 0x0A

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
            baudrate=115200,
            parity=serial.PARITY_NONE,
            stopbits=serial.STOPBITS_ONE,
            bytesize=serial.EIGHTBITS,
            timeout=1
        )
        self.ser.flushInput()
        self.ser_val = [0, 0, 0, 0, 0, 0]
        self.firmwareVerified = False
        self.currentByte = 0
        self.rxBuffer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        self.firmwareVersion = ""


    def Start(self):

        # Verify the firmware is up to date
        if self.firmwareVerified == False:
            Logger.debug("GUI: Requesting Firmware Version..")
            firmware_request = [KE_CP_OP_CODES['KE_FIRMWARE_REQ'], 0x0A]
            self.ser.write(firmware_request)
            self.firmwareVerified = True
            time.sleep(1)
            # TODO: update if required

        #====Begin main serial loop====
        
        # See if any bytes are in the buffer
        if self.ser.inWaiting() > 0:
            rxByte = 0
            try:
                # Read the byte in the buffer
                rxByte = self.ser.read(1)

                # Log the byte
                Logger.info("[MCU] Byte received " + str(rxByte))

                # Check if it is the start of a new message
                if rxByte == b'\xff':
                    self.currentByte = 0
                    Logger.info( "[MCU] UART_SOL recieved")

                # Save the byte to the buffer
                self.rxBuffer[ self.currentByte ] = rxByte

                # Increment the byte count
                self.currentByte = self.currentByte + 1

                # Show the current buffer
                if self.currentByte == int.from_bytes( self.rxBuffer[UART_PCKT_LEN_POS], "big"  ):
                #if hex(self.currentByte) == self.rxBuffer[UART_PCKT_LEN_POS]:
                    Logger.info("[RX BUFFER] " + str( self.rxBuffer ) )
                    if int.from_bytes( self.rxBuffer[UART_PCKT_CMD_POS], "big") == KE_CP_OP_CODES['KE_FIRMWARE_REPORT']:
                        firmware = self.rxBuffer[UART_PCKT_DATA_START_POS:self.currentByte]
                        Logger.info("[MCU] Firmware Report " + str(firmware) )

            except Exception as e:
                Logger.error( "Error occured when reading byte " + str(e))

        return self.ser_val

    def UpdateRequirements(self, requirements):
        Logger.info("GUI: Updating requirements: " + str(requirements))
        pid_request = [ UART_SOL , 0x07, KE_CP_OP_CODES['KE_PID_STREAM_NEW'],  0x00, 0x0C, 0x00, 0x33 ]
        #self.ser.write( pid_request );
        # TODO Write byte data to micro
        # STUB string with encoding 'utf-8'
        # STUB arr = bytes(requirements, 'utf-8')
        # STUB print(arr)

        # STUB Write our data to the micro
        # STUB ser.write(arr)

    def PowerCycle(self):
        pass
