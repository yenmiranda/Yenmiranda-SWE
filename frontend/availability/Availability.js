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
    ["00:00-01:00", "00:00 - 01:00 (12:00 AM - 1:00 AM)"],
    ["01:00-02:00", "01:00 - 02:00 (1:00 AM - 2:00 AM)"],
    ["02:00-03:00", "02:00 - 03:00 (2:00 AM - 3:00 AM)"],
    ["03:00-04:00", "03:00 - 04:00 (3:00 AM - 4:00 AM)"],
    ["04:00-05:00", "04:00 - 05:00 (4:00 AM - 5:00 AM)"],
    ["05:00-06:00", "05:00 - 06:00 (5:00 AM - 6:00 AM)"],
    ["06:00-07:00", "06:00 - 07:00 (6:00 AM - 7:00 AM)"],
    ["07:00-08:00", "07:00 - 08:00 (7:00 AM - 8:00 AM)"],
    ["08:00-09:00", "08:00 - 09:00 (8:00 AM - 9:00 AM)"],
    ["09:00-10:00", "09:00 - 10:00 (9:00 AM - 10:00 AM)"],
    ["10:00-11:00", "10:00 - 11:00 (10:00 AM - 11:00 AM)"],
    ["11:00-12:00", "11:00 - 12:00 (11:00 AM - 12:00 PM)"],
    ["12:00-13:00", "12:00 - 13:00 (12:00 PM - 1:00 PM)"],
    ["13:00-14:00", "13:00 - 14:00 (1:00 PM - 2:00 PM)"],
    ["14:00-15:00", "14:00 - 15:00 (2:00 PM - 3:00 PM)"],
    ["15:00-16:00", "15:00 - 16:00 (3:00 PM - 4:00 PM)"],
    ["16:00-17:00", "16:00 - 17:00 (4:00 PM - 5:00 PM)"],
    ["17:00-18:00", "17:00 - 18:00 (5:00 PM - 6:00 PM)"],
    ["18:00-19:00", "18:00 - 19:00 (6:00 PM - 7:00 PM)"],
    ["19:00-20:00", "19:00 - 20:00 (7:00 PM - 8:00 PM)"],
    ["20:00-21:00", "20:00 - 21:00 (8:00 PM - 9:00 PM)"],
    ["21:00-22:00", "21:00 - 22:00 (9:00 PM - 10:00 PM)"],
    ["22:00-23:00", "22:00 - 23:00 (10:00 PM - 11:00 PM)"],
    ["23:00-00:00", "23:00 - 00:00 (11:00 PM - 12:00 AM)"]
  ];

  timeSlots.forEach(([value, text]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  });

  const del = document.createElement('button');
  del.classList.add('del-btn');
  del.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  del.onclick = () => {
    container.removeChild(slot);
    updateDisabledOptions(container);
  };

  select.addEventListener('change', () => {
    updateDisabledOptions(container);
  });

  slot.appendChild(select);
  slot.appendChild(del);

  const addBtn = container.querySelector('.add-btn');
  container.insertBefore(slot, addBtn);

  updateDisabledOptions(container);
}


function updateDisabledOptions(container) {
  const selectedValues = Array.from(container.querySelectorAll('select'))
    .map(sel => sel.value)
    .filter(v => v !== '');

  container.querySelectorAll('select option').forEach(opt => {
    if (selectedValues.includes(opt.value)) {
      opt.disabled = true;
    } else {
      opt.disabled = false;
    }
  });
}


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

saveBtn.addEventListener('click', async () => {
  const availabilityData = [];
  

  const tutorRefNo = "000877048-1"; 
  const classNo = "CS101"; 
  
  document.querySelectorAll('.day input[type="checkbox"]:checked').forEach(checkbox => {
    const day = checkbox.id; 
    const timesDiv = document.getElementById(day + '-times');
    
    timesDiv.querySelectorAll('select.time-select').forEach(select => {
      if (select.value) {
        availabilityData.push({
          day: day,
          timeSlot: select.value, 
          tutorRefNo: tutorRefNo,
          classNo: classNo
        });
      }
    });
  });

  if (availabilityData.length === 0) {
    alert('Please select at least one time slot before saving.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/availability/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify(availabilityData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert('Availability saved successfully for the next 12 weeks!');
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


async function loadAvailability() {
  const tutorRefNo = "000877048-1"; 
  
  try {
    const response = await fetch(`http://localhost:3000/api/availability/mine?tutorRefNo=${tutorRefNo}`, {
      credentials: 'include' 
    });
    
    if (!response.ok) {
      console.error('Failed to load availability');
      return;
    }
    
    const scheduleData = await response.json();
    
    if (scheduleData.length === 0) {
      console.log('No existing availability found');
      return;
    }
    
    const slotsByDay = {};
    scheduleData.forEach(item => {
      if (!slotsByDay[item.day]) {
        slotsByDay[item.day] = [];
      }
      slotsByDay[item.day].push(item.timeSlot);
    });
    
    Object.keys(slotsByDay).forEach(day => {
      const dayCheckbox = document.getElementById(day);
      
      if (!dayCheckbox) {
        console.warn(`Checkbox for ${day} not found`);
        return;
      }
      
      dayCheckbox.checked = true;
      
      dayCheckbox.dispatchEvent(new Event('change'));
      
      setTimeout(() => {
        const timesDiv = document.getElementById(day + '-times');
        const timeSlots = slotsByDay[day];
        
        const firstSlot = timesDiv.querySelector('.slot');
        if (firstSlot) {
          timesDiv.removeChild(firstSlot);
        }
        
        timeSlots.forEach(timeSlot => {
          addTimeSlot(timesDiv);
          
          const selects = timesDiv.querySelectorAll('select.time-select');
          const lastSelect = selects[selects.length - 1];
          if (lastSelect) {
            lastSelect.value = timeSlot;
          }
        });
        
        updateDisabledOptions(timesDiv);
      }, 100);
    });
    
  } catch (error) {
    console.error('Failed to load availability:', error);
  }
}

window.addEventListener('DOMContentLoaded', loadAvailability);
