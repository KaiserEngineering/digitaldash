import type { Handle } from "@sveltejs/kit";
import * as cookie from "cookie";
import { checkToken } from "./routes/api/user/+server";
import { GetConstants } from "$lib/Constants";
import { ReadFile } from "$lib/Util";

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
  const cookies = cookie.parse(event.request.headers.get("cookie") || "");
  event.locals.ke_web_app = cookies.ke_web_app || undefined;

  const user = await checkToken(cookies.ke_web_app);

  event.locals.user = user;
  event.locals.username = user.username;

  event.locals.configuration = ReadFile("/etc/config.json", true);
  event.locals.constants = await GetConstants();
  event.locals.actions = [];
  event.locals.count = 0;

  const response = await resolve(event);
  return response;
};
