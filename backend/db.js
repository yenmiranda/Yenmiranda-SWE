import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || process.env.DB_PASS || "",
  database: process.env.DB_NAME || "study_buddy",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(c => { console.log("Database connected successfully!"); c.release(); })
  .catch(err => {
    console.error("Database connection failed:", err.message);
    console.error("   Check your .env file has the correct password!");
  });

export default pool;
