require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db')
const fs = require('fs'); 
const path = require('path'); 
const https = require('https');

const User = require('./User');
const Tutor = require('./Tutor');
const Tutee = require('./Tutee');
const Booking = require('./Booking');

const app = express();
const port = 3000;
const saltRounds = 10;

const keyPath = path.resolve(__dirname, 'certs/key.pem');
const certPath = path.resolve(__dirname, 'certs/cert.pem');

const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

const httpsServer = https.createServer(options, app);

app.use(express.json());
app.use(cors()); 

const cssPath = path.join(__dirname, '..', 'css');
app.use(express.static(cssPath));

const htmlPath = path.join(__dirname, '..', 'html');
app.use(express.static(htmlPath));

const jsPath = path.join(__dirname, '..', 'javascript');
app.use(express.static(jsPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'Login.html'));
});

app.post('/api/register', async (req, res) => {
    const { firstName, surname, samID, password, securityKey, role, course } = req.body;

    if (!firstName || !surname || !samID || !password || !securityKey || !role) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (role === 'Tutor' && !course) {
        return res.status(400).json({ success: false, message: "Tutors must select a course." });
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,25}$/;
    if (!regex.test(password)) {
        return res.status(400).json({ 
            success: false, 
            message: "Password must be 8-25 chars, include uppercase, lowercase, number & special char" 
        });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const hashedSecurityKey = await bcrypt.hash(securityKey, saltRounds);

        const user = new User(firstName, surname, samID, role);
        
        await user.clickRegister(hashedPassword, hashedSecurityKey);

        let subTableSql = '';
        let subTableParams = [];

        if (role === 'Tutor') {
            subTableSql = 'INSERT INTO Tutors (TutorRefNo, ClassNo) VALUES (?, ?)';
            subTableParams = [user.refID, course];
        } else {
            subTableSql = 'INSERT INTO Students (StdRefNo) VALUES (?)';
            subTableParams = [user.refID];
        }

        await db.execute(subTableSql, subTableParams);
        res.status(201).json({ success: true, message: "Registration successful!" });

    } catch (error) {
        console.error("Registration error:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: "This Sam ID is already registered." });
        }

        res.status(500).json({ success: false, message: "A server error occurred during registration." });
    }
});

app.post('/api/login', async (req, res) => {
    const { samID, password } = req.body;

    if (!samID || !password) {
        return res.status(400).json({ success: false, message: "Sam ID and password are required." });
    }

    try {
        const user = new User(null, null, samID, null);
        
        const loginSuccess = await user.clickLogin(password);

        if (loginSuccess) {
            res.json({ 
                success: true, 
                message: "Login successful!",
                user: {
                    refNo: user.refID,
                    firstName: user.firstName,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials." });
        }

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "A server error occurred." });
    }
});

app.post('/api/verify-key', async (req, res) => {
    const { samID, securityKey } = req.body;

    if (!samID || !securityKey) {
        return res.status(400).json({ success: false, message: "Sam ID and Security Key are required." });
    }

    try {
        // 1. Find the user by SamID
        const sql = 'SELECT SecurityKey FROM Users WHERE SamID = ?';
        const [rows] = await db.execute(sql, [samID]);

        if (rows.length === 0) {
            // Use a generic message for security to prevent enumeration of valid Sam IDs
            return res.status(401).json({ success: false, message: "Verification failed. Invalid SAM ID or Security Key." });
        }

        const hashedSecurityKey = rows[0].SecurityKey;
        
        // 2. Compare the provided security key with the hashed one in the database
        const isMatch = await bcrypt.compare(securityKey, hashedSecurityKey);

        if (isMatch) {
            // Security key is correct
            res.json({ success: true, message: "Security key verified." });
        } else {
            // Use a generic message for security
            res.status(401).json({ success: false, message: "Verification failed. Invalid SAM ID or Security Key." });
        }

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ success: false, message: "A server error occurred." });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { samID, newPassword, confirmPassword } = req.body;
    
    // Check if passwords match (client-side validation is done, but server should re-check)
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match." });
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,25}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ 
            success: false, 
            message: "Password must be 8-25 chars, include uppercase, lowercase, number & special char" 
        });
    }

    try {
        // 1. Hash the new password
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // 2. Update the user's password in the database
        const sql = 'UPDATE Users SET PasswordHash = ? WHERE SamID = ?';
        const [result] = await db.execute(sql, [newPasswordHash, samID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found or password was not changed." });
        }

        res.json({ success: true, message: "Your password has been successfully reset!" });

    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ success: false, message: "A server error occurred during password reset." });
    }
});


httpsServer.listen(port, () => {
    console.log(`HTTPS server running on https://localhost:${port}`);
});