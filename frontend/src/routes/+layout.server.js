import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ url, locals }) {
  const { user } = locals;

  if (!user && url.pathname != "/login") {
    throw redirect(307, "/login");
  }
  locals.segment = url.pathname;

  return { locals };
}
