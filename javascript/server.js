//Base file for running server using node.js

//requried constants, packages, and files
const express = require('express');
const db = require('./db'); 
const bcrypt = require('bcrypt'); //passowrd hash
const cors = require('cors'); 

const app = express(); //declares application
const PORT = 3000; //port used
const saltRounds = 10; //salting


app.use(express.json());
app.use(cors()); 
app.post('/api/register', async (req, res) => { //register logic
    const { "Sam ID": samId, password, Role: role } = req.body;

    if (!samId || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds); //password hash

        const insertSql = "INSERT INTO users (sam_id, hashed_password, role) VALUES (?, ?, ?)";
        await db.execute(insertSql, [samId, hashedPassword, role]);

        res.json({ success: true, message: "Registration successful!" });

    } catch (error) { //reg error
        console.error("Registration error:", error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: "This Sam ID is already registered." });
        }
        res.status(500).json({ success: false, message: "A server error occurred during registration." });
    }
});

app.post('/api/login', async (req, res) => { //login logic
    const { "Sam ID": samId, password } = req.body;

    if (!samId || !password) {
        return res.status(400).json({ success: false, message: "Sam ID and password are required." });
    }

    try {
        const findUserSql = "SELECT * FROM users WHERE sam_id = ?";
        const [users] = await db.execute(findUserSql, [samId]);

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.hashed_password);

        if (isMatch) {

            res.json({ 
                success: true, 
                message: "Login successful!",
                role: user.role
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials." });
        }

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "A server error occurred during login." });
    }
});


app.post('/api/book-appointment', async (req, res) => { //book appointment extra logic
    
    const { tutor, day, time } = req.body;
    
    try {
        const checkSql = "SELECT * FROM bookings WHERE tutor_id = ? AND booking_day = ? AND booking_time = ?";
        const [existingBookings] = await db.execute(checkSql, [tutor, day, time]);

        if (existingBookings.length > 0) {
            return res.json({ 
                success: false, 
                message: "This time slot is already booked. Please try another time." 
            });
        }

        const insertSql = "INSERT INTO bookings (tutor_id, booking_day, booking_time) VALUES (?, ?, ?)";
        await db.execute(insertSql, [tutor, day, time]);

        res.json({ 
            success: true, 
            message: "Appointment confirmed!" 
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ 
            success: false, 
            message: "A server error occurred. Please try again later." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Study Buddy server running on http://localhost:${PORT}`);
});