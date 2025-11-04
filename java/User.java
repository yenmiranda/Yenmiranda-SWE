/* This module creates representations of users.
 * Every user, either a Tutee or Tutor shares the attributes first name, surname, sam ID, reference ID (refID), a designated role(Tutee or Tutor),
 * and status flags to determine successful login (loggedIn) and a flag to determing an active sesseion (active) used to update the page every
 * five minutes.
 */

 /* The User class interacts with the Login/Registration UI, the Database, and the Booking and Queue modules.
  * When a new user registers, a User object is created where, depending on the users chosen role of Tutee or Tutor, the class will be 
  extended by a subclass, either the sublclass Tutee or Tutor respectively
  */

  /* The user login/logout status will grant or deny access to the Booking if a logged in as a Tutee or grant or deny access to the 
   * Availability module if logged in as a Tutor.
   */

   /* The refID is a unique identifer that links a user across the system to their records for bookings if a Tutee or availability
    * if a Tutor
    */




import java.util.*;

public class User {

    // Attributes
    private String firstName;// users first name
    private String surName;// users last name
    private int samID;// students unique ID number

    // enumeration for roles, a user can either be a Tutee or a Tutor
    public enum Role {
        Tutee, Tutor
    }

    // enum attribute
    private Role role;// stores the users current role as a Tutee or Tutor

    // reference ID attribute, questions about this...
    private int refID; // starts at 4 digits, what is the limit? is it padded? is 0000 valid, 0001 and
                       // so on? do we want to automatically update refID?
                       // currently represented as a 4-digit number padded with zeros if necessary such as 0001, 0002, and so on
                        


    // Boolean values for login/logout
    private boolean loggedIn;// condition indicating the user is currently logged in or not
    private boolean active;// condition indicating the user is currently active or not, used to update the page (bookings, availability, etc) every five minutes

    // constructors for creating users

    // this constructor initializes a user as inactive and logged out before assigning attributes to prevent the system from incorrectly 
    // identifying them as logged in or giving them access to bookings or availability before checking(authenticating) samID/refID as unique
    public User() {
        this.active = false;
        this.loggedIn = false;

    }



    /* This constructore assigns all attributes to the user object */
    public User(String firstName, String surName, int samID, Role role, int refID) {
        this.firstName = firstName;
        this.surName = surName;
        this.samID = samID;
        this.role = role;
        setRefID(refID); 
        this.active = true;

    }


    // This method will collect registration data from the UI, check if samID is unique, check what the role is, store info in the DB
    public void clickRegister() {
        // TODO: Handle user registration logic
    }

    // This method will validate username and password, set loggedIn flag to true, set active flag to true
    public void clickLogin() {
        // TODO: Handle login logic
    }

    // This method process credentials entered on the login/registration UI
    public void enterCred() {
        // TODO: Process user input from login/register
    }

    //This method will allow the user to choose their role during registration
    public void chooseRole(Role userRole) {
        // TODO: Allow user to choose role of Tutee or Tutor
        this.role = userRole;
    }

    //this method allows Tutees to see appointments and Tutors to see schedules
    public void viewBooking() {
        // TODO: Display to Tutee booking appointment or display to Tutor the tutor
        // schedule
    }

    // This method sends the user to the previous page in the UI
    public void goBack() {
        // TODO: Let user return to previous UI page
    }

    // This method logs the user out of the systems, ends the current session, and returns them to the login/registration UI
    public void logOut() {
        // TODO: end the users session and return them to the login/registration UI
    }

    public void updatePage() {
        // TODO: update session every 5 minutes
    }

    // Getters and Setters for attributes

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getSurName() {
        return surName;
    }

    public void setSurName(String surName) {
        this.surName = surName;
    }

    public int getSamID() {
        return samID;
    }

    public void setSamID(int samID) {
        this.samID = samID;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public int getRefID() {
        return refID;
    }

    public void setRefID(int refID) {

        // refID starts at 4 digits, cant be negative;
        if (refID < 0) {
            throw new IllegalArgumentException("ID cant be negative!");
        }

        this.refID = refID;
    }

    public boolean isLoggedIn() {
        return loggedIn;
    }

    public void setLoggedIn(boolean loggedIn) {
        this.loggedIn = loggedIn;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getFormattedRefID() {
        return String.format("%04d", refID);
    }

}
