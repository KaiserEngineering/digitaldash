import { ReadLog } from '$lib/Debug';

export async function get() {
  return ReadLog();
}
