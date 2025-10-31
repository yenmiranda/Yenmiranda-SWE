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