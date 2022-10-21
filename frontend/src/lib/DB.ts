import sqlite3 from "better-sqlite3";
import { HashPassword } from "$lib/User";

const db = sqlite3("ke.db");

export function Setup() {
  const createTable =
    "CREATE TABLE IF NOT EXISTS User ('username' varchar PRIMARY KEY, 'password' varchar, 'token' varchar );";
  db.exec(createTable);

  const keUser = db.prepare("SELECT * FROM User").get();
  if (!keUser) {
    console.log("Creating default user");
    // Default password is 'dash'
    const createDefaultUser = db.prepare(
      "INSERT INTO User (username, password) VALUES (?, ?)"
    );

    const password = HashPassword("dash");

    createDefaultUser.run(
      "ke",
      password
    );
  }
}

export default db;
