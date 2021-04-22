"""Serial handler class."""
# pylint: skip-file
import serial
import time
from kivy.logger import Logger
import subprocess  # nosec
from static.constants import KE_CP_OP_CODES
import os
import fnmatch
from gpiozero import CPUTemperature

KE_SOL = 0xFF
KE_EOL = 0x0A
KE_PCKT_SOL_POS = 0x00
KE_PCKT_LEN_POS = 0x01
KE_PCKT_CMD_POS = 0x02
KE_PCKT_DATA_START_POS = 0x03
KE_MAX_PAYLOAD = 0x64


class Serial:
    def __init__(self):
        super().__init__()
        self.ser = serial.Serial(
            port="/dev/ttyAMA0",
            baudrate=57600,
            parity=serial.PARITY_NONE,
            stopbits=serial.STOPBITS_ONE,
            bytesize=serial.EIGHTBITS,
            timeout=0.25,
        )
        self.ser.flushInput()
        self.ser_val = [0, 0, 0, 0, 0, 0]
        self.systemFirmware = [0, 0, 0]
        self.hardwareFirmware = [0, 0, 0]
        self.firmwareVerified = False  # False to do a firmware request
        self.data_stream_active = False
        self.requirements = []
        self.fan_speed = 0
        self.queued_message = None
        self.message_pending = False
        self.byte = 0
        self.KE_RX_IN_PROGRESS = False
        self.KE_PCKT_CMPLT = True
        self.rx_abort_count = 0
        self.rx_count = 0
        self.rx_buffer = [0] * KE_MAX_PAYLOAD
        self.tx_buffer = [0] * KE_MAX_PAYLOAD
        self.rx_byte_count = 0
        self.tx_byte_count = 0

    def generateTXMessage(self, cmd):
        # Clear the buffer
        self.tx_buffer = [0] * KE_MAX_PAYLOAD

        # Populate the Start of Line byte
        self.tx_buffer[KE_PCKT_SOL_POS] = KE_SOL

        # Command
        self.tx_buffer[KE_PCKT_CMD_POS] = cmd

        # Align the buffer to start of the data bytes
        self.tx_byte_count = KE_PCKT_DATA_START_POS

        if cmd == KE_CP_OP_CODES["KE_ACK"]:
            # Include Fan Speed
            self.tx_buffer[self.tx_byte_count] = self.fan_speed
            self.tx_byte_count += 1

        # Packet is complete
        self.tx_buffer[self.tx_byte_count] = KE_EOL

        # Byte has been added, increment the byte count
        self.tx_byte_count += 1

        # Populate the length
        self.tx_buffer[KE_PCKT_LEN_POS] = self.tx_byte_count

        # Send the packet
        packet = self.tx_buffer[0 : self.tx_byte_count]
        self.ser.write(packet)

    def KE_Process_Packet(self):
        # Get the payload
        serial_data = self.rx_buffer[KE_PCKT_DATA_START_POS : self.rx_byte_count - 1]

        if self.rx_buffer[KE_PCKT_CMD_POS] == KE_CP_OP_CODES["KE_PID_STREAM_REPORT"]:

            self.data_stream_active = True

            if self.queued_message != None:
                self.ser.write(self.queued_message)
                self.queued_message = None
            else:
                self.generateTXMessage(KE_CP_OP_CODES["KE_ACK"])

            # Payload is ASCII data
            serial_data = "".join(map(chr, serial_data))
            Logger.info("DATA RX'd: " + serial_data)

            key_val = {}

            try:
                # Parameters are comma deliminated
                for val in serial_data.split(","):
                    # Parameters are colon deliminated
                    (pid, units, value) = val.split(":")
                    # Link the data to the PID
                    key_val[str(pid)] = value
            except:
                Logger.error("KE_PID_STREAM_REPORT missing data")

            self.ser_val = key_val

            return self.ser_val

    def service(self, **args):

        cpu = CPUTemperature()

        if( cpu.temperature > 80 ):
            self.fan_speed = 0x03    # Request max fan speed
        elif( cpu.temperature > 76 ):
            self.fan_speed = 0x02    # Request med fan speed
        elif( cpu.temperature > 72 ):
            self.fan_speed = 0x01    # Request min fan speed
        elif( cpu.temperature < 60 ):
            self.fan_speed = 0x00    # Turn off the fan 

        while self.ser.inWaiting():
            byte = self.ser.read()

            if len(byte) > 0:
                byte = ord(byte)

                # Look for a start of line byte
                if byte == KE_SOL:
                    # Check if a current RX is in progress
                    if self.KE_RX_IN_PROGRESS == False:
                        # Increment the number of aborted RX messages
                        self.rx_abort_count += 1

                        # Log the error
                        Logger.error("[KE] SOL Received before message completion")

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

                    # Logger.info( "[KE] SOL Received")

                # A Message is in progress
                elif self.KE_RX_IN_PROGRESS == True:
                    # Verify the UART buffer has room */
                    if self.rx_byte_count >= KE_MAX_PAYLOAD:
                        # Increment the number of aborted RX messages
                        self.rx_abort_count += 1

                        # Log the error
                        Logger.Error("[KE] Maximum payload reached")

                        # Indicate an RX has ended
                        self.KE_RX_IN_PROGRESS == False

                        # Reset the UART buffer, something has gone horribly wrong
                        self.rx_buffer = [0] * KE_MAX_PAYLOAD

                        # Reset the byte count
                        self.rx_byte_count = 0

                        # return KE_BUFFER_FULL;

                    # Add the byte to the buffer
                    self.rx_buffer[self.rx_byte_count] = byte

                    # Increment the byte count
                    self.rx_byte_count += 1

                    # See if the message is complete
                    if self.rx_byte_count == self.rx_buffer[KE_PCKT_LEN_POS]:
                        # Indicate an RX has ended
                        self.KE_RX_IN_PROGRESS == False

                        # Increment the number of received RX messages
                        self.rx_count += 1

                        # Set the Message complete flag
                        self.KE_PCKT_CMPLT = True

                        packet = self.rx_buffer[0 : self.rx_byte_count]

                        # Log the complete message
                        # Logger.info( "[KE] Packet Received" )

                        self.KE_Process_Packet()

                        # return KE_PACKET_COMPLETE;

                    # This should not have happened, abort!
                    elif self.rx_byte_count > self.rx_buffer[KE_PCKT_LEN_POS]:
                        # Increment the number of aborted RX messages
                        self.rx_abort_count += 1

                        # Log the error
                        Logger.error("[KE] Payload greater than expected")

                        # Indicate an RX has ended
                        self.KE_RX_IN_PROGRESS == False

                        # Reset the UART buffer, something has gone horribly wrong
                        self.rx_buffer = [0] * KE_MAX_PAYLOAD

                        # Reset the byte count
                        self.rx_byte_count = 0
                    # return KE_OK;
        return self.ser_val

    def updateRequirements(self, app, pid_byte_code, pids):
        global KE_CP_OP_CODES
        msg = "GUI: Updating requirements: " + str(pid_byte_code)
        Logger.info(msg)

        # Save current PID request
        app.requirements = pids

        # Queue the message
        self.queued_message = pid_byte_code

        if self.data_stream_active == True:
            # Set the flag to transmit the queued message
            self.message_pending = True
        else:
            # No communication is in progress, asynchronously send the message
            self.ser.write(self.queued_message)

        return (1, msg)

    def initialize_hardware(self):
        """
        Handle making sure that our hardware is initialized and
        it is safe to start the main application loop.
        """
        global KE_CP_OP_CODES
        Logger.info("GUI: Initializing hardware")
        
        return (True, "Hardware: Successfully initiated hardware")

    def power_cycle(self):
        """
        Reboot the Raspberry Pi
        """
        global KE_CP_OP_CODES
        ke_power_cycle = [KE_SOL, 0x03, KE_CP_OP_CODES["KE_POWER_CYCLE"]]
        ret = self.ser.write(ke_power_cycle)

        msg = "Wrote : " + str(ret) + " bytes for power cycle"

        Logger.info(msg)
        return (ret, msg)


def buildUpdateRequirementsBytearray(requirements):
    """Function to build bytearray that is passed to micro on view change."""
    global KE_CP_OP_CODES

    index = 0
    pid_byte_code = []
    byte_count = 3
    for requirement in requirements:
        pid_byte_code.append(0x00)  # Spare
        pid_byte_code.append(requirement.unit)  # Units
        if len(requirement.value) == 6:
            pid_byte_code.append((int(requirement.value, 16) >> 8) & 0xFF)  # Mode
            pid_byte_code.append(0x00)  # PID byte 0
        else:
            pid_byte_code.append((int(requirement.value, 16) >> 16) & 0xFF)  # Mode
            pid_byte_code.append((int(requirement.value, 16) >> 8) & 0xFF)  # PID byte 0
        pid_byte_code.append((int(requirement.value, 16)) & 0xFF)  # PID byte 1

        index += 1
        byte_count += 5

    pid_byte_code = [
        KE_SOL,
        byte_count,
        KE_CP_OP_CODES["KE_PID_STREAM_NEW"],
    ] + pid_byte_code
    Logger.info("KE Protocol: Byte code: " + str(pid_byte_code))
    return pid_byte_code
