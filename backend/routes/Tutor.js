const User = require('./User');
const db = require('../db');

class Tutor extends User {
    constructor(firstName, surName, samID, refID = null) {
        super(firstName, surName, samID, 'Tutor', refID);
    }

    // addAvailability: adds a new time slot
    async addAvailability(classNo, date, timeSlot) {
        try {

            const startTime = timeSlot.split('-')[0];
            const fullDateTime = `${date} ${startTime}:00`;


            const sql = `
                INSERT INTO Avail (TutorRefNo, ClassNo, TimeSlot, IsBooked)
                VALUES (?, ?, ?, false)
            `;
            await db.execute(sql, [this.refID, classNo, fullDateTime]);
            console.log("Availability added:", classNo, fullDateTime);
            return true;
        } catch (err) {
            console.error("Error in addAvailability:", err.message);
            return false;
        }
    }

    // removeAvailability: deletes a time slot
    async removeAvailability(availId) {
        try {
            const sql = 'DELETE FROM Avail WHERE AvailID = ? AND TutorRefNo = ?';
            const [result] = await db.execute(sql, [availId, this.refID]);

            if (result.affectedRows > 0) {
                console.log("Availability removed:", availId);
                return true;
            } else {
                console.log("No availability found to remove");
                return false;
            }
        } catch (err) {
            console.error("Error in removeAvailability:", err.message);
            return false;
        }
    }

    // viewBooking: shows tutor's availability schedule
    async viewBooking() {
        try {
            const sql = `
                SELECT AvailID, ClassNo, TimeSlot, IsBooked
                FROM Avail
                WHERE TutorRefNo = ?
                ORDER BY TimeSlot ASC
            `;
            const [rows] = await db.execute(sql, [this.refID]);
            console.log("Availability for", this.firstName, rows);
            return rows;
        } catch (err) {
            console.error("Error in viewBooking:", err.message);
            return [];
        }
    }
}

module.exports = Tutor;
