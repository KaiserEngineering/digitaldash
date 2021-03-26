import * as cookie from 'cookie';
import { get_user } from '../routes/api/user';
import { get } from '../routes/api/config';
import { getConstants } from '../routes/api/constants';

export async function prepare(incoming: { headers: { cookie: any; }; }): Promise<{
    headers?: Record<string, string>;
    context?: Record<string, any>;
  }> {

  const cookies = cookie.parse(incoming.headers.cookie || '');
  const user = await get_user( cookies['ke_web_app'] );

  return {
    context: {
      user: user,
      configuration: await get(),
      constants    : await getConstants()
    },
  }
};

// This function takes context objects which could contain
// sensitive information like auth tokens. It then returns a
// safe session object for the client.
export async function getSession( context: Record<string, any> ): Promise<Record<string, any>> {
  // We will fix this when svelte-kit is stable
  context = context.context;

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
