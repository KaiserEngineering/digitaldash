import { redirect } from "@sveltejs/kit";

export async function load({ url, locals }) {
  const { user } = locals;

  if (!user && url.pathname != "/login") {
    throw redirect(307, "/login");
  }

  return { locals };
}
