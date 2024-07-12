import { ReadLog, ReadTemp } from "$lib/server/Debug";

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
