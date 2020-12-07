import fs from 'fs';

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
