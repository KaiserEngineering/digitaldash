import { writeFile } from 'fs/promises';
import fs from 'fs';

const env = process.env;
const config_path: String = env.KEGUIHome

export interface Config {
  views: { [key: string]: View };
}

export interface View {
  name:       string;
  enabled:    boolean;
  default:    number;
  background: string;
  theme:      string;
  alerts:     any[];
  dynamic:    Dynamic;
  gauges:     Gauge[];
}

export interface Dynamic {
  enabled:  boolean;
  pid:      string;
  op:       string;
  priority: number;
  value:    string;
  unit:     string;
}

export interface Gauge {
  module:      string;
  themeConfig: string;
  unit:        string;
  path:        string;
  pid:         string;
}

// Update our config cache by reading the DD config
function updateConfigCache(): Config {
  configCache = JSON.parse( fs.readFileSync(config_path+'/etc/config.json') );
  return configCache;
};

let configCache: Config;

export async function get() {
  if ( configCache ) {
    return configCache;
  }
  else {
    return updateConfigCache();
  }
}

// Use this to update config
export async function post( request: { body: string; } ) {
  const newConfig = JSON.parse( request.body );

  return await writeFile( `${config_path}/etc/config.json`, JSON.stringify( newConfig, null, 2 ))
  .then(() => {
    updateConfigCache();
    return { "body" : { "ret": 1, message: "Config updated", config: configCache } };
  });
}

// Right now lets use this for toggling view
export async function put( request: { body: { id: any; }; } ) {
  const id = request.body.id;

  if ( !configCache ) {
    updateConfigCache();
  }
  configCache.views[id].enabled = configCache.views[id].enabled ? false : true;

  let count = 0;
  for ( var key in configCache.views ) {
    if ( configCache.views[key].enabled ) {
      count = 1;
      break;
    }
  }

  if ( count === 0 ) {
    // Why do I need this? We obviously have some kind of object reference
    // need to look into how JS does refs.
    configCache.views[id].enabled = configCache.views[id].enabled ? false : true;
    return { "body": { "ret": 0, "views": configCache, message: "Need at least one enabled view" } };
  }
  else {
    return await writeFile( `${config_path}/etc/config.json`, JSON.stringify( configCache, null, 2 ))
    .then(() => {
      updateConfigCache();
      return { "body": { "ret": 1, "views": configCache, message: "Config updated" } };
    });
  }
}
