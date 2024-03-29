import { json } from "@sveltejs/kit";
import fs from "fs";

const gui_path: string | boolean = import.meta.env.VITE_KEGUIHome;

export function ReadLog() {
  const logNames = fs.readdirSync(gui_path + "etc/kivy/logs");

  const logHash: any = {};
  logNames.forEach((log) => {
    if (log == ".gitignore") {
      return;
    }

    logHash[log] = fs
      .readFileSync(gui_path + "/etc/kivy/logs/" + log)
      .toString();
  });

  return json(logHash);
}
