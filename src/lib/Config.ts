import fs from 'fs';

const config_path: String = import.meta.env.VITE_KEGUIHome;

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
  // Remove gauges that aren't defined
  // TODO: We should remove this and fix the real issue
  // How are blank gauges getting into the config?
  for ( var id in Object.keys( Config.views ) ) {
    let gauges = [];
    Config.views[id].gauges.forEach(function(gauge, i) {
      if ( gauge.pid ) {
        gauges.push(gauge);
      }
    });
    Config.views[id].gauges = gauges;
  }

  fs.writeFileSync( `${config_path}/etc/config.json`, JSON.stringify( Config, null, 2 ) );

  configCache = ReadConfig(true);

  return configCache;
}

configCache = ReadConfig();
