// Filename: models/Tutee.js
import User from './User.js';
import db from '../db.js';

class Tutee extends User {
    constructor(firstName, surName, samID, refID = null) {
        super(firstName, surName, samID, 'Tutee', refID);
    }

    // bookSession: creates a new booking record
    async bookSession(availId, tutorRefNo, classNo, timeSlot) {
        let connection;
        try {
            // BUG FIX: The original code used 'date' and 'time' which
            // were not defined. We should use the 'timeSlot' argument.
            // The 'timeSlot' from the frontend should be the full YYYY-MM-DD HH:MM:SS
            // or equivalent datetime string.
            // For this to work, the 'timeSlot' parameter must be the full datetime string.

            connection = await db.getConnection(); 
            await connection.beginTransaction();

            // Find the specific availability slot and lock it
            const findAvailSql = `
                SELECT AvailID 
                FROM Avail 
                WHERE AvailID = ? 
                  AND IsBooked = false
                FOR UPDATE
            `;
            const [rows] = await connection.execute(findAvailSql, [availId]);

            if (rows.length === 0) {
                await connection.rollback(); 
                console.log("Booking failed: Slot not available for AvailID", availId);
                return { success: false, message: "Sorry, this time slot is no longer available." };
            }

            // Create the new booking
            const insertBookingSql = `
                INSERT INTO Bookings (AvailID, StdRefNo, TutorRefNo, ClassNo, TimeSlot)
                VALUES (?, ?, ?, ?, ?)
            `;
            await connection.execute(insertBookingSql, [availId, this.refID, tutorRefNo, classNo, timeSlot]);
            
            // Mark the availability slot as booked
            const updateAvailSql = 'UPDATE Avail SET IsBooked = true WHERE AvailID = ?';
            await connection.execute(updateAvailSql, [availId]);

            await connection.commit();

            console.log("Booking created by", this.firstName, "for", classNo, timeSlot);
            return { success: true, message: "Booking confirmed!" };

        } catch (err) {
            if (connection) {
                await connection.rollback();
            }
            console.error("Error in bookSession transaction:", err.message);
            return { success: false, message: "A server error occurred during booking." };
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    // viewBooking: shows all bookings for this tutee
    async viewBooking() {
        try {
            const sql = `
                SELECT BookingNo, ClassNo, TimeSlot, TutorRefNo
                FROM Bookings
                WHERE StdRefNo = ?
                ORDER BY TimeSlot ASC
            `;
            const [rows] = await db.execute(sql, [this.refID]);
            console.log("Bookings for", this.firstName, rows);
            return rows;
        } catch (err) {
            console.error("Error in viewBooking:", err.message);
            return [];
        }
    }
}

export default Tutee;