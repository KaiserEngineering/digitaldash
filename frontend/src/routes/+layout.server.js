import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ url, locals }) {
  // @ts-ignore
  const { user } = locals;

  if (!user && url.pathname != "/login") {
    throw redirect(307, "/login");
  }
  // @ts-ignore
  locals.segment = url.pathname;

  return { locals };
}
