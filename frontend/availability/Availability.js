//global variables
let CURRENT_USER = null;
let ALL_APPOINTMENTS = []; 

//day-time logic
document.querySelectorAll('.day input[type="checkbox"]').forEach(box => {
  box.addEventListener('change', function() {
    const timesDiv = document.getElementById(this.id + '-times');
    timesDiv.innerHTML = ''; 
    if (this.checked) {
      const addBtn = document.createElement('button');
      addBtn.textContent = '+';
      addBtn.classList.add('add-btn');
      addBtn.onclick = () => addTimeSlot(timesDiv);
      timesDiv.appendChild(addBtn);

      if (timesDiv.querySelectorAll('.slot').length === 0) {
           addTimeSlot(timesDiv);
      }
    }
  });
});

//add time slot frontend
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
    const parentSelectValue = opt.closest('select').value;
    if (opt.value !== '' && opt.value !== parentSelectValue) {
        opt.disabled = selectedValues.includes(opt.value);
    }
  });
}

const schedule = document.querySelector('.schedule');
const editBtn = document.querySelector('.edit-button');
const saveBtn = document.querySelector('.save-button');
schedule.classList.add('grayed-out');
saveBtn.style.display = 'none';

//edit front end
editBtn.addEventListener('click', () => {
  schedule.classList.remove('grayed-out'); 
  editBtn.style.display = 'none'; 
  saveBtn.style.display = 'block'; 
});

//save front end
saveBtn.addEventListener('click', async () => {
    const availabilityData = [];
    
    if (!CURRENT_USER) {
        alert("Error: Not logged in.");
        return;
    }
    
    document.querySelectorAll('.day input[type="checkbox"]:checked').forEach(checkbox => {
        const day = checkbox.id; 
        const timesDiv = document.getElementById(day + '-times');
        timesDiv.querySelectorAll('select.time-select').forEach(select => {
            if (select.value && !select.disabled) {
                availabilityData.push({
                    day: day, 
                    timeSlot: select.value
                });
            }
        });
    });

    try {//api call
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
            loadAvailability();
        } else {
            alert('Error saving: ' + result.error);
        }
    } catch (error) {
        console.error('Failed to save:', error);
        alert('Failed to save availability. Please check your connection and try again.');
    }
});

//loads availability
async function loadAvailability() {
  try {//api call
    const response = await fetch(`/api/availability/mine`);
    
    if (!response.ok) {
        if (response.status === 401) handleLogout(); 
        const err = await response.json();
        console.error('Failed to load availability:', err.message);
        return;
    }
    
    const scheduleData = await response.json();
    if (scheduleData.length === 0) return;
    
    const slotsByDay = {};
    
    scheduleData.forEach(item => {
      const day = item.day.toLowerCase();
      if (!slotsByDay[day]) slotsByDay[day] = [];
      slotsByDay[day].push(item); 
    });
    
    Object.keys(slotsByDay).forEach(day => {
      const dayCheckbox = document.getElementById(day.charAt(0).toUpperCase() + day.slice(1));
      if (!dayCheckbox) return;
      
      dayCheckbox.checked = true;
      dayCheckbox.dispatchEvent(new Event('change')); 
      
      const timesDiv = document.getElementById(dayCheckbox.id + '-times');
      const timeSlots = slotsByDay[day];
      
      const existingSlots = timesDiv.querySelectorAll('.slot');
      existingSlots.forEach(slot => timesDiv.removeChild(slot));
        
      timeSlots.forEach(item => { 
        addTimeSlot(timesDiv); 
        const addBtn = timesDiv.querySelector('.add-btn');
        const lastSlot = addBtn.previousElementSibling;
        
        if (lastSlot) {
          const lastSelect = lastSlot.querySelector('select.time-select');
          lastSelect.value = item.timeSlot;
          if (item.hasBookings) {
            lastSelect.disabled = true;
            const delBtn = lastSlot.querySelector('.del-btn');
            if (delBtn) {
              delBtn.disabled = true;
              delBtn.style.opacity = '0.5';
            }
          }
        }
      });
      updateDisabledOptions(timesDiv);
    });
    
  } catch (error) {
    console.error('Failed to load availability:', error);
  }
}

//modal functions
function updateViewAllButton(totalAppointments) {
    const viewAllBtn = document.getElementById('viewAllBtn');
    const totalCount = document.getElementById('totalCount');
    
    if (!viewAllBtn || !totalCount) return;

    if (totalAppointments > 2) {
        viewAllBtn.classList.add('show');
        viewAllBtn.style.display = 'block';
        totalCount.textContent = totalAppointments;
    } else {
        viewAllBtn.classList.remove('show');
        viewAllBtn.style.display = 'none';
    }
}

//modal functions
function openModal() {
    renderModalAppointments();
    document.getElementById('appointmentsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

//modal functions
function closeModal() {
    document.getElementById('appointmentsModal').classList.remove('active');
    document.body.style.overflow = '';
}

//modal functions
function closeModalOutside(event) {
    if (event.target === document.getElementById('appointmentsModal')) {
        closeModal();
    }
}

//modal functions
function renderModalAppointments() {
    const modalList = document.getElementById('modalAppointmentsList'); 
    const modalCount = document.getElementById('modalCount');
    
    if (!modalList || !modalCount) return;

    modalCount.textContent = ALL_APPOINTMENTS.length;
    modalList.innerHTML = '';
    
    if (ALL_APPOINTMENTS.length === 0) {
        modalList.innerHTML = '<p>No appointments found.</p>';
        return;
    }

    ALL_APPOINTMENTS.forEach(appt => {
        const dt = new Date(appt.TimeSlot);
        const date = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const startTime = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const endDate = new Date(dt.getTime() + 60 * 60 * 1000); 
        const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const timeRange = `${startTime} - ${endTime}`;

        const card = document.createElement('div');
        card.className = 'modal-appointment-card';
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
        modalList.appendChild(card);
    });
}

//load appointments to front end
async function loadTutorAppointments() {
    const listContainer = document.querySelector('.appointments-list');
    listContainer.innerHTML = '<p>Loading appointments...</p>'; 

    try {//api call
        const response = await fetch(`/api/bookings/tutor`);
        if (!response.ok) {
            if (response.status === 401) handleLogout();
            listContainer.innerHTML = '<p>Could not load appointments.</p>';
            return;
        }

        const appointments = await response.json();
        
        ALL_APPOINTMENTS = appointments;
        updateViewAllButton(ALL_APPOINTMENTS.length);

        if (appointments.length === 0) {
            listContainer.innerHTML = `
                <div class="no-appointments">
                    <p>You don't have any upcoming appointments yet.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = ''; 
        
        const appointmentsToShow = ALL_APPOINTMENTS.slice(0, 2); 

        appointmentsToShow.forEach(appt => {
            const dt = new Date(appt.TimeSlot);
            const date = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const startTime = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const endDate = new Date(dt.getTime() + 60 * 60 * 1000); 
            const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const timeRange = `${startTime} - ${endTime}`;

            const card = document.createElement('div');
            card.className = 'appointment-card';
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

//cancel appointment front end
async function cancelBooking(bookingNo) {
    if (!confirm("Are you sure you want to cancel this student's booking?")) {
        return;
    }

    try {//api call
        const response = await fetch(`/api/bookings/${bookingNo}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message);
            loadTutorAppointments(); 
            loadAvailability(); 
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Cancel error:', error);
        alert('An error occurred. Please try again.');
    }
}

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

//initialization
window.addEventListener('DOMContentLoaded', () => {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        alert("You are not logged in.");
        window.location.href = 'Login.html';
        return;
    }
    CURRENT_USER = JSON.parse(userData);

    if (CURRENT_USER.role !== 'Tutor') {
        alert("Access denied. This page is for tutors only.");
        window.location.href = 'Login.html';
        return;
    }

    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    loadAvailability();
    loadTutorAppointments();

    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', openModal);
    }

    const apptListContainer = document.querySelector('.appointments-list');
    if (apptListContainer) {
        apptListContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('cancel-btn')) {
                const card = event.target.closest('.appointment-card');
                const bookingNo = card.dataset.bookingNo;
                if (bookingNo) {
                    cancelBooking(bookingNo);
                }
            }
        });
    }

    const modalListContainer = document.getElementById('modalAppointmentsList');
    if (modalListContainer) {
        modalListContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('cancel-btn')) {
                const card = event.target.closest('.modal-appointment-card');
                const bookingNo = card.dataset.bookingNo;
                if (bookingNo) {
                    closeModal(); 
                    cancelBooking(bookingNo); 
                }
            }
        });
    }

    // Modal close with ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});