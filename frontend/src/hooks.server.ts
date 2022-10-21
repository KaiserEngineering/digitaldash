import type { Handle } from "@sveltejs/kit";
import { checkToken } from "$lib/User";
import { GetConstants } from "$lib/server/Constants";
import { ReadFile } from "$lib/server/Util";
import { Setup } from "$lib/DB";

Setup();

export const handle: Handle = async ({ event, resolve }) => {
  // Create our session object
  event.locals.actions = [];
  event.locals.count = 0;

  if (event.url.pathname == '/login') {
    // skip verifying user, and allow to load website
    const response = await resolve(event);
    return response;
  }

  // Check if we have a logged in user already via cookie
  const user = await checkToken(event.cookies.get("ke_web_app"));

  if (!user) {
    return new Response(null, {
      status: 302,
      headers: {
        location: '/login'
      }
    })
  }

  // Set our user locals
  event.locals.user = user;

  // Read in our static content
  event.locals.configuration = ReadFile("/etc/config.json", true)

  event.locals.constants = await GetConstants();

  const response = await resolve(event);
  return response;
};

export async function getSession(event: { locals: { user: { username: any; }; }; }) {
  return event.locals.user ? {
    username: event.locals.user.username
  } : {}
}
