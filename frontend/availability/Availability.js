// Filename: frontend/availability/Availability.js

// --- GLOBAL VARS ---
let CURRENT_USER = null;

// --- DAY/TIME SLOT LOGIC ---
document.querySelectorAll('.day input[type="checkbox"]').forEach(box => {
  box.addEventListener('change', function() {
    const timesDiv = document.getElementById(this.id + '-times');
    timesDiv.innerHTML = ''; 
    if (this.checked) {
      addTimeSlot(timesDiv);
      const addBtn = document.createElement('button');
      addBtn.textContent = '+';
      addBtn.classList.add('add-btn');
      addBtn.onclick = () => addTimeSlot(timesDiv);
      timesDiv.appendChild(addBtn);
    }
  });
});

function addTimeSlot(container) {
  const maxSlots = 24; 
  const currentSlots = container.querySelectorAll('.slot').length;
  if (currentSlots >= maxSlots) {
    alert("You can't add more than 24 time slots in a day.");
    return;
  }
  const slot = document.createElement('div');
  slot.classList.add('slot');
  const select = document.createElement('select');
  select.classList.add('time-select');
  const placeholder = document.createElement('option');
  placeholder.textContent = '-- Choose a Time Slot --';
  placeholder.value = '';
  select.appendChild(placeholder);
  const timeSlots = [
    ["00:00-01:00", "00:00 - 01:00 (12:00 AM - 1:00 AM)"], ["01:00-02:00", "01:00 - 02:00 (1:00 AM - 2:00 AM)"],
    ["02:00-03:00", "02:00 - 03:00 (2:00 AM - 3:00 AM)"], ["03:00-04:00", "03:00 - 04:00 (3:00 AM - 4:00 AM)"],
    ["04:00-05:00", "04:00 - 05:00 (4:00 AM - 5:00 AM)"], ["05:00-06:00", "05:00 - 06:00 (5:00 AM - 6:00 AM)"],
    ["06:00-07:00", "06:00 - 07:00 (6:00 AM - 7:00 AM)"], ["07:00-08:00", "07:00 - 08:00 (7:00 AM - 8:00 AM)"],
    ["08:00-09:00", "08:00 - 09:00 (8:00 AM - 9:00 AM)"], ["09:00-10:00", "09:00 - 10:00 (9:00 AM - 10:00 AM)"],
    ["10:00-11:00", "10:00 - 11:00 (10:00 AM - 11:00 AM)"], ["11:00-12:00", "11:00 - 12:00 (11:00 AM - 12:00 PM)"],
    ["12:00-13:00", "12:00 - 13:00 (12:00 PM - 1:00 PM)"], ["13:00-14:00", "13:00 - 14:00 (1:00 PM - 2:00 PM)"],
    ["14:00-15:00", "14:00 - 15:00 (2:00 PM - 3:00 PM)"], ["15:00-16:00", "15:00 - 16:00 (3:00 PM - 4:00 PM)"],
    ["16:00-17:00", "16:00 - 17:00 (4:00 PM - 5:00 PM)"], ["17:00-18:00", "17:00 - 18:00 (5:00 PM - 6:00 PM)"],
    ["18:00-19:00", "18:00 - 19:00 (6:00 PM - 7:00 PM)"], ["19:00-20:00", "19:00 - 20:00 (7:00 PM - 8:00 PM)"],
    ["20:00-21:00", "20:00 - 21:00 (8:00 PM - 9:00 PM)"], ["21:00-22:00", "21:00 - 22:00 (9:00 PM - 10:00 PM)"],
    ["22:00-23:00", "22:00 - 23:00 (10:00 PM - 11:00 PM)"], ["23:00-00:00", "23:00 - 00:00 (11:00 PM - 12:00 AM)"]
  ];
  timeSlots.forEach(([value, text]) => {
    const option = document.createElement('option');
    option.value = value; option.textContent = text;
    select.appendChild(option);
  });
  const del = document.createElement('button');
  del.classList.add('del-btn');
  del.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  del.onclick = () => { container.removeChild(slot); updateDisabledOptions(container); };
  select.addEventListener('change', () => updateDisabledOptions(container));
  slot.appendChild(select); slot.appendChild(del);
  const addBtn = container.querySelector('.add-btn');
  container.insertBefore(slot, addBtn);
  updateDisabledOptions(container);
}

function updateDisabledOptions(container) {
  const selectedValues = Array.from(container.querySelectorAll('select'))
    .map(sel => sel.value).filter(v => v !== '');
  container.querySelectorAll('select option').forEach(opt => {
    opt.disabled = selectedValues.includes(opt.value);
  });
}

// --- EDIT/SAVE LOGIC ---
const schedule = document.querySelector('.schedule');
const editBtn = document.querySelector('.edit-button');
const saveBtn = document.querySelector('.save-button');
schedule.classList.add('grayed-out');
saveBtn.style.display = 'none';

editBtn.addEventListener('click', () => {
  schedule.classList.remove('grayed-out'); 
  editBtn.style.display = 'none'; 
  saveBtn.style.display = 'block'; 
});

// --- SAVE AVAILABILITY (JWT ENABLED) ---
saveBtn.addEventListener('click', async () => {
    const availabilityData = [];
    
    // User data is now in the token, but we check sessionStorage for UI data
    if (!CURRENT_USER) {
        alert("Error: Not logged in.");
        return;
    }
    
    document.querySelectorAll('.day input[type="checkbox"]:checked').forEach(checkbox => {
        const day = checkbox.id; // 'monday', 'tuesday', etc.
        const timesDiv = document.getElementById(day + '-times');
        timesDiv.querySelectorAll('select.time-select').forEach(select => {
            if (select.value) {
                availabilityData.push({
                    day: day.charAt(0).toUpperCase() + day.slice(1), // Capitalize (e.g., "Monday")
                    timeSlot: select.value
                });
            }
        });
    });

    if (availabilityData.length === 0) {
        alert("Saving... You are clearing all your available slots.");
    }

    try {
        // Use relative path - JWT cookie will be sent automatically
        const response = await fetch('/api/availability/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(availabilityData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Availability saved successfully!');
            schedule.classList.add('grayed-out');
            saveBtn.style.display = 'none';
            editBtn.style.display = 'block';
        } else {
            alert('Error saving: ' + result.error);
        }
    } catch (error) {
        console.error('Failed to save:', error);
        alert('Failed to save availability. Please check your connection and try again.');
    }
});

// --- LOAD EXISTING AVAILABILITY (JWT ENABLED) ---
async function loadAvailability() {
  try {
    // Use relative path - JWT cookie is sent automatically
    const response = await fetch(`/api/availability/mine`);
    
    if (!response.ok) {
        const err = await response.json();
        if (response.status === 401) handleLogout(); // Token failed
        console.error('Failed to load availability:', err.message);
        return;
    }
    
    const scheduleData = await response.json();
    if (scheduleData.length === 0) return;
    
    const slotsByDay = {};
    scheduleData.forEach(item => {
      const day = item.day.toLowerCase(); // 'monday'
      if (!slotsByDay[day]) slotsByDay[day] = [];
      slotsByDay[day].push(item.timeSlot);
    });
    
    Object.keys(slotsByDay).forEach(day => {
      const dayCheckbox = document.getElementById(day);
      if (!dayCheckbox) return;
      
      dayCheckbox.checked = true;
      dayCheckbox.dispatchEvent(new Event('change'));
      
      setTimeout(() => {
        const timesDiv = document.getElementById(day + '-times');
        const timeSlots = slotsByDay[day];
        
        const firstSlot = timesDiv.querySelector('.slot');
        if (firstSlot && firstSlot.querySelector('select').value === '') {
          timesDiv.removeChild(firstSlot);
        }
        
        timeSlots.forEach(timeSlot => {
          addTimeSlot(timesDiv);
          const selects = timesDiv.querySelectorAll('select.time-select');
          const lastSelect = selects[selects.length - 1];
          if (lastSelect) lastSelect.value = timeSlot;
        });
        updateDisabledOptions(timesDiv);
      }, 50);
    });
    
  } catch (error) {
    console.error('Failed to load availability:', error);
  }
}

// --- LOAD UPCOMING APPOINTMENTS (JWT ENABLED) ---
async function loadTutorAppointments() {
    const listContainer = document.querySelector('.appointments-list');
    listContainer.innerHTML = '<p>Loading appointments...</p>'; 

    try {
        // Use relative path - JWT cookie is sent automatically
        const response = await fetch(`/api/bookings/tutor`);
        if (!response.ok) {
            if (response.status === 401) handleLogout();
            listContainer.innerHTML = '<p>Could not load appointments.</p>';
            return;
        }

        const appointments = await response.json();

        if (appointments.length === 0) {
            listContainer.innerHTML = `
                <div class="no-appointments">
                    <p>You don't have any upcoming appointments yet.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = ''; // Clear loading
        appointments.forEach(appt => {
            const dt = new Date(appt.TimeSlot);
            const date = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            // Calculate time range
            const startTime = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const endDate = new Date(dt.getTime() + 60 * 60 * 1000); 
            const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const timeRange = `${startTime} - ${endTime}`;

            const card = document.createElement('div');
            card.className = 'appointment-card';
            // Add booking number to the card's dataset
            card.dataset.bookingNo = appt.BookingNo;

            card.innerHTML = `
                <div class="appointment-header">
                    <span class="appointment-course">${appt.ClassName}</span>
                    <span class="appointment-date">${date}</span>
                </div>
                <div class="appointment-details">
                    <p class="appointment-time">${timeRange}</p>
                    <p class="appointment-student">Student: ${appt.StudentFirstName} ${appt.StudentLastName}</p>
                    <p class="appointment-location">Location: AB1 210</p>
                </div>
                <div class="appointment-actions">
                    <button class="cancel-btn">Cancel</button>
                </div>
            `;
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to load appointments:', error);
        listContainer.innerHTML = '<p>Error loading appointments.</p>';
    }
}

// NEW FUNCTION to handle cancellation
async function cancelBooking(bookingNo) {
    if (!confirm("Are you sure you want to cancel this student's booking?")) {
        return;
    }

    try {
        const response = await fetch(`/api/bookings/${bookingNo}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message);
            // Reload the appointments list
            loadTutorAppointments(); 
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Cancel error:', error);
        alert('An error occurred. Please try again.');
    }
}

// --- LOGOUT FUNCTION (JWT ENABLED) ---
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

// --- PAGE INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    // Get user data from session storage
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        alert("You are not logged in.");
        window.location.href = 'Login.html';
        return;
    }
    CURRENT_USER = JSON.parse(userData);

    // Check if user is a Tutor
    if (CURRENT_USER.role !== 'Tutor') {
        alert("Access denied. This page is for tutors only.");
        window.location.href = 'Login.html';
        return;
    }

    // Add logout functionality
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Load the tutor's schedule
    loadAvailability();
    loadTutorAppointments();

    // NEW EVENT LISTENER for the cancel buttons
    const apptListContainer = document.querySelector('.appointments-list');
    apptListContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('cancel-btn')) {
            // Find the parent card and get its booking number
            const card = event.target.closest('.appointment-card');
            const bookingNo = card.dataset.bookingNo;
            if (bookingNo) {
                cancelBooking(bookingNo);
            }
        }
    });
});