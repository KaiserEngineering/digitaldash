import { ReadOverlayFile } from "$lib/Overlays";

export async function get() {
  return ReadOverlayFile();
}
