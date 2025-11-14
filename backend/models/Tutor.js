import User from './User.js';
import db from '../db.js';

class Tutor extends User {
    constructor(firstName, surName, samID, refID = null) {
        super(firstName, surName, samID, 'Tutor', refID);
    }
    
    //sets weekly schedule and assists with date estimation
    async setWeeklyAvailability(items, classNo) {
        const conn = await db.getConnection();
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        
        try {
            await conn.beginTransaction();

            await conn.query(
                `DELETE FROM Avail 
                 WHERE TutorRefNo=? AND IsBooked=FALSE AND TimeSlot >= NOW()`,
                [this.refID]
            );

            for (const item of items) {
                const { day, timeSlot } = item;
                if (!day || !timeSlot) continue;

                const today = new Date();
                const want = days.indexOf(day);
                if (want === -1) continue; 
                
                const add = (want - today.getDay() + 7) % 7;
                const startHH = timeSlot.split("-")[0];

                for (let week = 0; week < 12; week++) {
                    const dt = new Date(today);
                    dt.setDate(today.getDate() + add + (week * 7));

                    const y = dt.getFullYear();
                    const m = String(dt.getMonth() + 1).padStart(2, '0');
                    const d = String(dt.getDate()).padStart(2, '0');
                    const ymd = `${y}-${m}-${d}`;
                    
                    const startISO = `${ymd}T${startHH}:00`;

                    await conn.query(
                        `INSERT INTO Avail (TutorRefNo, TimeSlot, ClassNo, IsBooked)
                         VALUES (?, ?, ?, FALSE)`,
                        [this.refID, startISO, classNo]
                    );
                }
            }

            await conn.commit();
            return { success: true, message: "Availability saved for 12 weeks" };
        } catch (error) {
            await conn.rollback();
            console.error(e);
            throw error;
        } finally {
            conn.release();
        }
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
        } catch (error) {
            console.error("Error in addAvailability:", error.message);
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
        } catch (error) {
            console.error("Error in removeAvailability:", error.message);
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
        } catch (error) {
            console.error("Error in viewBooking:", error.message);
            return [];
        }
    }
}

export default Tutor;