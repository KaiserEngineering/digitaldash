import fs from 'fs';

let constantsCache;
export async function get() {
  return new Promise(function(resolve, reject){
    if ( constantsCache ) {
      resolve({ body: constantsCache });
    }
    else {
      fs.readFile('constants.json', 'utf8', function(err, jsonString) {
        constantsCache = JSON.parse( jsonString );
        err ? reject( err ) : resolve({ body: constantsCache });
      });
    }
  });
}
