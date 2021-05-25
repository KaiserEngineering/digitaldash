import { ReadFile, WriteFile } from '$lib/Util';
import type { Config } from '../globals';

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

  WriteFile( 'etc/config.json', Config );
  return ReadFile( 'etc/config.json', true );
}

// Build our cache right away
ReadFile( 'etc/config.json', true );
