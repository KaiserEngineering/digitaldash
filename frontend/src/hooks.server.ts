import type { Handle } from "@sveltejs/kit";
import * as cookie from "cookie";
import { checkToken } from "./routes/api/user/+server";
import { GetConstants } from "$lib/Constants";
import { ReadFile } from "$lib/Util";

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.ke_web_app = event.cookies.get("ke_web_app") || undefined;

  event.locals.session = {
    actions: [],
    count: 0,
  }

  if (event.url.pathname == '/login') {
    // skip verifying user, and allow to load website
    const response = await resolve(event);
    return response;
  }

  const user = await checkToken(event.locals.ke_web_app);
  if (!user) {
    return new Response(null, {
      status: 302,
      headers: {
        location: '/login'
      }
    })
  }

  event.locals.user = user;

  event.locals.configuration = ReadFile("/etc/config.json", true);
  event.locals.session.configuration = event.locals.configuration;

  event.locals.constants = await GetConstants();

  const response = await resolve(event);
  return response;
};

export async function getSession(event) {
  return event.locals.user ? {
    username: event.locals.user.username
  } : {}
}
