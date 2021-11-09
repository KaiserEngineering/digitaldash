import sqlite3 from "better-sqlite3";

const db = sqlite3("ke.db");
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
  createDefaultUser.run(
    "ke",
    "af9d2c92ddc38ca77b3cd29e944c9b61928032808d3a3cb6c3a3c8965067291e"
  );
}

export default db;
