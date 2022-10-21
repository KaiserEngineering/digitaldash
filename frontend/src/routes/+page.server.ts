import { ReadFile, WriteFile } from '$lib/server/Util';
import type { Actions } from './$types';

export const actions: Actions = {
  toggle_enabled: async ({ request }) => {
    let data = await request.formData();

    let id = data.get("id");
    let config = JSON.parse(data.get("config"));

    config.views[id].enabled = config.views[id].enabled ? false : true;

    let count = 0;
    for (var key in config.views) {
      if (config.views[key].enabled) {
        count = 1;
        break;
      }
    }

    if (count === 0) {
      return {
        theme: "alert-danger",
        msg: "Need at least one enabled view",
      };
    }
    WriteFile("etc/config.json", JSON.stringify(config, null, 2));
    let newConfigValue = ReadFile("etc/config.json");

    return {
      msg: "View toggled",
      theme: "alert-success",
      config: newConfigValue
    };
  }
};
