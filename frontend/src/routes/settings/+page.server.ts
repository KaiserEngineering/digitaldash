import type { Actions } from './$types';
import { UpdateUserCredentials } from '$lib/User';

export const actions: Actions = {
  default: async ({ request }) => {
    let attempt = await request.formData();
    UpdateUserCredentials(
      attempt.get("username"),
      attempt.get("password"),
    );

    return {
      msg: "Credentials updated",
      theme: "alert-info"
    };
  }
}
