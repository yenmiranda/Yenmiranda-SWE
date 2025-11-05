import java.util.*;

public class Tutee extends User {


    private List<String> myBookings;

    public Tutee(String firstName, String surName, int samID, int refID){
        super(firstName, surName, samID, Role.Tutee, refID);
        this.myBookings = new ArrayList<>();
    }

    public void bookSession(String bookingInfo){
        myBookings.add(bookingInfo);
        System.out.println("Session booked: " + bookingInfo + " this is under bookSession method in Tutee.java" );

    }

    public void cancelBooking(String bookingInfo){
        myBookings.remove(bookingInfo);
        System.out.println("Session canceled: " + bookingInfo + " this is under cancelBooking method in Tutee.javca");
    }

    public void viewMyBooking(){
        System.out.println("Bookings for " + getFirstName() + ":");
        for(String booking : myBookings){
            System.out.println(booking);
        }
        System.out.println("This is under viewBooking method in Tutee.java");
    }
    



}
