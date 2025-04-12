
const calendar = document.getElementById('calendar');
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const noteModal = document.getElementById('noteModal');
const overlay = document.getElementById('overlay');
const noteDate = document.getElementById('noteDate');
const noteText = document.getElementById('noteText');

let currentDate = new Date();
let selectedDate = '';

function initSelectors() {
  let currentYear = currentDate.getFullYear();
  for (let y = currentYear - 10; y <= currentYear + 10; y++) {
    let option = document.createElement('option');
    option.value = y;
    option.text = y;
    if (y === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  months.forEach((m, i) => {
    let option = document.createElement('option');
    option.value = i;
    option.text = m;
    if (i === currentDate.getMonth()) option.selected = true;
    monthSelect.appendChild(option);
  });

  yearSelect.addEventListener('change', buildCalendar);
  monthSelect.addEventListener('change', buildCalendar);
}

function buildCalendar() {
  calendar.innerHTML = '';
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(day => {
    const header = document.createElement('div');
    header.className = 'header';
    header.textContent = day;
    calendar.appendChild(header);
  });

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement('div'));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = `${year}-${month + 1}-${day}`;
    const dayCell = document.createElement('div');
    dayCell.className = 'day';
    dayCell.textContent = day;
    if (localStorage.getItem(`note-${fullDate}`)) {
      dayCell.classList.add('has-note');
    }
    dayCell.onclick = () => openNoteModal(year, month, day);
    calendar.appendChild(dayCell);
  }
}

function openNoteModal(year, month, day) {
  selectedDate = `${year}-${month + 1}-${day}`;
  noteDate.textContent = `Notes for ${selectedDate}`;
  noteText.value = localStorage.getItem(`note-${selectedDate}`) || '';
  noteModal.style.display = 'block';
  overlay.style.display = 'block';
}

function closeModal() {
  noteModal.style.display = 'none';
  overlay.style.display = 'none';
}

function saveNote() {
  if (noteText.value.trim() === '') {
    localStorage.removeItem(`note-${selectedDate}`);
  } else {
    localStorage.setItem(`note-${selectedDate}`, noteText.value);
  }
  closeModal();
  buildCalendar();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

initSelectors();
buildCalendar();
