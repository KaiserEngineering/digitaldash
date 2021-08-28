import * as cookie from "cookie";
import { checkToken } from "../routes/api/user";
import { GetConstants } from "$lib/Constants";
import { ReadFile } from "$lib/Util";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
  const cookies = cookie.parse(request.headers.cookie || "");
  request.locals.ke_web_app = cookies.ke_web_app || undefined;

  const user = await checkToken(request.locals.ke_web_app);
  // TODO https://github.com/sveltejs/kit/issues/1046
  if (request.query.has("_method")) {
    request.method = request.query.get("_method").toUpperCase();
  }

  request.locals.user = user;
  request.locals.configuration = ReadFile("/etc/config.json", true);
  request.locals.constants = await GetConstants();

  const response = await resolve(request);
  return response;
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request: any) {
  return {
    user: request.locals.user && {
      username: request.locals.user.Username,
    },
    actions: [],
    configuration: request.locals.configuration,
    constants: request.locals.constants,
    count: 0,
  };
}
