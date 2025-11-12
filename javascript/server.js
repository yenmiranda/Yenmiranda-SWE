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

app.post('/api/availability/check', async (req, res) => {
    const { course, date, time } = req.body; 

    const startTime = time.split('-')[0];
    const fullDateTime = `${date} ${startTime}:00`;

    try {
        const sql = `
            SELECT COUNT(DISTINCT TutorRefNo) as tutorCount 
            FROM Avail
            WHERE ClassNo = ? AND TimeSlot = ? AND IsBooked = false
        `;
        
        const [rows] = await db.execute(sql, [course, fullDateTime]);
        
        const count = rows[0].tutorCount;
        
        if (count > 0) {
            res.json({ available: true, tutorCount: count });
        } else {
            res.json({ available: false, tutorCount: 0 });
        }
    } catch (error) {
        console.error("Error checking availability:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

app.post('/api/availability/tutors', async (req, res) => {
    const { course, date, time } = req.body;
    
    const startTime = time.split('-')[0];
    const fullDateTime = `${date} ${startTime}:00`;

    try {
        const sql = `
            SELECT T.TutorRefNo, U.FirstName, U.LastName 
            FROM Avail A
            JOIN Tutors T ON A.TutorRefNo = T.TutorRefNo
            JOIN Users U ON T.TutorRefNo = U.RefNo
            WHERE A.ClassNo = ? AND A.TimeSlot = ? AND A.IsBooked = false
        `;
        const [tutors] = await db.execute(sql, [course, fullDateTime]);

        const availableTutors = tutors.map(t => ({
            id: t.TutorRefNo,
            name: `${t.FirstName} ${t.LastName}`
        }));
        
        res.json({ tutors: availableTutors });

    } catch (error) {
        console.error("Error fetching tutors:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

app.post('/api/book', async (req, res) => {

    const { course, time, date, tutorId, studentRefNo } = req.body;

    if (!course || !time || !date || !tutorId || !studentRefNo) {
        return res.status(400).json({ success: false, message: "Missing booking details." });
    }

    const tutee = new Tutee(null, null, null, studentRefNo);

    try {
        
        const result = await tutee.bookSession(tutorId, course, date, time);
        
        if (result.success) {
            res.json({ success: true, message: result.message });
        } else {
            const statusCode = result.message.includes("available") ? 409 : 500;
            res.status(statusCode).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Booking API error:", error);
        res.status(500).json({ success: false, message: "A server error occurred." });
    }
});

httpsServer.listen(port, () => {
    console.log(`HTTPS server running on https://localhost:${port}`);
});