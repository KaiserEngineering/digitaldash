import fs from "fs";
import { exec } from "child_process";
import util from "util";
const execute = util.promisify(exec);

const guiHome: string | boolean = import.meta.env.VITE_KEGUIHome;

// Cache all our goodies
let cache: any = {};

export function ReadFile(File: string) {
  return JSON.parse(fs.readFileSync(`${guiHome}/${File}`).toString());
}

export function WriteFile(File: string, Value: any) {
  fs.writeFileSync(`${guiHome}/${File}`, Value);
}

export async function GetPythonDictionary(
  File: string,
  Force: boolean = false
) {
  const { stdout, stderr } = await execute(`python3 ${guiHome}/${File}`);
  if (stderr) {
    console.error("Could not read ${File}");
  } else {
    cache[File] = JSON.parse(stdout);
    return cache[File];
  }
}

export async function ResetWithGit(File: String) {
  await execute(`git checkout ${guiHome}/${File}`);
  // Todo - Need some kind of sane error checking here
  return 1;
}
