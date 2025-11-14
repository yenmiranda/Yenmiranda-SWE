//global variables
let CURRENT_USER = null;
let BOOKING_DATA = null;

//html elements
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

//loads booking data
function loadBookingData() {
    const bookingDataString = sessionStorage.getItem('bookingData');
    if (!bookingDataString) {
        alert('No booking data found. Please start from the session selection page.');
        window.location.href = 'Booking-select.html';
        return null;
    }
    return JSON.parse(bookingDataString);
}

//formats time for display
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

// displays booking summary
function displayBookingSummary(bookingData) {
    summaryCourse.textContent = bookingData.courseName || bookingData.course;
    const dateObj = new Date(bookingData.date + 'T00:00:00');
    summaryDate.textContent = dateObj.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    summaryTime.textContent = formatTimeDisplay(bookingData.time);
    summaryCount.textContent = `${bookingData.tutorCount} tutor(s)`;
}

//gets the available tutors
function getAvailableTutors() {
    const tutorDataString = sessionStorage.getItem('availableTutors');
    if (!tutorDataString) {
        console.error("No tutor list found in session storage.");
        return [];
    }
    return JSON.parse(tutorDataString);
}

//gets tutor intial
function getTutorInitial(name) {
    return name.charAt(0).toUpperCase();
}

//creates tutor card
function createTutorCard(tutorSlot) {
    const card = document.createElement('div');
    card.className = 'tutor-card';
    const tutorName = `${tutorSlot.FirstName} ${tutorSlot.LastName}`;

    card.dataset.tutorId = tutorSlot.TutorRefNo;
    card.dataset.tutorName = tutorName;
    card.dataset.availId = tutorSlot.AvailID;
    card.dataset.classNo = tutorSlot.ClassNo;
    card.dataset.timeSlot = tutorSlot.TimeSlot; 

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

//displays tutors
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

//
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

//selects tutors with data
function selectTutor(tutorData) {
    BOOKING_DATA.tutorRefNo = tutorData.tutorId;
    BOOKING_DATA.tutorName = tutorData.tutorName;
    BOOKING_DATA.availId = tutorData.availId;
    BOOKING_DATA.classNo = tutorData.classNo;
    BOOKING_DATA.timeSlot = tutorData.timeSlot; 
    
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

//shows confirmation
function showConfirmation(bookingData) {
    selectedTutorName.textContent = bookingData.tutorName;
    confirmCourse.textContent = bookingData.courseName || bookingData.course;
    confirmDate.textContent = summaryDate.textContent;
    confirmTime.textContent = formatTimeDisplay(bookingData.time);
    confirmTutor.textContent = bookingData.tutorName;
    
    confirmationSection.style.display = 'block';
}

//change tutor button functionality
changeTutorBtn.addEventListener('click', function() {
    confirmationSection.style.display = 'none';
    document.querySelectorAll('.tutor-card').forEach(card => {
        card.classList.remove('selected');
    });
    tutorList.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

//back button functionality
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

//confirmation button fucntionality
confirmBookingBtn.addEventListener('click', async function() {
    this.disabled = true;
    this.textContent = 'Booking...';

    const finalBookingData = loadBookingData();
 
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

//logout function
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

//page initialization
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