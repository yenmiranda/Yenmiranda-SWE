import java.util.*;

/**
 * BOOKINGS CLASS - DRAFT
 *  Backend - Booking Module
 */
public class Bookings {
    private int BookingNO;          // Booking identifier
    private int DisplayHour;        // Displays hour 
    private int DisplayMinute;      // Displays minutes 
    
    public enum Day { 
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY 
    }
    private Day DaysBook;           // Monday to Sunday

    // INTERNAL DATA STRUCTURES 
    private List<BookingRecord> bookingRecords;
    private boolean sessionActive;
    
    public Bookings() {
        // Initialize internal data structures
        this.bookingRecords = new ArrayList<>();
        this.sessionActive = true;
        this.BookingNO = 1000; // Starting booking number
    }

    /**
    * CreateTable() Method
    * Purpose: Initializes the internal booking table for the week
    * The method should fill the 'bookingRecords' list with time slots
    * 
    * Behavior
    * Should clear any previous booking data
    * Will loop through each day of the week
    * Days will have hourly timeslots
    * A unique booking number for each slot
    * Slots should be available by default
    * EX: MONDAY -> 
    */
    public void CreateTable() 
    {
        bookingRecords.clear();    //clear existing booking records  

        //Initialize the parameters
        int bookingNumber = 1000;    // Counter for the booking number
        int starthour = 0;           // When the day for the appointment begins
        int endHour = 24;            // End of the day for the appointment

        // Populate booking tables
        for (Day d : Day.values())
        {
            for (int hour = startHour; hour <endHour; hour++)
            {
                BookingRecord newslot = new BookingRecord( bookingNumber++, d, hour, 0, "Available");
                bookingRecords.add(newSlot);
            }
        }
        return bookingRecords.size(); // Should return the total count of confirmations
    }
    //Last edits made by Zeque. Will finish this later. 
    public void DisplayTable() 
    {
        if (bookingRecords.isEmpty())    //If statements to check if the table is empty
        {
            return "No Bookings were found.";
        }

    StringBuilder table = new StringBuilder();
    table.append(String.formate("%-10 %-12s %-12s %-12s %-10s\n", "BookNo", "Day", "Start", "End", "Status"));
    }

    
    public void UpdateTable() {
        // TODO: Implement data refresh logic
    }
    
    public void NotAvail() {
        // TODO: Handle unavailable time slot logic
        // Tutor cannot book an appointment and tutee cannot access
    }
    
    public void LogOut() {
        // TODO: Implement session cleanup
        // End session
    }
    
    public void ConfirmLogoutBook() {
        // TODO: Add confirmation workflow
        // User confirms logout
    }
    
    public void EndSession() {
        // TODO: Complete session termination
        // Session is terminated
    }
    
    public boolean validateBookingTime(int hour, int minute) {
        // TODO: Implement time validation rules
        // Business rules: operating hours, time slot intervals
        return true;
    }
    
    public boolean isSlotAvailable(Day day, int hour, int minute) {
        // TODO: Implement availability checking logic
        // Business rules: weekend availability, holiday rules, etc.
        return true;
    }
    
    public int createNewBooking(Day day, int hour, int minute) {
        // TODO: Implement booking creation logic
        // Business logic for creating new booking records
        return -1; // Placeholder
    }
    
    public String formatDisplayTime(int hour, int minute) {
        // TODO: Implement time formatting logic
        return ""; // Placeholder
    }

    public int getBookingNO() { return BookingNO; }
    public void setBookingNO(int bookingNO) { BookingNO = bookingNO; }
    
    public int getDisplayHour() { return DisplayHour; }
    public void setDisplayHour(int displayHour) { DisplayHour = displayHour; }
    
    public int getDisplayMinute() { return DisplayMinute; }
    public void setDisplayMinute(int displayMinute) { DisplayMinute = displayMinute; }
    
    public Day getDaysBook() { return DaysBook; }
    public void setDaysBook(Day daysBook) { DaysBook = daysBook; }
    
    public boolean isSessionActive() { return sessionActive; }

    // INTERNAL DATA CLASS
    /**
    * Idea is to represent one individual booking slot
    * Each record contains a unique booking number, day of the week, time of booking (hour and minute), and the current status
    *
    * The records should be stored inside the parent class
    * Slots should be generated when the CreateTable() method runs.
    */

   private class BookingRecord
    {
        {
            private int bookingNumber;    //Client's unique booking number
            private Day day;              //Day of the apointment
            private int hour;             //hour time of the appointment
            private int minute            //minute time of the appointment
            private String AptStatus      //Displays either booked or available?

        }

        public BookingRecord(int bookingNumber, Day day, int hour, int minute, String AptStatus)
        {
            this.bookingNumber = bookingNumber;
            this.day = day;
            this.hour = hour;
            this.minute = minute;
            this.AptStatus = status;
        }

        // It should return a string that is formatted for the booking record
        // Example Output should be 1001 MONDAY 00:00 Booked

        @Override
        public String toString()
        {
            //%-10d : left-align integer in a 10-character wide space
            //%-10s : left-align string in a 10-character wide space
            //%02d : zero-pads the numbers to the 2 digits (example: 00)
            return String.format("%10d %10s %02d:%02d %-10s",
            bookingNumber, day, hour, minute, status);
        }
    }
}
