import type { Actions } from './$types';

export const actions: Actions = {
  toggle_enabled: async ({ request }) => {
    let data = await request.formData();
    console.log("HERE")

    return {
      msg: "Config reset to default",
      theme: "alert-info"
    };
  }
};
