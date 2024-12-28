/**
 * @file Timer Application
 * @overview Aplikasi untuk melacak waktu tugas dengan fitur histori.
 *
 * ## Flow Penjelasan Alur
 * 1. **Inisialisasi**:
 *    - Variabel seperti `isRunning`, `time`, dan `taskHistory` disiapkan.
 *    - Elemen DOM (`display`, `startStopButton`, dll.) diambil untuk interaksi.
 * 2. **Fungsi Format**:
 *    - `formatTime(seconds)`: Mengubah detik menjadi format HH:MM:SS.
 *    - `formatTimestamp(date)`: Mengambil waktu sekarang dalam format HH:MM:SS.
 *    - `formatTimeFromHHMMSS(time)`: Mengubah HH:MM:SS menjadi teks deskriptif.
 * 3. **Logika Timer**:
 *    - Ketika tombol ditekan:
 *      - Jika **timer aktif**, waktu berhenti, tugas dicatat, dan input diaktifkan kembali.
 *      - Jika **timer tidak aktif**, waktu dihitung mulai dari 0, tugas dimulai, dan input dinonaktifkan.
 * 4. **Riwayat Tugas**:
 *    - Riwayat diperbarui setiap kali tugas selesai.
 *    - Jika tidak ada tugas, ditampilkan pesan "Belum ada histori".
 * 5. **Interaksi**:
 *    - Tombol mulai/berhenti dikaitkan dengan fungsi `toggleTimer`.
 *    - Riwayat tugas diperbarui saat halaman dimuat.
 */

// Timer ID untuk setInterval, digunakan untuk menghentikan/melanjutkan timer
let timer;

// Menunjukkan apakah timer sedang berjalan atau tidak
let isRunning = false;

// Menyimpan waktu yang sudah berlalu dalam hitungan detik
let time = 0;

// Menyimpan deskripsi tugas saat ini
let task = "";

// Array untuk menyimpan riwayat tugas yang telah selesai
let taskHistory = [
  {
    task: "Belajar javascript dasar", // Nama tugas
    duration: "00:00:07", // Durasi tugas dalam format HH:MM:SS
    start: "15:49:14", // Waktu mulai tugas
    end: "15:49:21", // Waktu selesai tugas
  },
  {
    task: "Fix bug website timer",
    duration: "00:45:38",
    start: "15:49:14",
    end: "15:49:21",
  },
];

// Waktu mulai tugas yang sedang berjalan
let startTime = null;

// Elemen untuk pesan notifikasi
const alertBox = document.querySelector(".alert-box"); 

// Elemen DOM untuk interaksi
const display = document.getElementById("display"); // Elemen untuk menampilkan waktu
const startStopButton = document.getElementById("startStop"); // Tombol untuk mulai/berhenti timer
const taskInput = document.getElementById("taskInput"); // Input untuk deskripsi tugas
const taskList = document.getElementById("task-list"); // Elemen untuk menampilkan riwayat tugas

/**
 * Format waktu dalam hitungan detik menjadi format HH:MM:SS.
 * @param {number} seconds - Waktu dalam detik.
 * @returns {string} Waktu yang sudah diformat.
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600); // Menghitung jumlah jam
  const minutes = Math.floor((seconds % 3600) / 60); // Menghitung jumlah menit
  const remainingSeconds = seconds % 60; // Menghitung sisa detik
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;
}

/**
 * Format tanggal menjadi timestamp dalam format HH:MM:SS.
 * @param {Date} date - Objek tanggal.
 * @returns {string} Timestamp dalam format HH:MM:SS.
 */
function formatTimestamp(date) {
  const hours = String(date.getHours()).padStart(2, "0"); // Jam
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Menit
  const seconds = String(date.getSeconds()).padStart(2, "0"); // Detik
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Tampilkan pesna peringatan di halaman 
 * @param {*} message 
 */
function showAlert(message) {
  alertBox.textContent = message;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 3000); // Hide after 3 seconds
}

/**
 * Mengaktifkan atau menonaktifkan timer.
 * - Saat timer mulai: waktu dihitung dari 0 dan deskripsi tugas disimpan.
 * - Saat timer berhenti: durasi tugas dihitung dan dicatat ke riwayat.
 */
function toggleTimer() {
  if (isRunning) {
    // Timer dihentikan
    clearInterval(timer); // Hentikan interval timer

    const endTime = new Date(); // Catat waktu selesai

    taskHistory.push({
      task: task, // Nama tugas
      duration: formatTime(time), // Durasi tugas
      start: formatTimestamp(startTime), // Waktu mulai
      end: formatTimestamp(endTime), // Waktu selesai
    });

    startStopButton.textContent = "Mulai"; // Ubah teks tombol menjadi "Mulai"
    taskInput.value = ""; // Kosongkan input tugas
    taskInput.disabled = false; // Aktifkan input tugas
    display.textContent = formatTime(0); // Reset tampilan timer ke 0

    updateTaskHistory(); // Perbarui riwayat tugas
  } else {
    // Timer dimulai
    task = taskInput.value.trim(); // Ambil deskripsi tugas dari input

    if (task === "") {
      showAlert("Silakan masukkan deskripsi tugas!");
      return;
    }

    taskInput.disabled = true; // Nonaktifkan input saat timer berjalan
    time = 0; // Reset waktu menjadi 0
    startTime = new Date(); // Catat waktu mulai

    timer = setInterval(() => {
      time++; // Tambahkan waktu setiap detik
      display.textContent = formatTime(time); // Tampilkan waktu yang telah berlalu
    }, 1000);

    startStopButton.textContent = "Berhenti"; // Ubah teks tombol menjadi "Berhenti"
  }

  isRunning = !isRunning; // Toggle status timer
}

/**
 * Format waktu dari format HH:MM:SS menjadi teks yang lebih mudah dibaca.
 * Contoh: "01:30:15" menjadi "1 jam 30 menit 15 detik".
 * @param {string} time - Waktu dalam format HH:MM:SS.
 * @returns {string} Waktu dalam format teks.
 */
function formatTimeFromHHMMSS(time) {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  let result = [];
  if (hours > 0) result.push(`${hours} jam`);
  if (minutes > 0) result.push(`${minutes} menit`);
  if (seconds > 0 || result.length === 0) result.push(`${seconds} detik`);
  return result.join(" ");
}

/**
 * Perbarui elemen riwayat tugas di halaman.
 * - Jika tidak ada tugas di riwayat, tampilkan pesan "Belum ada histori".
 * - Jika ada riwayat, tambahkan elemen untuk setiap tugas.
 */
function updateTaskHistory() {
  taskList.innerHTML = ""; // Kosongkan elemen riwayat supaya tidak duplikat

  if (taskHistory.length === 0) {
    // Jika riwayat kosong
    const li = document.createElement("div");
    li.textContent = "Belum ada histori"; // Pesan jika tidak ada riwayat
    li.className = "empty-history"; // Tambahkan kelas untuk styling

    taskList.appendChild(li); // Tambahkan elemen ke daftar

    return; // Keluar dari fungsi
  }

  // Tambahkan riwayat tugas dari awal ke daftar
  taskHistory.forEach((taskData) => {
    const li = document.createElement("li");
    li.innerHTML = `<h4>${taskData.task}</h4> 
    <small>Durasi: ${formatTimeFromHHMMSS(taskData.duration)}</small>
    <br><small>Dimulai: ${taskData.start} | Selesai: ${taskData.end}</small>`;

    taskList.appendChild(li); // Tambahkan elemen ke daftar
  });
}

// Tambahkan event listener untuk tombol mulai/berhenti
startStopButton.addEventListener("click", toggleTimer);

// Setup awal: perbarui tampilan riwayat tugas saat halaman dimuat
updateTaskHistory();
