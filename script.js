const audioPlayer = document.getElementById("player");
const audioSource = document.getElementById("audioSource");

const volumeSlider = document.getElementById("volumeControl");
const toggleBtn = document.getElementById("toggleBtn");
const toggleIcon = toggleBtn.querySelector(".bi");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const trackInfo = document.getElementById('trackInfo');
const trackTitle = document.getElementById('trackTitle');

/* Tracks list */
const playlist = [
    "bg_audio/LØST SIGNAL, Mayvee, PHURS - Rescue Me.mp3",
    "bg_audio/Daytune feat. Alosa & Mayvee - So High.mp3",
    "bg_audio/Deep Mage, May Zoean, PHURS - Blue.mp3"
];

let currentTrack = 0;
let isRepeat = false;
let trackInfoTimeout = null;

function loadTrack(index) {
  audioSource.src = playlist[index];
  audioPlayer.load();
  audioPlayer.play();
}

/* Volume/Volume slider */
audioPlayer.volume = parseFloat(volumeSlider.value);

volumeSlider.addEventListener("input", () => {
  audioPlayer.volume = parseFloat(volumeSlider.value);
  updateSliderBackground(volumeSlider);
});

function updateSliderBackground(el) {
  const value = parseFloat(el.value);
  const min = parseFloat(el.min);
  const max = parseFloat(el.max);
  const percentage = ((value - min) / (max - min)) * 100;
  el.style.background = `linear-gradient(to right, rgb(255, 141, 160) ${percentage}%, #555 ${percentage}%)`;
}
updateSliderBackground(volumeSlider);

/* UI play/pause */
function setPlayingUI(isPlaying) {
  if (isPlaying) {
    toggleIcon.classList.remove("bi-play-fill");
    toggleIcon.classList.add("bi-pause-fill");
    toggleBtn.setAttribute("data-label", "Пауза");
  } else {
    toggleIcon.classList.remove("bi-pause-fill");
    toggleIcon.classList.add("bi-play-fill");
    toggleBtn.setAttribute("data-label", "Слушать");
  }
}

// Play/Pause/Click events
toggleBtn.addEventListener("click", () => {
  if (audioPlayer.paused) audioPlayer.play();
  else audioPlayer.pause();
});

audioPlayer.addEventListener("play", () => setPlayingUI(true));
audioPlayer.addEventListener("pause", () => setPlayingUI(false));

audioPlayer.addEventListener('play', () => {  
    setPlayingUI(true);  
    updateAndShowCurrentTrack();
});

// Next / Previous track
nextBtn.addEventListener('click', () => {  
    currentTrack++;  
    if (currentTrack >= playlist.length) currentTrack = 0;  
    loadTrack(currentTrack);  
    updateAndShowCurrentTrack();
});

prevBtn.addEventListener('click', () => {  
    currentTrack--;  
    if (currentTrack < 0) currentTrack = playlist.length - 1;  
    loadTrack(currentTrack);  
    updateAndShowCurrentTrack();
});

// Next track when current ended
audioPlayer.addEventListener("ended", () => {
  nextBtn.click();
});

// Track info display
function getFileNameFromPath(path) {
  try {
    const parts = path.split('/').pop().split('\\\\').pop();
    return parts.replace(/\.[^/.]+$/, '');
  } catch (e) {
    return path;
  }
}

function showTrackInfo(text, duration = 5000) {
  if (!trackInfo) return;
  trackTitle.textContent = text;
  trackInfo.hidden = false;
  trackInfo.classList.add('visible');
  if (trackInfoTimeout) clearTimeout(trackInfoTimeout);
  trackInfoTimeout = setTimeout(() => {
    trackInfo.classList.remove('visible');
    setTimeout(() => { if (trackInfo) trackInfo.hidden = true; }, 500);
  }, duration);
}

function updateAndShowCurrentTrack() {
  const name = getFileNameFromPath(playlist[currentTrack]);
  showTrackInfo(name);
}
