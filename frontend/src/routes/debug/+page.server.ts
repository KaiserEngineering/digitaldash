import { ReadLog, ReadTemp } from "$lib/server/Debug";
import type { Actions } from "./$types";
import { exec } from 'child_process';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const [logResponse, tempResponse] = await Promise.all([ReadLog(), ReadTemp()]);
  const [logData, cpuTemp] = await Promise.all([logResponse.json(), tempResponse.json()]);
  const fileNames: string[] = Object.keys(logData).sort();

  return {
    // We don't want to mutate our array, so no pop()
    content: logData[fileNames[fileNames.length - 1]],
    logNames: fileNames,
    logs: logData,
    current: fileNames[fileNames.length - 1],
    cpuTemp: cpuTemp,
  };
}

export function _Reboot() {
  return new Promise((resolve, reject) => {
      exec('reboot', (error, stdout, stderr) => {
          if (error) {
              reject(`exec error: ${error}`);
          }
          resolve(stdout ? stdout : stderr);
      });
  });
}

export const actions: Actions = {
  reboot: async (_) => {
    await _Reboot();
    return 1;
  },
};
