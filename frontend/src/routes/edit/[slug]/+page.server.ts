import { HashPassword, UpdateToken, User } from '$lib/User';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    let attempt = await request.formData();

    return { success: true };
    return { failed: true }
  }
};
