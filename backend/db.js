import mysql from "mysql2/promise";
import 'dotenv/config';
import fs from 'fs'; 
import path from 'path'; 


const caCertPath = path.resolve(__dirname, 'certs/ca-cert.pem');


const pool = mysql.createPool({
    host: process.env.DB_HOST,       
    user: process.env.DB_USER,           
    password: process.env.DB_PASSWORD,            
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { 
        ca: fs.readFileSync(caCertPath),
        rejectUnauthorized: true 
    }
});

