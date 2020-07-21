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
    'KE_POWER_CYCLE'             : 0x14,    # Power cycle
    'KE_FIRMWARE_REQ'            : 0x15,    # Request firmware version
    'KE_FIRMWARE_REPORT'         : 0x16,    # Report firmware version
    'KE_FIRMWARE_UPDATE'         : 0x17     # Place device in firmware update mode
}

KE_PID = {
   "0x0C": {
       'name': 'ENGINE_RPM', 'shortName' : 'RPM', 'decimals' : '0', 'units' : 'RPM',
       'Min' : 0, 'Max' : 8000
    },
   "0x0F": {
       'name': 'INTAKE_AIR_TEMPERATURE', 'shortName' : 'IAT', 'decimals' : '2', 'units' : 'Celcius',
       'Min' : 0, 'Max' : 215
    },
    "0x0B": {
       'name': 'INTAKE_MANIFOLD_ABSOLUTE_PRESSURE', 'shortName' : 'MAP', 'decimals' : '0', 'units' : 'kPa',
       'Min' : 0, 'Max' : 255
    },
    "0x05": {
       'name': 'ENGINE_COOLANT_TEMPERATURE', 'shortName' : 'ECT', 'decimals' : '1', 'units' : 'Celcius'
    },
    "0x04": {
       'name': 'CALCULATED_ENGINE_LOAD', 'shortName' : 'LOAD', 'decimals' : '1', 'units' : '%'
    },
    "0x5C": {
       'name': 'ENGINE_OIL_TEMPERATURE', 'shortName' : 'Oil Temp', 'decimals' : '0', 'uints' : 'Celcius',
        'Min' : 0, 'Max' : 150
    },
    "0x6F": {
       'name': 'TURBO_INLET_PRESSURE', 'shortName' : 'Boost', 'decimals' : '0', 'uints' : 'kPa',
        'Min' : 0, 'Max' : 210
    },
}

def GetConstants():
    return { **KE_PID, **KE_CP_OP_CODES }
