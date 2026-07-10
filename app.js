const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const preview = document.getElementById("preview");
const shareBtn = document.getElementById("shareBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const hint = document.getElementById("hint");

let mediaRecorder = null;
let chunks = [];
let audioBlob = null;
let stream = null;
let timerInterval = null;
let elapsedSeconds = 0;

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startTimer() {
  elapsedSeconds = 0;
  timerEl.textContent = formatTime(elapsedSeconds);
  timerInterval = setInterval(() => {
    elapsedSeconds += 1;
    timerEl.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    statusEl.textContent = "Permissão de microfone negada.";
    return;
  }

  chunks = [];
  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : "audio/webm";
  mediaRecorder = new MediaRecorder(stream, { mimeType });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    audioBlob = new Blob(chunks, { type: mimeType });
    preview.src = URL.createObjectURL(audioBlob);
    preview.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");
    resetBtn.classList.remove("hidden");

    const file = new File([audioBlob], "audio.webm", { type: mimeType });
    const shareSupported = navigator.canShare && navigator.canShare({ files: [file] });
    if (shareSupported) {
      shareBtn.classList.remove("hidden");
      statusEl.textContent = "Gravação pronta. Ouça e compartilhe.";
    } else {
      hint.classList.remove("hidden");
      statusEl.textContent = "Gravação pronta. Baixe e anexe no chat.";
    }

    stream.getTracks().forEach((track) => track.stop());
  };

  mediaRecorder.start();
  startTimer();
  statusEl.textContent = "Gravando...";
  recordBtn.disabled = true;
  stopBtn.disabled = false;
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  stopTimer();
  recordBtn.disabled = true;
  stopBtn.disabled = true;
}

async function shareAudio() {
  if (!audioBlob) return;
  const file = new File([audioBlob], `audio-${Date.now()}.webm`, {
    type: audioBlob.type,
  });

  try {
    await navigator.share({ files: [file], title: "Áudio" });
    statusEl.textContent = "Compartilhado.";
  } catch (err) {
    if (err.name !== "AbortError") {
      hint.classList.remove("hidden");
    }
  }
}

function downloadAudio() {
  if (!audioBlob) return;
  const url = URL.createObjectURL(audioBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audio-${Date.now()}.webm`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function resetRecording() {
  audioBlob = null;
  chunks = [];
  preview.src = "";
  preview.classList.add("hidden");
  shareBtn.classList.add("hidden");
  downloadBtn.classList.add("hidden");
  resetBtn.classList.add("hidden");
  hint.classList.add("hidden");
  timerEl.textContent = "00:00";
  statusEl.textContent = "Pronto para gravar";
  recordBtn.disabled = false;
  stopBtn.disabled = true;
}

recordBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
shareBtn.addEventListener("click", shareAudio);
downloadBtn.addEventListener("click", downloadAudio);
resetBtn.addEventListener("click", resetRecording);
