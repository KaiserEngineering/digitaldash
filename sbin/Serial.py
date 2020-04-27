"""Serial handler class."""
import serial
import time
from kivy.logger import Logger
from subprocess import call
from static import Constants
import os
import fnmatch

UART_SOL                 = 0xFF
UART_PCKT_SOL_POS        = 0x00
UART_PCKT_LEN_POS        = 0x01
UART_PCKT_CMD_POS        = 0x02
UART_PCKT_DATA_START_POS = 0x03

KE_CODES = Constants.GetConstants()


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
        self.ser_val = [0, 0, 0, 0, 0, 0]
        self.systemFirmware = [0, 0, 0]
        self.hardwareFirmware = [0, 0, 0]
        self.firmwareVerified = False  #False to do a firmware request
        self.requirements = []


    def Start(self):
        global KE_CODES

        """L1612773-4oop for checking Serial connection for data."""
        # Handle grabbing data
        data_line = ''

        try:
            data_line = self.ser.readline()

        except Exception as e:
            Logger.error("Error occured when reading serial data: " + str(e))

        # There shall always be an opcode and EOL
        if ( len(data_line) < 2 ):
            self.UpdateRequirements( self.requirements )
            Logger.info("GUI: Data packet of length: " + str(len(data_line)) + " received: " + str(data_line))
            return self.ser_val

        #Logger.info("RAW DATA: " +  str(data_line) )

        # Get the command (Always the 1st byte)
        cmd = data_line[ UART_PCKT_CMD_POS ]

        # Remove the command byte from the payload
        data_line = data_line[ UART_PCKT_DATA_START_POS :len(data_line) - 1 ]

        if cmd == KE_CODES['KE_FIRMWARE_REPORT']:
            Logger.info("GUI: >> [FIRMWARE VERSION] "  + data_line.decode() + "\n")

        elif cmd == KE_CODES['KE_POWER_DISABLE']:
            Logger.info("SYS: Shutdown received")
            positive_ack = [UART_SOL, 0x03, KE_CODES['KE_ACK']]
            self.ser.write(positive_ack)
            call("sudo nohup shutdown -h now", shell=True)

        elif cmd == KE_CODES['KE_ACK']:
            Logger.info("GUI: >> ACK RX'd" + "\n")

        elif cmd == KE_CODES['KE_PID_STREAM_REPORT']:
            positive_ack = [UART_SOL, 0x03, KE_CODES['KE_ACK']]
            self.ser.write(positive_ack)
            Logger.info("Clipped Data: " + str(data_line))
            Logger.info("GUI: << ACK" + "\n")
            count = 0
            data_line = data_line.decode('utf-8', 'ignore')
            for val in data_line.split(';'):
                try:
                    val = float(val)
                    self.ser_val[count] = val
                    count = count + 1
                except ValueError:
                    print("Value error caught for: " + str(val))
                    count = count + 1
            #self.ser_val[2] = self.ser.inWaiting()
            #self.ser.flushInput()
            return self.ser_val

        return self.ser_val

    def UpdateRequirements(self, requirements):
        global KE_CODES
        Logger.info("GUI: Updating requirements: " + str(requirements))

        #Save current PID request
        self.requirements = requirements

        pid_byte_code = []
        byte_count    = 3
        for requirement in requirements:
            try:
                pid_byte_code.append( (KE_CODES[requirement]['byteCode'] >> 0x8) & 0xFF )
                pid_byte_code.append( (KE_CODES[requirement]['byteCode'] >> 0x0) & 0xFF )

                byte_count += 2
            except Exception as e:
                Logger.error( "Could not load byte code for "+requirement+" : "+str(e) )

        bytes_written = self.ser.write( [ UART_SOL , byte_count, KE_CODES['KE_PID_STREAM_NEW']]+ pid_byte_code );

        msg = "PIDs updated " + str( bytes_written ) + " written"
        Logger.info( msg )

        return( 1, msg )

    def InitializeHardware( self ):
        """
            Handle making sure that our hardware is initialized and
            it is safe to start the main application loop.
        """
        global KE_CODES
        Logger.info( "GUI: Initializing hardware" )

        while self.firmwareVerified != True:
            Logger.info("GUI: Requesting Firmware Version..")
            firmware_request = [UART_SOL, 0x03, KE_CODES['KE_FIRMWARE_REQ']]
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
                    self.firmwareVerified = True #TODO, STLINK Utility
            except:
                Logger.warning("Firmware decode misaligned")

        return ( True, "Hardware: Successfully initiated hardware" )

    def ResetHardware( self ):
        """
            Re-run the hardware initialize function.
        """
        global KE_CODES

        # STUB FOR @MATT
            # Reboot the hardware here
        # END STUB

        # After reboot attempt to initialize the hardware again
        return ( self.InitializeHardware() )

    def PowerCycle( self ):
       """
          Reboot the Raspberry Pi
       """
       global KE_CODES
       ke_power_cycle = [UART_SOL, 0x03, KE_CODES['KE_POWER_CYCLE']]
       ret = self.ser.write(ke_power_cycle)

       msg = "Wrote : " + str(ret) + " bytes for power cycle"

       Logger.info( msg )
       return ( ret, msg )
