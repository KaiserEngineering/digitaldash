import { ReadOverlayFile } from "$lib/Overlays";

export async function GET() {
  return ReadOverlayFile();
}
