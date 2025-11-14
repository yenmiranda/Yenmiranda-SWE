// Filename: backend/routes/bookingRoutes.js
import { Router } from 'express';
import Booking from '../models/Booking.js';
import Tutee from '../models/Tutee.js'; // Import Tutee for creating bookings
import { protect } from '../middleware/authMiddleware.js'; // Import the protector

const router = Router();

// --- CREATE A NEW BOOKING (PROTECTED) ---
router.post('/create', protect, async (req, res) => {
    // 1. Get all 4 slot details from the body
    const { availId, tutorRefNo, classNo, timeSlot } = req.body;
    
    // 2. Get the student's ID from the secure token
    const { refNo, role } = req.user; 

    if (role !== 'Tutee') {
        return res.status(403).json({ success: false, message: "Only tutees can create bookings." });
    }
    
    if (!availId || !tutorRefNo || !classNo || !timeSlot) {
        return res.status(400).json({ success: false, message: "Missing booking details." });
    }

    try {
        // 3. Create a Tutee instance using the secure refNo
        const tutee = new Tutee(null, null, null, refNo); 
        
        // 4. Pass all 4 details to the bookSession function
        const result = await tutee.bookSession(availId, tutorRefNo, classNo, timeSlot);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(409).json(result); // 409 Conflict (slot taken)
        }
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ success: false, message: "A server error occurred." });
    }
});

// --- GET A STUDENT'S UPCOMING BOOKINGS (PROTECTED) ---
router.get('/student', protect, async (req, res) => {
    // Get stdRefNo from token
    const { refNo, role } = req.user; 

    if (role !== 'Tutee') {
        return res.status(403).json({ error: "Only tutees can access this." });
    }
    
    try {
        const booking = new Booking(null, null, refNo); // Use secure refNo
        const appointments = await booking.getStudentBookings();
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching student bookings:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- GET A TUTOR'S UPCOMING APPOINTMENTS (PROTECTED) ---
router.get('/tutor', protect, async (req, res) => {
    // Get tutorRefNo from token
    const { refNo, role } = req.user; 

    if (role !== 'Tutor') {
        return res.status(403).json({ error: "Only tutors can access this." });
    }

    try {
        const booking = new Booking(null, refNo); // Use secure refNo
        const appointments = await booking.getTutorAppointments();
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching tutor appointments:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- CANCEL A BOOKING (PROTECTED & SECURED) ---
router.delete('/:bookingNo', protect, async (req, res) => {
    const { bookingNo } = req.params;
    const { refNo: userRefNo } = req.user; // Get user from token

    try {
        const booking = new Booking(bookingNo);
        
        // 1. Load the booking's details from the DB
        const found = await booking.loadDetails();
        if (!found) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        // 2. SECURITY CHECK: Is this user the tutee or the tutor?
        if (booking.stdRefNo !== userRefNo && booking.tutorRefNo !== userRefNo) {
            return res.status(403).json({ 
                success: false, 
                message: "You are not authorized to cancel this booking." 
            });
        }
        
        // 3. Proceed with cancellation
        const result = await booking.cancelBooking(); 
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result); // Not found or other issue
        }
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;