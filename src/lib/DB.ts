import sqlite3 from 'better-sqlite3';

const db = sqlite3( 'ke.db' );
// const createTable = "CREATE TABLE IF NOT EXISTS User ('username' varchar PRIMARY KEY, 'password' varchar, 'token' varchar );"
// db.exec(createTable);

// const updateUserToken = db.prepare("UPDATE User SET token=? WHERE rowid=1");
// updateUserToken.run('');

export default db;
