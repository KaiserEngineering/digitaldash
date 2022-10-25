import { ReadFile, GetPythonDictionary } from "$lib/server/Util";

export async function GetConstants() {
  const constants = await GetPythonDictionary("/static/constants.py");
  const themes = ReadFile("/themes/themes.json");

  return { ...constants, themes: themes };
}

GetPythonDictionary("/static/constants.py");
