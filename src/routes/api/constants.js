import { exec } from 'child_process';

const constants_path = process.env.KEGUIHome

let constantsCache;
export async function get() {
  return new Promise(function(resolve, reject){
    if ( !constantsCache ) {
      exec( `python3 ${constants_path}/static/constants.py`, (error, stdout, stderr) => {
        if ( error ) {
          reject( err );
        }
        else {
          constantsCache = JSON.parse( stdout );
          resolve({ body: constantsCache });
        }
      });
    }
    else {
      resolve({ body: constantsCache });
    }
  });
}
