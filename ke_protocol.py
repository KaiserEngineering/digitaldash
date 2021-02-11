"""Serial handler class."""
import serial
import time
from kivy.logger import Logger
import subprocess #nosec
from static.constants import KE_CP_OP_CODES
from static.constants import PID_UNITS
import os
import fnmatch
from gpiozero import CPUTemperature

UART_SOL                 = 0xFF
UART_PCKT_SOL_POS        = 0x00
KE_PCKT_LEN_POS          = 0x01
KE_PCKT_CMD_POS          = 0x02
KE_PCKT_DATA_START_POS   = 0x03
KE_MAX_PAYLOAD           = 0x64

class Serial():
    def __init__(self):
        super(Serial, self).__init__()
        self.ser = serial.Serial(
            port='/dev/ttyAMA0',
            baudrate=57600,
            parity=serial.PARITY_NONE,
            stopbits=serial.STOPBITS_ONE,
            bytesize=serial.EIGHTBITS,
            timeout=1
        )
        self.ser.flushInput()
        self.ser_val            = [0, 0, 0, 0, 0, 0]
        self.systemFirmware     = [0, 0, 0]
        self.hardwareFirmware   = [0, 0, 0]
        self.firmwareVerified   = False  #False to do a firmware request
        self.data_stream_active = False
        self.requirements       = []
        self.fan_speed          = 0
        self.queued_message     = None
        self.message_pending    = False
        self.byte               = 0
        self.KE_RX_IN_PROGRESS  = False
        self.KE_PCKT_CMPLT      = True
        self.rx_abort_count     = 0
        self.rx_count           = 0
        self.rx_buffer          = [0] * KE_MAX_PAYLOAD
        self.rx_byte_count      = 0

    def KE_Process_Packet( self ):
        # Get the payload
        serial_data = self.rx_buffer[KE_PCKT_DATA_START_POS : self.rx_byte_count - 4]

        if( self.rx_buffer[KE_PCKT_CMD_POS] == KE_CP_OP_CODES['KE_PID_STREAM_REPORT'] ):

            # Todo generate the code
            response = [UART_SOL, 0x04, KE_CP_OP_CODES['KE_ACK'], self.fan_speed ]
            Logger.info("GUI: << ACK" + "\n")

            # Send the response
            self.ser.write(response)

            # Payload is ASCII data
            serial_data = "".join(map(chr, serial_data ))
            Logger.info("DATA RX'd: " + serial_data)

            key_val = {}

            # Parameters are comma deliminated
            for val in serial_data.split(','):
                # Parameters are colon deliminated
                (pid, units, value) = val.split(':')
                # Link the data to the PID
                key_val[str(pid)] = value
            self.ser_val = key_val

            return self.ser_val

    def start(self, **args):

        byte = self.ser.read()

        if( len(byte) > 0 ):
            byte = ord( byte )

            # Look for a start of line byte
            if( byte == UART_SOL ):
                # Check if a current RX is in progress
                if ( self.KE_RX_IN_PROGRESS == False ):
                    # Increment the number of aborted RX messages
                    self.rx_abort_count += 1

                    # Log the error
                    Logger.error( "[KE] SOL Received before message completion")

                # Start of a new message, reset the buffer
                self.rx_buffer = [0] * KE_MAX_PAYLOAD

                # Reset the byte count
                self.rx_byte_count = 0

                # Add the byte to the buffer
                self.rx_buffer[self.rx_byte_count] = byte

                # Increment the byte count
                self.rx_byte_count += 1

                # Indicate an RX is in progress
                self.KE_RX_IN_PROGRESS = True

                Logger.info( "[KE] SOL Received")

            # A Message is in progress
            elif ( self.KE_RX_IN_PROGRESS == True ):
                # Verify the UART buffer has room */
                if( self.rx_byte_count >= KE_MAX_PAYLOAD ):
                    # Increment the number of aborted RX messages
                    self.rx_abort_count += 1

                    # Log the error
                    Logger.Error( "[KE] Maximum payload reached")

                    # Indicate an RX has ended
                    self.KE_RX_IN_PROGRESS == False

                    # Reset the UART buffer, something has gone horribly wrong
                    self.rx_buffer = [0] * KE_MAX_PAYLOAD

                    # Reset the byte count
                    self.rx_byte_count = 0

                    #return KE_BUFFER_FULL;

                # Add the byte to the buffer
                self.rx_buffer[self.rx_byte_count] = byte

                # Increment the byte count
                self.rx_byte_count += 1

                # See if the message is complete
                if( self.rx_byte_count == self.rx_buffer[ KE_PCKT_LEN_POS ] ):
                    # Indicate an RX has ended
                    self.KE_RX_IN_PROGRESS == False

                    # Increment the number of received RX messages
                    self.rx_count += 1

                    # Set the Message complete flag
                    self.KE_PCKT_CMPLT = True;

                    packet = self.rx_buffer[0:self.rx_byte_count]

                    # Log the complete message
                    Logger.info( "[KE] Packet Received" )

                    self.KE_Process_Packet()

                    #return KE_PACKET_COMPLETE;

                # This should not have happened, abort!
                elif ( self.rx_byte_count > self.rx_buffer[ KE_PCKT_LEN_POS ] ):
                    # Increment the number of aborted RX messages
                    self.rx_abort_count += 1

                    # Log the error
                    Logger.Error( "[KE] Payload greater than expected")

                    # Indicate an RX has ended
                    self.KE_RX_IN_PROGRESS == False

                    # Reset the UART buffer, something has gone horribly wrong
                    self.rx_buffer = [0] * KE_MAX_PAYLOAD

                    # Reset the byte count
                    self.rx_byte_count = 0
                #return KE_OK;
        return self.ser_val

    def update_requirements(self, app, pid_byte_code, pids):
        global KE_CP_OP_CODES
        msg = "GUI: Updating requirements: " + str(pid_byte_code)
        Logger.info( msg )

        # Save current PID request
        app.requirements = pids

        # Queue the message
        self.queued_message = pid_byte_code

        if self.data_stream_active == True:
            # Set the flag to transmit the queued message
            self.message_pending = True
        else:
            # No communication is in progress, asynchronously send the message
            self.ser.write( self.queued_message )

        return( 1, msg )

    def initialize_hardware( self ):
        """
            Handle making sure that our hardware is initialized and
            it is safe to start the main application loop.
        """
        global KE_CP_OP_CODES
        Logger.info( "GUI: Initializing hardware" )

        while self.firmwareVerified != True:
            Logger.info("GUI: Requesting Firmware Version..")
            firmware_request = [UART_SOL, 0x03, KE_CP_OP_CODES['KE_FIRMWARE_REQ']]
            self.ser.write(firmware_request)

            # Wait for the MCU to receive the request and respond
            time.sleep(1)
            data_line = self.ser.readline()

            # Remove the command byte from the payload
            data_line = data_line[ UART_PCKT_DATA_START_POS :len(data_line) - 1 ]
            Logger.info("GUI: Firmware Version Received: " +  data_line.decode() )

            for file_name in os.listdir("../ford-focus-binary"):
                if fnmatch.fnmatch(file_name, '*.hex'):
                    try:
                        #Drop the hex extension
                        fw = file_name.split('.')

                        #Get the Major, Minor, and Patch
                        fw = fw[0].split('_')

                        self.systemFirmware[0] = int(fw[0])
                        self.systemFirmware[1] = int(fw[1])
                        self.systemFirmware[2] = int(fw[2])
                        Logger.info("File firmware version: "  + fw[0] + "." + fw[1] + "." + fw[2])
                    except:
                        Logger.warning("Hex file misaligned")
            try:
                fw = data_line.decode()
                fw = fw.split('.')
                self.hardwareFirmware[0] = int(fw[0])
                self.hardwareFirmware[1] = int(fw[1])
                self.hardwareFirmware[2] = int(fw[2])
                Logger.info("Hardware firmware version: "  + fw[0] + "." + fw[1] + "." + fw[2])

                fwUpdateReq = False

                if self.systemFirmware[0] > self.hardwareFirmware[0]:
                    fwUpdateReq = True
                else:
                    if self.systemFirmware[1] > self.hardwareFirmware[2]:
                        fwUpdateReq = True
                    else:
                        if self.systemFirmware[2] > self.hardwareFirmware[2]:
                            fwUpdateReq = True

                if fwUpdateReq == False:
                    Logger.info("Firmware Up To Date")
                    self.firmwareVerified = True
                else :
                    Logger.warning("Firmware Update Required")
                    command = "sh ../ford-focus-binary/flash.sh"
                    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE) # nosec
                    process.wait()
            except:
                Logger.warning("Firmware decode misaligned")

        return ( True, "Hardware: Successfully initiated hardware" )

    def power_cycle( self ):
        """
           Reboot the Raspberry Pi
        """
        global KE_CP_OP_CODES
        ke_power_cycle = [UART_SOL, 0x03, KE_CP_OP_CODES['KE_POWER_CYCLE']]
        ret = self.ser.write(ke_power_cycle)

        msg = "Wrote : " + str(ret) + " bytes for power cycle"

        Logger.info( msg )
        return ( ret, msg )


def build_update_requirements_bytearray(units, requirements):
    '''Function to build bytearray that is passed to micro on view change.'''
    global KE_CP_OP_CODES

    index         = 0
    pid_byte_code = []
    byte_count    = 3
    for requirement in requirements:
        pid_byte_code.append( 0x00 )                                     # Spare
        pid_byte_code.append( PID_UNITS[units[requirement]] )            # Units
        if len(requirement) == 6:
            pid_byte_code.append( ( int(requirement,16) >> 8 ) & 0xFF )  # Mode
            pid_byte_code.append( 0x00 )                                 # PID byte 0
        else:
            pid_byte_code.append( ( int(requirement,16) >> 16 ) & 0xFF ) # Mode
            pid_byte_code.append( ( int(requirement,16) >> 8 ) & 0xFF )  # PID byte 0
        pid_byte_code.append( ( int(requirement,16) ) & 0xFF )           # PID byte 1

        index += 1
        byte_count += 5

    pid_byte_code = [ UART_SOL , byte_count, KE_CP_OP_CODES['KE_PID_STREAM_NEW'] ] + pid_byte_code
    Logger.info( "KE Protocol: Byte code: " + str(pid_byte_code) )
    return pid_byte_code
