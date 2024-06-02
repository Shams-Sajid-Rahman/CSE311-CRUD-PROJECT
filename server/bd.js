
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cse_assignment",
});

db.connect((err) => {
  if (err) console.log("error from database connection: ",err);
  else {
    const user = `CREATE TABLE IF NOT EXISTS account (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        gender ENUM('male', 'female', 'other'),
        dob varchar(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        profileImage VARCHAR(255)
    )`;

    db.query(user, (err) => {
        if (err) {
          console.log("Error creating user table :", err);
        } else {
          console.log("account table created successfully");
        }
      });
  }
});

module.exports = db;
