import fs from 'fs';

let credentialsCache;
export async function get() {
  return new Promise(function(resolve, reject){
    if ( credentialsCache ) {
      resolve({ body: credentialsCache});
    }
    else {
      fs.readFile('auth.json', 'utf8', function(err, jsonString) {
        credentialsCache = JSON.parse( jsonString ).User;
        err ? reject( err ) : resolve({ body: credentialsCache});
      });
    }
  });
}

// Do our login
export async function post( request ) {
  return new Promise(function(resolve, reject){
    fs.readFile('auth.json', 'utf8', function(err, jsonString) {
      let credentials = JSON.parse( jsonString ).User;
      let attempt     = JSON.parse( request.body );

      let res = {
        "message"  : "Login failed",
        "ret"      : 0,
        "username" : ""
      };

      let headers = {};
      if ( credentials.Username == attempt.Username && credentials.Password == attempt.Password ) {
        res.ret      = 1;
        res.message  = "Success";
        res.username = attempt.Username;

        headers = {
          'Set-Cookie' : "ke_web_app="+res.username+"; Path=/; SameSite=Strict; Expires='';"
        };
        updateSession( credentials );
      }

      err ? reject( err ) : resolve({
        headers : headers,
        body    : res
      });
    });
  });
}

// Update our auth creds
export async function put( request ) {
  return new Promise(function(resolve, reject){
    let args = JSON.parse( request.body );
    let temp = { Session: { ...args.Session }, User: { Username: args.username, Password: args.password }};

    fs.writeFile('auth.json', JSON.stringify( temp, null, 2 ), (err) => {
      err ? reject( err ) :
      credentialsCache = temp;

      resolve({ body: { ret: 1, message: "Login updated" } });
    });
  });
}

function updateSession ( credentials ) {
  let content = {
    User: {
      "Username": credentials.Username,
      "Password": credentials.Password,
    },
    "Session" : {
      "token" : credentials.Username
    }
  };

  fs.writeFile('auth.json', JSON.stringify( content, null, 2 ), (err) => {
    if ( err ) { console.error( err ); }
  });
}
