import type { Actions } from "./$types";
import { UpdateConfig, NormalizeConfigInput } from "$lib/server/Config";

export const actions: Actions = {
  default: async (event) => {
    const attempt = await event.request.formData();

    const id = attempt.get("id");

    const config = event.locals.configuration;

    // Grab the view we are updating
    const view_to_update = config["views"][id];

    const new_config = NormalizeConfigInput(attempt, view_to_update);

    config.views[id] = new_config;

    UpdateConfig(JSON.stringify(config, null, 2));
    return {
      msg: "Config updated",
      theme: "alert-success",
      config: config,
    };
  },
};
