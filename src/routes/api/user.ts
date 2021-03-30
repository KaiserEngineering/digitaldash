import jwt from "jsonwebtoken";
import { HashPassword, UpdateToken, UpdateUserCredentials, User } from "$lib/user";

export function checkToken( sid: String ) {
  let user = User();

  if ( user ) {
    return user.token == sid ? user : undefined;
  }
  return undefined;
}

export function get() {
  User();
}

// Do our login
export function post( request: { body: string; } ) {
  let attempt = JSON.parse( request.body );

  let user = User();

  let res = {
    "message"  : "Login failed",
    "ret"      : 0,
    "username" : ""
  };

  let headers = {};
  if ( user.username.toLowerCase() == attempt.Username.toLowerCase() && user.password == HashPassword(attempt.Password) ) {
    res.ret      = 1;
    res.message  = "Success";
    res.username = attempt.Username;

    // Can we make our seed actually useful?
    let token = jwt.sign({username: user.username}, 'ke-webapp');
    headers = {
      'Set-Cookie' : "ke_web_app="+token+"; Path=/; SameSite=Strict; Expires='';"
    };

    UpdateToken(token);
  }

  return {
    headers : headers,
    body    : res
  }
}

// Update our auth creds
export function put( request: { body: string; } ) {
  let args = JSON.parse( request.body );

  UpdateUserCredentials( args.username, args.password );

  return { body: { ret: 1, message: "Updated user authentification" } };
}
