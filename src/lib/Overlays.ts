import { ReadFile } from "$lib/Util";

// For now we just hard code the file we are reading
export function ReadOverlayFile() {
  let localFile: string;
  try {
    localFile = ReadFile("/local/static/constants.py", false, false);
  } catch {}
  let coreFile = ReadFile("/static/constants.py", false, false);

  const file = localFile ? localFile : coreFile;

  return {
    headers: { "content-type": "text/html; charset=UTF-8" },
    body: file.toString(),
  };
}
