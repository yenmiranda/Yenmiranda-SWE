import db from '../db.js';

//constructor for booking
class Booking {
    constructor(bookingNo = null, tutorRefNo = null, stdRefNo = null) {
        this.bookingNo = bookingNo;
        this.tutorRefNo = tutorRefNo;
        this.stdRefNo = stdRefNo;
        this.availId = null;
        this.classNo = null;
        this.className = null;
        this.timeSlot = null;
        this.studentName = null;
        this.tutorName = null;
    }

    //loads details
    async loadDetails() {
        try {
            if (!this.bookingNo) return false;
            const sql = `
                SELECT B.*, C.ClassName,
                    U1.FirstName AS StudentFirstName, U1.LastName AS StudentLastName,
                    U2.FirstName AS TutorFirstName, U2.LastName AS TutorLastName
                FROM Bookings B
                JOIN Classes C ON B.ClassNo = C.ClassNo
                JOIN Students S ON B.StdRefNo = S.StdRefNo
                JOIN Users U1 ON S.StdRefNo = U1.RefNo
                JOIN Tutors T ON B.TutorRefNo = T.TutorRefNo
                JOIN Users U2 ON T.TutorRefNo = U2.RefNo
                WHERE B.BookingNo = ?
            `;
            const [rows] = await db.execute(sql, [this.bookingNo]);
            if (rows.length === 0) return false;
            
            const b = rows[0];
            this.availId = b.AvailID; this.stdRefNo = b.StdRefNo;
            this.tutorRefNo = b.TutorRefNo; this.classNo = b.ClassNo;
            this.className = b.ClassName; this.timeSlot = b.TimeSlot;
            this.studentName = `${b.StudentFirstName} ${b.StudentLastName}`;
            this.tutorName = `${b.TutorFirstName} ${b.TutorLastName}`;
            return true;
        } catch (error) {
            console.error("Error in loadDetails:", error.message);
            return false;
        }
    }

    //gets appointments for tutor
    async getTutorAppointments() {
        try {
            if (!this.tutorRefNo) return [];
            const sql = `
                SELECT B.BookingNo, B.TimeSlot, B.ClassNo, C.ClassName,
                    U.FirstName AS StudentFirstName, U.LastName AS StudentLastName
                FROM Bookings B
                JOIN Classes C ON B.ClassNo = C.ClassNo
                JOIN Students S ON B.StdRefNo = S.StdRefNo
                JOIN Users U ON S.StdRefNo = U.RefNo
                WHERE B.TutorRefNo = ? AND B.TimeSlot >= NOW()
                ORDER BY B.TimeSlot ASC
            `;
            const [rows] = await db.execute(sql, [this.tutorRefNo]);
            return rows;
        } catch (error) {
            console.error("Error in getTutorAppointments:", error.message);
            return [];
        }
    }

    //gets appointments for students
    async getStudentBookings() {
        try {
            if (!this.stdRefNo) return [];
            const sql = `
                SELECT B.BookingNo, B.TimeSlot, B.ClassNo, C.ClassName,
                    U.FirstName AS TutorFirstName, U.LastName AS TutorLastName
                FROM Bookings B
                JOIN Classes C ON B.ClassNo = C.ClassNo
                JOIN Tutors T ON B.TutorRefNo = T.TutorRefNo
                JOIN Users U ON T.TutorRefNo = U.RefNo
                WHERE B.StdRefNo = ? AND B.TimeSlot >= NOW()
                ORDER BY B.TimeSlot ASC
            `;
            const [rows] = await db.execute(sql, [this.stdRefNo]);
            return rows;
        } catch (error) {
            console.error("Error in getStudentBookings:", error.message);
            return [];
        }
    }

    //cancels bookings
    async cancelBooking() {
        let connection;
        try {
            if (!this.bookingNo) {
                return { success: false, message: "No booking number provided." };
            }
            connection = await db.getConnection();
            await connection.beginTransaction();

            const getBookingSql = `SELECT AvailID FROM Bookings WHERE BookingNo = ? FOR UPDATE`;
            const [bookings] = await connection.execute(getBookingSql, [this.bookingNo]);

            if (bookings.length === 0) {
                await connection.rollback();
                return { success: false, message: "Booking not found." };
            }
            this.availId = bookings[0].AvailID;

            const deleteBookingSql = 'DELETE FROM Bookings WHERE BookingNo = ?';
            await connection.execute(deleteBookingSql, [this.bookingNo]);

            const updateAvailSql = 'UPDATE Avail SET IsBooked = false WHERE AvailID = ?';
            await connection.execute(updateAvailSql, [this.availId]);

            await connection.commit();
            return { success: true, message: "Booking canceled successfully." };

        } catch (error) {
            if (connection) await connection.rollback();
            console.error("Error in cancelBooking transaction:", error.message);
            return { success: false, message: "A server error occurred." };
        } finally {
            if (connection) connection.release();
        }
    }
}

export default Booking;