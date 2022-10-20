import { ReadFile, GetPythonDictionary } from "$lib/server/Util";

export async function GetConstants() {
  let constants = await GetPythonDictionary("/static/constants.py");
  let themes = ReadFile("/themes/themes.json");

  return { ...constants, themes: themes };
}

GetPythonDictionary("/static/constants.py");
