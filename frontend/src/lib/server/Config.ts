import { ReadFile, WriteFile, ResetWithGit } from "$lib/server/Util";
import type { Config } from "../../app";

export function ReadConfig() {
  return ReadFile("etc/config.json", true);
}

export function UpdateConfig(Config: Config) {
  WriteFile("etc/config.json", Config);
}

export async function ResetConfig() {
  let res = await ResetWithGit('etc/config.json');

  return { body: res };
}
