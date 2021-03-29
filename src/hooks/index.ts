import * as cookie from 'cookie';
import { get_user } from '../routes/api/user';
import { get } from '../routes/api/config';
import { getConstants } from '../routes/api/constants';
import type { ReadOnlyFormData } from '@sveltejs/kit';

type Incoming = {
  method: string;
  host: string;
  headers: Headers;
  path: string;
  query: URLSearchParams;
  body: string | Buffer | ReadOnlyFormData;
};

type GetContext<Context = any> = {
  (incoming: Incoming): Context;
};

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

type GetSession<Context = any, Session = any> = {
  ({ context }: { context: Context }): Session | Promise<Session>;
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
