import * as cookie from 'cookie';
import { get_user } from '../routes/api/user';
import { get } from '../routes/api/config';
import { getConstants } from '../routes/api/constants';

export async function prepare( headers: Record<string, string> ): Promise<{
    headers?: Record<string, string>;
    context?: Record<string, any>;
  }> {

  let cookies: { [x: string]: String; };
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
};

// This function takes context objects which could contain
// sensitive information like auth tokens. It then returns a
// safe session object for the client.
export async function getSession( context: Record<string, any> ): Promise<Record<string, any>> {

  return {
    user: context.user && context.user && {
      username: context.user.Username
    },
    actions       : [],
    configuration : context.configuration,
    constants     : context.constants,
    count         : 0
  }
};
