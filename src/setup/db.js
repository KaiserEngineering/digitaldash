import fs from 'fs';

export async function get_user( sid ) {
  return new Promise(function(resolve, reject){
    fs.readFile('auth.json', 'utf8', function(err, jsonString) {
      authObj = JSON.parse( jsonString );

      if ( !authObj || !authObj.Session ) {
        reject( "No session found on file." );
      }
      else {
        err ? reject( err ) :
        authObj.Session.token == sid ? resolve( authObj.User ) : resolve( undefined );
      }
    });
  });
}
