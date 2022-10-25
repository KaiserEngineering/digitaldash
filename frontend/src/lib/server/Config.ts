import { ReadFile, WriteFile, ResetWithGit } from "$lib/server/Util";
import type { View } from "../../app";

export function ReadConfig() {
  return ReadFile("etc/config.json");
}

export function UpdateConfig(config: string) {
  WriteFile("etc/config.json", config);
}

export async function ResetConfig() {
  let res = await ResetWithGit('etc/config.json');

  return { body: res };
}

type Control = {
  basics: string[];
  gauges: string[];
  alerts: string[];
  dynamic: string[];
}

// CODE TO HANDLE OUR FORM INPUT
export function NormalizeConfigInput(attempt: { get: (arg0: string) => any; }, control_view: { [x: string]: any; }) {

  FormData.prototype.getNotNull = function monkeyPatchGet(k: string): false | FormDataEntryValue {
    let newValue = this.get(k);

    if (newValue == null) {
      return false;
    }

    return newValue
  }

  let control: Control = {
    basics: ["name", "background", "dynamicMinMax"],
    gauges: ["unit", "pid"],
    alerts: ["message", "op", "priority", "unit", "value", "pid"],
    dynamic: ["pid", "op", "enabled", "value", "priority", "unit"]
  }

  // Set two options that aren't set via UI
  let new_config: View = {
    enabled: control_view["enabled"],
    default: control_view["default"],
    gauges: [],
    alerts: [],
    name: "",
    background: "",
    dynamic: {},
    dynamicMinMax: false
  };

  control["basics"].forEach(item => {
    new_config[item] = attempt.get("basics-" + item);
  });

  let dynamic_obj = {};
  control["dynamic"].forEach(item => {
    dynamic_obj[item] = attempt.get("dynamic-" + item);
  });
  new_config["dynamic"] = dynamic_obj;

  // Build our gauges section
  for (let i = 0; i < 3; i++) {
    // Stop iterating if we have no more gauge inputs (less than 3)
    if (!attempt.get("gauge-pid-" + i)) {
      break;
    }

    // Set default theme across all gauges
    let gauge_obj = {
      theme: attempt.get("theme")
    };
    control["gauges"].forEach(item => {
      gauge_obj[item] = attempt.get("gauge-" + item + "-" + i);
    });
    new_config["gauges"].push(gauge_obj);
  }

  // Build our alerts section
  for (let i = 0; i < 10; i++) {
    // Stop iterating if we have no more gauge inputs (less than 3)
    if (!attempt.get("alert-pid-" + i)) {
      break;
    }

    let alert_obj = {};
    control["alerts"].forEach(item => {
      alert_obj[item] = attempt.get("alert-" + item + "-" + i);
    });
    new_config["alerts"].push(alert_obj);
  }
  return new_config;
}