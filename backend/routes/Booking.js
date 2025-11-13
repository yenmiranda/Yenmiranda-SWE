const db = require('../../frontend/javascript/db');

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

    // loadDetails: loads full details for a specific booking
    async loadDetails() {
        try {
            if (!this.bookingNo) {
                console.log("No booking number provided");
                return false;
            }

            const sql = `
                SELECT 
                    B.BookingNo,
                    B.AvailID,
                    B.StdRefNo,
                    B.TutorRefNo,
                    B.ClassNo,
                    B.TimeSlot,
                    C.ClassName,
                    U1.FirstName AS StudentFirstName,
                    U1.LastName AS StudentLastName,
                    U2.FirstName AS TutorFirstName,
                    U2.LastName AS TutorLastName
                FROM Bookings B
                JOIN Classes C ON B.ClassNo = C.ClassNo
                JOIN Students S ON B.StdRefNo = S.StdRefNo
                JOIN Users U1 ON S.StdRefNo = U1.RefNo
                JOIN Tutors T ON B.TutorRefNo = T.TutorRefNo
                JOIN Users U2 ON T.TutorRefNo = U2.RefNo
                WHERE B.BookingNo = ?
            `;

            const [rows] = await db.execute(sql, [this.bookingNo]);

            if (rows.length === 0) {
                console.log("Booking not found:", this.bookingNo);
                return false;
            }

            const booking = rows[0];
            this.availId = booking.AvailID;
            this.stdRefNo = booking.StdRefNo;
            this.tutorRefNo = booking.TutorRefNo;
            this.classNo = booking.ClassNo;
            this.className = booking.ClassName;
            this.timeSlot = booking.TimeSlot;
            this.studentName = `${booking.StudentFirstName} ${booking.StudentLastName}`;
            this.tutorName = `${booking.TutorFirstName} ${booking.TutorLastName}`;

            console.log("Booking details loaded:", this.bookingNo);
            return true;

        } catch (err) {
            console.error("Error in loadDetails:", err.message);
            return false;
        }
    }

    // getTutorAppointments: retrieves all upcoming appointments for this tutor
    async getTutorAppointments() {
        try {
            if (!this.tutorRefNo) {
                console.log("No tutor RefNo provided");
                return [];
            }

            const sql = `
                SELECT 
                    B.BookingNo,
                    B.TimeSlot,
                    B.ClassNo,
                    C.ClassName,
                    U.FirstName AS StudentFirstName,
                    U.LastName AS StudentLastName
                FROM Bookings B
                JOIN Classes C ON B.ClassNo = C.ClassNo
                JOIN Students S ON B.StdRefNo = S.StdRefNo
                JOIN Users U ON S.StdRefNo = U.RefNo
                WHERE B.TutorRefNo = ?
                AND B.TimeSlot >= NOW()
                ORDER BY B.TimeSlot ASC
            `;

            const [rows] = await db.execute(sql, [this.tutorRefNo]);

            console.log("Retrieved", rows.length, "appointments for tutor", this.tutorRefNo);
            return rows;

        } catch (err) {
            console.error("Error in getTutorAppointments:", err.message);
            return [];
        }
    }

    // getStudentBookings: retrieves all upcoming bookings for this student
    async getStudentBookings() {
        try {
            if (!this.stdRefNo) {
                console.log("No student RefNo provided");
                return [];
            }

            const sql = `
                SELECT 
                    B.BookingNo,
                    B.TimeSlot,
                    B.ClassNo,
                    C.ClassName,
                    U.FirstName AS TutorFirstName,
                    U.LastName AS TutorLastName
                FROM Bookings B
                JOIN Classes C ON B.ClassNo = C.ClassNo
                JOIN Tutors T ON B.TutorRefNo = T.TutorRefNo
                JOIN Users U ON T.TutorRefNo = U.RefNo
                WHERE B.StdRefNo = ?
                AND B.TimeSlot >= NOW()
                ORDER BY B.TimeSlot ASC
            `;

            const [rows] = await db.execute(sql, [this.stdRefNo]);

            console.log("Retrieved", rows.length, "bookings for student", this.stdRefNo);
            return rows;

        } catch (err) {
            console.error("Error in getStudentBookings:", err.message);
            return [];
        }
    }

    // cancelBooking: cancels this booking and frees up the availability slot
    async cancelBooking() {
        let connection;
        try {
            if (!this.bookingNo) {
                console.log("No booking number provided for cancellation");
                return { success: false, message: "No booking number provided." };
            }

            connection = await db.getConnection();
            await connection.beginTransaction();

            // Get booking details to retrieve AvailID
            const getBookingSql = `
                SELECT AvailID, StdRefNo, TutorRefNo 
                FROM Bookings 
                WHERE BookingNo = ?
            `;
            const [bookings] = await connection.execute(getBookingSql, [this.bookingNo]);

            if (bookings.length === 0) {
                await connection.rollback();
                console.log("Booking not found:", this.bookingNo);
                return { success: false, message: "Booking not found." };
            }

            const booking = bookings[0];
            this.availId = booking.AvailID;

            // Delete the booking
            const deleteBookingSql = 'DELETE FROM Bookings WHERE BookingNo = ?';
            await connection.execute(deleteBookingSql, [this.bookingNo]);

            // Free up the availability slot
            const updateAvailSql = 'UPDATE Avail SET IsBooked = false WHERE AvailID = ?';
            await connection.execute(updateAvailSql, [this.availId]);

            await connection.commit();
            console.log("Booking canceled successfully:", this.bookingNo);
            return { success: true, message: "Booking canceled successfully." };

        } catch (err) {
            if (connection) {
                await connection.rollback();
            }
            console.error("Error in cancelBooking transaction:", err.message);
            return { success: false, message: "A server error occurred while canceling the booking." };
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}

module.exports = Booking;
