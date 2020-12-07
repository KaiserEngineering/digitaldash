import * as cookie from 'cookie';
import { get_user } from './db.js';

export async function prepare( headers ) {
  let cookies;
  if ( headers.cookie ) {
    cookies = cookie.parse( headers.cookie );
  }

  return {
    context: {
      user: headers.cookie ? await get_user( cookies['ke_web_app'] ) : undefined
    },
  }
}

// This function takes context objects which could contain
// sensitive information like auth tokens. It then returns a
// safe session object for the client.
export function getSession( context ) {
  return {
    user: context.user && context.user && {
      username: context.user.Username
    },
    actions: []
  }
}
