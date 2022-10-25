import type { Actions } from "./$types";
import { ResetConfig } from "$lib/server/Config";
import { WriteFile } from "$lib/server/Util";

export const actions: Actions = {
  updateConfig: async ({ request }) => {
    const data = await request.formData();
    const config = data.get("config");

    WriteFile("etc/config.json", config);

    return {
      msg: "Config updated",
      theme: "alert-info",
    };
  },
  reset: async (_) => {
    ResetConfig();

    return {
      msg: "Config reset to default",
      theme: "alert-info",
    };
  },
};
