import fs, { readFileSync, readSync } from 'fs';

const config_path = process.env.KEGUIHome

let configCache;

// Need to add some kind of error handling here
function readConfig() {
  return JSON.parse( fs.readFileSync( `${config_path}/etc/config.json`, 'utf8' ) );
}

export async function get() {
  return new Promise(function(resolve, reject) {
    if ( configCache ) {
      resolve({ body: configCache });
    }
    else {
      configCache = readConfig();
      resolve({ body: configCache });
    }
  });
}

// Use this to update config
export async function post( request ) {
  return new Promise(function(resolve, reject) {
    const newConfig = JSON.parse( request.body );

    fs.writeFile( `${config_path}/etc/config.json`, JSON.stringify( newConfig, null, 2 ), (err) => {
      err ? reject( err ) :
        configCache = readConfig();
        resolve({ body: {"ret": 1, message: "Config updated", config: configCache }});
    });
  });
}

// Right now lets use this for toggling view
export async function put( request ) {
  return new Promise(function(resolve, reject) {
    const id = request.body.id;

    let temp = configCache;
    temp.views[id].enabled = !temp.views[id].enabled;

    fs.writeFile( `${config_path}/etc/config.json`, JSON.stringify( temp, null, 2 ), (err) => {
      err ? reject( err ) :
        configCache = readConfig();
        resolve({ body: {"views": configCache, message: "Config updated" }});
    });
  });
}
