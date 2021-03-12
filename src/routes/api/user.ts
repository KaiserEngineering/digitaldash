import { writeFile, readFile } from 'fs/promises';
import jwt from "jsonwebtoken";

interface session {
  User: {
    "Username": String,
    "Password": String,
  },
  "Session" : {
    "token" : String
  }
};

interface credentials {
  "Username": String,
  "Password": String
};

let sessionCache: session;
let credentialsCache: credentials;

export async function get_user( sid: String ) {
  if ( sessionCache ) {
    return sessionCache;
  }
  else {
    return await readFile('auth.json', 'utf8')
    .then((result) => {
      let authObj = JSON.parse( result );

      if ( !authObj || !authObj.Session ) {
        console.log( "No session found on file." );
        return undefined;
      }
      else {
        return authObj.Session.token && authObj.Session.token == sid ? authObj.User : undefined;
      }
    })
    .catch(function(error) {
      console.error( error );
      return undefined;
    });
  }
}

export async function get() {
  if ( credentialsCache ) {
    return credentialsCache;
  }
  else {
    return await readFile('auth.json', 'utf8')
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
export async function post( request: { body: string; } ) {
  return await readFile('auth.json', 'utf8')
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
export async function put( request: { body: string; } ) {
  let args = JSON.parse( request.body );
  let temp = { Session: { ...args.Session }, User: { Username: args.username, Password: args.password }};

  return await writeFile('auth.json', JSON.stringify( temp, null, 2 ))
  .then(() => {
    credentialsCache = temp.User;
    return { body: { ret: 1, message: "Login updated" } };
  })
  .catch(function(error) {
    console.error( error )
    return { body: { ret: 0, message: "Failed to update login" } };
  });
}

async function updateSession ( credentials: { Username: any; Password: any; token: any; } ) {
  let content = {
    User: {
      "Username": credentials.Username,
      "Password": credentials.Password,
    },
    "Session" : {
      "token" : credentials.token
    }
  };

  writeFile('auth.json', JSON.stringify( content, null, 2 ));
}

export function updateSessionCache( credentials: { Username: any; Password: any; } ) {
  sessionCache = {
    User: {
      "Username": credentials.Username,
      "Password": credentials.Password,
    },
    "Session" : {
      "token" : credentials.Username
    }
  };
}
