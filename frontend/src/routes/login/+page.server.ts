import { HashPassword, UpdateToken, User } from "$lib/User";
import type { Actions } from "./$types";
import jwt from "jsonwebtoken";

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const attempt = await request.formData();

    const user = User();

    if (
      user.username.toLowerCase() == attempt.get("username").toLowerCase() &&
      user.password == HashPassword(attempt.get("password"))
    ) {
      const token = jwt.sign({ username: user.username }, "ke-webapp");
      cookies.set(
        "ke_web_app",
        token,
        {
          sameSite: "lax",
          httpOnly: true,
          secure: false
        }
      );

      UpdateToken(token);
      return {
        msg: "Login successful",
        theme: "alert-success",
      };
    }
    return {
      msg: "Login failed",
      theme: "alert-danger",
    };
  },
};
