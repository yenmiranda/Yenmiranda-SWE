//necessary imports
import { Router } from 'express';
import Booking from '../models/Booking.js';
import Tutee from '../models/Tutee.js'; 
import { protect } from '../middleware/authMiddleware.js'; 

const router = Router();

//booking creation
router.post('/create', protect, async (req, res) => {
    const { availId, tutorRefNo, classNo } = req.body;
    const { refNo, role } = req.user; 

    if (role !== 'Tutee') {
        return res.status(403).json({ success: false, message: "Only tutees can create bookings." });
    }

    if (!availId || !tutorRefNo || !classNo ) {
        return res.status(400).json({ success: false, message: "Missing booking details." });
    }

    try {
        
        const tutee = new Tutee(null, null, null, refNo); 
        const result = await tutee.bookSession(availId, tutorRefNo, classNo);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(409).json(result); 
        }
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ success: false, message: "A server error occurred." });
    }
});

router.get('/student', protect, async (req, res) => {
    
    const { refNo, role } = req.user; 

    if (role !== 'Tutee') {
        return res.status(403).json({ error: "Only tutees can access this." });
    }
    
    try {
        const booking = new Booking(null, null, refNo); 
        const appointments = await booking.getStudentBookings();
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching student bookings:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/tutor', protect, async (req, res) => {
    const { refNo, role } = req.user; 

    if (role !== 'Tutor') {
        return res.status(403).json({ error: "Only tutors can access this." });
    }

    try {
        const booking = new Booking(null, refNo); 
        const appointments = await booking.getTutorAppointments();
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching tutor appointments:", error);
        res.status(500).json({ error: "Server error" });
    }
});

//booking deletion
router.delete('/:bookingNo', protect, async (req, res) => {
    const { bookingNo } = req.params;
    const { refNo: userRefNo } = req.user; 

    try {
        const booking = new Booking(bookingNo);
        
        const found = await booking.loadDetails();
        if (!found) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }
        
        if (booking.stdRefNo !== userRefNo && booking.tutorRefNo !== userRefNo) {
            return res.status(403).json({ 
                success: false, 
                message: "You are not authorized to cancel this booking." 
            });
        }
        
        const result = await booking.cancelBooking(); 
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result); 
        }
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;