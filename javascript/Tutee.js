const User = require('./User');
const db = require('../db');

class Tutee extends User {
    constructor(firstName, surName, samID, refID = null) {
        super(firstName, surName, samID, 'Tutee', refID);
    }

    // bookSession: creates a new booking record
    async bookSession(availId, tutorRefNo, classNo, timeSlot) {
        try {
            const sql = `
                INSERT INTO Bookings (AvailID, StdRefNo, TutorRefNo, ClassNo, TimeSlot)
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.execute(sql, [availId, this.refID, tutorRefNo, classNo, timeSlot]);
            console.log("Booking created for", this.firstName, classNo, timeSlot);
            return true;
        } catch (err) {
            console.error("Error in bookSession:", err.message);
            return false;
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
