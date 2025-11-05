import java.util.*;

public class Tutor extends User {

    private List<String> availabilitySlots;

    public Tutor(String firstName, String surName, int samID, int refID){
        super(firstName, surName, samID, Role.Tutor, refID);
        this.availabilitySlots = new ArrayList<>();
    }


    public void addAvailability(String timeSlot){
        availabilitySlots.add(timeSlot);
        System.out.println("Availability slot " + timeSlot + " was added.");
        System.out.println("This is under addAvailability method in Tutor.java");
    }

    public void removeAvailability(String timeSlot){
        availabilitySlots.remove(timeSlot);
        System.out.println("Availability slot " + timeSlot + " was removed.");
        System.out.println("This is under removeAvailability method in Tutor.java");
    }

    public void viewAvailability(){
        System.out.println("Availability for " + getFirstName() + " : ");
        for (String slot : availabilitySlots){
            System.out.println(slot);
        }
        System.out.println("This is under the method viewAvailability in Tutor.java");
    }




    
}
