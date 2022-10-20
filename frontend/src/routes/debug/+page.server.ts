/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const res = await fetch("/api/debug");
  if (res.ok) {
    let data = await res.json();
    const fileNames = Object.keys(data).sort();

    return {
      // We don't want to mutate our array, so no pop()
      content: data[fileNames[fileNames.length - 1]],
      logNames: fileNames,
      logs: data,
      current: fileNames[fileNames.length - 1],
    };
  }

  return {
    status: res.status,
    error: new Error(`Could not load /api/debug`),
  };
}
