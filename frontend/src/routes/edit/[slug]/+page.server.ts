import type { Actions } from "./$types";
import { UpdateConfig, NormalizeConfigInput } from "$lib/server/Config";

export const actions: Actions = {
  default: async (event) => {
    const attempt = await event.request.formData();

    const id = attempt.get("id");

    const config = event.locals.configuration;

    // Grab the view we are updating
    const view_to_update = config.views[id];

    // Check if we are setting default and if another view is already default
    if (attempt.get("basics-default")) {
      let defaultAlreadyExists = false;
      Object.keys(config.views).forEach((viewId) => {
        if (viewId !== id && config.views[viewId].default) {
          defaultAlreadyExists = true;
          return;
        }
      });
      if (defaultAlreadyExists) {
        return {
          msg: "A default view already exists",
          theme: "alert-danger",
          config: config,
        };
      }
    }

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
