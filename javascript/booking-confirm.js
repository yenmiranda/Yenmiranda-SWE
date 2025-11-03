// STEP 1: GET REFERENCES TO ALL HTML ELEMENTS WE'LL USE
// This is like creating shortcuts to elements on the page so we can interact with them

// Summary elements (shows booking details from Page 1)
const summaryCourse = document.getElementById('summary-course');
// Gets the span that shows the selected course

const summaryDate = document.getElementById('summary-date');
// Gets the span that shows the selected date

const summaryTime = document.getElementById('summary-time');
// Gets the span that shows the selected time

const summaryCount = document.getElementById('summary-count');
// Gets the span that shows number of available tutors

// Button elements
const backBtn = document.getElementById('back-btn');
// Gets the "Change Session Details" button

// Tutor list container
const tutorList = document.getElementById('tutor-list');
// Gets the container where tutor cards will be added

// Confirmation section elements
const confirmationSection = document.getElementById('confirmation-section');
// Gets the confirmation section (hidden by default)

const selectedTutorName = document.getElementById('selected-tutor-name');
// Gets the span that shows selected tutor's name

const confirmCourse = document.getElementById('confirm-course');
const confirmDate = document.getElementById('confirm-date');
const confirmTime = document.getElementById('confirm-time');
const confirmTutor = document.getElementById('confirm-tutor');
// Gets all the confirmation summary spans

const changeTutorBtn = document.getElementById('change-tutor-btn');
// Gets the "Change Tutor" button

const confirmBookingBtn = document.getElementById('confirm-booking-btn');
// Gets the "Confirm Booking" button


// STEP 2: SAMPLE TUTOR DATA
// In a real application, this would come from a database
// For now, we'll create sample tutor profiles

const tutors = [
    { id: 1, name: 'Sarah Johnson' },
    { id: 2, name: 'Michael Chen' },
    { id: 3, name: 'Emily Rodriguez' },
    { id: 4, name: 'David Thompson' },
    { id: 5, name: 'Jessica Martinez' },
    { id: 6, name: 'James Wilson' },
    { id: 7, name: 'Amanda Taylor' },
    { id: 8, name: 'Christopher Lee' }
];
// Array of tutor objects, each with an id and name


// STEP 3: LOAD BOOKING DATA FROM PAGE 1
// When user completed Page 1, their selections were saved to sessionStorage
// Now we need to retrieve that data and display it

function loadBookingData() {
    // Get the saved booking data from sessionStorage
    const bookingDataString = sessionStorage.getItem('bookingData');
    // Gets the JSON string that was saved
    // Example: '{"course":"COSC4319","date":"2025-11-05","time":"14:00-15:00","tutorCount":"3"}'
    
    if (!bookingDataString) {
        // If no data found, user probably came here directly without going through Page 1
        
        alert('No booking data found. Please start from the session selection page.');
        // Shows alert to user
        
        window.location.href = 'booking-select.html';
        // Redirects back to Page 1
        
        return null;
        // Stops function execution
    }
    
    // Convert JSON string back to JavaScript object
    const bookingData = JSON.parse(bookingDataString);
    // Converts '{"course":"COSC4319"}' back to {course: "COSC4319"}
    
    return bookingData;
    // Returns the object so we can use it
}

// STEP 4: DISPLAY BOOKING DATA IN SUMMARY SECTION
// Takes the booking data and puts it on the page

function displayBookingSummary(bookingData) {
    // Update course name
    summaryCourse.textContent = bookingData.course;
    // Example: "COSC4319" or "COSC3319"
    
    // Format and display date
    const dateObj = new Date(bookingData.date + 'T00:00:00');
    // Creates Date object from date string
    // Added 'T00:00:00' to prevent timezone issues
    
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    // Formats date to: "Wednesday, November 5, 2025"
    
    summaryDate.textContent = dateFormatted;
    
    // Display time slot
    summaryTime.textContent = formatTimeDisplay(bookingData.time);
    // Example: "14:00 - 15:00 (2:00 PM - 3:00 PM)"
    
    // Display tutor count
    summaryCount.textContent = `${bookingData.tutorCount} tutor(s)`;
    // Example: "3 tutor(s)"
}

// FUNCTION: Format time for display (converts military to standard time)
// Same function from Page 1 - converts "14:00-15:00" to readable format
function formatTimeDisplay(timeSlot) {
    const [start, end] = timeSlot.split('-');
    // Splits "14:00-15:00" into ["14:00", "15:00"]
    
    // Format start time
    const startHour = parseInt(start.split(':')[0]);
    // Gets hour number: 14
    
    const startFormatted = startHour === 0 ? '12:00 AM' :
                          startHour < 12 ? `${startHour}:00 AM` :
                          startHour === 12 ? '12:00 PM' :
                          `${startHour - 12}:00 PM`;
    // Converts 14 to "2:00 PM"
    
    // Format end time
    const endHour = parseInt(end.split(':')[0]);
    const endFormatted = endHour === 0 ? '12:00 AM' :
                        endHour < 12 ? `${endHour}:00 AM` :
                        endHour === 12 ? '12:00 PM' :
                        `${endHour - 12}:00 PM`;
    // Converts 15 to "3:00 PM"
    
    return `${start} - ${end} (${startFormatted} - ${endFormatted})`;
    // Returns: "14:00 - 15:00 (2:00 PM - 3:00 PM)"
}

// STEP 5: GET AVAILABLE TUTORS
// In a real app, this would filter tutors based on availability
// For now, we'll show a random subset based on the tutorCount from Page 1

function getAvailableTutors(tutorCount) {
    // Get the number of tutors that should be available
    const count = parseInt(tutorCount);
    // Converts string "3" to number 3
    
    // Shuffle the tutors array to get random tutors each time
    const shuffled = [...tutors].sort(() => Math.random() - 0.5);
    // Creates a copy of tutors array and randomly shuffles it
    // [...tutors] creates a copy so we don't modify the original
    
    // Return the first 'count' tutors from the shuffled array
    return shuffled.slice(0, count);
    // slice(0, 3) returns first 3 items
}

// STEP 6: GET TUTOR INITIAL
// Gets the first letter of tutor's first name for avatar

function getTutorInitial(name) {
    return name.charAt(0).toUpperCase();
    // Gets first character and makes it uppercase
    // "Sarah Johnson" → "S"
}

// STEP 7: CREATE TUTOR CARD HTML
// Creates the HTML for a single tutor card

function createTutorCard(tutor) {
    // Create the main card container
    const card = document.createElement('div');
    // Creates a new <div> element
    
    card.className = 'tutor-card';
    // Adds CSS class for styling
    
    card.dataset.tutorId = tutor.id;
    // Adds data attribute to store tutor ID
    // This creates: <div data-tutor-id="1">
    
    card.dataset.tutorName = tutor.name;
    // Adds data attribute to store tutor name
    // This creates: <div data-tutor-name="Sarah Johnson">
    
    // Build the card's inner HTML
    card.innerHTML = `
        <div class="tutor-avatar">${getTutorInitial(tutor.name)}</div>
        <div class="tutor-name">${tutor.name}</div>
        <button class="select-tutor-btn" data-tutor-id="${tutor.id}" data-tutor-name="${tutor.name}">
            Select Tutor
        </button>
    `;
    // Creates avatar with initial, name, and select button
    
    return card;
    // Returns the completed card element
}

// STEP 8: DISPLAY ALL TUTOR CARDS
// Creates and displays all available tutor cards

function displayTutors(availableTutors) {
    // Clear the loading message
    tutorList.innerHTML = '';
    // Empties the container
    
    if (availableTutors.length === 0) {
        // If no tutors available (shouldn't happen, but just in case)
        
        tutorList.innerHTML = '<p class="loading-message">No tutors available. Please try a different time slot.</p>';
        // Shows message
        
        return;
        // Stops function
    }
    
    // Create and add a card for each tutor
    availableTutors.forEach(tutor => {
        // Loop through each tutor
        
        const card = createTutorCard(tutor);
        // Creates the card HTML
        
        tutorList.appendChild(card);
        // Adds card to the page
    });
    
    // Add click event listeners to all select buttons
    attachTutorSelectListeners();
    // Runs function to make buttons work
}

// STEP 9: ATTACH EVENT LISTENERS TO TUTOR SELECT BUTTONS
// Makes the "Select Tutor" buttons clickable

function attachTutorSelectListeners() {
    // Get all select buttons
    const selectButtons = document.querySelectorAll('.select-tutor-btn');
    // Gets all buttons with class "select-tutor-btn"
    
    selectButtons.forEach(button => {
        // Loop through each button
        
        button.addEventListener('click', function(event) {
            // When button is clicked
            
            event.stopPropagation();
            // Prevents click from bubbling up to the card
            
            // Get tutor information from button's data attributes
            const tutorId = this.dataset.tutorId;
            const tutorName = this.dataset.tutorName;
            
            // Handle tutor selection
            selectTutor(tutorId, tutorName);
        });
    });
    
    // Also make entire cards clickable
    const tutorCards = document.querySelectorAll('.tutor-card');
    
    tutorCards.forEach(card => {
        card.addEventListener('click', function() {
            // When card is clicked
            
            const tutorId = this.dataset.tutorId;
            const tutorName = this.dataset.tutorName;
            
            // Handle tutor selection
            selectTutor(tutorId, tutorName);
        });
    });
}

// STEP 10: HANDLE TUTOR SELECTION
// Called when user clicks a tutor card or select button

function selectTutor(tutorId, tutorName) {
    // Get the booking data
    const bookingData = loadBookingData();
    
    if (!bookingData) return;
    // If no booking data, stop
    
    // Add selected tutor to booking data
    bookingData.tutorId = tutorId;
    bookingData.tutorName = tutorName;
    
    // Save updated booking data
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    // Saves the updated data with tutor information
    
    // Update visual state of cards
    const allCards = document.querySelectorAll('.tutor-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
        // Removes 'selected' class from all cards
    });
    
    const selectedCard = document.querySelector(`[data-tutor-id="${tutorId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        // Adds 'selected' class to clicked card
        // This makes it orange with thicker border
    }
    
    // Show confirmation section
    showConfirmation(bookingData);
    
    // Scroll to confirmation section
    confirmationSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Smoothly scrolls to show confirmation
}

// STEP 11: SHOW CONFIRMATION SECTION
// Displays confirmation with all booking details

function showConfirmation(bookingData) {
    // Update tutor name in confirmation message
    selectedTutorName.textContent = bookingData.tutorName;
    
    // Update confirmation summary
    confirmCourse.textContent = bookingData.course;
    
    const dateObj = new Date(bookingData.date + 'T00:00:00');
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    confirmDate.textContent = dateFormatted;
    
    confirmTime.textContent = formatTimeDisplay(bookingData.time);
    
    confirmTutor.textContent = bookingData.tutorName;
    
    // Show the confirmation section
    confirmationSection.style.display = 'block';
    // Changes display from 'none' to 'block'
}

// STEP 12: HANDLE "CHANGE TUTOR" BUTTON
// Allows user to go back and select a different tutor

changeTutorBtn.addEventListener('click', function() {
    // Hide confirmation section
    confirmationSection.style.display = 'none';
    
    // Remove selected state from all cards
    const allCards = document.querySelectorAll('.tutor-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // Scroll back to tutor list
    tutorList.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// STEP 13: HANDLE "CHANGE SESSION DETAILS" BUTTON
// Goes back to Page 1

backBtn.addEventListener('click', function() {
    // Navigate back to Page 1
    window.location.href = 'booking-confirm.html';
    // Changes browser URL back to Page 1
    // The booking data is still saved in sessionStorage
});

// STEP 14: HANDLE "CONFIRM BOOKING" BUTTON
// Final confirmation - completes the booking

confirmBookingBtn.addEventListener('click', function() {
    // Get the final booking data
    const bookingData = loadBookingData();
    
    if (!bookingData) return;
    
    // In a real application, this would:
    // 1. Send booking data to a server/database
    // 2. Create a booking confirmation page
    // 3. Send confirmation email
    // 4. Update tutor's calendar
    
    // For now, we'll show an alert with booking details
    const message = `
Booking Confirmed! ✓

Course: ${bookingData.course}
Date: ${summaryDate.textContent}
Time: ${formatTimeDisplay(bookingData.time)}
Tutor: ${bookingData.tutorName}

You will receive a confirmation email shortly.
    `;
    
    alert(message);
    // Shows alert with booking summary
    
    // Log booking data to console for debugging
    console.log('Booking confirmed:', bookingData);
    
    // Clear the booking data from sessionStorage
    sessionStorage.removeItem('bookingData');
    // Removes the saved data
    
    // Redirect to a success page or home page
    // For now, we'll go back to Page 1
    alert('Redirecting to session selection page...');
    window.location.href = 'booking-select.html';
});

// STEP 15: INITIALIZE PAGE WHEN IT LOADS
// This runs when the page first loads

function initializePage() {
    console.log('Tutor selection page loaded');
    
    // Load booking data from Page 1
    const bookingData = loadBookingData();
    
    if (!bookingData) {
        // If no data, loadBookingData() already redirected to Page 1
        return;
    }
    
    // Display booking summary at top
    displayBookingSummary(bookingData);
    
    // Get available tutors based on count from Page 1
    const availableTutors = getAvailableTutors(bookingData.tutorCount);
    
    // Display tutor cards
    displayTutors(availableTutors);
    
    // If tutor was already selected (user came back from confirmation), show it
    if (bookingData.tutorId && bookingData.tutorName) {
        selectTutor(bookingData.tutorId, bookingData.tutorName);
    }
}

// Run initialization when page loads
initializePage();

// *** DEBUGGING HELPERS ***
// These help us see what's happening in the browser console

console.log('Booking Tutor Selection JavaScript Loaded Successfully');

// Log available tutors
console.log('Sample tutors available:', tutors);

// LOGOUT FUNCTIONALITY
// Handles user logout - clears session data and redirects to login page

// FUNCTION: Handle logout button click
function handleLogout() {
    // Clear all session data
    sessionStorage.clear();
    // Removes all saved booking data from browser session storage
    
    // Optional: Also clear localStorage if you're using it
    // localStorage.clear();
    
    // Redirect to login page
    window.location.href = 'login.html';
    // Change 'login.html' to whatever your login page is called
}