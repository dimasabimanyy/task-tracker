let timer;
let isRunning = false;
let time = 0; // Time in seconds
let task = ''; // Task description
let taskHistory = []; // Array to store completed tasks and times
let startTime = null; // Start time of the task

const display = document.getElementById("display");
const startStopButton = document.getElementById("startStop");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("task-list");

// Function to format the time
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Function to format a timestamp (e.g., HH:MM:SS)
function formatTimestamp(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Function to toggle timer on and off
function toggleTimer() {
  if (isRunning) {
    // Timer stopped
    clearInterval(timer);
    const endTime = new Date(); // Record end time
    taskHistory.push({ 
      task: task, 
      duration: formatTime(time),
      start: formatTimestamp(startTime),
      end: formatTimestamp(endTime)
    });
    startStopButton.textContent = "mulai";
    taskInput.value = ''; // Clear input field after stop
    taskInput.disabled = false; // Enable input when timer stops
    display.textContent = formatTime(0); // Reset timer display to 0
    updateTaskHistory();
  } else {
    // Timer started
    task = taskInput.value.trim(); // Get task description from input
    if (task === '') {
      alert('Silakan masukkan deskripsi tugas!');
      return;
    }
    taskInput.disabled = true; // Disable input when timer starts
    time = 0; // Reset time to 0 when starting a new task
    startTime = new Date(); // Record start time

    timer = setInterval(() => {
      time++;
      display.textContent = formatTime(time);
    }, 1000);
    startStopButton.textContent = "berhenti";
  }
  isRunning = !isRunning;
}

// Function to update the task history list
function updateTaskHistory() {
  taskList.innerHTML = ''; // Kosongkan elemen histori

  if (taskHistory.length === 0) {
    // Jika histori kosong, tambahkan pesan
    const li = document.createElement("div");
    li.textContent = "Belum ada histori";
    li.className = "empty-history";
    taskList.appendChild(li); // Tambahkan ke daftar
    return; // Hentikan fungsi di sini
  }

  // Jika histori tidak kosong, tambahkan elemen histori
  taskHistory.forEach(taskData => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${taskData.task}</span> - ${taskData.duration} 
    <br><small>Dimulai: ${taskData.start} | Selesai: ${taskData.end}</small>`;
    taskList.appendChild(li);
  });
}

// Adding event listeners
startStopButton.addEventListener('click', toggleTimer);

// Initial setup
updateTaskHistory(); // Panggil fungsi ini saat halaman dimuat
