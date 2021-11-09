import db from "$lib/DB";
import { createHash } from "crypto";

export function HashPassword(Password: string): string {
  return createHash("sha256").update(Password).digest("hex");
}

export function UpdateToken(Token: string) {
  const updateUserToken = db.prepare("UPDATE User SET token=? WHERE rowid=1");
  updateUserToken.run(Token);
}

export function UpdateUserCredentials(Username: string, Password: string) {
  const updateUser = db.prepare(
    "UPDATE User SET username=?, password=? WHERE rowid=1"
  );
  updateUser.run(Username, HashPassword(Password));
}

export function User() {
  return db.prepare("SELECT * FROM User").get();
}
