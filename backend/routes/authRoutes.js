import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import User from '../models/User.js';

const router = Router();
const saltRounds = 10;

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
    const { samID, password } = req.body;
    if (!samID || !password) {
        return res.status(400).json({ success: false, message: "Sam ID and password are required." });
    }

    try {
        const user = new User(null, null, samID, null);
        const loginSuccess = await user.clickLogin(password);

        if (loginSuccess) {
            let classNo = null;
            if (user.role === 'Tutor') {
                const [tutorRows] = await db.execute('SELECT ClassNo FROM Tutors WHERE TutorRefNo = ?', [user.refID]);
                if (tutorRows.length > 0) {
                    classNo = tutorRows[0].ClassNo;
                }
            }

            const payload = {
                refNo: user.refID,
                role: user.role,
                classNo: classNo 
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            res.cookie('jwt', token, {
                httpOnly: true, 
                secure: true,   
                sameSite: 'strict', 
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({ 
                success: true, 
                message: "Login successful!",
                user: {
                    refNo: user.refID, 
                    firstName: user.firstName,
                    role: user.role,
                    classNo: classNo
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

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(0) 
    });
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

router.post('/verify-key', async (req, res) => {
    const { samID, securityKey } = req.body;
    if (!samID || !securityKey) {
        return res.status(400).json({ success: false, message: "Sam ID and Security Key are required." });
    }

    try {
        const sql = 'SELECT SecurityKey FROM Users WHERE SamID = ?';
        const [rows] = await db.execute(sql, [samID]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Verification failed. Invalid SAM ID or Security Key." });
        }

        const hashedSecurityKey = rows[0].SecurityKey;
        const isMatch = await bcrypt.compare(securityKey, hashedSecurityKey);

        if (isMatch) {
            res.json({ success: true, message: "Security key verified." });
        } else {
            res.status(401).json({ success: false, message: "Verification failed. Invalid SAM ID or Security Key." });
        }

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ success: false, message: "A server error occurred." });
    }
});

router.post('/reset-password', async (req, res) => {
    const { samID, newPassword, confirmPassword } = req.body;
    
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
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
        const sql = 'UPDATE Users SET PasswordHash = ? WHERE SamID = ?';
        const [result] = await db.execute(sql, [newPasswordHash, samID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({ success: true, message: "Your password has been successfully reset!" });

    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ success: false, message: "A server error occurred." });
    }
});

export default router;