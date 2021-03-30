import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./emp_database.db', (err) => {
  if (err) {
      console.error("Erro opening database " + err.message);
  } else {

      db.run('CREATE TABLE employees( \
          employee_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
          last_name NVARCHAR(20)  NOT NULL,\
          first_name NVARCHAR(20)  NOT NULL,\
          title NVARCHAR(20),\
          address NVARCHAR(100),\
          country_code INTEGER\
      )', (err) => {
          if (err) {
              console.log("Table already exists.");
          }
          let insert = 'INSERT INTO employees (last_name, first_name, title, address, country_code) VALUES (?,?,?,?,?)';
          db.run(insert, ["Chandan", "Praveen", "SE", "Address 1", 1]);
          db.run(insert, ["Samanta", "Mohim", "SSE", "Address 2", 1]);
          db.run(insert, ["Gupta", "Pinky", "TL", "Address 3", 1]);
      });
  }
});

export default db;