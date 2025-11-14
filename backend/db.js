//base imports
import mysql from "mysql2/promise";
import 'dotenv/config';

//connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,       
    user: process.env.DB_USER,           
    password: process.env.DB_PASSWORD,            
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//try connection or pass error
pool.getConnection()
  .then(c => { 
      console.log("Database connected successfully!"); 
      c.release(); 
  })
  .catch(err => {
    console.error("Database connection failed:", err.message);
  });

export default pool;