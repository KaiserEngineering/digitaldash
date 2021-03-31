import * as cookie from 'cookie';
import { checkToken } from '../routes/api/user';
import { ReadConfig } from '$lib/Config';
import { GetConstants } from '$lib/Constants';

/** @type {import('@sveltejs/kit').GetContext} */
export async function getContext({ headers }) {
  const cookies = cookie.parse(headers.cookie || '');
  const user = await checkToken( cookies['ke_web_app'] );

  return {
    context: {
      user: user,
      configuration: ReadConfig(),
      constants    : await GetConstants()
    },
  }
};

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession({ context }) {
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
