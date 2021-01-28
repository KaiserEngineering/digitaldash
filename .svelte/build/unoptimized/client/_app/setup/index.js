import * as cookie from '../../_snowpack/pkg/cookie.js';
import { get_user } from './db.js';
import { get } from '../routes/api/config.js';
import { getConstants } from './db.js';

export async function prepare( headers ) {
  let cookies;
  if ( headers.cookie ) {
    cookies = cookie.parse( headers.cookie );
  }

  return {
    context: {
      user: headers.cookie ? await get_user( cookies['ke_web_app'] ) : undefined,
      configuration: await get(),
      constants    : await getConstants()
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
    actions       : [],
    configuration : context.configuration,
    constants     : context.constants,
    count         : 0
  }
}
