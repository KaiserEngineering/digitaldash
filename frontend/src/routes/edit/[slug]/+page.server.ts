import type { Actions } from './$types';
import { UpdateConfig } from '$lib/server/Config';

export const actions: Actions = {
  default: async (event) => {
    let attempt = await event.request.formData();

    console.log(attempt)
    let id = attempt.get("id");

    let config = event.locals.configuration;

    // Grab the view we are updating
    let view_to_update = config["views"][id];

    let new_config = { ...view_to_update };
    Object.keys(view_to_update).forEach((item: any) => {
      let new_value = attempt.get(item);
      if (new_value) {
        new_config[item] = new_value;
      }
    });

    config["views"][id] = new_config;
    UpdateConfig(JSON.stringify(config));
    return { success: true };
  }
};
