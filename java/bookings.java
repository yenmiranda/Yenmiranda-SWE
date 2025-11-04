import java.util.*;
import java.time.LocalDateTime;
import java.sql.Timestamp;

/**
 * BOOKINGS CLASS
 * Backend - Booking Module
 * Handles the creation and management of tutoring session bookings
 */
public class bookings {
    private int bookingNo;          // Booking identifier (auto-incrementing)
    private int availId;            // Reference to Avail table
    private String sRefNo;          // Student Reference Number
    private String tRefNo;          // Tutor Reference Number
    private String classNo;         // Course identifier
    private LocalDateTime timeSlot; // Date and time of session

    private boolean isBooked;        // Booking status flag
    
    // Constructor
    public bookings(int availId, String sRefNo, String tRefNo, String classNo, LocalDateTime timeSlot) {
        this.availId = availId;
        this.sRefNo = sRefNo;
        this.tRefNo = tRefNo;
        this.classNo = classNo;
        this.timeSlot = timeSlot;
        this.isBooked = false;
    }

    // Getters and Setters
    public int getBookingNo() { return bookingNo; }
    public void setBookingNo(int bookingNo) { this.bookingNo = bookingNo; }

    public int getAvailId() { return availId; }
    public void setAvailId(int availId) { this.availId = availId; }

    public String getSRefNo() { return sRefNo; }
    public void setSRefNo(String sRefNo) { this.sRefNo = sRefNo; }

    public String getTRefNo() { return tRefNo; }
    public void setTRefNo(String tRefNo) { this.tRefNo = tRefNo; }

    public String getClassNo() { return classNo; }
    public void setClassNo(String classNo) { this.classNo = classNo; }

    public LocalDateTime getTimeSlot() { return timeSlot; }
    public void setTimeSlot(LocalDateTime timeSlot) { this.timeSlot = timeSlot; }

    public boolean isBooked() { return isBooked; }
    public void setBooked(boolean booked) { isBooked = booked; }

    /**
     * Validates if the requested booking time is within allowed hours
     * @param requestedTime The time to validate
     * @return true if the time is valid, false otherwise
     */
    public boolean validateBookingTime(LocalDateTime requestedTime) {
        int hour = requestedTime.getHour();
        // Allow bookings between 8 AM and 9 PM
        return hour >= 8 && hour <= 21;
    }

    /**
     * Checks if a time slot is available for booking
     * @param availId The availability ID to check
     * @param timeSlot The requested time slot
     * @return true if the slot is available, false otherwise
     */
    public boolean isSlotAvailable(int availId, LocalDateTime timeSlot) {
        // In a real implementation, this would check the database
        // For now, we'll assume the slot is available if it's not already booked
        return !isBooked;
    }

    /**
     * Creates a new booking in the system
     * @return true if booking was successful, false otherwise
     */
    public boolean createBooking() {
        if (!validateBookingTime(timeSlot) || !isSlotAvailable(availId, timeSlot)) {
            return false;
        }

        try {
            // Set booking as confirmed
            this.isBooked = true;
            return true;
        } catch (Exception e) {
            System.err.println("Error creating booking: " + e.getMessage());
            return false;
        }
    }

    /**
     * Formats the booking time slot for display
     * @return Formatted string representation of the booking time
     */
    public String formatBookingTime() {
        return String.format("%s %02d:00-%02d:00", 
            timeSlot.toLocalDate(),
            timeSlot.getHour(),
            timeSlot.getHour() + 1);
    }

    /**
     * Returns a string representation of the booking
     * @return String containing booking details
     */
    @Override
    public String toString() {
        return String.format("Booking{id=%d, class=%s, time=%s, student=%s, tutor=%s}", 
            bookingNo, classNo, formatBookingTime(), sRefNo, tRefNo);
    }
}


