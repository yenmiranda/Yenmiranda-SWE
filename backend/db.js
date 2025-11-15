import mysql from "mysql2/promise";
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const caCertPath = path.resolve(__dirname, 'certs', 'ca-cert.pem');

const pool = mysql.createPool({
    host: process.env.DB_HOST,       
    user: process.env.DB_USER,           
    password: process.env.DB_PASSWORD,            
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: { 
        ca: fs.readFileSync(caCertPath),
        rejectUnauthorized: true 
    }
});

pool.getConnection()
  .then(c => { 
      console.log("Database connected successfully (SSL)!");
      c.release(); 
  })
  .catch(error => {
    console.error("Database connection failed:", error.message);
  });

export default pool;