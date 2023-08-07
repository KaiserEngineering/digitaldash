import { ReadFile, WriteFile } from "$lib/server/Util";
import type { Actions } from "./$types";

export const actions: Actions = {
  toggle_enabled: async ({ request }) => {
    const data = await request.formData();

    const id = data.get("id");
    const config = JSON.parse(data.get("config"));


    // If we are disabling, check if this is the default view
    if (config.views[id].default && config.views[id].enabled) {
      return {
        theme: "alert-danger",
        msg: "Cannot disable default view",
      };
    }

    config.views[id].enabled = config.views[id].enabled ? false : true;

    let count = 0;
    for (let key in config.views) {
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
    const newConfigValue = ReadFile("etc/config.json");

    return {
      msg: "View toggled",
      theme: "alert-success",
      config: newConfigValue,
    };
  },
  removeView: async ({ request }) => {
    const data = await request.formData();

    const id = data.get("id");
    const config = JSON.parse(data.get("config"));

    if (config.views[id].default) {
      return {
        theme: "alert-danger",
        msg: "Cannot remove default view",
      };
    }

    delete config.views[id];

    WriteFile("etc/config.json", JSON.stringify(config, null, 2));
    const newConfigValue = ReadFile("etc/config.json");

    return {
      msg: "View removed",
      theme: "alert-success",
      config: newConfigValue,
    };
  },
  addView: async ({ request }) => {
    const data = await request.formData();

    const config = JSON.parse(data.get("config") || "{}");

    const lastId: number = Number(Object.keys(config.views).pop() || 0);
    let newId = 0;
    if (lastId !== undefined) {
      newId = lastId + 1;
    }

    const numViews = Object.keys(config.views).length;

    config.views[newId] = {
      name: "View #" + newId,
      enabled: numViews == 0 ? true : false,
      default: numViews == 0 ? true : false,
      background: "Blue Purple Gradient.png",
      alerts: [],
      dynamic: {},
      gauges: [],
      dynamicMinMax: false,
    };

    WriteFile("etc/config.json", JSON.stringify(config, null, 2));
    const newConfigValue = ReadFile("etc/config.json");

    return {
      msg: "New view ready",
      theme: "alert-success",
      config: newConfigValue,
    };
  },
};
