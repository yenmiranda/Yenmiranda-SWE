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
  const slot = document.createElement('div');
  slot.classList.add('slot');

  const start = document.createElement('input');
  start.type = 'time';

  const end = document.createElement('input');
  end.type = 'time';

  const del = document.createElement('button');
  del.classList.add('del-btn');
  del.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  del.onclick = () => container.removeChild(slot);

  slot.appendChild(start);
  slot.appendChild(document.createTextNode(' - '));
  slot.appendChild(end);
  slot.appendChild(del);

  container.insertBefore(slot, container.querySelector('.add-btn'));
}
