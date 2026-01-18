const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",        
  password: "Noisemaker&&56",        // My MySQL password here
  database: "learnsphere"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ LearnSphere connected successfully");
  }
});

module.exports = db;
