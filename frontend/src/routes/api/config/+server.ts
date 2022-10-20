import { ReadConfig, UpdateConfig, ResetConfig } from "$lib/Config";

export interface Config {
  views: { [key: string]: View };
}

export interface View {
  name: string;
  enabled: boolean;
  default: number;
  background: string;
  theme: string;
  alerts: any[];
  dynamic: Dynamic;
  gauges: Gauge[];
}

export interface Dynamic {
  enabled: boolean;
  pid: string;
  op: string;
  priority: number;
  value: string;
  unit: string;
}

export interface Gauge {
  module: string;
  themeConfig: string;
  unit: string;
  path: string;
  pid: string;
}

export async function get() {
  return ReadConfig();
}

// Use this to update config
export async function post({ request }) {
  let newConfig = await request.json()

  let config = UpdateConfig(newConfig);
  return { body: { ret: 1, message: "Config updated", config: config } };
}

// Right now lets use this for toggling view
export async function put({ request }) {
  let body = await request.json();
  const id = body.id;

  var config = ReadConfig();
  config.views[id].enabled = config.views[id].enabled ? false : true;

  let count = 0;
  for (var key in config.views) {
    if (config.views[key].enabled) {
      count = 1;
      break;
    }
  }

  if (count === 0) {
    config.views[id].enabled = config.views[id].enabled ? false : true;
    return {
      body: {
        ret: 0,
        views: config,
        message: "Need at least one enabled view",
      },
    };
  } else {
    config = UpdateConfig(config);
    return { body: { ret: 1, views: config, message: "Config updated" } };
  }
}

// Reset our config
export async function del() {
  let res = {
    message: "Failed to reset config",
    ret: 0,
    config: undefined
  };

  if (await ResetConfig()) {
    res.message = "Config reset!";
    res.ret = 1;
    res.config = ReadConfig();
  }
  return { body: res };
}
