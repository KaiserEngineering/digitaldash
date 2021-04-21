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
  theme:       string;
  unit:        string;
  pid:         string;
}

let configCache: Config;

// Force update by passing true
export function ReadConfig(Force: boolean = false) {
  if ( !Force && configCache ) {
    return configCache;
  }
  else {
    return JSON.parse( fs.readFileSync(config_path+'/etc/config.json').toString() );
  }
}

export function UpdateConfig( Config: Config ): Config {
  fs.writeFileSync( `${config_path}/etc/config.json`, JSON.stringify( Config, null, 2 ) );

  configCache = ReadConfig(true);

  return configCache;
}

configCache = ReadConfig();
