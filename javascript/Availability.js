// loop through each day checkbox
document.querySelectorAll('.day input[type="checkbox"]').forEach(box => {
  // waits for when a checkbox is checked or unchecked
  box.addEventListener('change', function() {
    const timesDiv = document.getElementById(this.id + '-times');
    timesDiv.innerHTML = ''; // clear old time slots

    // if box is checked show time slot options
    if (this.checked) {
      addTimeSlot(timesDiv); // create first time slot

      // create + button to add more slots
      const addBtn = document.createElement('button');
      addBtn.textContent = '+';
      addBtn.classList.add('add-btn');
      addBtn.onclick = () => addTimeSlot(timesDiv);
      timesDiv.appendChild(addBtn);
    }
  });
});


// add a new time slot row under the selected day
function addTimeSlot(container) {
  const maxSlots = 24; // can't exceed 24 hours
  const currentSlots = container.querySelectorAll('.slot').length;

  if (currentSlots >= maxSlots) {
    alert("You can't add more than 24 time slots in a day.");
    return;
  }

  // create a new div element to hold the time slot
  const slot = document.createElement('div');
  slot.classList.add('slot');

  // create single dropdown for time slot
  const select = document.createElement('select');
  select.classList.add('time-select');

  // create the placeholder for choose a time slot
  const placeholder = document.createElement('option');
  placeholder.textContent = '-- Choose a Time Slot --';
  placeholder.value = '';
  select.appendChild(placeholder);

  // add all 24 hourly time slots in military with standard time
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

  // loop through each time slot and add it as an option in the dropdown
  timeSlots.forEach(([value, text]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  });

  // create delete trash button
  const del = document.createElement('button');
  del.classList.add('del-btn');
  del.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  del.onclick = () => {
    container.removeChild(slot);
    updateDisabledOptions(container);
  };

  // when user selects a slot
  select.addEventListener('change', () => {
    updateDisabledOptions(container);
  });

  // put everything together
  slot.appendChild(select);
  slot.appendChild(del);

  // insert slot before + button
  const addBtn = container.querySelector('.add-btn');
  container.insertBefore(slot, addBtn);

  // refresh gray-out states
  updateDisabledOptions(container);
}


// disables already chosen time slots for that day
function updateDisabledOptions(container) {
  const selectedValues = Array.from(container.querySelectorAll('select'))
    .map(sel => sel.value)
    .filter(v => v !== '');

  container.querySelectorAll('select option').forEach(opt => {
    if (selectedValues.includes(opt.value)) {
      opt.disabled = true; // gray out selected times
    } else {
      opt.disabled = false;
    }
  });
}


// get references to the schedule and buttons
const schedule = document.querySelector('.schedule');
const editBtn = document.querySelector('.edit-button');
const saveBtn = document.querySelector('.save-button');

// start with gray out 
schedule.classList.add('grayed-out');
saveBtn.style.display = 'none'; // hide save button initially

// when user clicks Edit
editBtn.addEventListener('click', () => {
  schedule.classList.remove('grayed-out'); // make it editable
  editBtn.style.display = 'none'; // hide edit
  saveBtn.style.display = 'block'; // show save
});

// when user clicks Save
saveBtn.addEventListener('click', () => {
  schedule.classList.add('grayed-out'); // gray it out again
  saveBtn.style.display = 'none'; // hide save
  editBtn.style.display = 'block'; // show edit again
});
