import * as cookie from 'cookie';
import { get_user } from '../routes/api/user';
import { get } from '../routes/api/config';
import { getConstants } from '../routes/api/constants';

/** @type {import('@sveltejs/kit').GetContext} */
export async function getContext({ headers }) {
  const cookies = cookie.parse(headers.cookie || '');
  const user = await get_user( cookies['ke_web_app'] );

  return {
    context: {
      user: user,
      configuration: await get(),
      constants    : await getConstants()
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
