// STEP 1: GET REFERENCES TO ALL HTML ELEMENTS I'LL USE
// I'm creating shortcuts to elements on the page so I can interact with them

// Form input elements
const courseSelect = document.getElementById('course-select');
// I'm getting the course dropdown

const dateSelect = document.getElementById('date-select');
// I'm getting the date picker

const timeSelect = document.getElementById('time-select');
// I'm getting the time slot dropdown

// Button elements
const checkAvailabilityBtn = document.getElementById('check-availability-btn');
// I'm getting the "Check Availability" button

const continueBtn = document.getElementById('continue-btn');
// I'm getting the "Continue to Choose Tutor" button

// Result containers
const availabilityResult = document.getElementById('availability-result');
// I'm getting the container that holds success/warning messages

const availableMessage = document.getElementById('available-message');
// I'm getting the green success message

const unavailableMessage = document.getElementById('unavailable-message');
// I'm getting the yellow warning message

const tutorCount = document.getElementById('tutor-count');
// I'm getting the span that shows number of tutors

const unavailableTime = document.getElementById('unavailable-time');
// I'm getting the span that shows the unavailable time

const alternativeTimes = document.getElementById('alternative-times');
// I'm getting the container for alternative time buttons

const selectionForm = document.getElementById('selection-form');
// I'm getting the entire form

// FUNCTION: Initialize date picker with today as minimum date
function setupDatePicker() {
    // I'm getting today's date
    const today = new Date();
    // I'm creating a Date object with current date and time
    
    // I'm formatting today's date as YYYY-MM-DD (required format for date input)
    const year = today.getFullYear();
    // I'm getting the year (e.g., 2025)
    
    const month = String(today.getMonth() + 1).padStart(2, '0');
    // I'm getting the month (0-11, so I add 1), then adding leading zero if needed
    // Example: January = 0, so 0+1 = 1, padStart makes it "01"
    
    const day = String(today.getDate()).padStart(2, '0');
    // I'm getting the day of month, adding leading zero if needed
    // Example: 5th becomes "05"
    
    const todayFormatted = `${year}-${month}-${day}`;
    // I'm combining into format: "2025-10-31"
    
    // I'm setting the minimum date to today (can't select past dates)
    dateSelect.min = todayFormatted;
    // This prevents users from clicking on dates before today
    
    // I'm setting the maximum date to 3 months from today (optional - prevents booking too far ahead)
    const maxDate = new Date();
    // I'm creating another date object
    
    maxDate.setMonth(maxDate.getMonth() + 3);
    // I'm adding 3 months to today
    
    const maxYear = maxDate.getFullYear();
    const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxDay = String(maxDate.getDate()).padStart(2, '0');
    const maxDateFormatted = `${maxYear}-${maxMonth}-${maxDay}`;
    // I'm formatting max date the same way
    
    dateSelect.max = maxDateFormatted;
    // This prevents users from selecting dates more than 3 months away
}

// I'm calling the function when page loads
setupDatePicker();
// I'm running the function immediately to set up date restrictions

// ========================================
// STEP 4.5: RESTRICT TIME SLOTS BASED ON CURRENT TIME
// If user selects today's date, I'll disable times that have already passed
// ========================================

// FUNCTION: Update available time slots based on selected date
function updateAvailableTimeSlots() {
    // I'm getting the selected date
    const selectedDate = dateSelect.value;
    // Example: "2025-11-05"
    
    if (!selectedDate) return;
    // If no date selected yet, I'll do nothing
    
    // I'm getting today's date in same format
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // I'm checking if selected date is today
    if (selectedDate === todayFormatted) {
        // Selected date is TODAY - I need to disable past times
        
        const currentHour = today.getHours();
        // I'm getting current hour in 24-hour format (0-23)
        // Example: if it's 3:45 PM, currentHour = 15
        
        // I'm getting all time slot options
        const timeOptions = timeSelect.querySelectorAll('option');
        // I'm getting all <option> elements in the time dropdown
        
        // I'm looping through each time option
        timeOptions.forEach(option => {
            if (option.value === '') {
                // I'm skipping the placeholder option ("-- Choose a Time Slot --")
                return;
            }
            
            // I'm extracting the start hour from the time slot value
            const timeValue = option.value;
            // Example: "14:00-15:00"
            
            const startHour = parseInt(timeValue.split(':')[0]);
            // I'm getting the start hour: 14
            
            // If this time slot has already passed, I'll disable it
            if (startHour <= currentHour) {
                option.disabled = true;
                // I'm making this option unclickable and grayed out
                
                option.style.color = '#999';
                // I'm making text gray to show it's disabled
                
            } else {
                // Time slot is in the future, I'll enable it
                option.disabled = false;
                option.style.color = '';
                // I'm restoring normal color
            }
        });
        
        // If currently selected time is now disabled, I'll clear the selection
        const currentSelection = timeSelect.value;
        if (currentSelection) {
            const selectedStartHour = parseInt(currentSelection.split(':')[0]);
            if (selectedStartHour <= currentHour) {
                timeSelect.value = '';
                // I'm clearing the selection
                
                resetAvailabilityCheck();
                // I'm resetting the form
            }
        }
        
    } else {
        // Selected date is in the FUTURE - I'll enable all time slots
        
        const timeOptions = timeSelect.querySelectorAll('option');
        
        timeOptions.forEach(option => {
            if (option.value === '') return;
            // I'm skipping placeholder
            
            option.disabled = false;
            // I'm enabling all options
            
            option.style.color = '';
            // I'm restoring normal color
        });
    }
}

// EVENT LISTENER: Update time slots when date changes
dateSelect.addEventListener('change', function() {
    updateAvailableTimeSlots();
    // I'm running this whenever user selects a different date
    
    resetAvailabilityCheck();
    // I'm also resetting availability check
});

// I'm calling on page load in case date is pre-filled
updateAvailableTimeSlots();

//SHOW CHECK AVAILABILITY BUTTON WHEN ALL FIELDS FILLED

// FUNCTION: Check if all required fields are filled
function checkFormComplete() {
    // I'm getting the current values of all three fields
    const course = courseSelect.value;
    // I'm getting selected course value (e.g., "COSC4319" or empty string "")
    
    const date = dateSelect.value;
    // I'm getting selected date value (e.g., "2025-11-01" or empty string "")
    
    const time = timeSelect.value;
    // I'm getting selected time value (e.g., "14:00-15:00" or empty string "")
    
    // I'm checking if ALL three fields have values (not empty)
    if (course && date && time) {
        // All fields are filled
        
        checkAvailabilityBtn.style.display = 'block';
        // I'm showing the Check Availability button by changing display from 'none' to 'block'
        
    } else {
        // At least one field is empty
        
        checkAvailabilityBtn.style.display = 'none';
        // I'm hiding the Check Availability button
        
        availabilityResult.style.display = 'none';
        // I'm hiding any previous availability results
        
        continueBtn.style.display = 'none';
        // I'm hiding the Continue button
    }
}

// FUNCTION: Reset availability check when form changes
function resetAvailabilityCheck() {
    // When user changes any field, I'll hide previous results
    // They need to click Check Availability again
    
    availabilityResult.style.display = 'none';
    // I'm hiding the availability result messages
    
    continueBtn.style.display = 'none';
    // I'm hiding the Continue button
    
    availableMessage.style.display = 'none';
    // I'm hiding the success message
    
    unavailableMessage.style.display = 'none';
    // I'm hiding the warning message
    
    // Then I'll check if all fields are filled to show/hide Check Availability button
    checkFormComplete();
}

// EVENT LISTENERS: Listen for changes to form fields
// These run the resetAvailabilityCheck function whenever a field changes

courseSelect.addEventListener('change', resetAvailabilityCheck);
// When course dropdown changes, I'm running resetAvailabilityCheck

dateSelect.addEventListener('change', resetAvailabilityCheck);
// When date picker changes, I'm running resetAvailabilityCheck

timeSelect.addEventListener('change', resetAvailabilityCheck);
// When time dropdown changes, I'm running resetAvailabilityCheck

// CHECK TUTOR AVAILABILITY
// This function checks if tutors are available for selected time
// RIGHT NOW: I'm using dummy data for testing UI
// LATER: I'll replace this with PHP backend call to MySQL database

// DUMMY DATA: Temporary fake tutor availability for testing
// I'LL REPLACE THIS ENTIRE SECTION WITH MY BACKEND CALL LATER
const mockTutorAvailability = {
    // Structure: "COURSE-DATE-TIME": number of tutors available
    // Example: 3 tutors available for Software Engineering on Nov 15 at 14:00-15:00
    
    "COSC4319-2025-11-15-14:00-15:00": 3,
    "COSC4319-2025-11-15-15:00-16:00": 2,
    "COSC4319-2025-11-15-16:00-17:00": 1,
    "COSC3319-2025-11-15-10:00-11:00": 2,
    "COSC3319-2025-11-15-11:00-12:00": 1,
    // I can add more mock data as needed for testing
};
// This is just for testing - my PHP backend will return real availability

// FUNCTION: Check if tutors are available (DUMMY VERSION)
function checkTutorAvailability(course, date, time) {
    // I'm creating a unique key from course, date, and time
    const key = `${course}-${date}-${time}`;
    // Example: "COSC4319-2025-11-15-14:00-15:00"
    
    // I'm checking if this key exists in my mock data
    const tutorCount = mockTutorAvailability[key];
    // Returns number of tutors, or undefined if key doesn't exist
    
    // I'm returning result object
    return {
        available: tutorCount > 0,
        // True if tutors exist, false if undefined or 0
        
        tutorCount: tutorCount || 0
        // I'm returning the count, or 0 if undefined
    };
}

// *** BACKEND INTEGRATION POINT ***
// When I'm ready to connect to my PHP backend, I'll replace the function above with:
/*
async function checkTutorAvailability(course, date, time) {
    try {
        // I'll make API call to my PHP backend
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
        
        // I'll parse JSON response from PHP
        const data = await response.json();
        
        // I'll return result in same format
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
    // I'm searching 2 hours before and 2 hours after the selected time
    
    const alternatives = [];
    // I'm creating an array to store alternative time slots
    
    // I'm parsing the selected time to get start hour
    const selectedStartHour = parseInt(selectedTime.split(':')[0]);
    // Example: "14:00-15:00" becomes 14
    
    // I'm checking 2 hours before and 2 hours after
    for (let hourOffset = -2; hourOffset <= 2; hourOffset++) {
        // I'm looping from -2 to +2
        
        if (hourOffset === 0) continue;
        // I'm skipping the selected time itself
        
        const newHour = selectedStartHour + hourOffset;
        // I'm calculating alternative hour
        
        if (newHour < 0 || newHour >= 24) continue;
        // I'm skipping if hour is outside 0-23 range
        
        // I'm formatting the new time slot
        const startTime = String(newHour).padStart(2, '0') + ':00';
        const endHour = (newHour + 1) % 24;
        // Next hour, wraps around at 24
        
        const endTime = String(endHour).padStart(2, '0') + ':00';
        const timeSlot = `${startTime}-${endTime}`;
        // Example: "15:00-16:00"
        
        // I'm checking if tutors available for this time
        const result = checkTutorAvailability(course, date, timeSlot);
        
        if (result.available) {
            // If tutors available, I'm adding to alternatives list
            alternatives.push({
                time: timeSlot,
                tutorCount: result.tutorCount
            });
        }
    }
    
    return alternatives;
    // I'm returning array of alternative times with tutor counts
}

// FUNCTION: Format time for display (converts military to standard time)
function formatTimeDisplay(timeSlot) {
    // I'm converting "14:00-15:00" to "2:00 PM - 3:00 PM"
    
    const [start, end] = timeSlot.split('-');
    // I'm splitting into start and end times
    
    // I'm formatting start time
    const startHour = parseInt(start.split(':')[0]);
    const startFormatted = startHour === 0 ? '12:00 AM' :
                          startHour < 12 ? `${startHour}:00 AM` :
                          startHour === 12 ? '12:00 PM' :
                          `${startHour - 12}:00 PM`;
    
    // I'm formatting end time
    const endHour = parseInt(end.split(':')[0]);
    const endFormatted = endHour === 0 ? '12:00 AM' :
                        endHour < 12 ? `${endHour}:00 AM` :
                        endHour === 12 ? '12:00 PM' :
                        `${endHour - 12}:00 PM`;
    
    return `${start} - ${end} (${startFormatted} - ${endFormatted})`;
    // I'm returning: "14:00 - 15:00 (2:00 PM - 3:00 PM)"
}

// EVENT LISTENER: Check Availability button click
checkAvailabilityBtn.addEventListener('click', function() {
    // This runs when user clicks "Check Availability" button
    
    // I'm getting current form values
    const course = courseSelect.value;
    const date = dateSelect.value;
    const time = timeSelect.value;
    
    // I'm checking availability
    const result = checkTutorAvailability(course, date, time);
    
    // I'm showing the availability result section
    availabilityResult.style.display = 'block';
    
    if (result.available) {
        // TUTORS ARE AVAILABLE - I'm showing success message
        
        availableMessage.style.display = 'flex';
        // I'm showing green success message
        
        unavailableMessage.style.display = 'none';
        // I'm hiding warning message
        
        tutorCount.textContent = result.tutorCount;
        // I'm updating the number of tutors available
        
        continueBtn.style.display = 'block';
        // I'm showing the Continue button
        
    } else {
        // NO TUTORS AVAILABLE - I'm showing warning with alternatives
        
        availableMessage.style.display = 'none';
        // I'm hiding success message
        
        unavailableMessage.style.display = 'flex';
        // I'm showing warning message
        
        unavailableTime.textContent = formatTimeDisplay(time);
        // I'm showing the selected time that wasn't available
        
        continueBtn.style.display = 'none';
        // I'm hiding Continue button
        
        // I'm finding alternative times
        const alternatives = findAlternativeTimes(course, date, time);
        
        // I'm clearing previous alternatives
        alternativeTimes.innerHTML = '';
        // I'm emptying the container
        
        if (alternatives.length > 0) {
            // If I found alternative times, I'm creating buttons for them
            
            alternatives.forEach(alt => {
                // I'm looping through each alternative time
                
                const button = document.createElement('button');
                // I'm creating a new button element
                
                button.className = 'alt-time-btn';
                // I'm adding CSS class for styling
                
                button.textContent = `${formatTimeDisplay(alt.time)} (${alt.tutorCount} tutor${alt.tutorCount > 1 ? 's' : ''})`;
                // I'm setting button text to show time and number of tutors
                // Example: "15:00 - 16:00 (2:00 PM - 3:00 PM) (2 tutors)"
                
                button.onclick = function() {
                    // When alternative time button is clicked
                    
                    timeSelect.value = alt.time;
                    // I'm updating the time dropdown to this time
                    
                    // I'm automatically checking availability for this new time
                    checkAvailabilityBtn.click();
                    // I'm simulating clicking the Check Availability button
                };
                
                alternativeTimes.appendChild(button);
                // I'm adding button to the container
            });
            
        } else {
            // No alternatives found
            
            alternativeTimes.innerHTML = '<p style="color: var(--shsu-gray-medium); font-style: italic;">No nearby times available. Please try a different date.</p>';
            // I'm showing message suggesting to pick different date
        }
    }
});

// HANDLE FORM SUBMISSION AND NAVIGATE TO PAGE 2
// When user clicks "Continue to Choose Tutor", I'll save their selections and go to Page 2

// EVENT LISTENER: Form submission (Continue button)
selectionForm.addEventListener('submit', function(event) {
    // This runs when user clicks "Continue to Choose Tutor →" button
    
    event.preventDefault();
    // I'm preventing the default form submission behavior (page reload)
    // I want to handle navigation myself
    
    // I'm getting all form values
    const selectedCourse = courseSelect.value;
    // Example: "COSC4319"
    
    const selectedDate = dateSelect.value;
    // Example: "2025-11-05"
    
    const selectedTime = timeSelect.value;
    // Example: "14:00-15:00"
    
    // I'm getting the tutor count from the success message
    const selectedTutorCount = tutorCount.textContent;
    // Example: "3"
    
    // I'm creating an object with all booking information
    const bookingData = {
        course: selectedCourse,
        date: selectedDate,
        time: selectedTime,
        tutorCount: selectedTutorCount
    };
    
    // I'm saving to browser's sessionStorage
    // sessionStorage keeps data while browser is open, clears when browser closes
    // localStorage would keep data permanently (even after closing browser)
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    // I'm converting object to JSON string and storing it
    // JSON.stringify turns {course: "COSC4319"} into '{"course":"COSC4319"}'
    
    // I'm navigating to Page 2 (tutor selection page)
    window.location.href = 'booking-confirm.html';
    // I'm changing browser URL to Page 2
    // I can change 'booking-confirm.html' to whatever I name Page 2
});

// *** DEBUGGING HELPER ***
// This helps me see what data is being saved
// I'll remove this section once everything is working
console.log('Booking Select Page JavaScript Loaded Successfully');
// I'm showing in browser console (F12) that file loaded

// Optional: Log when data is saved
selectionForm.addEventListener('submit', function() {
    console.log('Booking data saved:', sessionStorage.getItem('bookingData'));
    // I'm showing saved data in console for debugging
});

// LOGOUT FUNCTIONALITY
// I'm handling user logout - clearing session data and redirecting to login page

// FUNCTION: Handle logout button click
function handleLogout() {
    // I'm clearing all session data
    sessionStorage.clear();
    // I'm removing all saved booking data from browser session storage
    
    // I'm redirecting to login page
    window.location.href = 'LoginAndRegister.html';
}