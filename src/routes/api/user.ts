import db from './db';
import jwt from "jsonwebtoken";

export function checkToken( sid: String ) {
  let user = db.prepare("SELECT * FROM User").get();

  if ( user ) {
    return user.token == sid ? user : undefined;
  }
  return undefined;
}

export function get() {
  return db.prepare("SELECT * FROM User").get();
}

// Do our login
export function post( request: { body: string; } ) {
  let attempt = JSON.parse( request.body );

  let user = get();

  let res = {
    "message"  : "Login failed",
    "ret"      : 0,
    "username" : ""
  };

  let headers = {};
  if ( user.username.toLowerCase() == attempt.Username.toLowerCase() && user.password == attempt.Password ) {
    res.ret      = 1;
    res.message  = "Success";
    res.username = attempt.Username;

    // Can we make our seed actually useful?
    let token = jwt.sign(user, 'ke-webapp');
    headers = {
      'Set-Cookie' : "ke_web_app="+token+"; Path=/; SameSite=Strict; Expires='';"
    };

    const updateUserToken = db.prepare("UPDATE User SET token=? WHERE rowid=1");
    updateUserToken.run(token);
  }

  return {
    headers : headers,
    body    : res
  }
}

// Update our auth creds
export function put( request: { body: string; } ) {
  let args = JSON.parse( request.body );

  const updateUser = db.prepare("UPDATE User SET username=?, password=? WHERE rowid=1");
  updateUser.run(args.username, args.password);
  return { body: { ret: 1, message: "Updated user authentification" } };
}
