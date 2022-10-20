import { HashPassword, UpdateToken, User } from '$lib/User';
import type { Actions } from './$types';
import jwt from "jsonwebtoken";

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    let attempt = await request.formData();

    let user = User();

    if (
      user.username.toLowerCase() == attempt.get("username").toLowerCase() &&
      user.password == HashPassword(attempt.get("password"))
    ) {

      let token = jwt.sign({ username: user.username }, "ke-webapp");
      cookies.set("ke_web_app", token + "; Path=/; SameSite=Strict; Expires='';",)

      UpdateToken(token);
      return {
        msg: "Login successful",
        theme: "alert-info"
      };
    }
    return {
      msg: "Login failed",
      theme: "alert-danger"
    };
  }
};
