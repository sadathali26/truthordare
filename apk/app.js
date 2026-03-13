/* =====================================================
   🏴‍☠️ CONVERSATIONAL GAME — State Machine + Smart Inputs
   Flow: question → T/D pill → truth(textarea) / dare(voice|action|text) → response
   ===================================================== */

/* ═══════════ DATA CARDS ═══════════════════════════
   Each card has: q, truth{prompt, inputType}, dare{text, inputType, hint}
   inputType: 'text' | 'voice' | 'action'
═════════════════════════════════════════════════════ */
const CARDS = [
  {
    q: "Tell us about all the crushes you have had so far in your life.",
    truth: { prompt: "Who were they and what made you like them?", inputType: "text" },
    dare: { text: "Sing 15 seconds of a romantic song like you are confessing to your crush.", inputType: "voice", hint: "record → sing → submit" }
  },
  {
    q: "Do you currently have someone special or a relationship?",
    truth: { prompt: "If yes, how did it start? If no, why do you think you don't have one right now?", inputType: "text" },
    dare: { text: "Call a random contact and sing them a song for 20 seconds.", inputType: "voice", hint: "record → call → submit" }
  },
  {
    q: "What is the most awkward moment you have ever experienced in your life?",
    truth: { prompt: "Explain the full story and what you did after that.", inputType: "text" },
    dare: { text: "Sing a dramatic sad breakup song like you're in a movie scene.", inputType: "video", hint: "record → dramatic singing → submit" }
  },
  {
    q: "What character or habit of mine do you dislike the most?",
    truth: { prompt: "Explain honestly why that bothers you.", inputType: "text" },
    dare: { text: "Roast me by turning your roast into a funny rap.", inputType: "video", hint: "record → rap roast → submit" }
  },
  {
    q: "Why did you choose me as your friend in the first place?",
    truth: { prompt: "What made you trust or like me?", inputType: "text" },
    dare: { text: "Sing a friendship song dedicated to me for 20 seconds.", inputType: "voice", hint: "record → sing → submit" }
  },
  {
    q: "Why should you keep me as a friend?",
    truth: { prompt: "Give your honest reasons.", inputType: "text" },
    dare: { text: "Sing your answer like an opera singer.", inputType: "video", hint: "record → opera style → submit" }
  },
  {
    q: "If you rate me as a friend out of 10, what would it be and why?",
    truth: { prompt: "Be honest.", inputType: "text" },
    dare: { text: "Sing the rating like a judge on a singing reality show.", inputType: "voice", hint: "record → judge singing → submit" }
  },
  {
    q: "What was your first impression of me when we met?",
    truth: { prompt: "How did that impression change later?", inputType: "text" },
    dare: { text: "Turn your first impression into a short funny song.", inputType: "voice", hint: "record → sing → submit" }
  },
  {
    q: "What is one funny or strange memory you have with me?",
    truth: { prompt: "Explain what happened.", inputType: "text" },
    dare: { text: "Sing the story like a storytelling ballad.", inputType: "voice", hint: "record → sing → submit" }
  },
  {
    q: "What is something about me that surprised you after we became friends?",
    truth: { prompt: "Was it a good surprise or bad one?", inputType: "text" },
    dare: { text: "Imitate a famous singer and perform 15 seconds of a song.", inputType: "voice", hint: "record → imitate → submit" }
  },
  {
    q: "What childish habit do you still have even now?",
    truth: { prompt: "When do you usually do it?", inputType: "text" },
    dare: { text: "Sing a nursery rhyme like a professional concert performance.", inputType: "video", hint: "record → sing → submit" }
  },
  {
    q: "If you could change one thing about your personality, what would it be?",
    truth: { prompt: "Why would you change that?", inputType: "text" },
    dare: { text: "Freestyle a song about your personality.", inputType: "voice", hint: "record → freestyle → submit" }
  },
  {
    q: "What is the funniest thing someone has ever said to you?",
    truth: { prompt: "Explain the situation.", inputType: "text" },
    dare: { text: "Turn that funny moment into a dramatic musical performance.", inputType: "video", hint: "record → musical style → submit" }
  },
  {
    q: "What is the weirdest habit you have that most people don't know?",
    truth: { prompt: "Explain when you usually do it.", inputType: "text" },
    dare: { text: "Sing while pretending you're performing in front of 50,000 people.", inputType: "video", hint: "record → stage performance → submit" }
  },
  {
    q: "Who do you trust the most in your life right now?",
    truth: { prompt: "Why do you trust that person the most?", inputType: "text" },
    dare: { text: "Sing a thank-you song for that person.", inputType: "voice", hint: "record → sing → submit" }
  },
  {
    q: "What is something about you that people often misunderstand?",
    truth: { prompt: "Why do you think they misunderstand it?", inputType: "text" },
    dare: { text: "Explain it by singing like a sad movie song.", inputType: "voice", hint: "record → sing → submit" }
  },
  {
    q: "What is the biggest misunderstanding someone has had about you?",
    truth: { prompt: "Explain what actually happened.", inputType: "text" },
    dare: { text: "Sing the story like a dramatic movie soundtrack.", inputType: "video", hint: "record → dramatic singing → submit" }
  },
  {
    q: "What is one decision in your life that changed you the most?",
    truth: { prompt: "Explain what happened and how it affected you.", inputType: "text" },
    dare: { text: "Sing a motivational song like you're performing at a concert.", inputType: "voice", hint: "record → sing → submit" }
  },
  {
    q: "What is a dream or goal you really want to achieve in life?",
    truth: { prompt: "What are you doing to reach it?", inputType: "text" },
    dare: { text: "Sing a victory song as if you already achieved your dream.", inputType: "voice", hint: "record → sing → submit" }
  },
  {
    q: "What is something people think about you that is completely wrong?",
    truth: { prompt: "Explain the truth behind it.", inputType: "text" },
    dare: { text: "Turn the truth into a short rap song.", inputType: "voice", hint: "record → rap → submit" }
  }
];


const KUNJOL_REACTIONS = [
  "…okay but hear me out 👀",
  "I plead the fifth 🫣",
  "Definitely not a trap 😤",
  "Define 'embarrassing' 🤔",
  "I am fully innocent 😇",
  "Cannot confirm or deny ☠️",
  "My lawyer said no comment 🧑‍⚖️",
  "Bold of you to assume I remember 🙃",
  "Hypothetically speaking... 👁️",
  "Who told you?? 😤",
  "I don't remember signing up for this 🚪",
  "Room temperature response incoming..."
];

const TRUTH_RESPONSES = [
  { icon: "📝", msg: "The room has noted this. Carry on." },
  { icon: "💀", msg: "Wow. Okay. That's archived forever." },
  { icon: "😂", msg: "WHAT. Okay. Moving on." },
  { icon: "👀", msg: "Sadath has been informed." },
  { icon: "🗃️", msg: "Filed. Under 'Things Kunjol will regret.'" },
  { icon: "🔒", msg: "Stored securely in the vault. (It's not secure.)" }
];

const DARE_RESPONSES = [
  { icon: "🏴‍☠️", msg: "Dare completed. The crew is impressed." },
  { icon: "⚔️", msg: "That took guts. Barely, but still." },
  { icon: "🎖️", msg: "Dare done. Legend status: pending." },
  { icon: "💣", msg: "Detonated. Clean getaway." },
  { icon: "🔥", msg: "The room is on fire. Good." }
];

const FRIENDSHIP_LEVELS = [
  { t: 0, label: "Suspicious 😒" },
  { t: 20, label: "Tolerated 🙃" },
  { t: 40, label: "Acquaintance 🤝" },
  { t: 60, label: "Friend Material 😊" },
  { t: 80, label: "Bestie Candidate 🌟" },
  { t: 100, label: "Certified Bestie ✨" }
];

/* ═══════════ STATE ═══════════════════════════════ */
let currentScene = -1;
let fp = 10;
let shuffledCards = [];
let cardIdx = 0;
let escapeCount = 0;
let konami = [];
let kunjolBuf = '';
let mediaRecorder = null;
let audioChunks = [];
let recordedBlob = null;
let isRecording = false;
let actionDone = false;
/* media capture */
let videoBlob = null;
let videoChunks = [];
let videoRecorder = null;
let isVideoRecording = false;
let cameraStream = null;
let imageBlob = null;

/* ═══════════ UTILS ═══════════════════════════════ */
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rand = (a, b) => Math.random() * (b - a) + a;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ═══════════ SCENE ENGINE ════════════════════════ */
function goScene(n) {
  const prev = document.querySelector('.scene.visible');
  const next = document.getElementById(`scene-${n}`);
  if (!next || n === currentScene) return;

  if (prev) {
    prev.classList.add('exiting');
    setTimeout(() => { prev.classList.remove('visible', 'exiting'); prev.classList.add('hidden'); }, 650);
  }

  next.classList.remove('hidden');
  next.classList.add('entering');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    next.classList.remove('entering');
    next.classList.add('visible');
  }));

  currentScene = n;
  onEnter(n);
}

function onEnter(n) {
  if (n === 1) {
    if (!musicPlaying) toggleMusic();
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      requestFullscreen();
    }
  }
  if (n === 4) revealEvidenceBoard();
  if (n === 6) startGame();
}

/* ═══════════ EVIDENCE BOARD REVEAL ════════════════ */
function revealEvidenceBoard() {
  const cta = document.getElementById('crew-cta');
  if (cta) setTimeout(() => {
    cta.style.opacity = '1';
    cta.style.animation = 'fadeUp .5s cubic-bezier(.34,1.56,.64,1) forwards';
  }, 1400);
}

/* ═══════════ SADATH TRAP ════════════════════════ */
function initSadathTrap() {
  const noBtn = document.getElementById('no-btn');
  const msg = document.getElementById('escape-msg');

  noBtn.addEventListener('mouseenter', flee);
  noBtn.addEventListener('touchstart', flee, { passive: true });

  function flee() {
    if (escapeCount >= 5) {
      noBtn.style.display = 'none';
      msg.textContent = '😂 The button has fled forever. Sadath is eternal.';
      msg.classList.add('show');
      return;
    }
    escapeCount++;
    noBtn.classList.add('noshake');
    setTimeout(() => noBtn.classList.remove('noshake'), 350);

    const wrap = document.getElementById('sadath-wrap');
    const wW = wrap.offsetWidth, nW = noBtn.offsetWidth, nH = noBtn.offsetHeight;
    const newLeft = clamp(rand(0, wW - nW - 4), 0, wW - nW - 4);
    const newTop = clamp(rand(-50, 42), -60, 60);
    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';
    noBtn.style.right = 'auto';
    noBtn.style.position = 'absolute';

    const lines = ['Nope.', 'Nuh-uh.', 'Try harder 😏', 'Ha!', 'Running... 🏃'];
    msg.textContent = lines[escapeCount - 1];
    msg.classList.add('show');
  }
}

function sadathYes() {
  document.getElementById('yes-btn').classList.add('flash');
  fireConfetti(130);
  addFP(25);
  showToast('✅ Correct! The truth prevails. +25 friendship ⭐');
  setTimeout(() => goScene(6), 1400);
}
window.sadathYes = sadathYes;

/* ═══════════ GAME START ════════════════════════ */
function startGame() {
  shuffledCards = shuffle(CARDS);
  cardIdx = 0;
  showPhase('phase-q');
  showCard();
}

function restartGame() {
  goScene(6);
}
window.restartGame = restartGame;

/* ═══════════ SHOW CARD (Phase Q) ════════════════ */
function showCard() {
  const card = shuffledCards[cardIdx];
  if (!card) { endGame(); return; }

  updateProgress();

  const bubbleEl = document.getElementById('q-bubble-text');
  bubbleEl.textContent = '';

  const tdChoice = document.getElementById('td-choice');
  tdChoice.classList.remove('show-fade');
  tdChoice.classList.add('hidden-fade');

  showPhase('phase-q');

  // type in question then reveal T/D pills
  setTimeout(() => {
    typeText(bubbleEl, card.q, 26, () => {
      setTimeout(() => {
        tdChoice.classList.remove('hidden-fade');
        tdChoice.classList.add('show-fade');
      }, 500);
    });
  }, 200);
}

function typeText(el, text, speed, onDone) {
  el.textContent = '';
  let i = 0;
  const go = () => {
    if (i < text.length) { el.textContent += text[i++]; setTimeout(go, speed); }
    else if (onDone) onDone();
  };
  go();
}

/* ═══════════ PICK TRUTH ════════════════════════ */
function pickTruth(btn) {
  if (btn && btn.classList) {
    btn.classList.add('burst-truth');
    setTimeout(() => pickTruthLogic(), 400);
    return;
  }
  pickTruthLogic();
}
window.pickTruth = pickTruth;

function pickTruthLogic() {
  const card = shuffledCards[cardIdx];
  document.getElementById('truth-q-echo').textContent = card.q;
  document.getElementById('truth-sub').textContent = card.truth.prompt;
  document.getElementById('truth-input').value = '';
  document.getElementById('char-count').textContent = '0';
  showPhase('phase-truth');
  setTimeout(() => document.getElementById('truth-input').focus(), 300);
  if (typeof addFP === 'function') addFP(3);
  showToast('🌊 Truth it is. The room is listening.');

  // Clear animation classes
  document.querySelectorAll('.burst-truth').forEach(el => el.classList.remove('burst-truth'));
}

/* ═══════════ PICK DARE ════════════════════════ */
function pickDare(btn) {
  if (btn && btn.classList) {
    btn.classList.add('burst-dare');
    setTimeout(() => pickDareLogic(), 400);
    return;
  }
  pickDareLogic();
}
window.pickDare = pickDare;

function pickDareLogic() {
  const card = shuffledCards[cardIdx];
  const dare = card.dare;

  document.getElementById('dare-box-text').textContent = dare.text;
  buildDareInput(dare);
  showPhase('phase-dare');
  if (typeof addFP === 'function') addFP(3);
  showToast('💣 Dare selected. No backing out.');

  // Clear animation classes
  document.querySelectorAll('.burst-dare').forEach(el => el.classList.remove('burst-dare'));
}

/* Build smart dare input based on dare.inputType */
function buildDareInput(dare) {
  const zone = document.getElementById('dare-input-zone');
  zone.innerHTML = '';
  actionDone = false;
  recordedBlob = null;
  audioChunks = [];
  videoBlob = null;
  imageBlob = null;
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  isVideoRecording = false;

  if (dare.inputType === 'voice') {
    zone.innerHTML = `
      <div class="voice-ui" id="voice-ui">
        <p class="voice-hint">${dare.hint}</p>
        <button class="voice-mic-btn" id="mic-btn" onclick="toggleRecording()">🎙️</button>
        <div class="voice-waveform" id="voice-wave">
          <div class="wave-bar" style="height:8px"></div>
          <div class="wave-bar" style="height:8px"></div>
          <div class="wave-bar" style="height:8px"></div>
          <div class="wave-bar" style="height:8px"></div>
          <div class="wave-bar" style="height:8px"></div>
        </div>
        <p class="voice-status" id="voice-status">tap mic to start recording</p>
        <audio id="audio-playback" controls style="display:none;width:100%;margin-top:6px;border-radius:10px"></audio>
      </div>`;
    // Disable submit until they record
    document.getElementById('dare-submit-btn').disabled = true;
    document.getElementById('dare-submit-btn').style.opacity = '0.4';

  } else if (dare.inputType === 'action') {
    zone.innerHTML = `
      <div class="action-ui">
        <p class="action-hint">${dare.hint}</p>
        <button class="action-check-btn" id="action-check" onclick="markActionDone()">
          <span id="check-icon">⬜</span> Mark as done
        </button>
      </div>`;
    document.getElementById('dare-submit-btn').disabled = true;
    document.getElementById('dare-submit-btn').style.opacity = '0.4';

  } else if (dare.inputType === 'video') {
    zone.innerHTML = `
      <div class="media-dare-ui">
        <p class="voice-hint">${dare.hint}</p>
        <div class="media-option-row" id="media-options">
          <button class="media-option-btn" onclick="startVideoCapture()">🎥 Record Camera</button>
          <button class="media-option-btn" onclick="document.getElementById('video-file-in').click()">📁 From Device</button>
          <input type="file" id="video-file-in" accept="video/*" style="display:none" onchange="handleVideoFile(this)">
        </div>
        <div id="cam-video-ui" style="display:none; flex-direction:column; align-items:center; gap:10px;">
          <video id="cam-preview-v" autoplay muted playsinline class="media-preview-video"></video>
          <button class="voice-mic-btn" id="video-rec-btn" onclick="toggleVideoRec()">⏺️</button>
          <p class="voice-status" id="video-rec-status">tap ⏺️ to start recording</p>
        </div>
        <div id="video-preview-wrap" style="display:none;">
          <video id="video-preview" controls class="media-preview-video"></video>
        </div>
        <p class="upload-status" id="upload-status"></p>
      </div>`;
    document.getElementById('dare-submit-btn').disabled = true;
    document.getElementById('dare-submit-btn').style.opacity = '0.4';

  } else if (dare.inputType === 'image') {
    zone.innerHTML = `
      <div class="media-dare-ui">
        <p class="voice-hint">${dare.hint}</p>
        <div class="media-option-row" id="media-options">
          <button class="media-option-btn" onclick="startImageCapture()">📸 Take Photo</button>
          <button class="media-option-btn" onclick="document.getElementById('image-file-in').click()">🖼️ From Device</button>
          <input type="file" id="image-file-in" accept="image/*" style="display:none" onchange="handleImageFile(this)">
        </div>
        <div id="cam-image-ui" style="display:none; flex-direction:column; align-items:center; gap:10px;">
          <video id="cam-preview-i" autoplay muted playsinline class="media-preview-video"></video>
          <button class="snap-btn" onclick="snapPhoto()">📸 Snap</button>
          <canvas id="snap-canvas" style="display:none"></canvas>
        </div>
        <div id="image-preview-wrap" style="display:none;">
          <img id="image-preview" class="media-preview-img" alt="captured photo">
        </div>
        <p class="upload-status" id="upload-status"></p>
      </div>`;
    document.getElementById('dare-submit-btn').disabled = true;
    document.getElementById('dare-submit-btn').style.opacity = '0.4';

  } else {
    // text
    zone.innerHTML = `
      <textarea
        class="dare-text-input" id="dare-text-input"
        placeholder="describe what you did / write your response..."
        rows="3" maxlength="400"
      ></textarea>`;
    setTimeout(() => { const t = document.getElementById('dare-text-input'); if (t) t.focus(); }, 200);
  }
}

/* Action check */
function markActionDone() {
  actionDone = true;
  const btn = document.getElementById('action-check');
  btn.classList.add('done');
  btn.innerHTML = '<span>✅</span> Done!';
  const submitBtn = document.getElementById('dare-submit-btn');
  submitBtn.disabled = false;
  submitBtn.style.opacity = '1';
  addFP(5);
  showToast('✅ Logged. Respect.');
}
window.markActionDone = markActionDone;

/* ─── Mic helper: robust getUserMedia for audio ─── */
async function requestMicStream() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Your browser does not support microphone access. Try Chrome or Firefox.');
  }
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    // Try again with minimal constraints in case the device is picky
    if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
      return await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
    }
    // Map common errors to friendly messages
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      throw new Error('Microphone permission was denied. Please allow mic access in your browser settings and try again.');
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      throw new Error('No microphone found on this device. Please connect a mic and try again.');
    }
    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      throw new Error('Microphone is in use by another app. Close other apps using the mic and try again.');
    }
    throw new Error('Mic error: ' + (err.message || err.name));
  }
}

/* Voice recording */
async function toggleRecording() {
  if (!isRecording) {
    try {
      const stream = await requestMicStream();
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
      mediaRecorder.onstop = () => {
        recordedBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(recordedBlob);
        const audio = document.getElementById('audio-playback');
        if (audio) { audio.src = url; audio.style.display = 'block'; }
        document.getElementById('voice-status').textContent = 'recording saved — play it back 🎧';
        document.getElementById('voice-wave').classList.remove('playing');
        // enable submit
        const sub = document.getElementById('dare-submit-btn');
        if (sub) { sub.disabled = false; sub.style.opacity = '1'; }
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      isRecording = true;
      const micBtn = document.getElementById('mic-btn');
      if (micBtn) { micBtn.classList.add('recording'); micBtn.textContent = '⏹️'; }
      document.getElementById('voice-status').textContent = 'recording... tap to stop';
      const wave = document.getElementById('voice-wave');
      if (wave) wave.classList.add('playing');
      showToast('🎙️ Recording started...');
    } catch (err) {
      console.error('Mic error:', err);
      const statusEl = document.getElementById('voice-status');
      if (statusEl) statusEl.textContent = '⚠️ Mic blocked — check browser settings';
      showToast('🎙️ ' + (err.message || 'Mic access denied! Allow microphone permission in your browser.'));
    }
  } else {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    isRecording = false;
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) { micBtn.classList.remove('recording'); micBtn.textContent = '🎙️'; }
    addFP(8);
  }
}
window.toggleRecording = toggleRecording;

/* ═══════════ GOOGLE DRIVE UPLOAD ══════════════════ */
const DRIVE_URL = 'https://script.google.com/macros/s/AKfycbw9c3nWK5QsF92xPepp7Z3xpCldKUAfH4v-A3OvADDSE3gS-YMeZyG_tMMVT6JQ2mShgQ/exec';

function uploadToDrive(blob, filename, mimeType) {
  const statusEl = document.getElementById('upload-status');
  if (statusEl) { statusEl.textContent = '☁️ Uploading to Drive...'; statusEl.style.color = 'var(--muted)'; }
  showToast('☁️ Uploading to Drive...', 3000);
  const reader = new FileReader();
  reader.onload = e => {
    const payload = {
      fileName: filename,
      mimeType: mimeType || 'application/octet-stream',
      base64: e.target.result.split(',')[1],
      folderName: 'Kunjol Interrogation Files'
    };
    fetch(DRIVE_URL, { method: 'POST', body: JSON.stringify(payload) })
      .then(r => r.json())
      .then(res => {
        if (res.status === 'success') {
          if (statusEl) { statusEl.textContent = '💖 Saved to my heart!'; statusEl.style.color = 'var(--green)'; }
          showToast('💖 Saved to my heart!', 4000);
        } else {
          if (statusEl) { statusEl.textContent = '❌ Drive error: ' + res.message; statusEl.style.color = 'var(--red)'; }
          showToast('❌ Drive upload failed.');
        }
      })
      .catch(() => {
        if (statusEl) { statusEl.textContent = '❌ Upload failed. Check connection.'; statusEl.style.color = 'var(--red)'; }
        showToast('❌ Drive upload failed. Check connection.');
      });
  };
  reader.readAsDataURL(blob);
}

/* ═══════════ VIDEO CAPTURE ════════════════════════ */
async function startVideoCapture() {
  try {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (audioErr) {
      console.warn("Audio failed, falling back to video only:", audioErr);
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      showToast('Mic access missing/denied! Recording video only.');
    }
    const ui = document.getElementById('cam-video-ui');
    const opts = document.getElementById('media-options');
    if (ui) { ui.style.display = 'flex'; }
    if (opts) opts.style.display = 'none';
    const preview = document.getElementById('cam-preview-v');
    if (preview) preview.srcObject = cameraStream;
  } catch (e) { showToast('Camera access denied! Allow permission.'); }
}
window.startVideoCapture = startVideoCapture;

async function toggleVideoRec() {
  if (!isVideoRecording) {
    videoChunks = [];
    videoRecorder = new MediaRecorder(cameraStream);
    videoRecorder.ondataavailable = e => { if (e.data.size > 0) videoChunks.push(e.data); };
    videoRecorder.onstop = () => {
      videoBlob = new Blob(videoChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(videoBlob);
      const wrap = document.getElementById('video-preview-wrap');
      const vid = document.getElementById('video-preview');
      const camUi = document.getElementById('cam-video-ui');
      if (vid) vid.src = url;
      if (wrap) wrap.style.display = 'block';
      if (camUi) camUi.style.display = 'none';
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
      const sub = document.getElementById('dare-submit-btn');
      if (sub) { sub.disabled = false; sub.style.opacity = '1'; }
      const st = document.getElementById('video-rec-status');
      if (st) st.textContent = 'video saved! ▶️ play it back';
      showToast('🎥 Video captured!');
    };
    videoRecorder.start();
    isVideoRecording = true;
    const btn = document.getElementById('video-rec-btn');
    if (btn) { btn.textContent = '⏹️'; btn.classList.add('recording'); }
    const st = document.getElementById('video-rec-status');
    if (st) st.textContent = 'recording... tap ⏹️ to stop';
    showToast('🔴 Recording...');
  } else {
    if (videoRecorder && videoRecorder.state !== 'inactive') videoRecorder.stop();
    isVideoRecording = false;
    const btn = document.getElementById('video-rec-btn');
    if (btn) { btn.textContent = '⏺️'; btn.classList.remove('recording'); }
  }
}
window.toggleVideoRec = toggleVideoRec;

function handleVideoFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 35 * 1024 * 1024) { showToast('Video too large! Max ~35MB.'); return; }
  videoBlob = file;
  const url = URL.createObjectURL(file);
  const wrap = document.getElementById('video-preview-wrap');
  const vid = document.getElementById('video-preview');
  const opts = document.getElementById('media-options');
  if (vid) vid.src = url;
  if (wrap) wrap.style.display = 'block';
  if (opts) opts.style.display = 'none';
  const sub = document.getElementById('dare-submit-btn');
  if (sub) { sub.disabled = false; sub.style.opacity = '1'; }
  showToast('🎥 Video selected!');
}
window.handleVideoFile = handleVideoFile;

/* ═══════════ IMAGE CAPTURE ════════════════════════ */
async function startImageCapture() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const ui = document.getElementById('cam-image-ui');
    const opts = document.getElementById('media-options');
    if (ui) ui.style.display = 'flex';
    if (opts) opts.style.display = 'none';
    const preview = document.getElementById('cam-preview-i');
    if (preview) preview.srcObject = cameraStream;
  } catch (e) { showToast('Camera access denied! Allow permission.'); }
}
window.startImageCapture = startImageCapture;

function snapPhoto() {
  const video = document.getElementById('cam-preview-i');
  const canvas = document.getElementById('snap-canvas');
  if (!video || !canvas) return;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  canvas.toBlob(blob => {
    imageBlob = blob;
    const url = URL.createObjectURL(blob);
    const wrap = document.getElementById('image-preview-wrap');
    const img = document.getElementById('image-preview');
    const camUi = document.getElementById('cam-image-ui');
    if (img) img.src = url;
    if (wrap) wrap.style.display = 'block';
    if (camUi) camUi.style.display = 'none';
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    const sub = document.getElementById('dare-submit-btn');
    if (sub) { sub.disabled = false; sub.style.opacity = '1'; }
    showToast('📸 Photo snapped!');
  }, 'image/png');
}
window.snapPhoto = snapPhoto;

function handleImageFile(input) {
  const file = input.files[0];
  if (!file) return;
  imageBlob = file;
  const url = URL.createObjectURL(file);
  const wrap = document.getElementById('image-preview-wrap');
  const img = document.getElementById('image-preview');
  const opts = document.getElementById('media-options');
  if (img) img.src = url;
  if (wrap) wrap.style.display = 'block';
  if (opts) opts.style.display = 'none';
  const sub = document.getElementById('dare-submit-btn');
  if (sub) { sub.disabled = false; sub.style.opacity = '1'; }
  showToast('🖼️ Image selected!');
}
window.handleImageFile = handleImageFile;

/* Switch T <-> D */
function switchToDare() {
  const card = shuffledCards[cardIdx];
  document.getElementById('dare-box-text').textContent = card.dare.text;
  buildDareInput(card.dare);
  showPhase('phase-dare');
  showToast('💣 Switched to DARE. Brave.');
}
window.switchToDare = switchToDare;

function switchToTruth() {
  pickTruthLogic();
  showToast('🌊 Switched to TRUTH. Safe choice... this time.');
}
window.switchToTruth = switchToTruth;

/* Submit truth */
function submitTruth() {
  const val = document.getElementById('truth-input').value.trim();
  if (!val && val.length < 2) { showToast('Type something first. We\'re waiting. 👀'); return; }
  const res = pick(TRUTH_RESPONSES);
  showResponse(res.icon, res.msg, val);
  addFP(10);
  fireConfetti(50);
  // Upload Q+A as text file to Drive
  const card = shuffledCards[cardIdx];
  const qLabel = card.q.slice(0, 36).replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
  const content = `TRUTH\n\nQuestion:\n${card.q}\n\nAnswer:\n${val}\n`;
  const blob = new Blob([content], { type: 'text/plain' });
  uploadToDrive(blob, `truth_${qLabel}_${Date.now()}.txt`, 'text/plain');
}
window.submitTruth = submitTruth;

/* Submit dare */
function submitDare() {
  let evidence = '';
  const card = shuffledCards[cardIdx];
  const dareType = card.dare.inputType;
  const qLabel = card.q.slice(0, 36).replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
  const ts = Date.now();

  if (dareType === 'voice' && !recordedBlob) { showToast('Record something first! Mic → speak → stop.'); return; }
  if (dareType === 'video' && !videoBlob) { showToast('Capture or select a video first! 🎥'); return; }
  if (dareType === 'image' && !imageBlob) { showToast('Take or select a photo first! 📸'); return; }
  if (dareType === 'action' && !actionDone) { showToast('Mark it as done first! ⬜ → ✅'); return; }

  if (dareType === 'text') {
    const t = document.getElementById('dare-text-input');
    if (t && t.value.trim().length < 2) { showToast('Write something! Just a few words.'); return; }
    evidence = t ? t.value.trim() : '';
    // Upload dare text response as text file to Drive
    const content = `DARE\n\nDare:\n${card.dare.text}\n\nResponse:\n${evidence}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    uploadToDrive(blob, `dare_text_${qLabel}_${ts}.txt`, 'text/plain');
  }
  if (dareType === 'voice') {
    evidence = '🎙️ Voice note recorded';
    uploadToDrive(recordedBlob, `audio_${qLabel}_${ts}.webm`, 'audio/webm');
  }
  if (dareType === 'video') {
    evidence = '🎥 Video recorded';
    const ext = (videoBlob.type || '').includes('mp4') ? 'mp4' : 'webm';
    uploadToDrive(videoBlob, `video_${qLabel}_${ts}.${ext}`, videoBlob.type || 'video/webm');
    videoBlob = null;
  }
  if (dareType === 'image') {
    evidence = '📸 Photo captured';
    const ext = (imageBlob.type || '').includes('jpeg') || (imageBlob.type || '').includes('jpg') ? 'jpg' : 'png';
    uploadToDrive(imageBlob, `image_${qLabel}_${ts}.${ext}`, imageBlob.type || 'image/png');
    imageBlob = null;
  }
  if (dareType === 'action') evidence = '✅ Dare completed';

  const res = pick(DARE_RESPONSES);
  showResponse(res.icon, res.msg, evidence);
  addFP(15);
  fireConfetti(70);
}
window.submitDare = submitDare;

/* ═══════════ SHOW RESPONSE ══════════════════════ */
function showResponse(icon, msg, answer) {
  document.getElementById('response-icon').textContent = icon;
  document.getElementById('response-msg').textContent = msg;
  const answerEl = document.getElementById('response-answer');
  if (answer && answer.length > 0) {
    answerEl.textContent = `"${answer}"`;
    answerEl.classList.add('has-answer');
  } else {
    answerEl.textContent = '';
    answerEl.classList.remove('has-answer');
  }
  showPhase('phase-response');
}

function nextCard() {
  cardIdx++;
  if (cardIdx >= shuffledCards.length) { endGame(); return; }
  showCard();
}
window.nextCard = nextCard;

/* ═══════════ PHASE SWITCHER ═════════════════════ */
function showPhase(id) {
  document.querySelectorAll('#scene-6 .phase').forEach(el => {
    el.classList.remove('phase');
    el.classList.add('hidden-phase');
  });
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('hidden-phase');
    target.classList.add('phase');
  }
}

/* ═══════════ PROGRESS BAR ═══════════════════════ */
function updateProgress() {
  const pct = (cardIdx / CARDS.length) * 100;

  // Top thin rail
  const topFill = document.getElementById('progress-fill');
  if (topFill) topFill.style.width = pct + '%';
  const ctr = document.getElementById('q-counter');
  if (ctr) ctr.textContent = `${cardIdx + 1} / ${CARDS.length}`;

  // Bottom main tracker
  const bottomFill = document.getElementById('progress-fill-bottom');
  if (bottomFill) bottomFill.style.width = pct + '%';
  const bottomTxt = document.getElementById('progress-level-txt');
  if (bottomTxt) bottomTxt.textContent = Math.round(pct) + '%';
}

/* ═══════════ END GAME ═══════════════════════════ */
function endGame() {
  const pbFill = document.getElementById('progress-fill-bottom');
  if (pbFill) pbFill.style.width = '100%';
  const pbTxt = document.getElementById('progress-level-txt');
  if (pbTxt) pbTxt.textContent = '100%';
  document.getElementById('end-level').textContent = "Interrogation Complete 🏁";
  fireConfetti(150);
  goScene(7); // Go to Feedback Scene
}

/* ═══════════ FEEDBACK SECTION ═══════════════════ */
let fbAudioBlob = null;
let fbVideoBlob = null;
let fbVideoStream = null;
let fbAudioRecorder = null;
let fbVideoRecorder = null;
let isFbAudioRecording = false;
let isFbVideoRecording = false;
let fbAudioChunks = [];
let fbVideoChunks = [];

function toggleFeedbackVoice() {
  document.getElementById('fb-voice-ui').style.display = 'flex';
  document.getElementById('fb-video-ui').style.display = 'none';
  if (fbVideoStream) fbVideoStream.getTracks().forEach(t => t.stop());
}

async function startFeedbackVideo() {
  document.getElementById('fb-video-ui').style.display = 'flex';
  document.getElementById('fb-voice-ui').style.display = 'none';
  try {
    try {
      fbVideoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (audioErr) {
      console.warn("Audio failed, falling back to video only:", audioErr);
      fbVideoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      showToast('Mic access missing/denied! Recording video only.');
    }
    const preview = document.getElementById('fb-cam-preview');
    if (preview) preview.srcObject = fbVideoStream;
  } catch (e) { showToast('Camera access denied! Allow permission.'); }
}

async function toggleFeedbackVoiceRec() {
  if (!isFbAudioRecording) {
    try {
      const stream = await requestMicStream();
      fbAudioRecorder = new MediaRecorder(stream);
      fbAudioChunks = [];
      fbAudioRecorder.ondataavailable = e => { if (e.data.size > 0) fbAudioChunks.push(e.data); };
      fbAudioRecorder.onstop = () => {
        fbAudioBlob = new Blob(fbAudioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(fbAudioBlob);
        const audio = document.getElementById('fb-audio-playback');
        if (audio) { audio.src = url; audio.style.display = 'block'; }
        document.getElementById('fb-voice-status').textContent = 'Recording saved — play it back 🎧';
        document.getElementById('fb-voice-wave').classList.remove('playing');
        stream.getTracks().forEach(t => t.stop());
      };
      fbAudioRecorder.start();
      isFbAudioRecording = true;
      const btn = document.getElementById('fb-mic-btn');
      if (btn) { btn.classList.add('recording'); btn.textContent = '⏹️'; }
      document.getElementById('fb-voice-status').textContent = 'Recording... tap to stop';
      const wave = document.getElementById('fb-voice-wave');
      if (wave) wave.classList.add('playing');
    } catch (err) {
      console.error('Feedback mic error:', err);
      const statusEl = document.getElementById('fb-voice-status');
      if (statusEl) statusEl.textContent = '⚠️ Mic blocked — check browser settings';
      showToast('🎙️ ' + (err.message || 'Mic access denied! Allow microphone permission in your browser.'));
    }
  } else {
    if (fbAudioRecorder && fbAudioRecorder.state !== 'inactive') fbAudioRecorder.stop();
    isFbAudioRecording = false;
    const btn = document.getElementById('fb-mic-btn');
    if (btn) { btn.classList.remove('recording'); btn.textContent = '🎙️'; }
  }
}

async function toggleFeedbackVideoRec() {
  if (!isFbVideoRecording) {
    fbVideoChunks = [];
    fbVideoRecorder = new MediaRecorder(fbVideoStream);
    fbVideoRecorder.ondataavailable = e => { if (e.data.size > 0) fbVideoChunks.push(e.data); };
    fbVideoRecorder.onstop = () => {
      fbVideoBlob = new Blob(fbVideoChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(fbVideoBlob);
      const wrap = document.getElementById('fb-video-wrap');
      const vid = document.getElementById('fb-video-playback');
      const preview = document.getElementById('fb-cam-preview');
      if (vid) vid.src = url;
      if (wrap) wrap.style.display = 'block';
      if (preview) preview.style.display = 'none';
      if (fbVideoStream) fbVideoStream.getTracks().forEach(t => t.stop());
      const st = document.getElementById('fb-video-status');
      if (st) st.textContent = 'Video saved! ▶️ Play it back';
    };
    fbVideoRecorder.start();
    isFbVideoRecording = true;
    const btn = document.getElementById('fb-video-btn');
    if (btn) { btn.textContent = '⏹️'; btn.classList.add('recording'); }
    const st = document.getElementById('fb-video-status');
    if (st) st.textContent = 'Recording... tap ⏹️ to stop';
  } else {
    if (fbVideoRecorder && fbVideoRecorder.state !== 'inactive') fbVideoRecorder.stop();
    isFbVideoRecording = false;
    const btn = document.getElementById('fb-video-btn');
    if (btn) { btn.textContent = '⏺️'; btn.classList.remove('recording'); }
  }
}

function submitFeedback() {
  const textVal = document.getElementById('feedback-text').value.trim();
  const ts = Date.now();
  let uploadedSomething = false;

  if (textVal.length > 0) {
    const content = `FEEDBACK\n\nText:\n${textVal}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    uploadToDrive(blob, `feedback_text_${ts}.txt`, 'text/plain');
    uploadedSomething = true;
  }

  if (fbAudioBlob) {
    uploadToDrive(fbAudioBlob, `feedback_audio_${ts}.webm`, 'audio/webm');
    uploadedSomething = true;
  }

  if (fbVideoBlob) {
    uploadToDrive(fbVideoBlob, `feedback_video_${ts}.webm`, 'video/webm');
    uploadedSomething = true;
  }

  if (!uploadedSomething) {
    showToast('Say something before submitting! ☠️');
    return;
  }

  document.getElementById('fb-submit-btn').innerHTML = '<span>Submitted!</span>';
  document.getElementById('fb-submit-btn').disabled = true;
  showToast('Feedback sent to developer. Proceeding...');
  setTimeout(() => goScene(8), 2000);
}

window.toggleFeedbackVoice = toggleFeedbackVoice;
window.startFeedbackVideo = startFeedbackVideo;
window.toggleFeedbackVoiceRec = toggleFeedbackVoiceRec;
window.toggleFeedbackVideoRec = toggleFeedbackVideoRec;
window.submitFeedback = submitFeedback;

/* ═══════════ FRIENDSHIP ═════════════════════════ */
// Old friendship points removed. Kept for legacy compatibility if needed elsewhere.
function addFP(n) { }

/* ═══════════ CHAR COUNTER ═══════════════════════ */
function initCharCounter() {
  document.addEventListener('input', e => {
    if (e.target.id === 'truth-input') {
      const cc = document.getElementById('char-count');
      if (cc) cc.textContent = e.target.value.length;
    }
  });
}

/* ═══════════ EMBERS ════════════════════════════ */
function initEmbers() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Ember {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = rand(0, canvas.width); this.y = init ? rand(0, canvas.height) : canvas.height + 10;
      this.r = rand(1, 3); this.vx = rand(-.5, .5); this.vy = rand(-1, -.2);
      this.op = rand(.3, .8); this.life = 0; this.max = rand(200, 400);
    }
    update() {
      this.x += this.vx + Math.sin(this.life * .05) * .25; this.y += this.vy;
      this.life++; this.op = (1 - this.life / this.max) * .8;
      if (this.life >= this.max || this.y < -10) this.reset(false);
    }
    draw() {
      const c = Math.random() < .6 ? `rgba(255,${Math.floor(rand(90, 190))},40,` : `rgba(255,${Math.floor(rand(160, 220))},100,`;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = c + this.op + ')'; ctx.shadowColor = c + '0.8)'; ctx.shadowBlur = 5; ctx.fill();
    }
  }

  const embers = Array.from({ length: 70 }, () => new Ember());
  (function tick() { ctx.clearRect(0, 0, canvas.width, canvas.height); embers.forEach(e => { e.update(); e.draw(); }); requestAnimationFrame(tick); })();
}

/* ═══════════ CONFETTI ═══════════════════════════ */
function fireConfetti(count = 70) {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth; canvas.height = innerHeight;
  const COLS = ['#E63946', '#FF8C42', '#FFD166', '#06D6A0', '#8B9FE8', '#FFB7D5', '#fff'];
  const pieces = Array.from({ length: count }, () => ({
    x: canvas.width / 2 + rand(-180, 180), y: canvas.height / 2,
    vx: rand(-7, 7), vy: rand(-12, -3), r: rand(4, 9), color: pick(COLS),
    g: rand(.2, .4), rot: rand(0, Math.PI * 2), rv: rand(-.2, .2), op: 1,
    shape: Math.random() < .5 ? 'rect' : 'circle'
  }));
  let raf;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.rot += p.rv; p.op -= .013;
      if (p.op <= 0) return; alive = true;
      ctx.save(); ctx.globalAlpha = p.op; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
      if (p.shape === 'rect') ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      else { ctx.beginPath(); ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    });
    if (alive) raf = requestAnimationFrame(draw); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}

/* ═══════════ SPARKLES ═══════════════════════════ */
function initSparkles() {
  const canvas = document.getElementById('sparkles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize(); window.addEventListener('resize', resize, { passive: true });

  class Sparkle {
    constructor() { this.reset(); this.y = rand(0, canvas.height); }
    reset() {
      this.x = rand(0, canvas.width);
      this.y = rand(canvas.height, canvas.height + 100);
      this.r = rand(0.5, 2.5);
      this.vy = rand(-1.2, -0.3);
      this.vx = rand(-0.3, 0.3);
      this.op = rand(0.2, 0.9);
      this.blinkSpeed = rand(0.02, 0.05);
      this.life = rand(0, Math.PI * 2);
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.life += this.blinkSpeed;
      if (this.y < -10) this.reset();
    }
    draw() {
      const flicker = Math.abs(Math.sin(this.life)) * this.op;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${flicker})`;
      ctx.shadowColor = 'rgba(255, 203, 164, 0.8)'; // peach glow
      ctx.shadowBlur = 6;
      ctx.fill();
    }
  }

  const sparks = Array.from({ length: 60 }, () => new Sparkle());
  (function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(tick);
  })();
}

/* ═══════════ TOAST ════════════════════════════ */
function showToast(msg, dur = 3000) {
  const box = document.getElementById('toast-box');
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg; box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, dur);
}

/* ═══════════ FLOAT EMOJI ═══════════════════════ */
function floatEmoji(emoji, x, y) {
  const el = document.createElement('div');
  el.className = 'float-emoji'; el.textContent = emoji;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  document.getElementById('float-layer').appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

/* ═══════════ EASTER EGGS ════════════════════════ */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
function initEasterEggs() {
  document.addEventListener('keydown', e => {
    konami.push(e.key); konami = konami.slice(-10);
    if (konami.join(',') === KONAMI.join(',')) { fireConfetti(200); showToast('👑 KUNJOL IS AWESOME! (Also suspect #1.) 💀', 5000); addFP(50); }
    kunjolBuf += e.key.toLowerCase(); kunjolBuf = kunjolBuf.slice(-6);
    if (kunjolBuf === 'kunjol') { fireConfetti(160); showToast('🌀 KUNJOL DETECTED. EVACUATE! 😂', 4000); addFP(15); kunjolBuf = ''; }
  });
}

/* ═══════════ MUSIC TOGGLE ═══════════════════════ */
const MUSIC_TRACKS = [
  'bg-musics/track1.ogg', 'bg-musics/track2.ogg', 'bg-musics/track3.ogg',
  'bg-musics/track4.ogg', 'bg-musics/track5.ogg', 'bg-musics/track6.ogg',
  'bg-musics/track7.ogg', 'bg-musics/track8.ogg', 'bg-musics/track9.ogg',
  'bg-musics/v-track1.ogg', 'bg-musics/v-track2.ogg'
];
let currentMusicIdx = Math.floor(Math.random() * MUSIC_TRACKS.length);
let musicPlaying = false;

function playNextTrack() {
  const bgm = document.getElementById('bg-music');
  if (!bgm) return;
  bgm.src = MUSIC_TRACKS[currentMusicIdx];
  bgm.volume = 0.7;
  bgm.play().then(() => {
    musicPlaying = true;
    const btn = document.getElementById('music-toggle');
    if (btn) { btn.classList.add('playing'); btn.innerHTML = '🔊'; }
  }).catch(err => console.log(err));

  // Pick next random track different from current
  let nextIdx = Math.floor(Math.random() * MUSIC_TRACKS.length);
  while (nextIdx === currentMusicIdx && MUSIC_TRACKS.length > 1) {
    nextIdx = Math.floor(Math.random() * MUSIC_TRACKS.length);
  }
  currentMusicIdx = nextIdx;
}

function toggleMusic() {
  const bgm = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  if (!bgm || !btn) return;

  if (musicPlaying) {
    bgm.pause();
    musicPlaying = false;
    btn.classList.remove('playing');
    btn.innerHTML = '🎵';
  } else {
    // If no source is set, play the first track, else resume
    if (!bgm.getAttribute('src')) {
      playNextTrack();
    } else {
      bgm.volume = 0.7;
      bgm.play().then(() => {
        musicPlaying = true;
        btn.classList.add('playing');
        btn.innerHTML = '🔊';
      }).catch(err => {
        showToast('Click anywhere first to play music!');
      });
    }
  }
}

/* ═══════════ FULLSCREEN TOGGLE ═══════════════════ */
function checkFullscreen() {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;

  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    btn.innerHTML = '⛶'; // Fullscreen icon
    btn.classList.remove('playing');
  } else {
    // We are in fullscreen, revert to music icon
    if (musicPlaying) {
      btn.innerHTML = '🔊';
      btn.classList.add('playing');
    } else {
      btn.innerHTML = '🎵';
      btn.classList.remove('playing');
    }
  }
}

function requestFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => console.log(err));
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen().catch(err => console.log(err));
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen().catch(err => console.log(err));
  }
}

function toggleFullscreenOrMusic() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    requestFullscreen();
  } else {
    toggleMusic();
  }
}

// Hook into the first actual scene click
document.addEventListener('click', (e) => {
  if (currentScene === 0 && (!document.fullscreenElement && !document.webkitFullscreenElement)) {
    requestFullscreen();
  }
}, { once: true });

// Listen for orientation changes to enforce fullscreen on landscape
window.addEventListener("orientationchange", function () {
  if (window.orientation === 90 || window.orientation === -90) {
    requestFullscreen();
  }
}, false);

// Keep our button icon in sync with fullscreen state
document.addEventListener('fullscreenchange', checkFullscreen);
document.addEventListener('webkitfullscreenchange', checkFullscreen);
document.addEventListener('msfullscreenchange', checkFullscreen);

// Initial check
checkFullscreen();
window.toggleMusic = toggleMusic;
window.playNextTrack = playNextTrack;

/* ═══════════ BOOT ════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Start at scene 0
  const s0 = document.getElementById('scene-0');
  s0.classList.remove('hidden'); s0.classList.add('visible');
  currentScene = 0;

  initEmbers();
  initSparkles();
  initSadathTrap();
  initCharCounter();
  initEasterEggs();

  // Audio playlist
  const bgm = document.getElementById('bg-music');
  if (bgm) bgm.addEventListener('ended', playNextTrack);

  // Timed toasts
  setTimeout(() => showToast('👀 Evidence collection has begun...'), 4500);
  setTimeout(() => showToast('⚓ Tip: the NO button is not your friend.'), 15000);

  // Expose globals
  window.goScene = goScene;
});
