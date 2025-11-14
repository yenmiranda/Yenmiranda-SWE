// Filename: frontend/booking/booking-confirm.js

// --- GLOBAL VARS ---
let CURRENT_USER = null;
let BOOKING_DATA = null;

// --- 1. GET HTML ELEMENTS ---
const summaryCourse = document.getElementById('summary-course');
const summaryDate = document.getElementById('summary-date');
const summaryTime = document.getElementById('summary-time');
const summaryCount = document.getElementById('summary-count');
const backBtn = document.getElementById('back-btn');
const tutorList = document.getElementById('tutor-list');
const confirmationSection = document.getElementById('confirmation-section');
const selectedTutorName = document.getElementById('selected-tutor-name');
const confirmCourse = document.getElementById('confirm-course');
const confirmDate = document.getElementById('confirm-date');
const confirmTime = document.getElementById('confirm-time');
const confirmTutor = document.getElementById('confirm-tutor');
const changeTutorBtn = document.getElementById('change-tutor-btn');
const confirmBookingBtn = document.getElementById('confirm-booking-btn');

// --- 2. LOAD & DISPLAY DATA FROM PAGE 1 ---
function loadBookingData() {
    const bookingDataString = sessionStorage.getItem('bookingData');
    if (!bookingDataString) {
        alert('No booking data found. Please start from the session selection page.');
        window.location.href = 'Booking-select.html';
        return null;
    }
    return JSON.parse(bookingDataString);
}

function formatTimeDisplay(timeSlot) {
    const [start, end] = timeSlot.split('-');
    const startHour = parseInt(start.split(':')[0]);
    const startFormatted = startHour === 0 ? '12:00 AM' :
                          startHour < 12 ? `${startHour}:00 AM` :
                          startHour === 12 ? '12:00 PM' :
                          `${startHour - 12}:00 PM`;
    
    const endHour = parseInt(end.split(':')[0]);
    const endFormatted = endHour === 0 ? '12:00 AM' :
                        endHour < 12 ? `${endHour}:00 AM` :
                        endHour === 12 ? '12:00 PM' :
                        `${endHour - 12}:00 PM`;
    
    return `${start} - ${end} (${startFormatted} - ${endFormatted})`;
}

function displayBookingSummary(bookingData) {
    summaryCourse.textContent = bookingData.courseName || bookingData.course;
    const dateObj = new Date(bookingData.date + 'T00:00:00');
    summaryDate.textContent = dateObj.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    summaryTime.textContent = formatTimeDisplay(bookingData.time);
    summaryCount.textContent = `${bookingData.tutorCount} tutor(s)`;
}

// --- 3. TUTOR LIST & SELECTION ---

// Reads the actual tutor list from sessionStorage
function getAvailableTutors() {
    const tutorDataString = sessionStorage.getItem('availableTutors');
    if (!tutorDataString) {
        console.error("No tutor list found in session storage.");
        return [];
    }
    return JSON.parse(tutorDataString);
}

function getTutorInitial(name) {
    return name.charAt(0).toUpperCase();
}

// Stores all the critical IDs needed for booking
function createTutorCard(tutorSlot) {
    const card = document.createElement('div');
    card.className = 'tutor-card';
    const tutorName = `${tutorSlot.FirstName} ${tutorSlot.LastName}`;

    card.dataset.tutorId = tutorSlot.TutorRefNo;
    card.dataset.tutorName = tutorName;
    card.dataset.availId = tutorSlot.AvailID;
    card.dataset.classNo = tutorSlot.ClassNo;
    card.dataset.timeSlot = tutorSlot.TimeSlot; // The full ISO datetime

    card.innerHTML = `
        <div class="tutor-avatar">${getTutorInitial(tutorName)}</div>
        <div class="tutor-name">${tutorName}</div>
        <button class="select-tutor-btn"
            data-tutor-id="${tutorSlot.TutorRefNo}"
            data-tutor-name="${tutorName}"
            data-avail-id="${tutorSlot.AvailID}"
            data-class-no="${tutorSlot.ClassNo}"
            data-time-slot="${tutorSlot.TimeSlot}"
        >
            Select Tutor
        </button>
    `;
    return card;
}

function displayTutors(availableTutors) {
    tutorList.innerHTML = '';
    
    if (availableTutors.length === 0) {
        tutorList.innerHTML = '<p class="loading-message">No tutors available. Please try a different time slot.</p>';
        return;
    }
    
    availableTutors.forEach(tutor => {
        const card = createTutorCard(tutor);
        tutorList.appendChild(card);
    });
    
    attachTutorSelectListeners();
}

function attachTutorSelectListeners() {
    document.querySelectorAll('.select-tutor-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            selectTutor(this.dataset);
        });
    });
    
    document.querySelectorAll('.tutor-card').forEach(card => {
        card.addEventListener('click', function() {
            selectTutor(this.dataset);
        });
    });
}

// Reads all data attributes from the selected card
function selectTutor(tutorData) {
    BOOKING_DATA.tutorRefNo = tutorData.tutorId;
    BOOKING_DATA.tutorName = tutorData.tutorName;
    BOOKING_DATA.availId = tutorData.availId;
    BOOKING_DATA.classNo = tutorData.classNo;
    BOOKING_DATA.timeSlot = tutorData.timeSlot; // The full datetime string
    
    sessionStorage.setItem('bookingData', JSON.stringify(BOOKING_DATA));
    
    document.querySelectorAll('.tutor-card').forEach(card => {
        card.classList.remove('selected');
    });
    const selectedCard = document.querySelector(`[data-avail-id="${tutorData.availId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    showConfirmation(BOOKING_DATA);
    confirmationSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// --- 4. CONFIRMATION SECTION & BOOKING ---
function showConfirmation(bookingData) {
    selectedTutorName.textContent = bookingData.tutorName;
    confirmCourse.textContent = bookingData.courseName || bookingData.course;
    confirmDate.textContent = summaryDate.textContent;
    confirmTime.textContent = formatTimeDisplay(bookingData.time);
    confirmTutor.textContent = bookingData.tutorName;
    
    confirmationSection.style.display = 'block';
}

changeTutorBtn.addEventListener('click', function() {
    confirmationSection.style.display = 'none';
    document.querySelectorAll('.tutor-card').forEach(card => {
        card.classList.remove('selected');
    });
    tutorList.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

backBtn.addEventListener('click', function() {
    sessionStorage.removeItem('availableTutors');
    delete BOOKING_DATA.tutorRefNo;
    delete BOOKING_DATA.tutorName;
    delete BOOKING_DATA.availId;
    delete BOOKING_DATA.classNo;
    delete BOOKING_DATA.timeSlot;
    sessionStorage.setItem('bookingData', JSON.stringify(BOOKING_DATA));
    window.location.href = 'Booking-select.html';
});

// FINAL STEP: Sends the booking to the database (JWT ENABLED)
confirmBookingBtn.addEventListener('click', async function() {
    this.disabled = true;
    this.textContent = 'Booking...';

    const finalBookingData = loadBookingData();
    
    // stdRefNo is no longer needed here, server gets it from token
    if (!finalBookingData || !finalBookingData.availId) {
        alert("Error: Booking details are incomplete.");
        this.disabled = false;
        this.textContent = 'Confirm Booking →';
        return;
    }

    const postData = {
        availId: finalBookingData.availId,
        tutorRefNo: finalBookingData.tutorRefNo,
        classNo: finalBookingData.classNo,
        timeSlot: finalBookingData.timeSlot,
    };

    try {
        // Use relative path - JWT cookie is sent automatically
        const response = await fetch('/api/bookings/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert("Booking Confirmed! ✓\n\nYour session is booked.");
            sessionStorage.removeItem('bookingData');
            sessionStorage.removeItem('availableTutors');
            window.location.href = 'Booking-select.html';
        } else {
            alert(`Booking Failed: ${result.message}`);
            this.disabled = false;
            this.textContent = 'Confirm Booking →';
        }
    } catch (error) {
        console.error("Error confirming booking:", error);
        alert("A network error occurred. Please try again.");
        this.disabled = false;
        this.textContent = 'Confirm Booking →';
    }
});

// --- 5. LOGOUT & PAGE INIT ---
async function handleLogout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error("Error logging out:", error);
    } finally {
        sessionStorage.clear();
        window.location.href = 'Login.html';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        alert("You are not logged in.");
        window.location.href = 'Login.html';
        return;
    }
    CURRENT_USER = JSON.parse(userData);

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    BOOKING_DATA = loadBookingData();
    if (!BOOKING_DATA) return;
    
    displayBookingSummary(BOOKING_DATA);
    
    const availableTutors = getAvailableTutors();
    displayTutors(availableTutors);
    
    if (BOOKING_DATA.availId) {
        selectTutor({
            tutorId: BOOKING_DATA.tutorRefNo,
            tutorName: BOOKING_DATA.tutorName,
            availId: BOOKING_DATA.availId,
            classNo: BOOKING_DATA.classNo,
            timeSlot: BOOKING_DATA.timeSlot
        });
    }
});