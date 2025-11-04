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

// ========================================
// STEP 4.5: RESTRICT TIME SLOTS BASED ON CURRENT TIME
// If user selects today's date, disable times that have already passed
// ========================================

// FUNCTION: Update available time slots based on selected date
function updateAvailableTimeSlots() {
    // Get the selected date
    const selectedDate = dateSelect.value;
    // Example: "2025-11-05"
    
    if (!selectedDate) return;
    // If no date selected yet, do nothing
    
    // Get today's date in same format
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Check if selected date is today
    if (selectedDate === todayFormatted) {
        // Selected date is TODAY - need to disable past times
        
        const currentHour = today.getHours();
        // Gets current hour in 24-hour format (0-23)
        // Example: if it's 3:45 PM, currentHour = 15
        
        // Get all time slot options
        const timeOptions = timeSelect.querySelectorAll('option');
        // Gets all <option> elements in the time dropdown
        
        // Loop through each time option
        timeOptions.forEach(option => {
            if (option.value === '') {
                // Skip the placeholder option ("-- Choose a Time Slot --")
                return;
            }
            
            // Extract the start hour from the time slot value
            const timeValue = option.value;
            // Example: "14:00-15:00"
            
            const startHour = parseInt(timeValue.split(':')[0]);
            // Gets the start hour: 14
            
            // If this time slot has already passed, disable it
            if (startHour <= currentHour) {
                option.disabled = true;
                // Makes this option unclickable and grayed out
                
                option.style.color = '#999';
                // Makes text gray to show it's disabled
                
            } else {
                // Time slot is in the future, enable it
                option.disabled = false;
                option.style.color = '';
                // Restores normal color
            }
        });
        
        // If currently selected time is now disabled, clear the selection
        const currentSelection = timeSelect.value;
        if (currentSelection) {
            const selectedStartHour = parseInt(currentSelection.split(':')[0]);
            if (selectedStartHour <= currentHour) {
                timeSelect.value = '';
                // Clears the selection
                
                resetAvailabilityCheck();
                // Resets the form
            }
        }
        
    } else {
        // Selected date is in the FUTURE - enable all time slots
        
        const timeOptions = timeSelect.querySelectorAll('option');
        
        timeOptions.forEach(option => {
            if (option.value === '') return;
            // Skip placeholder
            
            option.disabled = false;
            // Enables all options
            
            option.style.color = '';
            // Normal color
        });
    }
}

// EVENT LISTENER: Update time slots when date changes
dateSelect.addEventListener('change', function() {
    updateAvailableTimeSlots();
    // Runs whenever user selects a different date
    
    resetAvailabilityCheck();
    // Also resets availability check
});

// Call on page load in case date is pre-filled
updateAvailableTimeSlots();

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

// CHECK TUTOR AVAILABILITY
// This function checks if tutors are available for selected time
// RIGHT NOW: Uses dummy data for testing UI
// LATER: we'll replace this with PHP backend call to MySQL database

// DUMMY DATA: Temporary fake tutor availability for testing
// REPLACE THIS ENTIRE SECTION WITH OUR BACKEND CALL LATER
const mockTutorAvailability = {
    // Structure: "COURSE-DATE-TIME": number of tutors available
    // Example: 3 tutors available for Software Engineering on Nov 5 at 14:00-15:00
    
    "COSC4319-2025-11-05-14:00-15:00": 3,
    "COSC4319-2025-11-05-15:00-16:00": 2,
    "COSC4319-2025-11-05-16:00-17:00": 1,
    "COSC3319-2025-11-05-10:00-11:00": 2,
    "COSC3319-2025-11-05-11:00-12:00": 1,
    // Add more mock data as needed for testing
};
// This is just for testing - our PHP backend will return real availability

// FUNCTION: Check if tutors are available (DUMMY VERSION)
function checkTutorAvailability(course, date, time) {
    // Creates a unique key from course, date, and time
    const key = `${course}-${date}-${time}`;
    // Example: "COSC4319-2025-11-05-14:00-15:00"
    
    // Check if this key exists in our mock data
    const tutorCount = mockTutorAvailability[key];
    // Returns number of tutors, or undefined if key doesn't exist
    
    // Return result object
    return {
        available: tutorCount > 0,
        // True if tutors exist, false if undefined or 0
        
        tutorCount: tutorCount || 0
        // Returns the count, or 0 if undefined
    };
}

// *** BACKEND INTEGRATION POINT ***
// When WE're ready to connect to your PHP backend, replace the function above with:
/*
async function checkTutorAvailability(course, date, time) {
    try {
        // Make API call to your PHP backend
        const response = await fetch('api/check-availability.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                course: course,
                date: date,
                time: time
            })
        });
        
        // Parse JSON response from PHP
        const data = await response.json();
        
        // Return result in same format
        return {
            available: data.available,
            tutorCount: data.tutorCount
        };
        
    } catch (error) {
        console.error('Error checking availability:', error);
        return {
            available: false,
            tutorCount: 0
        };
    }
}
*/

// FUNCTION: Find alternative available times
function findAlternativeTimes(course, date, selectedTime) {
    // This function finds nearby times that have available tutors
    // Searches 2 hours before and 2 hours after the selected time
    
    const alternatives = [];
    // Array to store alternative time slots
    
    // Parse the selected time to get start hour
    const selectedStartHour = parseInt(selectedTime.split(':')[0]);
    // Example: "14:00-15:00" becomes 14
    
    // Check 2 hours before and 2 hours after
    for (let hourOffset = -2; hourOffset <= 2; hourOffset++) {
        // Loop from -2 to +2
        
        if (hourOffset === 0) continue;
        // Skip the selected time itself
        
        const newHour = selectedStartHour + hourOffset;
        // Calculate alternative hour
        
        if (newHour < 0 || newHour >= 24) continue;
        // Skip if hour is outside 0-23 range
        
        // Format the new time slot
        const startTime = String(newHour).padStart(2, '0') + ':00';
        const endHour = (newHour + 1) % 24;
        // Next hour, wraps around at 24
        
        const endTime = String(endHour).padStart(2, '0') + ':00';
        const timeSlot = `${startTime}-${endTime}`;
        // Example: "15:00-16:00"
        
        // Check if tutors available for this time
        const result = checkTutorAvailability(course, date, timeSlot);
        
        if (result.available) {
            // If tutors available, add to alternatives list
            alternatives.push({
                time: timeSlot,
                tutorCount: result.tutorCount
            });
        }
    }
    
    return alternatives;
    // Returns array of alternative times with tutor counts
}

// FUNCTION: Format time for display (converts military to standard time)
function formatTimeDisplay(timeSlot) {
    // Converts "14:00-15:00" to "2:00 PM - 3:00 PM"
    
    const [start, end] = timeSlot.split('-');
    // Splits into start and end times
    
    // Format start time
    const startHour = parseInt(start.split(':')[0]);
    const startFormatted = startHour === 0 ? '12:00 AM' :
                          startHour < 12 ? `${startHour}:00 AM` :
                          startHour === 12 ? '12:00 PM' :
                          `${startHour - 12}:00 PM`;
    
    // Format end time
    const endHour = parseInt(end.split(':')[0]);
    const endFormatted = endHour === 0 ? '12:00 AM' :
                        endHour < 12 ? `${endHour}:00 AM` :
                        endHour === 12 ? '12:00 PM' :
                        `${endHour - 12}:00 PM`;
    
    return `${start} - ${end} (${startFormatted} - ${endFormatted})`;
    // Returns: "14:00 - 15:00 (2:00 PM - 3:00 PM)"
}

// EVENT LISTENER: Check Availability button click
checkAvailabilityBtn.addEventListener('click', function() {
    // This runs when user clicks "Check Availability" button
    
    // Get current form values
    const course = courseSelect.value;
    const date = dateSelect.value;
    const time = timeSelect.value;
    
    // Check availability
    const result = checkTutorAvailability(course, date, time);
    
    // Show the availability result section
    availabilityResult.style.display = 'block';
    
    if (result.available) {
        // TUTORS ARE AVAILABLE - Show success message
        
        availableMessage.style.display = 'flex';
        // Shows green success message
        
        unavailableMessage.style.display = 'none';
        // Hides warning message
        
        tutorCount.textContent = result.tutorCount;
        // Updates the number of tutors available
        
        continueBtn.style.display = 'block';
        // Shows the Continue button
        
    } else {
        // NO TUTORS AVAILABLE - Show warning with alternatives
        
        availableMessage.style.display = 'none';
        // Hides success message
        
        unavailableMessage.style.display = 'flex';
        // Shows warning message
        
        unavailableTime.textContent = formatTimeDisplay(time);
        // Shows the selected time that wasn't available
        
        continueBtn.style.display = 'none';
        // Hides Continue button
        
        // Find alternative times
        const alternatives = findAlternativeTimes(course, date, time);
        
        // Clear previous alternatives
        alternativeTimes.innerHTML = '';
        // Empties the container
        
        if (alternatives.length > 0) {
            // If we found alternative times, create buttons for them
            
            alternatives.forEach(alt => {
                // Loop through each alternative time
                
                const button = document.createElement('button');
                // Creates a new button element
                
                button.className = 'alt-time-btn';
                // Adds CSS class for styling
                
                button.textContent = `${formatTimeDisplay(alt.time)} (${alt.tutorCount} tutor${alt.tutorCount > 1 ? 's' : ''})`;
                // Button text shows time and number of tutors
                // Example: "15:00 - 16:00 (2:00 PM - 3:00 PM) (2 tutors)"
                
                button.onclick = function() {
                    // When alternative time button is clicked
                    
                    timeSelect.value = alt.time;
                    // Updates the time dropdown to this time
                    
                    // Automatically check availability for this new time
                    checkAvailabilityBtn.click();
                    // Simulates clicking the Check Availability button
                };
                
                alternativeTimes.appendChild(button);
                // Adds button to the container
            });
            
        } else {
            // No alternatives found
            
            alternativeTimes.innerHTML = '<p style="color: var(--shsu-gray-medium); font-style: italic;">No nearby times available. Please try a different date.</p>';
            // Shows message suggesting to pick different date
        }
    }
});

// HANDLE FORM SUBMISSION AND NAVIGATE TO PAGE 2
// When user clicks "Continue to Choose Tutor", save their selections and go to Page 2

// EVENT LISTENER: Form submission (Continue button)
selectionForm.addEventListener('submit', function(event) {
    // This runs when user clicks "Continue to Choose Tutor →" button
    
    event.preventDefault();
    // Prevents the default form submission behavior (page reload)
    // We want to handle navigation ourselves
    
    // Get all form values
    const selectedCourse = courseSelect.value;
    // Example: "COSC4319"
    
    const selectedDate = dateSelect.value;
    // Example: "2025-11-05"
    
    const selectedTime = timeSelect.value;
    // Example: "14:00-15:00"
    
    // Get the tutor count from the success message
    const selectedTutorCount = tutorCount.textContent;
    // Example: "3"
    
    // Create an object with all booking information
    const bookingData = {
        course: selectedCourse,
        date: selectedDate,
        time: selectedTime,
        tutorCount: selectedTutorCount
    };
    
    // Save to browser's sessionStorage
    // sessionStorage keeps data while browser is open, clears when browser closes
    // localStorage would keep data permanently (even after closing browser)
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    // Converts object to JSON string and stores it
    // JSON.stringify turns {course: "COSC4319"} into '{"course":"COSC4319"}'
    
    // Navigate to Page 2 (tutor selection page)
    window.location.href = 'booking-confirm.html';
    // Changes browser URL to Page 2
    // You can change 'booking-confirm.html' to whatever you name Page 2
});

// *** DEBUGGING HELPER ***
// This helps us see what data is being saved
// Remove this section once everything is working
console.log('Booking Select Page JavaScript Loaded Successfully');
// Shows in browser console (F12) that file loaded

// Optional: Log when data is saved
selectionForm.addEventListener('submit', function() {
    console.log('Booking data saved:', sessionStorage.getItem('bookingData'));
    // Shows saved data in console for debugging
});

// LOGOUT FUNCTIONALITY
// Handles user logout - clears session data and redirects to login page

// FUNCTION: Handle logout button click
function handleLogout() {
    // Clear all session data
    sessionStorage.clear();
    // Removes all saved booking data from browser session storage
    
    // Redirect to login page
    window.location.href = 'LoginAndRegistration.html';
    // Change 'login.html' to whatever your login page is called
    // Could also be: 'index.html', 'signin.html', etc.
}