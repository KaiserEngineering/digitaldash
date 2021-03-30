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
    "PID_UNITS_CELCIUS": 0x02,
    "PID_UNITS_FAHRENHEIT": 0x03,
    "PID_UNITS_KPA": 0x04,
    "PID_UNITS_PSI": 0x05,
    "PID_UNITS_RPM": 0x06,
    "PID_UNITS_KMH": 0x07,
    "PID_UNITS_MPH": 0x08,
    "PID_UNITS_GRAMSEC": 0x09,
    "PID_UNITS_DEGREES": 0x0A,
}

PID_UNIT_LABEL = {
    "PID_UNITS_RESERVED": "",
    "PID_UNITS_PERCENT": "%",
    "PID_UNITS_CELCIUS": "\u00b0C",
    "PID_UNITS_FAHRENHEIT": "\u00b0F",
    "PID_UNITS_KPA": "kPa",
    "PID_UNITS_PSI": "psi",
    "PID_UNITS_RPM": "",
    "PID_UNITS_KMH": "kmh",
    "PID_UNITS_MPH": "mph",
    "PID_UNITS_GRAMSEC": "g/s",
    "PID_UNITS_DEGREES": "\u00b0",
}

KE_PID = {
    "0x0104": {
        "name": "CALCULATED_ENGINE_LOAD",
        "shortName": "Load",
        "units": {
            "PID_UNITS_PERCENT": {"Min": 0, "Max": 100, "decimals": "0"},
        },
    },
    "0x0105": {
        "name": "ENGINE_COOLANT_TEMPERATURE",
        "shortName": "ECT",
        "units": {
            "PID_UNITS_CELCIUS": {"Min": -40, "Max": 215, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x010A": {
        "name": "FUEL_PRESSURE",
        "shortName": "ECT",
        "units": {
            "PID_UNITS_KPA": {"Min": 0, "Max": 765, "decimals": "0"},
            "PID_UNITS_PSI": {"Min": 0, "Max": 110, "decimals": "1"},
        },
    },
    "0x010B": {
        "name": "INTAKE_MANIFOLD_ABSOLUTE_PRESSURE",
        "shortName": "MAP",
        "units": {
            "PID_UNITS_KPA": {"Min": 0, "Max": 255, "decimals": "0"},
            "PID_UNITS_PSI": {"Min": 0, "Max": 36, "decimals": "1"},
        },
    },
    "0x010C": {
        "name": "ENGINE_SPEED",
        "shortName": "RPM",
        "units": {
            "PID_UNITS_RPM": {"Min": 0, "Max": 8000, "decimals": "0"},
        },
    },
    "0x010D": {
        "name": "VEHICLE_SPEED",
        "shortName": "Speed",
        "units": {
            "PID_UNITS_KMH": {"Min": 0, "Max": 270, "decimals": "0"},
            "PID_UNITS_MPH": {"Min": 0, "Max": 180, "decimals": "0"},
        },
    },
    "0x010E": {
        "name": "TIMING_ADVANCE",
        "shortName": "Timing",
        "units": {
            "PID_UNITS_DEGREES": {"Min": -64, "Max": 63.5, "decimals": "1"},
        },
    },
    "0x010F": {
        "name": "INTAKE_AIR_TEMPERATURE",
        "shortName": "IAT",
        "units": {
            "PID_UNITS_CELCIUS": {"Min": -40, "Max": 200, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x0133": {
        "name": "ABSOLUTE_BAROMETRIC_PRESSURE",
        "shortName": "Baro",
        "units": {
            "PID_UNITS_KPA": {"Min": 0, "Max": 255, "decimals": "0"},
            "PID_UNITS_PSI": {"Min": 0, "Max": 36, "decimals": "1"},
        },
    },
    "0x015A": {
        "name": "RELATIVE_ACCELERATOR_PEDAL_POSITION",
        "shortName": "APP",
        "units": {
            "PID_UNITS_PERCENT": {"Min": 0, "Max": 100, "decimals": "0"},
        },
    },
    "0x015C": {
        "name": "ENGINE_OIL_TEMPERATURE",
        "shortName": "Oil Temp",
        "units": {
            "PID_UNITS_CELCIUS": {"Min": -40, "Max": 200, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x016F": {
        "name": "TURBOCHARGER_COMPRESSOR_INLET_PRESSURE",
        "shortName": "Boost",
        "units": {
            "PID_UNITS_KPA": {"Min": 0, "Max": 255, "decimals": "0"},
            "PID_UNITS_PSI": {"Min": 0, "Max": 36, "decimals": "1"},
        },
    },
    "0x220301": {
        "name": "MANIFOLD_ABSOLUTE_PRESSURE_SENSOR_VOLTAGE_1",
        "shortName": "MAP",
        "units": {
            "PID_UNITS_VOLTS": {"Min": 0, "Max": 5, "decimals": "2"},
        },
    },
    "0x220307": {
        "name": "LOW_PRESSURE_FUEL_PUMP_COMMANDED_DUTY_CYCLE",
        "shortName": "LPFP DC",
        "units": {
            "PID_UNITS_PERCENT": {"Min": 0, "Max": 100, "decimals": "0"},
        },
    },
    "0x2203EC": {
        "name": "IGNITION_CORRECTION_CYLINDER_1",
        "shortName": "IGN 1",
        "units": {
            "PID_UNITS_DEGREES": {"Min": -16, "Max": 16, "decimals": "2"},
        },
    },
    "0x22F40F": {
        "name": "INTAKE_AIR_TEMPERATURE",
        "shortName": "IAT",
        "units": {
            "PID_UNITS_CELCIUS": {"Min": -40, "Max": 200, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x220461": {
        "name": "CHARGE_AIR_TEMPERATURE",
        "shortName": "CAT",
        "units": {
            "PID_UNITS_CELCIUS": {"Min": -40, "Max": 200, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0x22057D": {
        "name": "AMBIENT_AIR_TEMPERATURE",
        "shortName": "AAT",
        "units": {
            "PID_UNITS_CELCIUS": {"Min": -40, "Max": 200, "decimals": "0"},
            "PID_UNITS_FAHRENHEIT": {"Min": -40, "Max": 400, "decimals": "1"},
        },
    },
    "0xDE01C8": {
        "name": "GAUGE_BRIGHTNESS",
        "shortName": "Dim",
        "units": {
            "PID_UNITS_PERCENT": {"Min": 0, "Max": 100, "decimals": "0"},
        },
    },
}


def get_constants():
    """Return combined constants dictionary"""
    return {"KE_PID": KE_PID, "KE_CP_OP_CODES": KE_CP_OP_CODES, "PID_UNITS": PID_UNITS}


def export_json():
    """This is used by the web app to get Constants.py as JSON"""
    return json.dumps(
        {"KE_PID": KE_PID, "KE_CP_OP_CODES": KE_CP_OP_CODES, "PID_UNITS": PID_UNITS, "PID_UNIT_LABEL": PID_UNIT_LABEL}
    )


if __name__ == "__main__":
    print(export_json())
