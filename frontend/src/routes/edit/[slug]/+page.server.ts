import type { Actions } from './$types';
import { UpdateConfig, NormalizeConfigInput } from '$lib/server/Config';

export const actions: Actions = {
  default: async (event) => {
    let attempt = await event.request.formData();

    let id = attempt.get("id");

    let config = event.locals.configuration;

    // Grab the view we are updating
    let view_to_update = config["views"][id];

    let new_config = NormalizeConfigInput(attempt, view_to_update);

    config.views[id] = new_config;

    UpdateConfig(JSON.stringify(config, null, 2));
    return {
      msg: "Config updated",
      theme: "alert-success",
      config: config
    };
  }
};
