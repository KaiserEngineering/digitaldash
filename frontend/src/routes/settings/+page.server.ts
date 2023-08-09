import type { Actions } from "./$types";
import { UpdateUserCredentials } from "$lib/User";

export const actions: Actions = {
  default: async ({ request }) => {
    const attempt = await request.formData();
    UpdateUserCredentials(attempt.get("username"), attempt.get("password"));

    return {
      msg: "Credentials updated",
      theme: "alert-info",
    };
  },
};
