import fs from 'fs';
import { exec } from 'child_process';

export async function get_user( sid ) {
  return new Promise(function(resolve, reject){
    fs.readFile('auth.json', 'utf8', function(err, jsonString) {
      authObj = JSON.parse( jsonString );

      if ( !authObj || !authObj.Session ) {
        console.log( "No session found on file." );
        resolve( undefined );
      }
      else {
        err ? reject( err ) :
        authObj.Session.token == sid ? resolve( authObj.User ) : resolve( undefined );
      }
    });
  });
}

const constants_path = process.env.KEGUIHome
let constantsCache;

export async function getConstants() {
  return new Promise(function(resolve, reject) {
    if ( constantsCache ) {
      resolve({ body: constantsCache });
    }
    else {
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
  });
}
