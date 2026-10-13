/* =========================================================================
   BritSparks - Dedicated Speech Synthesis & Royal Sound Engine (Fixed)
   ========================================================================= */

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioContext = null;
let isSoundOn = true;
let currentTeacherIndex = 0;

function ensureAudio() {
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === 'suspended') audioContext.resume();
}

function playTone(freq, type = 'sine', duration = 0.16, delay = 0, volume = 0.20) {
  if (!isSoundOn) return;
  ensureAudio();
  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime + delay);
    gain.gain.setValueAtTime(0.001, audioContext.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(audioContext.currentTime + delay);
    osc.stop(audioContext.currentTime + delay + duration);
  } catch (e) {}
}

function soundSuccessChime() {
  playTone(523.25, 'triangle', 0.14, 0, 0.22);
  playTone(659.25, 'triangle', 0.14, 0.08, 0.22);
  playTone(783.99, 'triangle', 0.18, 0.16, 0.22);
  playTone(1046.50, 'triangle', 0.35, 0.24, 0.26);
}

function soundGoldUpgradeChime() {
  playTone(587.33, 'triangle', 0.15, 0, 0.22);
  playTone(739.99, 'triangle', 0.15, 0.1, 0.22);
  playTone(880.00, 'triangle', 0.2, 0.2, 0.22);
  playTone(1174.66, 'sine', 0.45, 0.3, 0.3);
}

function soundTapPop() {
  playTone(560 + Math.random() * 120, 'sine', 0.07, 0, 0.16);
}

function soundEncourageTone() {
  playTone(349.23, 'sine', 0.18, 0, 0.18);
  playTone(311.13, 'sine', 0.24, 0.12, 0.18);
}

/* =========================================================================
   Web Speech API - 嚴格過濾發音與性別
   ========================================================================= */
let cachedVoices = [];

function loadVoices() {
  if ('speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

function getOptimalVoice(teacher) {
  if (!cachedVoices.length) loadVoices();
  const voices = cachedVoices;
  if (!voices.length) return null;

  // 強制只找英文語音包，嚴禁 fallback 到中文/廣東話語音包
  const englishVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  const ukVoices = englishVoices.filter(v => v.lang.toLowerCase().includes('gb') || v.lang.toLowerCase().includes('uk'));
  const targetPool = ukVoices.length > 0 ? ukVoices : englishVoices;

  for (const pName of teacher.preferredNames) {
    const found = targetPool.find(v => v.name.toLowerCase().includes(pName.toLowerCase()));
    if (found) return found;
  }

  const maleKeywords = ['male', 'david', 'george', 'daniel', 'oliver', 'mark', 'james', 'arthur', 'rishi'];
  if (teacher.isFemale) {
    const femaleVoice = targetPool.find(v => !maleKeywords.some(m => v.name.toLowerCase().includes(m)));
    if (femaleVoice) return femaleVoice;
  } else {
    const maleVoice = targetPool.find(v => maleKeywords.some(m => v.name.toLowerCase().includes(m)));
    if (maleVoice) return maleVoice;
  }

  return targetPool[0] || voices[0];
}

function speakBritishEnglish(text, onEndCallback = null) {
  if (!isSoundOn || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  // 清除特殊字符，確保朗讀流暢
  const clean = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
  if (!clean) return;

  const teacher = TEACHER_PROFILES[currentTeacherIndex];
  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = 'en-GB'; // 確保為英倫發音
  utter.rate = teacher.rate || 0.76;
  utter.pitch = teacher.pitch || 1.0;

  const matched = getOptimalVoice(teacher);
  if (matched) utter.voice = matched;

  if (onEndCallback) utter.onend = onEndCallback;
  window.speechSynthesis.speak(utter);
}

function speakPraise() {
  const praises = [
    "Splendid! That is correct!",
    "Brilliant work, young scholar!",
    "Marvellous! Spot on!",
    "First class! Jolly good job!",
    "Splendidly done! High five!"
  ];
  speakBritishEnglish(praises[Math.floor(Math.random() * praises.length)]);
}

function speakTryAgain() {
  const encouragements = [
    "Ever so close! Give it another try!",
    "Not quite, darling. Let's check once more!",
    "Have another go, you can do it!"
  ];
  speakBritishEnglish(encouragements[Math.floor(Math.random() * encouragements.length)]);
}
