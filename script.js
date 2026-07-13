const songs = [
  {
    title: "Golden Hour",
    artist: "Mara Quinn",
    duration: "3:42",
    durationSeconds: 222,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Quiet Streets",
    artist: "Elias Reed",
    duration: "4:08",
    durationSeconds: 248,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "After Rain",
    artist: "Nina Vale",
    duration: "3:19",
    durationSeconds: 199,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

const audio = document.getElementById("audio");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const autoplayToggle = document.getElementById("autoplayToggle");
const playlistEl = document.getElementById("playlist");
const coverArt = document.getElementById("coverArt");

let currentIndex = 0;
let isPlaying = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function renderPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const item = document.createElement("li");
    item.className = index === currentIndex ? "active" : "";
    const label = song.duration ? song.duration : "--:--";
    item.innerHTML = `<span>${song.title}</span><span>${label}</span>`;
    item.addEventListener("click", () => {
      loadSong(index);
      playAudio();
    });
    playlistEl.appendChild(item);
  });
}

function updatePlayButton() {
  playBtn.textContent = isPlaying ? "⏸" : "▶";
}

function loadSong(index) {
  currentIndex = index;
  const song = songs[currentIndex];
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverArt.textContent = "♫";
  audio.src = song.src;
  audio.load();
  progress.value = 0;
  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent = song.duration;
  progress.max = song.durationSeconds;
  renderPlaylist();
}

function playAudio() {
  audio.play().then(() => {
    isPlaying = true;
    updatePlayButton();
  }).catch(() => {
    isPlaying = false;
    updatePlayButton();
  });
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
  updatePlayButton();
}

function playNext() {
  const nextIndex = (currentIndex + 1) % songs.length;
  loadSong(nextIndex);
  if (autoplayToggle.checked || isPlaying) {
    playAudio();
  }
}

function playPrevious() {
  const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex);
  if (autoplayToggle.checked || isPlaying) {
    playAudio();
  }
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseAudio();
  } else {
    if (audio.src) {
      playAudio();
    } else {
      loadSong(currentIndex);
      playAudio();
    }
  }
});

prevBtn.addEventListener("click", playPrevious);
nextBtn.addEventListener("click", playNext);

progress.addEventListener("input", () => {
  audio.currentTime = Number(progress.value);
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

autoplayToggle.addEventListener("change", () => {
  if (autoplayToggle.checked && isPlaying) {
    playAudio();
  }
});

audio.addEventListener("loadedmetadata", () => {
  const song = songs[currentIndex];
  totalTimeEl.textContent = song.duration;
  progress.max = song.durationSeconds;
});

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  progress.value = audio.currentTime;
});

audio.addEventListener("play", () => {
  isPlaying = true;
  updatePlayButton();
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  updatePlayButton();
});

audio.addEventListener("ended", () => {
  if (autoplayToggle.checked) {
    playNext();
  } else {
    isPlaying = false;
    updatePlayButton();
  }
});

loadSong(currentIndex);
renderPlaylist();
volume.value = 0.02;
audio.volume = 0.02;
