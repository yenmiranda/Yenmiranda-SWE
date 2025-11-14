import User from './User.js';
import db from '../db.js';

class Tutee extends User {
    constructor(firstName, surName, samID, refID = null) {
        super(firstName, surName, samID, 'Tutee', refID);
    }

    //creates a new booking record
    async bookSession(availId, tutorRefNo, classNo, timeSlot) {
        let connection;
        try {
            connection = await db.getConnection(); 
            await connection.beginTransaction();

            const findAvailSql = `
                SELECT TimeSlot 
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

            const correctTimeSlot = rows[0].TimeSlot;

            const insertBookingSql = `
            INSERT INTO Bookings (AvailID, StdRefNo, TutorRefNo, ClassNo, TimeSlot)
            VALUES (?, ?, ?, ?, ?)
            `;


            await connection.execute(insertBookingSql, [availId, this.refID, tutorRefNo, classNo, correctTimeSlot]);
            
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

    //shows all bookings for this tutee
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