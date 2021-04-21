import { exec } from 'child_process';
import util from 'util';
const execute = util.promisify(exec);
import fs from 'fs';

const env = process.env;
const constants_path: String = env.KEGUIHome;
let constantsCache: any;
let themesCache: any;

function ReadThemes() {
  if ( themesCache ) {
    return themesCache;
  }
  else {
    return JSON.parse( fs.readFileSync(constants_path+'/themes/themes.json').toString() );
  }
}

export async function GetConstants() {
    if ( constantsCache ) {
      return constantsCache;
    }
    else {
      const { stdout, stderr } = await execute( `python3 ${constants_path}/static/constants.py`);
      if ( stderr ) {
        console.error( "Could not read constants.py" );
        return {themes: ReadThemes()};
      }
      else {
        constantsCache = JSON.parse( stdout );
        constantsCache.themes = ReadThemes();
        return constantsCache;
      }
    }
}

constantsCache = GetConstants();
