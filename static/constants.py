"""Place for storing useful constants"""
# pylint: skip-file

import json

KE_CP_OP_CODES = {
    "KE_RESERVED": 0x00,  # Reserved
    "KE_ACK": 0x01,  # Positive acknowledgment
    "KE_NACK": 0x02,  # Negative acknowledgment
    "KE_HEARTBEAT": 0x03,  # Heartbeat
    "KE_SYS_READY": 0x04,  # System ready (GUI)
    "KE_PID_STREAM_NEW": 0x05,  # Clear current PID request and add new PID(s)
    "KE_PID_STREAM_ADD": 0x06,  # Add PID request to current stream
    "KE_PID_STREAM_REMOVE": 0x07,  # Remove PID request from current stream
    "KE_PID_STREAM_CLEAR": 0x08,  # Clear all PID request from current stream
    "KE_PID_STREAM_REPORT": 0x09,  # Report PID Data
    "KE_LCD_ENABLE": 0x0A,  # Enable the LCD display
    "KE_LCD_DISABLE": 0x0B,  # Disable the LCD display
    "KE_LCD_POWER_CYCLE": 0x0C,  # Power cycle the LCD display
    "KE_LCD_FORCE_BRIGHTNESS": 0x0D,  # Force an LCD brightness (volatile)
    "KE_LCD_AUTO_BRIGHTNESS": 0x0E,  # Re-enable standard LCD brightness control
    "KE_USB_ENABLE": 0x0F,  # Enable the USB power
    "KE_USB_DISABLE": 0x10,  # Disable the USB power
    "KE_USB_POWER_CYCLE": 0x11,  # Power cycle the USB power
    "KE_POWER_ENABLE": 0x12,  # Enable Power
    "KE_POWER_DISABLE": 0x13,  # Disable Power
    "KE_POWER_CYCLE": 0x14,  # Power cycle
    "KE_FIRMWARE_REQ": 0x15,  # Request firmware version
    "KE_FIRMWARE_REPORT": 0x16,  # Report firmware version
    "KE_FIRMWARE_UPDATE": 0x17,  # Place device in firmware update mode
    "KE_ACTIVE_COOLING": 0x18,  # Enable or disable active cooling
}

PID_UNITS = {
    "n/a": "",
    "PID_UNITS_RESERVED": 0x00,
    "PID_UNITS_PERCENT": 0x01,
    "PID_UNITS_CELSIUS": 0x02,
    "PID_UNITS_FAHRENHEIT": 0x03,
    "PID_UNITS_KPA": 0x04,
    "PID_UNITS_PSI": 0x05,
    "PID_UNITS_RPM": 0x06,
    "PID_UNITS_KMH": 0x07,
    "PID_UNITS_MPH": 0x08,
    "PID_UNITS_GRAMSEC": 0x09,
    "PID_UNITS_DEGREES": 0x0A,
    "PID_UNITS_VOLTS": 0x0B,
    "PID_UNITS_KM": 0x0C,
    "PID_UNITS_MILES": 0x0D,
    "PID_UNITS_SECONDS": 0x0E,
    "PID_UNITS_RATIO": 0x0F,
    "PID_UNITS_LPH": 0x10,
    "PID_UNITS_BAR": 0x11,
    "PID_UNITS_G_FORCE": 0x12,
    "PID_UNITS_NONE": 0x13,
}

PID_UNIT_LABEL = {
    "PID_UNITS_RESERVED": "",
    "PID_UNITS_PERCENT": "%",
    "PID_UNITS_CELSIUS": "\u00b0C",
    "PID_UNITS_FAHRENHEIT": "\u00b0F",
    "PID_UNITS_KPA": "kPa",
    "PID_UNITS_PSI": "psi",
    "PID_UNITS_RPM": "",
    "PID_UNITS_KMH": "kmh",
    "PID_UNITS_MPH": "mph",
    "PID_UNITS_GRAMSEC": "g/s",
    "PID_UNITS_DEGREES": "\u00b0",
    "PID_UNITS_VOLTS": "V",
    "PID_UNITS_KM": "km",
    "PID_UNITS_MILES": "mi",
    "PID_UNITS_SECONDS": "s",
    "PID_UNITS_RATIO": ":1",
    "PID_UNITS_LPH": "lpm",
    "PID_UNITS_BAR": "bar",
    "PID_UNITS_G_FORCE": "G",
    "PID_UNITS_NONE": "",
}

KE_PID = {
    "0x0104": {
        "name": "CALCULATED_ENGINE_LOAD",
        "shortName": "Load",
        "shortDesc": "Calc Load",
        "units": {
            "PID_UNITS_PERCENT": {"Min": 0, "Max": 100, "decimals": "1"},
        },
    },
    "0x0105": {
        "name": "ENGINE_COOLANT_TEMPERATURE",
        "shortName": "ECT",
        "shortDesc": "Coolant Temp",
        "units": {
            "PID_UNITS_CELSIUS": {"Min": -40, "Max": 215, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x0106": {
        "name": "SHORT_TERM_FUEL_TRIM__BANK_1",
        "shortName": "STFT1",
        "shortDesc": "Short Fuel Trim 1",
        "units": {
            "PID_UNITS_PERCENT": {"Min": -100, "Max": 99.2, "decimals": "1"},
        },
    },
    "0x0107": {
        "name": "LONG_TERM_FUEL_TRIM__BANK_1",
        "shortName": "LTFT1",
        "shortDesc": "Long Fuel Trim 1",
        "units": {
            "PID_UNITS_PERCENT": {"Min": -100, "Max": 99.2, "decimals": "1"},
        },
    },
    "0x010B": {
        "name": "INTAKE_MANIFOLD_ABSOLUTE_PRESSURE",
        "shortName": "MAP",
        "shortDesc": "Manifold Abs Press",
        "units": {
            "PID_UNITS_KPA": {"Min": 0, "Max": 255, "decimals": "0"},
            "PID_UNITS_PSI": {"Min": 0, "Max": 36, "decimals": "1"},
            "PID_UNITS_BAR": {"Min": 0, "Max": 2.55, "decimals": "2"},
        },
    },
    "0x010C": {
        "name": "ENGINE_SPEED",
        "shortName": "RPM",
        "shortDesc": "Engine speed",
        "units": {
            "PID_UNITS_RPM": {"Min": 0, "Max": 8000, "decimals": "0"},
        },
    },
    "0x010D": {
        "name": "VEHICLE_SPEED",
        "shortName": "Speed",
        "shortDesc": "Speed",
        "units": {
            "PID_UNITS_KMH": {"Min": 0, "Max": 270, "decimals": "0"},
            "PID_UNITS_MPH": {"Min": 0, "Max": 180, "decimals": "0"},
        },
    },
    "0x010E": {
        "name": "TIMING_ADVANCE",
        "shortName": "Timing",
        "shortDesc": "Timing Advance",
        "units": {
            "PID_UNITS_DEGREES": {"Min": -64, "Max": 63.5, "decimals": "1"},
        },
    },
    "0x010F": {
        "name": "INTAKE_AIR_TEMPERATURE",
        "shortName": "IAT",
        "shortDesc": "Intake Air Temp",
        "units": {
            "PID_UNITS_CELSIUS": {"Min": -40, "Max": 200, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x0111": {
        "name": "THROTTLE_POSITION",
        "shortName": "Throttle",
        "shortDesc": "Throttle",
        "units": {
            "PID_UNITS_PERCENT": {"Min": 0, "Max": 100, "decimals": "1"},
        },
    },
    "0x0133": {
        "name": "ABSOLUTE_BAROMETRIC_PRESSURE",
        "shortName": "Baro",
        "shortDesc": "Barometric",
        "units": {
            "PID_UNITS_KPA": {"Min": 0, "Max": 255, "decimals": "0"},
            "PID_UNITS_PSI": {"Min": 0, "Max": 36, "decimals": "1"},
            "PID_UNITS_BAR": {"Min": 0, "Max": 2.55, "decimals": "2"},
        },
    },
    "0x015A": {
        "name": "RELATIVE_ACCELERATOR_PEDAL_POSITION",
        "shortName": "APP",
        "shortDesc": "Accel Pedal Pos",
        "units": {
            "PID_UNITS_PERCENT": {"Min": 0, "Max": 100, "decimals": "0"},
        },
    },
    "0x015C": {
        "name": "ENGINE_OIL_TEMPERATURE",
        "shortName": "Oil Temp",
        "shortDesc": "Oil Temp",
        "units": {
            "PID_UNITS_CELSIUS": {"Min": -40, "Max": 200, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x016F": {
        "name": "TURBOCHARGER_COMPRESSOR_INLET_PRESSURE",
        "shortName": "Boost",
        "shortDesc": "Boost",
        "units": {
            "PID_UNITS_KPA": {"Min": 0, "Max": 170, "decimals": "0"},
            "PID_UNITS_PSI": {"Min": 0, "Max": 24, "decimals": "1"},
            "PID_UNITS_BAR": {"Min": 0, "Max": 1.70, "decimals": "2"},
        },
    },
    "0xC16F": {
        "name": "TURBOCHARGER_COMPRESSOR_INLET_PRESSURE",
        "shortName": "Boost",
        "shortDesc": "Boost/Vacuum",
        "units": {
            "PID_UNITS_KPA": {"Min": -82, "Max": 170, "decimals": "0"},
            "PID_UNITS_PSI": {"Min": -12, "Max": 24, "decimals": "1"},
            "PID_UNITS_BAR": {"Min": -1, "Max": 1.70, "decimals": "2"},
        },
    },
    "0x220301": {
        "name": "MANIFOLD_ABSOLUTE_PRESSURE_SENSOR_VOLTAGE_1",
        "shortName": "MAP",
        "shortDesc": "Manifold Abs Press (V)",
        "units": {
            "PID_UNITS_VOLTS": {"Min": 0, "Max": 5, "decimals": "2"},
        },
    },
    "0x220461": {
        "name": "CHARGE_AIR_TEMPERATURE",
        "shortName": "CAT",
        "shortDesc": "[ST] Charge Air Temp",
        "units": {
            "PID_UNITS_CELSIUS": {"Min": -40, "Max": 200, "decimals": "1"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x2203CA": {
        "name": "MANIFOLD_CHARGE_TEMPERATURE",
        "shortName": "MCT",
        "shortDesc": "[RS] Manifold Charge Temp",
        "units": {
            "PID_UNITS_CELSIUS": {"Min": -40, "Max": 200, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x22057D": {
        "name": "AMBIENT_AIR_TEMPERATURE",
        "shortName": "AAT",
        "shortDesc": "Ambient Air Temp",
        "units": {
            "PID_UNITS_CELSIUS": {"Min": -40, "Max": 200, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x22F43C": {
        "name": "CATALYTIC_TEMPERATURE",
        "shortName": "Cat Temp",
        "shortDesc": "Catalytic Temperature",
        "units": {
            "PID_UNITS_CELSIUS": {"Min": 0, "Max": 1000, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": 0, "Max": 2000, "decimals": "0"},
        },
    },
    "0x0144": {
        "name": "COMMANDED_AIR_TO_FUEL_RATIO",
        "shortName": "Cmd AFR",
        "shortDesc": "Commanded Air-Fuel Ratio",
        "units": {
            "PID_UNITS_RATIO": {"Min": 0, "Max": 29.4, "decimals": "2"},
        },
    },
    "0x0134": {
        "name": "AIR_TO_FUEL_RATIO",
        "shortName": "AFR",
        "shortDesc": "Air-Fuel Ratio (Oxygen Sensor 1)",
        "units": {
            "PID_UNITS_RATIO": {"Min": 0, "Max": 29.4, "decimals": "2"},
        },
    },
    "0xDE0802": {
        "name": "BRAKE_PEDAL_STATUS",
        "shortName": "Brake Pedal",
        "shortDesc": "Brake Pedal",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xDE0C82": {
        "name": "EMERGENCY_BRAKE_STATUS",
        "shortName": "E-Brake",
        "shortDesc": "E-Brake",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xDE0803": {
        "name": "REVERSE_STATUS",
        "shortName": "Reverse",
        "shortDesc": "Reverse",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xDE0301": {
        "name": "CRUISE_CONTROL_ON_BUTTON",
        "shortName": "ON Button",
        "shortDesc": "Cruise Control ON Button",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xDE0302": {
        "name": "CRUISE_CONTROL_OFF_BUTTON",
        "shortName": "OFF Button",
        "shortDesc": "Cruise Control OFF Button",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xC10302": {
        "name": "CRUISE_CONTROL_OFF_BUTTON_TOGGLE",
        "shortName": "OFF Button",
        "shortDesc": "Cruise Control OFF button Toggle",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xDE0303": {
        "name": "CRUISE_CONTROL_SET_PLUS_BUTTON",
        "shortName": "SET+ Button",
        "shortDesc": "Cruise Control SET+ Button",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xDE0304": {
        "name": "CRUISE_CONTROL_SET_MINUS_BUTTON",
        "shortName": "SET- Button",
        "shortDesc": "Cruise Control SET- Button",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xDE0305": {
        "name": "CRUISE_CONTROL_RES_BUTTON",
        "shortName": "RES Button",
        "shortDesc": "Cruise Control RES Button",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xDE0306": {
        "name": "CRUISE_CONTROL_CAN_BUTTON",
        "shortName": "CAN Button",
        "shortDesc": "Cruise Control CAN Button",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 1, "decimals": "0"},
        },
    },
    "0xDE01C8": {
        "name": "GAUGE_BRIGHTNESS",
        "shortName": "Brightness",
        "shortDesc": "Gauge Illum Level",
        "units": {
            "PID_UNITS_NONE": {"Min": 0, "Max": 31, "decimals": "0"},
        },
    },
    "0xDE1802": {
        "name": "LATERAL_ACCELERATION",
        "shortName": "Lat Accel",
        "shortDesc": "Lateral Acceleration",
        "units": {
            "PID_UNITS_G_FORCE": {"Min": -1.5, "Max": 1.5, "decimals": "2"},
        },
    },
    "0xDE1602": {
        "name": "LONGITUDINAL_ACCELERATION",
        "shortName": "Long Accel",
        "shortDesc": "Longitudinal Acceleration",
        "units": {
            "PID_UNITS_G_FORCE": {"Min": -1.5, "Max": 1.5, "decimals": "2"},
        },
    },
}


def get_constants():
    """Return combined constants dictionary"""
    return {
        "KE_PID": KE_PID,
        "KE_CP_OP_CODES": KE_CP_OP_CODES,
        "PID_UNITS": PID_UNITS,
    }


def export_json():
    """This is used by the web app to get Constants.py as JSON"""
    return json.dumps(
        {
            "KE_PID": KE_PID,
            "KE_CP_OP_CODES": KE_CP_OP_CODES,
            "PID_UNITS": PID_UNITS,
            "PID_UNIT_LABEL": PID_UNIT_LABEL,
        }
    )


if __name__ == "__main__":
    print(export_json())
