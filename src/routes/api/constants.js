import { execSync } from 'child_process';

const constants_path = process.env.KEGUIHome

let constantsCache;
export async function get() {
  if ( !constantsCache ) {
    constantsCache = JSON.parse( execSync( `python3 ${constants_path}/static/constants.py` ) );
  }
  return { body: constantsCache };
}
