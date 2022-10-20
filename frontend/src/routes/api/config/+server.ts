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

export async function GET() {
  return new Response(ReadConfig());
}

// Use this to update config
export async function POST({ request }) {
  let newConfig = await request.json()

  let config = UpdateConfig(newConfig);
  return new Response(JSON.stringify({ body: { ret: 1, message: "Config updated", config: config } }));
}

// Right now lets use this for toggling view
export async function PUT({ request }) {
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
    return new Response(JSON.stringify({
      body: {
        ret: 0,
        views: config,
        message: "Need at least one enabled view",
      },
    }));
  } else {
    config = UpdateConfig(config);
    return new Response(JSON.stringify({ body: { ret: 1, views: config, message: "Config updated" } }));
  }
}

// Reset our config
export async function DEL() {
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
  return new Response(JSON.stringify({ body: res }));
}
