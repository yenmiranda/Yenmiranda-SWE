// STEP 1: GET REFERENCES TO ALL HTML ELEMENTS WE'LL USE
// This is like creating shortcuts to elements on the page so we can interact with them

// Form input elements
const courseSelect = document.getElementById('course-select');
// Gets the course dropdown

const dateSelect = document.getElementById('date-select');
// Gets the date picker

const timeSelect = document.getElementById('time-select');
// Gets the time slot dropdown

// Button elements
const checkAvailabilityBtn = document.getElementById('check-availability-btn');
// Gets the "Check Availability" button

const continueBtn = document.getElementById('continue-btn');
// Gets the "Continue to Choose Tutor" button

// Result containers
const availabilityResult = document.getElementById('availability-result');
// Gets the container that holds success/warning messages

const availableMessage = document.getElementById('available-message');
// Gets the green success message

const unavailableMessage = document.getElementById('unavailable-message');
// Gets the yellow warning message

const tutorCount = document.getElementById('tutor-count');
// Gets the span that shows number of tutors

const unavailableTime = document.getElementById('unavailable-time');
// Gets the span that shows the unavailable time

const alternativeTimes = document.getElementById('alternative-times');
// Gets the container for alternative time buttons

const selectionForm = document.getElementById('selection-form');
// Gets the entire form

// FUNCTION: Initialize date picker with today as minimum date
function setupDatePicker() {
    // Get today's date
    const today = new Date();
    // Creates a Date object with current date and time
    
    // Format today's date as YYYY-MM-DD (required format for date input)
    const year = today.getFullYear();
    // Gets the year (e.g., 2025)
    
    const month = String(today.getMonth() + 1).padStart(2, '0');
    // Gets the month (0-11, so we add 1), then adds leading zero if needed
    // Example: January = 0, so 0+1 = 1, padStart makes it "01"
    
    const day = String(today.getDate()).padStart(2, '0');
    // Gets the day of month, adds leading zero if needed
    // Example: 5th becomes "05"
    
    const todayFormatted = `${year}-${month}-${day}`;
    // Combines into format: "2025-10-31"
    
    // Set the minimum date to today (can't select past dates)
    dateSelect.min = todayFormatted;
    // This prevents users from clicking on dates before today
    
    // Set the maximum date to 3 months from today (optional - prevents booking too far ahead)
    const maxDate = new Date();
    // Create another date object
    
    maxDate.setMonth(maxDate.getMonth() + 3);
    // Add 3 months to today
    
    const maxYear = maxDate.getFullYear();
    const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxDay = String(maxDate.getDate()).padStart(2, '0');
    const maxDateFormatted = `${maxYear}-${maxMonth}-${maxDay}`;
    // Format max date same way
    
    dateSelect.max = maxDateFormatted;
    // This prevents users from selecting dates more than 3 months away
}

// Call the function when page loads
setupDatePicker();
// Runs the function immediately to set up date restrictions

//SHOW CHECK AVAILABILITY BUTTON WHEN ALL FIELDS FILLED

// FUNCTION: Check if all required fields are filled
function checkFormComplete() {
    // Get the current values of all three fields
    const course = courseSelect.value;
    // Gets selected course value (e.g., "COSC4319" or empty string "")
    
    const date = dateSelect.value;
    // Gets selected date value (e.g., "2025-11-01" or empty string "")
    
    const time = timeSelect.value;
    // Gets selected time value (e.g., "14:00-15:00" or empty string "")
    
    // Check if ALL three fields have values (not empty)
    if (course && date && time) {
        // All fields are filled
        
        checkAvailabilityBtn.style.display = 'block';
        // Shows the Check Availability button by changing display from 'none' to 'block'
        
    } else {
        // At least one field is empty
        
        checkAvailabilityBtn.style.display = 'none';
        // Hides the Check Availability button
        
        availabilityResult.style.display = 'none';
        // Hides any previous availability results
        
        continueBtn.style.display = 'none';
        // Hides the Continue button
    }
}

// FUNCTION: Reset availability check when form changes
function resetAvailabilityCheck() {
    // When user changes any field, hide previous results
    // They need to click Check Availability again
    
    availabilityResult.style.display = 'none';
    // Hides the availability result messages
    
    continueBtn.style.display = 'none';
    // Hides the Continue button
    
    availableMessage.style.display = 'none';
    // Hides the success message
    
    unavailableMessage.style.display = 'none';
    // Hides the warning message
    
    // Then check if all fields are filled to show/hide Check Availability button
    checkFormComplete();
}

// EVENT LISTENERS: Listen for changes to form fields
// These run the resetAvailabilityCheck function whenever a field changes

courseSelect.addEventListener('change', resetAvailabilityCheck);
// When course dropdown changes, run resetAvailabilityCheck

dateSelect.addEventListener('change', resetAvailabilityCheck);
// When date picker changes, run resetAvailabilityCheck

timeSelect.addEventListener('change', resetAvailabilityCheck);
// When time dropdown changes, run resetAvailabilityCheck