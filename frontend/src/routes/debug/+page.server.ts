import { ReadLog } from "$lib/server/Debug";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const res = await ReadLog();

  const data = await res.json();
  const fileNames: string[] = Object.keys(data).sort();

  return {
    // We don't want to mutate our array, so no pop()
    content: data[fileNames[fileNames.length - 1]],
    logNames: fileNames,
    logs: data,
    current: fileNames[fileNames.length - 1],
  };
}
