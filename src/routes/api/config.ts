import { writeFile, readFile } from 'fs/promises';
import fs from 'fs';

type ServerRoute = (
  req: {
      host: string;
      path: string;
      headers: Record<string, string>;
      query: URLSearchParams;
      body: undefined | Record<string, any>;
      params: Record<string, unknown>;
  },
  context?: Record<string, any>
) => Promise<{
  status?: number;
  headers?: Record<string, string>;
  body?: Record<string, any> | Buffer;
}>;

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

async function readConfigAsync(): Promise<Config> {
  return await readFile(config_path+'/etc/config.json', 'utf8')
    .then((result) => {
      let json = JSON.parse( result );
      return json;
    })
    .catch(function(error) {
      return undefined;
    });
};

let configCache: Config;
// Need to add some kind of error handling here
function readConfig(): Config {
    let json: any = fs.readFile(config_path+'/etc/config.json', 'utf-8', (error) => {
      if ( error ) {
        console.log('Failed to read config file')
      }});

    return JSON.parse( json );
};

export async function get() {
  if ( configCache ) {
    return configCache;
  }
  else {
    return await readFile(`${config_path}/etc/config.json`, 'utf8')
      .then((result) => {
        configCache = JSON.parse( result );
        return configCache;
      })
      .catch(function(error) {
        return {};
      });
  }
}

// Use this to update config
export async function post( request: { body: string; } ) {
  const newConfig = JSON.parse( request.body );

  return await writeFile( `${config_path}/etc/config.json`, JSON.stringify( newConfig, null, 2 ))
  .then(() => {
    configCache = readConfigAsync();
    return { "body" : { "ret": 1, message: "Config updated", config: configCache } };
  })
  .catch(function(error) {
    return { "body" : { "ret": 0, message: "Config failed to update: "+error, config: configCache } };
  });
}

// Right now lets use this for toggling view
export async function put( request: { body: { id: any; }; } ) {
  const id = request.body.id;

  let temp = configCache;
  if ( !temp ) {
      temp = await readConfigAsync();
  }
  temp.views[id].enabled = temp.views[id].enabled ? false : true;

  let count = 0;
  for ( var key in temp.views ) {
    if ( temp.views[key].enabled ) {
      count = 1;
      break;
    }
  }

  if ( count === 0 ) {
    // Why do I need this? We obviously have some kind of object reference
    // need to look into how JS does refs.
    temp.views[id].enabled = temp.views[id].enabled ? false : true;
    return { "body": { "ret": 0, "views": temp, message: "Need at least one enabled view" } };
  }
  else {
    return await writeFile( `${config_path}/etc/config.json`, JSON.stringify( temp, null, 2 ))
    .then(() => {
      configCache = readConfigAsync();
      return { "body": { "ret": 1, "views": temp, message: "Config updated" } };
    })
    .catch(function(error) {
      return { "body" : { "ret": 0, message: "Config failed to update: ", error, views: temp } };
    });
  }
}
