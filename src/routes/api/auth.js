import jwt from "jsonwebtoken";
import fs from 'fs';
import { updateSessionCache } from '../../setup/db';

let credentialsCache;
export async function get() {
  if ( credentialsCache ) {
    return credentialsCache;
  }
  else {
    fs.readFile('auth.json', 'utf8', function(err, jsonString) {
      credentialsCache = JSON.parse( jsonString ).User;
      if ( err ) {
        return {};
      }
      else {
        return credentialsCache;
      }
    });
  }
}

// Do our login
export async function post( request ) {
  fs.readFile('auth.json', 'utf8', function(err, jsonString) {
    let credentials = JSON.parse( jsonString ).User;
    let attempt     = JSON.parse( request.body );

    let res = {
      "message"  : "Login failed",
      "ret"      : 0,
      "username" : ""
    };

    let headers = {};
    if ( credentials.Username.toLowerCase() == attempt.Username.toLowerCase() && credentials.Password == attempt.Password ) {
      res.ret      = 1;
      res.message  = "Success";
      res.username = attempt.Username;

      // Can we make our seed actually useful?
      let token = jwt.sign(credentials, 'ke-webapp');
      headers = {
        'Set-Cookie' : "ke_web_app="+token+"; Path=/; SameSite=Strict; Expires='';"
      };

      updateSession({...credentials, token: token });
      updateSessionCache({...credentials, token: token });
    }

    if ( err ) {
      return {};
    }
    else {
      return {
        headers : headers,
        body    : res
      }
    }
  });
}

// Update our auth creds
export async function put( request ) {
  let args = JSON.parse( request.body );
  let temp = { Session: { ...args.Session }, User: { Username: args.username, Password: args.password }};

  fs.writeFile('auth.json', JSON.stringify( temp, null, 2 ), (err) => {
    err ? reject( err ) :
    credentialsCache = temp;

    return { ret: 1, message: "Login updated" };
  });
}

function updateSession ( credentials ) {
  let content = {
    User: {
      "Username": credentials.Username,
      "Password": credentials.Password,
    },
    "Session" : {
      "token" : credentials.token
    }
  };

  fs.writeFile('auth.json', JSON.stringify( content, null, 2 ), (err) => {
    if ( err ) { console.error( err ); }
  });
}
