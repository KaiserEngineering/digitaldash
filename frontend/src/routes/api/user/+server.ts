import jwt from "jsonwebtoken";
import {
  HashPassword,
  UpdateToken,
  UpdateUserCredentials,
  User,
} from "$lib/User";

export function checkToken(sid: String) {
  let user = User();

  if (user) {
    return user.token == sid ? user : undefined;
  }
  return undefined;
}

export function GET() {
  return new Response(User());
}

// Do our login
export async function POST({ request }) {
  let attempt = await request.json()

  let user = User();

  let res = {
    message: "Login failed",
    ret: 0,
    user: { username: "" },
  };

  let headers = {};
  if (
    user.username.toLowerCase() == attempt.Username.toLowerCase() &&
    user.password == HashPassword(attempt.Password)
  ) {
    res.ret = 1;
    res.message = "Success";
    res.user = {
      username: user.username,
    };

    // Can we make our seed actually useful?
    let token = jwt.sign({ username: user.username }, "ke-webapp");
    headers = {
      "Set-Cookie":
        "ke_web_app=" + token + "; Path=/; SameSite=Strict; Expires='';",
    };

    UpdateToken(token);
  }

  return new Response(JSON.stringify({
    headers: headers,
    body: res,
  }));
}

// Update our auth creds
export async function PUT({ request }) {
  let args = await request.json()

  UpdateUserCredentials(args.username, args.password);

  return new Response(JSON.stringify({ body: { ret: 1, message: "Updated user authentification" } }));
}
