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


// create dropdown list for time selection
function createTimeSelect(placeholderText) {
  const select = document.createElement('select');
  select.classList.add('time-select');

  // add first placeholder option
  const placeholder = document.createElement('option');
  placeholder.textContent = `-- ${placeholderText} --`;
  placeholder.value = '';
  select.appendChild(placeholder);

  // all possible hourly times
  const times = [
    "12:00 AM","1:00 AM","2:00 AM","3:00 AM","4:00 AM","5:00 AM",
    "6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM",
    "12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM",
    "6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM"
  ];

  // add each time as an option in the dropdown
  times.forEach(time => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    select.appendChild(option);
  });

  return select;
}


// add a new time slot row under the selected day
function addTimeSlot(container) {
  const slot = document.createElement('div');
  slot.classList.add('slot');

  // create dropdowns for start and end time
  const start = createTimeSelect('Select Start Time');
  const end = createTimeSelect('Select End Time');

  // create delete trash button
  const del = document.createElement('button');
  del.classList.add('del-btn');
  del.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  del.onclick = () => container.removeChild(slot);

  // put everything together in the slot
  slot.appendChild(start);
  slot.appendChild(document.createTextNode(' - '));
  slot.appendChild(end);
  slot.appendChild(del);

  // insert slot before the + button
  container.insertBefore(slot, container.querySelector('.add-btn'));
}
