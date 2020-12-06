import { exec } from 'child_process';

const constants_path = process.env.KEGUIHome

let constantsCache;
export async function get() {
  if ( !constantsCache ) {
    exec( `python3 ${constants_path}/static/constants.py`, (error, stdout, stderr) => {
      if ( error ) {
        console.error(`exec error: ${error}`);
      }
      constantsCache = JSON.parse( stdout );
    });
  }
  return { body: constantsCache };
}
