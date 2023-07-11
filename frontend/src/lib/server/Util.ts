import fs from "fs";
import { exec } from "child_process";
import util from "util";
const execute = util.promisify(exec);

const guiHome: string | boolean = import.meta.env.VITE_KEGUIHome;
const pythonAlias: string = import.meta.env.VITE_PythonAlias;

// Cache all our goodies
const cache: any = {};

export function ReadFile(File: string) {
  return JSON.parse(fs.readFileSync(`${guiHome}${File}`).toString());
}

export function WriteFile(File: string, Value: any) {
  fs.writeFileSync(`${guiHome}/${File}`, Value);
}

export async function GetPythonDictionary(File: string) {
  const { stdout, stderr } = await execute(`${pythonAlias} ${guiHome}/${File}`);
  if (stderr) {
    console.error("Could not read ${File}");
  } else {
    cache[File] = JSON.parse(stdout);
    return cache[File];
  }
}

export async function ResetWithGit(File: string) {
  await execute(`git checkout ${guiHome}/${File}`);
  // Todo - Need some kind of sane error checking here
  return 1;
}
