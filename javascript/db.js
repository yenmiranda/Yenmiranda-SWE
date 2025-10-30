//helps server.js pull from db (params can be changed). This may become irrelevant

const mysql = require('mysql2/promise'); //requires MySQL

const pool = mysql.createPool({ //params for database access. I'd recommend using xampp with apache and mysql to get phpmyadmin but MySQL Workbench works too
    host: 'localhost',       
    user: 'root',           
    password: '',            
    database: 'study_buddy_db' 
});

module.exports = pool;