import jwt from "../../../_snowpack/pkg/jsonwebtoken.js";
import { writeFile, readFile } from 'fs/promises';
import fs from 'fs';
import { updateSessionCache } from '../../setup/db.js';

let credentialsCache;
export async function get() {
  if ( credentialsCache ) {
    return credentialsCache;
  }
  else {
    return res = await readFile('auth.json', 'utf8')
    .then((result) => {
      credentialsCache = JSON.parse( result ).User;
      return credentialsCache;
    })
    .catch(function(error) {
      console.error( error );
      return {};
    });
  }
}

// Do our login
export async function post( request ) {
  return res = await readFile('auth.json', 'utf8')
  .then((result) => {
    let credentials = JSON.parse( result ).User;
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

    return {
      headers : headers,
      body    : res
    }
  })
  .catch(function(error) {
    console.error( error )
    return {};
  });
}

// Update our auth creds
export async function put( request ) {
  let args = JSON.parse( request.body );
  let temp = { Session: { ...args.Session }, User: { Username: args.username, Password: args.password }};

  return res = await writeFile('auth.json', JSON.stringify( temp, null, 2 ))
  .then(() => {
    credentialsCache = temp;
    return { body: { ret: 1, message: "Login updated" } };
  })
  .catch(function(error) {
    console.error( error )
    return { body: { ret: 0, message: "Failed to update login" } };
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
