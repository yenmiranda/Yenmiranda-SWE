// STEP 1: GET REFERENCES TO ALL HTML ELEMENTS I'LL USE
// I'm creating shortcuts to elements on the page so I can interact with them

// Summary elements (shows booking details from Page 1)
const summaryCourse = document.getElementById('summary-course');
// I'm getting the span that shows the selected course

const summaryDate = document.getElementById('summary-date');
// I'm getting the span that shows the selected date

const summaryTime = document.getElementById('summary-time');
// I'm getting the span that shows the selected time

const summaryCount = document.getElementById('summary-count');
// I'm getting the span that shows number of available tutors

// Button elements
const backBtn = document.getElementById('back-btn');
// I'm getting the "Change Session Details" button

// Tutor list container
const tutorList = document.getElementById('tutor-list');
// I'm getting the container where tutor cards will be added

// Confirmation section elements
const confirmationSection = document.getElementById('confirmation-section');
// I'm getting the confirmation section (hidden by default)

const selectedTutorName = document.getElementById('selected-tutor-name');
// I'm getting the span that shows selected tutor's name

const confirmCourse = document.getElementById('confirm-course');
const confirmDate = document.getElementById('confirm-date');
const confirmTime = document.getElementById('confirm-time');
const confirmTutor = document.getElementById('confirm-tutor');
// I'm getting all the confirmation summary spans

const changeTutorBtn = document.getElementById('change-tutor-btn');
// I'm getting the "Change Tutor" button

const confirmBookingBtn = document.getElementById('confirm-booking-btn');
// I'm getting the "Confirm Booking" button


// STEP 2: SAMPLE TUTOR DATA
// In a real application, this would come from a database
// For now, I'll create sample tutor profiles

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
// I'm creating an array of tutor objects, each with an id and name


// STEP 3: LOAD BOOKING DATA FROM PAGE 1
// When the user completed Page 1, their selections were saved to sessionStorage
// Now I need to retrieve that data and display it

function loadBookingData() {
    // I'm getting the saved booking data from sessionStorage
    const bookingDataString = sessionStorage.getItem('bookingData');
    // I'm getting the JSON string that was saved
    // Example: '{"course":"COSC4319","date":"2025-11-05","time":"14:00-15:00","tutorCount":"3"}'
    
    if (!bookingDataString) {
        // If no data found, the user probably came here directly without going through Page 1
        
        alert('No booking data found. Please start from the session selection page.');
        // I'm showing an alert to the user
        
        window.location.href = 'Booking.html';
        // I'm redirecting back to Page 1
        
        return null;
        // I'm stopping function execution
    }
    
    // I'm converting JSON string back to JavaScript object
    const bookingData = JSON.parse(bookingDataString);
    // I'm converting '{"course":"COSC4319"}' back to {course: "COSC4319"}
    
    return bookingData;
    // I'm returning the object so I can use it
}

// STEP 4: DISPLAY BOOKING DATA IN SUMMARY SECTION
// I'm taking the booking data and putting it on the page

function displayBookingSummary(bookingData) {
    // I'm updating the course name
    summaryCourse.textContent = bookingData.course;
    // Example: "COSC4319" or "COSC3319"
    
    // I'm formatting and displaying the date
    const dateObj = new Date(bookingData.date + 'T00:00:00');
    // I'm creating a Date object from date string
    // I added 'T00:00:00' to prevent timezone issues
    
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    // I'm formatting date to: "Wednesday, November 5, 2025"
    
    summaryDate.textContent = dateFormatted;
    
    // I'm displaying the time slot
    summaryTime.textContent = formatTimeDisplay(bookingData.time);
    // Example: "14:00 - 15:00 (2:00 PM - 3:00 PM)"
    
    // I'm displaying the tutor count
    summaryCount.textContent = `${bookingData.tutorCount} tutor(s)`;
    // Example: "3 tutor(s)"
}

// FUNCTION: Format time for display (converts military to standard time)
// I'm using the same function from Page 1 - converting "14:00-15:00" to readable format
function formatTimeDisplay(timeSlot) {
    const [start, end] = timeSlot.split('-');
    // I'm splitting "14:00-15:00" into ["14:00", "15:00"]
    
    // I'm formatting the start time
    const startHour = parseInt(start.split(':')[0]);
    // I'm getting the hour number: 14
    
    const startFormatted = startHour === 0 ? '12:00 AM' :
                          startHour < 12 ? `${startHour}:00 AM` :
                          startHour === 12 ? '12:00 PM' :
                          `${startHour - 12}:00 PM`;
    // I'm converting 14 to "2:00 PM"
    
    // I'm formatting the end time
    const endHour = parseInt(end.split(':')[0]);
    const endFormatted = endHour === 0 ? '12:00 AM' :
                        endHour < 12 ? `${endHour}:00 AM` :
                        endHour === 12 ? '12:00 PM' :
                        `${endHour - 12}:00 PM`;
    // I'm converting 15 to "3:00 PM"
    
    return `${start} - ${end} (${startFormatted} - ${endFormatted})`;
    // I'm returning: "14:00 - 15:00 (2:00 PM - 3:00 PM)"
}

// STEP 5: GET AVAILABLE TUTORS
// In a real app, this would filter tutors based on availability
// For now, I'll show a random subset based on the tutorCount from Page 1

function getAvailableTutors(tutorCount) {
    // I'm getting the number of tutors that should be available
    const count = parseInt(tutorCount);
    // I'm converting string "3" to number 3
    
    // I'm shuffling the tutors array to get random tutors each time
    const shuffled = [...tutors].sort(() => Math.random() - 0.5);
    // I'm creating a copy of tutors array and randomly shuffling it
    // [...tutors] creates a copy so I don't modify the original
    
    // I'm returning the first 'count' tutors from the shuffled array
    return shuffled.slice(0, count);
    // slice(0, 3) returns first 3 items
}

// STEP 6: GET TUTOR INITIAL
// I'm getting the first letter of tutor's first name for avatar

function getTutorInitial(name) {
    return name.charAt(0).toUpperCase();
    // I'm getting the first character and making it uppercase
    // "Sarah Johnson" → "S"
}

// STEP 7: CREATE TUTOR CARD HTML
// I'm creating the HTML for a single tutor card

function createTutorCard(tutor) {
    // I'm creating the main card container
    const card = document.createElement('div');
    // I'm creating a new <div> element
    
    card.className = 'tutor-card';
    // I'm adding CSS class for styling
    
    card.dataset.tutorId = tutor.id;
    // I'm adding data attribute to store tutor ID
    // This creates: <div data-tutor-id="1">
    
    card.dataset.tutorName = tutor.name;
    // I'm adding data attribute to store tutor name
    // This creates: <div data-tutor-name="Sarah Johnson">
    
    // I'm building the card's inner HTML
    card.innerHTML = `
        <div class="tutor-avatar">${getTutorInitial(tutor.name)}</div>
        <div class="tutor-name">${tutor.name}</div>
        <button class="select-tutor-btn" data-tutor-id="${tutor.id}" data-tutor-name="${tutor.name}">
            Select Tutor
        </button>
    `;
    // I'm creating avatar with initial, name, and select button
    
    return card;
    // I'm returning the completed card element
}

// STEP 8: DISPLAY ALL TUTOR CARDS
// I'm creating and displaying all available tutor cards

function displayTutors(availableTutors) {
    // I'm clearing the loading message
    tutorList.innerHTML = '';
    // I'm emptying the container
    
    if (availableTutors.length === 0) {
        // If no tutors available (shouldn't happen, but just in case)
        
        tutorList.innerHTML = '<p class="loading-message">No tutors available. Please try a different time slot.</p>';
        // I'm showing a message
        
        return;
        // I'm stopping the function
    }
    
    // I'm creating and adding a card for each tutor
    availableTutors.forEach(tutor => {
        // I'm looping through each tutor
        
        const card = createTutorCard(tutor);
        // I'm creating the card HTML
        
        tutorList.appendChild(card);
        // I'm adding the card to the page
    });
    
    // I'm adding click event listeners to all select buttons
    attachTutorSelectListeners();
    // I'm running the function to make buttons work
}

// STEP 9: ATTACH EVENT LISTENERS TO TUTOR SELECT BUTTONS
// I'm making the "Select Tutor" buttons clickable

function attachTutorSelectListeners() {
    // I'm getting all select buttons
    const selectButtons = document.querySelectorAll('.select-tutor-btn');
    // I'm getting all buttons with class "select-tutor-btn"
    
    selectButtons.forEach(button => {
        // I'm looping through each button
        
        button.addEventListener('click', function(event) {
            // When button is clicked
            
            event.stopPropagation();
            // I'm preventing click from bubbling up to the card
            
            // I'm getting tutor information from button's data attributes
            const tutorId = this.dataset.tutorId;
            const tutorName = this.dataset.tutorName;
            
            // I'm handling tutor selection
            selectTutor(tutorId, tutorName);
        });
    });
    
    // I'm also making entire cards clickable
    const tutorCards = document.querySelectorAll('.tutor-card');
    
    tutorCards.forEach(card => {
        card.addEventListener('click', function() {
            // When card is clicked
            
            const tutorId = this.dataset.tutorId;
            const tutorName = this.dataset.tutorName;
            
            // I'm handling tutor selection
            selectTutor(tutorId, tutorName);
        });
    });
}

// STEP 10: HANDLE TUTOR SELECTION
// I'm handling when user clicks a tutor card or select button

function selectTutor(tutorId, tutorName) {
    // I'm getting the booking data
    const bookingData = loadBookingData();
    
    if (!bookingData) return;
    // If no booking data, I'm stopping
    
    // I'm adding selected tutor to booking data
    bookingData.tutorId = tutorId;
    bookingData.tutorName = tutorName;
    
    // I'm saving updated booking data
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    // I'm saving the updated data with tutor information
    
    // I'm updating visual state of cards
    const allCards = document.querySelectorAll('.tutor-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
        // I'm removing 'selected' class from all cards
    });
    
    const selectedCard = document.querySelector(`[data-tutor-id="${tutorId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        // I'm adding 'selected' class to clicked card
        // This makes it orange with thicker border
    }
    
    // I'm showing the confirmation section
    showConfirmation(bookingData);
    
    // I'm scrolling to confirmation section
    confirmationSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // I'm smoothly scrolling to show confirmation
}

// STEP 11: SHOW CONFIRMATION SECTION
// I'm displaying confirmation with all booking details

function showConfirmation(bookingData) {
    // I'm updating tutor name in confirmation message
    selectedTutorName.textContent = bookingData.tutorName;
    
    // I'm updating confirmation summary
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
    
    // I'm showing the confirmation section
    confirmationSection.style.display = 'block';
    // I'm changing display from 'none' to 'block'
}

// STEP 12: HANDLE "CHANGE TUTOR" BUTTON
// I'm allowing user to go back and select a different tutor

changeTutorBtn.addEventListener('click', function() {
    // I'm hiding the confirmation section
    confirmationSection.style.display = 'none';
    
    // I'm removing selected state from all cards
    const allCards = document.querySelectorAll('.tutor-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // I'm scrolling back to tutor list
    tutorList.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// STEP 13: HANDLE "CHANGE SESSION DETAILS" BUTTON
// I'm going back to Page 1

backBtn.addEventListener('click', function() {
    // I'm navigating back to Page 1
    window.location.href = 'Booking.html';
    // I'm changing browser URL back to Page 1
    // The booking data is still saved in sessionStorage
});

// STEP 14: HANDLES "CONFIRM BOOKING" BUTTON
// Final confirmation - I'm completing the booking

confirmBookingBtn.addEventListener('click', function() {
    // I'm getting the final booking data
    const bookingData = loadBookingData();
    
    if (!bookingData) return;
    
    // In a real application, I would:
    // 1. Send booking data to a server/database
    // 2. Create a booking confirmation page
    // 3. Send confirmation email
    // 4. Update tutor's calendar
    
    // For now, I'll show an alert with booking details
    const message = `
Booking Confirmed! ✓

Course: ${bookingData.course}
Date: ${summaryDate.textContent}
Time: ${formatTimeDisplay(bookingData.time)}
Tutor: ${bookingData.tutorName}

Booking Confirmation!
    `;
    
    alert(message);
    // I'm showing an alert with booking summary
    
    // I'm logging booking data to console for debugging
    console.log('Booking confirmed:', bookingData);
    
    // I'm clearing the booking data from sessionStorage
    sessionStorage.removeItem('bookingData');
    // I'm removing the saved data
    
    // I'm redirecting to a success page or home page
    // For now, I'll go back to Page 1
    alert('Redirecting to session selection page...');
    window.location.href = 'Booking.html';
});

// STEP 15: INITIALIZE PAGE WHEN IT LOADS
// This runs when the page first loads

function initializePage() {
    console.log('Tutor selection page loaded');
    
    // I'm loading booking data from Page 1
    const bookingData = loadBookingData();
    
    if (!bookingData) {
        // If no data, loadBookingData() already redirected to Page 1
        return;
    }
    
    // I'm displaying booking summary at top
    displayBookingSummary(bookingData);
    
    // I'm getting available tutors based on count from Page 1
    const availableTutors = getAvailableTutors(bookingData.tutorCount);
    
    // I'm displaying tutor cards
    displayTutors(availableTutors);
    
    // If tutor was already selected (user came back from confirmation), I'm showing it
    if (bookingData.tutorId && bookingData.tutorName) {
        selectTutor(bookingData.tutorId, bookingData.tutorName);
    }
}

// I'm running initialization when page loads
initializePage();

// *** DEBUGGING HELPERS ***
// These help me see what's happening in the browser console

console.log('Booking Tutor Selection JavaScript Loaded Successfully');

// I'm logging available tutors
console.log('Sample tutors available:', tutors);

// LOGOUT FUNCTIONALITY
// I'm handling user logout - clearing session data and redirecting to login page

// FUNCTION: Handle logout button click
function handleLogout() {
    // I'm clearing all session data
    sessionStorage.clear();
    // I'm removing all saved booking data from browser session storage
    
    // Optional: I can also clear localStorage if I'm using it
    // localStorage.clear();
    
    // I'm redirecting to login page
    window.location.href = 'Login.html';
}