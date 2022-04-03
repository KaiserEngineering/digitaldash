import * as cookie from "cookie";
import { checkToken } from "../routes/api/user";
import { GetConstants } from "$lib/Constants";
import { ReadFile } from "$lib/Util";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve, headers }) {
  const cookies = cookie.parse(event.request.headers.get('cookie') || "");
  event.locals.ke_web_app = cookies.ke_web_app || undefined;

  const user = await checkToken(cookies.ke_web_app);
  // TODO https://github.com/sveltejs/kit/issues/1046
  if (event.url.searchParams.has("_method")) {
    event.method = event.query.get("_method").toUpperCase();
  }

  event.locals.user = user;
  event.locals.configuration = ReadFile("/etc/config.json", true);
  event.locals.constants = await GetConstants();

  const response = await resolve(event);
  return response;
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
  return {
    user: event.locals.user && {
      username: event.locals.user.Username,
    },
    actions: [],
    configuration: event.locals.configuration,
    constants: event.locals.constants,
    count: 0,
  };
}
