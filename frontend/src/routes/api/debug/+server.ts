import { ReadLog } from "$lib/Debug";

export async function GET() {
  return ReadLog();
}
