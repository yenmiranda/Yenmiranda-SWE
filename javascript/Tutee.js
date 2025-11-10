const User = require('./User');
const db = require('./db');

class Tutee extends User {
    constructor(firstName, surName, samID, refID = null) {
        super(firstName, surName, samID, 'Tutee', refID);
    }

    // bookSession: creates a new booking record
    async bookSession(availId, tutorRefNo, classNo, timeSlot) {
        let connection;
        try {

            const startTime = time.split('-')[0];
            const fullDateTime = `${date} ${startTime}:00`;

            connection = await db.getConnection(); 
            await connection.beginTransaction();

            const findAvailSql = `
                SELECT AvailID 
                FROM Avail 
                WHERE TutorRefNo = ? 
                  AND ClassNo = ? 
                  AND TimeSlot = ? 
                  AND IsBooked = false
                FOR UPDATE
            `;

            const [rows] = await connection.execute(findAvailSql, [tutorRefNo, classNo, fullDateTime]);

            if (rows.length === 0) {
                await connection.rollback(); 
                console.log("Booking failed: Slot not available for", classNo, fullDateTime);
                return { success: false, message: "Sorry, this time slot is no longer available." };
            }

            const availId = rows[0].AvailID;

            const sql = `
                INSERT INTO Bookings (AvailID, StdRefNo, TutorRefNo, ClassNo, TimeSlot)
                VALUES (?, ?, ?, ?, ?)
            `;

            await connection.execute(sql, [availId, this.refID, tutorRefNo, classNo, fullDateTime]);
            
            const updateAvailSql = 'UPDATE Avail SET IsBooked = true WHERE AvailID = ?';
            await connection.execute(updateAvailSql, [availId]);

            
            await db.execute(sql, [availId, this.refID, tutorRefNo, classNo, timeSlot]);

            await connection.commit();

            console.log("Booking created by", this.firstName, "for", classNo, fullDateTime);
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

    // cancelBooking: removes a booking
    async cancelBooking(bookingNo) {
        try {
            const sql = 'DELETE FROM Bookings WHERE BookingNo = ? AND StdRefNo = ?';
            const [result] = await db.execute(sql, [bookingNo, this.refID]);

            if (result.affectedRows > 0) {
                console.log("Booking canceled:", bookingNo);
                return true;
            } else {
                console.log("No booking found to cancel");
                return false;
            }
        } catch (err) {
            console.error("Error in cancelBooking:", err.message);
            return false;
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

module.exports = Tutee;
