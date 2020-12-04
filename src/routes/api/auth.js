import fs from 'fs';

let credentialsCache;
export async function get() {
  return new Promise(function(resolve, reject){
    if ( credentialsCache ) {
      resolve({ body: credentialsCache});
    }
    else {
      fs.readFile('auth.json', 'utf8', function(err, jsonString) {
        credentialsCache = JSON.parse( jsonString );
        err ? reject( err ) : resolve({ body: credentialsCache});
      });
    }
  });
}

export async function post( request ) {
  return new Promise(function(resolve, reject){
    fs.readFile('auth.json', 'utf8', function(err, jsonString) {
      let credentials = JSON.parse( jsonString );
      let attempt     = JSON.parse( request.body );
      let msg = "Login failed", ret = 0;

      if ( credentials.Username == attempt.username && credentials.Password == attempt.password ) {
        ret = 1;
        msg = "Success";
      }
      err ? reject( err ) : resolve({ body: { "message": msg, "ret": ret }});
    });
  });
}

// Update our auth creds
export async function put( request ) {
  return new Promise(function(resolve, reject){
    let args = JSON.parse( request.body );
    let temp = { Username: args.username, Password: args.password };

    fs.writeFile('auth.json', JSON.stringify( temp, null, 2 ), (err) => {
      err ? reject( err ) :
      credentialsCache = temp;

      resolve({ body: { ret: 1, message: "Login updated" } });
    });
  });
}
