/* =========================================================================
   BritSparks - Core Game Engine & Expanded Mission Handlers
   ========================================================================= */

let currentGrade = 'reception';
let currentMode = 'rec_phonics';
let targetAnswer = null;
let activeQuestionPrompt = '';
let isInputLocked = false;

let totalQuestions = 0;
let correctCount = 0;
let currentStars = 0;

// 12 個皇家勳章進化狀態
const honoursTierMap = {
  h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0,
  h7: 0, h8: 0, h9: 0, h10: 0, h11: 0, h12: 0
};
let activeShowcaseBadge = null;
let currentPhonicsTarget = null;

function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}
function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// 首頁年級卡片
function renderCurriculumCards() {
  const container = document.getElementById('gradeCardsContainer');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(UK_CURRICULUM).forEach(key => {
    const item = UK_CURRICULUM[key];
    const card = document.createElement('div');
    card.className = 'royal-card p-4 flex flex-col justify-between hover:scale-102 transition-all border-t-4 border-amber-400';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-3xl">${item.icon}</span>
          <span class="bg-amber-400/20 text-amber-300 text-[11px] font-black px-2 py-0.5 rounded-full border border-amber-400/40">${item.ageRange}</span>
        </div>
        <h3 class="text-lg font-black text-white font-serif mt-1">${item.title}</h3>
        <p class="text-xs font-bold text-slate-300 mt-0.5">${item.desc}</p>
        <div class="mt-2 text-[11px] font-bold text-amber-400 bg-slate-900/60 px-2 py-1 rounded-lg">
          🏰 ${item.topics.length} Royal Missions Included
        </div>
      </div>
      <button type="button" onclick="selectGrade('${key}')" class="bouncy-btn royal-gold-btn mt-3 w-full text-slate-950 font-black text-xs sm:text-sm py-2 rounded-xl border-b-4 border-amber-700">
        Enter Realm 👉
      </button>
    `;
    container.appendChild(card);
  });
}

window.selectGrade = function(gradeKey) {
  soundTapPop();
  currentGrade = gradeKey;
  const cfg = UK_CURRICULUM[gradeKey];
  safeSetText('activeGradePillIcon', cfg.icon);
  safeSetText('activeGradePillText', cfg.title.split(' ')[0]);
  renderGradeLobby();
};

function renderGradeLobby() {
  const cfg = UK_CURRICULUM[currentGrade];
  safeSetText('lobbyBadge', `${cfg.icon} ${cfg.title}`);
  safeSetText('lobbyTitle', `${cfg.title} Missions`);
  safeSetText('lobbySubtitle', cfg.desc);

  const container = document.getElementById('lobbyCardsContainer');
  container.innerHTML = '';
  cfg.topics.forEach(topic => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'bouncy-btn royal-card p-4 flex flex-col items-center text-center cursor-pointer hover:border-amber-400';
    card.innerHTML = `
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr ${topic.color} text-white flex items-center justify-center text-3xl mb-2.5 shadow-md">
        ${topic.icon}
      </div>
      <h4 class="text-base font-black text-white font-serif">${topic.title}</h4>
      <span class="text-[11px] font-bold text-slate-300 mt-0.5">${topic.subtitle}</span>
      <span class="text-xs font-black text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full mt-2 font-serif">Commence ▶</span>
    `;
    card.onclick = () => launchTopic(topic.id);
    container.appendChild(card);
  });

  document.getElementById('curriculumPortalScreen').style.display = 'none';
  document.getElementById('gamePlayScreen').style.display = 'none';
  document.getElementById('gradeLobbyScreen').style.display = 'flex';
}

window.launchTopic = function(topicId) {
  soundTapPop();
  currentMode = topicId;
  document.getElementById('gradeLobbyScreen').style.display = 'none';
  document.getElementById('gamePlayScreen').style.display = 'flex';
  safeSetText('navBackLabel', "Missions");
  safeSetText('navBackIcon', "🔙");
  generateQuestion();
};

window.handleNavigationBack = function() {
  soundTapPop();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  const play = document.getElementById('gamePlayScreen');
  const lobby = document.getElementById('gradeLobbyScreen');
  const portal = document.getElementById('curriculumPortalScreen');

  if (play.style.display !== 'none') {
    play.style.display = 'none';
    lobby.style.display = 'flex';
  } else if (lobby.style.display !== 'none') {
    lobby.style.display = 'none';
    portal.style.display = 'flex';
    safeSetText('navBackLabel', "Curriculum");
    safeSetText('navBackIcon', "🏛️");
  }
};

function hideAllStages() {
  ['stagePhonics', 'stageEarlyCount', 'stageTenFrame', 'stageUkCoins', 'stageTimesTables', 'stageUkMarket'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('numberOptionsRow').innerHTML = '';
  isInputLocked = false;
}

function generateQuestion() {
  hideAllStages();

  switch (currentMode) {
    case 'toddler_sounds':
    case 'nursery_phonics':
    case 'rec_phonics':
    case 'y1_digraphs':
    case 'y2_phonics':
      renderPhonicsMission();
      break;
    case 'toddler_count':
    case 'nursery_count':
      renderEarlyCountMission();
      break;
    case 'toddler_compare':
    case 'rec_compare':
      renderCompareMission();
      break;
    case 'nursery_shapes':
      renderShapesMission();
      break;
    case 'rec_bonds':
      renderTenFrameMission();
      break;
    case 'rec_sub':
      renderSubtractionMission();
      break;
    case 'y1_coins':
    case 'y3_coins':
      renderUkCoinsMission();
      break;
    case 'y1_math20':
      renderMath20Mission();
      break;
    case 'y1_clock':
    case 'y4_clock':
      renderClockMission();
      break;
    case 'y2_times':
    case 'y3_times':
    case 'y4_tables':
    case 'y5_tables':
      renderTimesTableMission();
      break;
    case 'y2_place':
      renderPlaceValueMission();
      break;
    case 'y2_mental':
    case 'y4_mental':
      renderMentalSpeedMission();
      break;
    case 'y3_market':
    case 'y5_market':
      renderUkMarketMission();
      break;
    case 'y3_listening':
      renderListeningStoryMission();
      break;
    case 'y5_primes':
      renderPrimeMission();
      break;
    default:
      renderPhonicsMission();
  }

  speakBritishEnglish(activeQuestionPrompt);
}

/* 關卡渲染實作 */
function renderPhonicsMission() {
  const stage = document.getElementById('stagePhonics');
  stage.style.display = 'flex';

  currentPhonicsTarget = getRandomItem(PHONICS_DATA);
  targetAnswer = currentPhonicsTarget.sound;

  safeSetText('missionBadgeText', `${currentPhonicsTarget.phase}: Sound Blending`);
  safeSetText('promptTitle', `Identify the Sound`);
  safeSetText('promptSubtitle', `Can you find the sound /${currentPhonicsTarget.sound}/?`);
  activeQuestionPrompt = `Can you find the phonetic sound: ${currentPhonicsTarget.sound}, as in ${currentPhonicsTarget.example}?`;

  safeSetText('phonicsTargetDisplay', currentPhonicsTarget.icon);
  safeSetText('phonicsHintWord', `Word: ${currentPhonicsTarget.example}`);

  const choices = [targetAnswer];
  while (choices.length < 4) {
    const cand = getRandomItem(PHONICS_DATA).sound;
    if (!choices.includes(cand)) choices.push(cand);
  }
  renderChoiceButtons(choices.sort());
}

window.speakTargetPhonicsSound = function() {
  soundTapPop();
  if (currentPhonicsTarget) {
    speakBritishEnglish(`The sound is: ${currentPhonicsTarget.sound}, as in ${currentPhonicsTarget.example}!`);
  }
};

function renderEarlyCountMission() {
  const stage = document.getElementById('stageEarlyCount');
  stage.style.display = 'flex';

  const max = currentMode === 'toddler_count' ? 3 : 5;
  const count = getRandomInt(1, max);
  targetAnswer = count;
  const mascot = getRandomItem(ROYAL_MASCOTS);

  safeSetText('missionBadgeText', `EYFS Counting Quest`);
  safeSetText('promptTitle', `Count the ${mascot.name}s!`);
  safeSetText('promptSubtitle', `How many are standing in the palace grounds?`);
  activeQuestionPrompt = `How many ${mascot.name}s are there? Let us count them!`;

  const grid = document.getElementById('earlyCountGrid');
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const item = document.createElement('div');
    item.className = 'text-6xl p-2 cursor-pointer pop-in';
    item.innerText = mascot.emoji;
    item.onclick = () => { soundTapPop(); speakBritishEnglish(String(i + 1)); };
    grid.appendChild(item);
  }

  renderChoiceButtons([1, 2, 3, 4, 5].slice(0, 4));
}

function renderCompareMission() {
  const stage = document.getElementById('stageEarlyCount');
  stage.style.display = 'flex';
  const mascot = getRandomItem(ROYAL_MASCOTS);

  const leftCount = getRandomInt(2, 6);
  let rightCount = getRandomInt(2, 6);
  while (rightCount === leftCount) rightCount = getRandomInt(2, 6);

  targetAnswer = leftCount > rightCount ? 'Left' : 'Right';
  safeSetText('missionBadgeText', `Quantity Comparison`);
  safeSetText('promptTitle', `Which Group has MORE?`);
  safeSetText('promptSubtitle', `Compare Left vs Right!`);
  activeQuestionPrompt = `Which group has more royal mascots? Left or Right?`;

  const grid = document.getElementById('earlyCountGrid');
  grid.innerHTML = `
    <div class="flex items-center gap-6">
      <div class="p-3 bg-slate-800 rounded-2xl border border-amber-400 text-center">
        <div class="text-3xl">${mascot.emoji.repeat(leftCount)}</div>
        <span class="text-xs font-black text-amber-300 mt-1 block">Left (${leftCount})</span>
      </div>
      <span class="text-2xl font-black text-amber-400">VS</span>
      <div class="p-3 bg-slate-800 rounded-2xl border border-amber-400 text-center">
        <div class="text-3xl">${mascot.emoji.repeat(rightCount)}</div>
        <span class="text-xs font-black text-amber-300 mt-1 block">Right (${rightCount})</span>
      </div>
    </div>
  `;

  renderChoiceButtons(['Left', 'Right']);
}

function renderShapesMission() {
  const stage = document.getElementById('stageEarlyCount');
  stage.style.display = 'flex';
  const shapes = [
    { name: 'Circle', icon: '🔴' },
    { name: 'Square', icon: '🟦' },
    { name: 'Triangle', icon: '🔺' },
    { name: 'Star', icon: '⭐' }
  ];
  const target = getRandomItem(shapes);
  targetAnswer = target.name;

  safeSetText('missionBadgeText', `Nursery 2D Shapes`);
  safeSetText('promptTitle', `Identify the Shape`);
  safeSetText('promptSubtitle', `Which shape is shown here?`);
  activeQuestionPrompt = `What shape is this? Is it a ${target.name}?`;

  const grid = document.getElementById('earlyCountGrid');
  grid.innerHTML = `<div class="text-7xl p-4">${target.icon}</div>`;
  renderChoiceButtons(shapes.map(s => s.name));
}

function renderTenFrameMission() {
  const stage = document.getElementById('stageTenFrame');
  stage.style.display = 'flex';

  const given = getRandomInt(1, 9);
  targetAnswer = 10 - given;

  safeSetText('missionBadgeText', `Ten-Frame: Bonds to 10`);
  safeSetText('promptTitle', `Complete Number 10`);
  safeSetText('promptSubtitle', `${given} plus what makes 10?`);
  activeQuestionPrompt = `${given} plus what makes 10? Fill the royal ten frame!`;

  safeSetText('tenFrameGiven', given);
  const grid = document.getElementById('tenFrameGrid');
  grid.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const cell = document.createElement('div');
    cell.className = 'w-10 h-10 rounded-xl flex items-center justify-center border-2 border-amber-400/60 bg-slate-800';
    cell.innerHTML = i < given ? '<span class="text-amber-400 font-black text-2xl">●</span>' : '<span class="text-slate-600">○</span>';
    grid.appendChild(cell);
  }

  renderChoiceButtons([targetAnswer, (targetAnswer+2)%9+1, (targetAnswer+4)%9+1, (targetAnswer+5)%9+1].sort((a,b)=>a-b));
}

function renderSubtractionMission() {
  const stage = document.getElementById('stageTimesTables');
  stage.style.display = 'flex';
  const a = getRandomInt(5, 10);
  const b = getRandomInt(1, 4);
  targetAnswer = a - b;

  safeSetText('missionBadgeText', `Take Away Subtraction`);
  safeSetText('promptTitle', `Royal Take Away`);
  safeSetText('promptSubtitle', `${a} minus ${b} equals what?`);
  activeQuestionPrompt = `What is ${a} take away ${b}?`;

  safeSetText('timesTableA', a);
  safeSetText('timesTableB', b);

  renderChoiceButtons([targetAnswer, targetAnswer + 1, Math.max(1, targetAnswer - 2), targetAnswer + 3].sort((x,y)=>x-y));
}

function renderUkCoinsMission() {
  const stage = document.getElementById('stageUkCoins');
  stage.style.display = 'flex';

  const coin = getRandomItem(UK_COINS);
  targetAnswer = coin.name;

  safeSetText('missionBadgeText', `British Sovereign Coins`);
  safeSetText('promptTitle', `Name the Sovereign Coin`);
  safeSetText('promptSubtitle', `Which coin is presented in the royal vault?`);
  activeQuestionPrompt = `Look at the coin. Is it ${coin.spoken}?`;

  document.getElementById('ukCoinTargetBox').innerHTML = `
    <div class="uk-coin ${coin.css}">
      <span class="text-base">${coin.label}</span>
    </div>
  `;

  const choices = [targetAnswer];
  while (choices.length < 4) {
    const cand = getRandomItem(UK_COINS).name;
    if (!choices.includes(cand)) choices.push(cand);
  }
  renderChoiceButtons(choices.sort());
}

function renderMath20Mission() {
  const stage = document.getElementById('stageTimesTables');
  stage.style.display = 'flex';
  const a = getRandomInt(6, 12);
  const b = getRandomInt(3, 7);
  targetAnswer = a + b;

  safeSetText('missionBadgeText', `Year 1: Addition to 20`);
  safeSetText('promptTitle', `Calculate Sum to 20`);
  safeSetText('promptSubtitle', `${a} + ${b} = ?`);
  activeQuestionPrompt = `What is ${a} plus ${b}?`;

  safeSetText('timesTableA', a);
  safeSetText('timesTableB', b);

  renderChoiceButtons([targetAnswer, targetAnswer - 1, targetAnswer + 2, targetAnswer + 3].sort((x,y)=>x-y));
}

function renderClockMission() {
  const stage = document.getElementById('stageEarlyCount');
  stage.style.display = 'flex';
  const isHalf = Math.random() > 0.5;
  const hour = getRandomInt(1, 12);
  targetAnswer = isHalf ? `${hour}:30` : `${hour}:00`;

  safeSetText('missionBadgeText', `Telling the Time`);
  safeSetText('promptTitle', `Look at the London Clock!`);
  safeSetText('promptSubtitle', `What time does the clock say?`);
  activeQuestionPrompt = `What time is it on the London clock face?`;

  const grid = document.getElementById('earlyCountGrid');
  grid.innerHTML = `
    <div class="p-4 bg-slate-900 border-2 border-amber-400 rounded-3xl text-center">
      <div class="text-5xl">🕰️</div>
      <span class="text-sm font-black text-amber-300 mt-2 block">${isHalf ? `Half past ${hour}` : `${hour} o'clock`}</span>
    </div>
  `;

  const choices = [targetAnswer, `${(hour%12)+1}:00`, `${hour}:15`, `${(hour%12)+1}:30`];
  renderChoiceButtons(choices.sort());
}

function renderPlaceValueMission() {
  const stage = document.getElementById('stageEarlyCount');
  stage.style.display = 'flex';
  const tens = getRandomInt(1, 5);
  const ones = getRandomInt(1, 9);
  targetAnswer = tens * 10 + ones;

  safeSetText('missionBadgeText', `Tens and Ones Place Value`);
  safeSetText('promptTitle', `Count the Royal Jewels`);
  safeSetText('promptSubtitle', `${tens} Tens and ${ones} Ones = ?`);
  activeQuestionPrompt = `What number is formed by ${tens} tens and ${ones} ones?`;

  const grid = document.getElementById('earlyCountGrid');
  grid.innerHTML = `
    <div class="flex items-center gap-4 text-center">
      <div class="p-3 bg-slate-800 border border-amber-400 rounded-2xl">
        <span class="text-xs font-bold text-amber-300 block">Tens (10s)</span>
        <div class="text-2xl mt-1">${'💎 '.repeat(tens)}</div>
      </div>
      <div class="p-3 bg-slate-800 border border-amber-400 rounded-2xl">
        <span class="text-xs font-bold text-sky-300 block">Ones (1s)</span>
        <div class="text-2xl mt-1">${'⭐ '.repeat(ones)}</div>
      </div>
    </div>
  `;

  renderChoiceButtons([targetAnswer, targetAnswer + 10, targetAnswer - 5, targetAnswer + 2].sort((x,y)=>x-y));
}

function renderMentalSpeedMission() {
  const stage = document.getElementById('stageTimesTables');
  stage.style.display = 'flex';
  const a = getRandomInt(2, 6) * 10;
  const b = getRandomInt(1, 4) * 10;
  targetAnswer = a + b;

  safeSetText('missionBadgeText', `Mental Speed Rocket`);
  safeSetText('promptTitle', `Rapid Tens Addition`);
  safeSetText('promptSubtitle', `${a} + ${b} = ?`);
  activeQuestionPrompt = `Calculate in your head: what is ${a} plus ${b}?`;

  safeSetText('timesTableA', a);
  safeSetText('timesTableB', b);

  renderChoiceButtons([targetAnswer, targetAnswer - 10, targetAnswer + 10, targetAnswer + 20].sort((x,y)=>x-y));
}

function renderListeningStoryMission() {
  const stage = document.getElementById('stageEarlyCount');
  stage.style.display = 'flex';
  const a = getRandomInt(2, 5);
  const b = getRandomInt(1, 3);
  targetAnswer = a + b;

  safeSetText('missionBadgeText', `🎧 Royal Listening Story`);
  safeSetText('promptTitle', `Listen to Lady Victoria's Story`);
  safeSetText('promptSubtitle', `How many royal guards are on duty altogether?`);
  activeQuestionPrompt = `Listen carefully! There are ${a} guards standing at Windsor Castle. Then, ${b} more sentries arrive. How many guards are on duty altogether?`;

  const grid = document.getElementById('earlyCountGrid');
  grid.innerHTML = `
    <div class="p-4 bg-slate-900 border border-amber-400 rounded-2xl text-center">
      <div class="text-4xl">💂 🎧 💂</div>
      <span class="text-xs font-bold text-slate-300 mt-2 block">"Listen carefully to the teacher..."</span>
    </div>
  `;

  renderChoiceButtons([targetAnswer, targetAnswer + 1, Math.max(1, targetAnswer - 2), targetAnswer + 3].sort((x,y)=>x-y));
}

function renderTimesTableMission() {
  const stage = document.getElementById('stageTimesTables');
  stage.style.display = 'flex';

  let a = 2, b = getRandomInt(1, 12);
  if (currentMode === 'y2_times') a = getRandomItem([2, 5, 10]);
  else if (currentMode === 'y3_times') a = getRandomItem([3, 4, 8]);
  else a = getRandomInt(2, 12);

  targetAnswer = a * b;
  safeSetText('missionBadgeText', `Times Tables Mastery`);
  safeSetText('promptTitle', `Calculate Multiplication`);
  safeSetText('promptSubtitle', `What is ${a} × ${b}?`);
  activeQuestionPrompt = `What is ${a} times ${b}? Calculate carefully!`;

  safeSetText('timesTableA', a);
  safeSetText('timesTableB', b);

  const choices = [targetAnswer];
  while (choices.length < 4) {
    const c = targetAnswer + getRandomInt(-8, 8);
    if (c > 0 && !choices.includes(c)) choices.push(c);
  }
  renderChoiceButtons(choices.sort((x,y)=>x-y));
}

function renderUkMarketMission() {
  const stage = document.getElementById('stageUkMarket');
  stage.style.display = 'flex';

  const count = currentMode === 'y5_market' ? 3 : 2;
  const items = [];
  for (let i = 0; i < count; i++) items.push(getRandomItem(UK_STORE_ITEMS));

  targetAnswer = `£${items.reduce((acc, it) => acc + it.price, 0)}`;

  safeSetText('missionBadgeText', `Royal Pantry: Pounds (£)`);
  safeSetText('promptTitle', `Calculate Total Basket`);
  safeSetText('promptSubtitle', `Sum the items in British Pounds (£)`);
  activeQuestionPrompt = `What is the total price in pounds for our afternoon tea items?`;

  const list = document.getElementById('ukMarketItemList');
  list.innerHTML = items.map(it => `
    <div class="flex items-center justify-between bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
      <span class="text-white">${it.icon} ${it.name}</span>
      <span class="font-extrabold text-amber-300">£${it.price}</span>
    </div>
  `).join('');

  safeSetText('ukMarketEquation', items.map(i => `£${i.price}`).join(' + ') + ' = ?');
  const totalVal = items.reduce((acc, it) => acc + it.price, 0);
  const choices = [targetAnswer, `£${totalVal + 1}`, `£${Math.max(1, totalVal - 2)}`, `£${totalVal + 3}`];
  renderChoiceButtons(choices.sort());
}

function renderPrimeMission() {
  const stage = document.getElementById('stageTimesTables');
  stage.style.display = 'flex';

  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  const nonPrimes = [4, 6, 8, 9, 10, 12, 14, 15, 16, 20, 21];

  targetAnswer = getRandomItem(primes);
  safeSetText('missionBadgeText', `Year 5: Prime Numbers`);
  safeSetText('promptTitle', `Select the Prime Number`);
  safeSetText('promptSubtitle', `Which number has only factors 1 and itself?`);
  activeQuestionPrompt = `Can you identify the prime number among these royal options?`;

  safeSetText('timesTableA', 'Prime');
  safeSetText('timesTableB', 'Number');

  const choices = [targetAnswer];
  while (choices.length < 4) {
    const c = getRandomItem(nonPrimes);
    if (!choices.includes(c)) choices.push(c);
  }
  renderChoiceButtons(choices.sort((a,b)=>a-b));
}

function renderChoiceButtons(options) {
  const row = document.getElementById('numberOptionsRow');
  row.innerHTML = '';
  options.forEach(val => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bouncy-btn royal-gold-btn text-slate-950 font-black px-5 py-3 rounded-2xl text-lg sm:text-xl min-w-[80px] border-b-4 border-amber-700 shadow-lg';
    btn.innerText = val;
    btn.onclick = () => {
      if (isInputLocked) return;
      if (String(val) === String(targetAnswer)) onAnswerCorrect(); else onAnswerWrong();
    };
    row.appendChild(btn);
  });
}

function onAnswerCorrect() {
  isInputLocked = true;
  soundSuccessChime();
  speakPraise();

  totalQuestions++;
  correctCount++;
  currentStars++;
  safeSetText('headerStars', currentStars);

  if (typeof confetti === 'function') {
    confetti({ particleCount: 75, spread: 85, origin: { y: 0.6 } });
  }

  safeSetText('promptTitle', 'Splendid! That is correct! ⭐');

  // 每答對 3 題解鎖/升級皇家勳章
  if (totalQuestions % 3 === 0) {
    setTimeout(evolveRoyalBadge, 600);
  } else {
    setTimeout(generateQuestion, 1400);
  }
}

function onAnswerWrong() {
  soundEncourageTone();
  speakTryAgain();
  safeSetText('promptTitle', 'Not quite! Try once more! 💪');
  const b = document.getElementById('promptDisplayBanner');
  b.classList.add('animate-wiggle');
  setTimeout(() => b.classList.remove('animate-wiggle'), 400);
}

window.speakCurrentPrompt = function(forceUserClick = false) {
  soundTapPop();
  if (activeQuestionPrompt) speakBritishEnglish(activeQuestionPrompt);
};

/* 皇家勳章進化系統 */
function evolveRoyalBadge() {
  let target = null;
  let targetTier = 1;

  for (let b of ROYAL_HONOURS) {
    if (honoursTierMap[b.id] === 0) { target = b; targetTier = 1; break; }
  }
  if (!target) {
    for (let b of ROYAL_HONOURS) {
      if (honoursTierMap[b.id] === 1) { target = b; targetTier = 2; break; }
    }
  }
  if (!target) {
    for (let b of ROYAL_HONOURS) {
      if (honoursTierMap[b.id] === 2) { target = b; targetTier = 3; break; }
    }
  }
  if (!target) { target = getRandomItem(ROYAL_HONOURS); targetTier = 3; }

  honoursTierMap[target.id] = targetTier;
  updateAlbumBadgeCount();
  openShowcaseModal(target, targetTier);
}

function updateAlbumBadgeCount() {
  let count = 0;
  ROYAL_HONOURS.forEach(b => { if (honoursTierMap[b.id] > 0) count++; });
  safeSetText('albumTierBadge', `${count}/12`);
}

/* 彈窗管理 */
window.openRoyalTreasuryModal = function() {
  soundTapPop();
  const container = document.getElementById('badgeGridContainer');
  container.innerHTML = '';

  ROYAL_HONOURS.forEach(b => {
    const tier = honoursTierMap[b.id];
    const slot = document.createElement('div');
    let css = 'bg-slate-800/50 border border-slate-700 opacity-40 cursor-not-allowed';
    let tag = 'Locked';

    if (tier === 3) {
      css = 'tier-diamond cursor-pointer';
      tag = '💎 Diamond';
    } else if (tier === 2) {
      css = 'tier-gold cursor-pointer';
      tag = '✨ Gold';
    } else if (tier === 1) {
      css = 'tier-bronze cursor-pointer';
      tag = '🥉 Bronze';
    }

    slot.className = `p-2 rounded-2xl flex flex-col items-center justify-between min-h-[95px] ${css}`;
    slot.innerHTML = `
      <span class="text-3xl my-auto">${tier > 0 ? b.icon : '🔒'}</span>
      <span class="text-[9px] font-black text-amber-200">${tier > 0 ? b.name.split(' ')[0] : 'Locked'}</span>
      <span class="text-[8px] font-black px-1.5 rounded-full bg-slate-900/80 text-white">${tag}</span>
    `;
    if (tier > 0) slot.onclick = () => openShowcaseModal(b, tier);
    container.appendChild(slot);
  });

  document.getElementById('royalTreasuryModal').style.display = 'flex';
};

window.closeRoyalTreasuryModal = function() {
  soundTapPop();
  document.getElementById('royalTreasuryModal').style.display = 'none';
};

function openShowcaseModal(badge, tier) {
  activeShowcaseBadge = badge;
  safeSetText('showcaseBadgeName', badge.name);
  safeSetText('showcaseSpeechText', `"${badge.desc}"`);

  const tag = document.getElementById('showcaseTierTag');
  const box = document.getElementById('showcaseIconContainer');
  box.innerText = badge.icon;

  if (tier === 3) {
    soundGoldUpgradeChime();
    tag.innerText = '💎 Crown Diamond Hologram';
    box.className = 'w-28 h-28 rounded-3xl my-3 flex items-center justify-center text-6xl shadow-2xl animate-gentleFloatWiggle tier-diamond';
  } else if (tier === 2) {
    soundGoldUpgradeChime();
    tag.innerText = '✨ Gilded Gold Honours';
    box.className = 'w-28 h-28 rounded-3xl my-3 flex items-center justify-center text-6xl shadow-2xl animate-gentleFloatWiggle tier-gold';
  } else {
    tag.innerText = '🥉 Royal Bronze Medal';
    box.className = 'w-28 h-28 rounded-3xl my-3 flex items-center justify-center text-6xl shadow-2xl animate-gentleFloatWiggle tier-bronze';
  }

  document.getElementById('badgeShowcaseModal').style.display = 'flex';
  speakBritishEnglish(badge.desc);
}

window.replayShowcaseVoice = function() {
  soundTapPop();
  if (activeShowcaseBadge) speakBritishEnglish(activeShowcaseBadge.desc);
};

window.closeShowcaseModal = function() {
  soundTapPop();
  document.getElementById('badgeShowcaseModal').style.display = 'none';
};

window.openTeacherVoiceModal = function() {
  soundTapPop();
  const list = document.getElementById('teacherCardsList');
  list.innerHTML = TEACHER_PROFILES.map((t, idx) => `
    <div onclick="selectTeacher(${idx})" class="p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${idx === currentTeacherIndex ? 'bg-amber-400/20 border-amber-400' : 'bg-slate-900 border-slate-700'}">
      <div class="flex items-center gap-3 text-left">
        <span class="text-3xl">${t.avatar}</span>
        <div>
          <div class="text-sm font-black text-amber-200 font-serif">${t.name}</div>
          <div class="text-[11px] font-bold text-slate-400">${t.title}</div>
        </div>
      </div>
      <span class="text-xs font-bold text-amber-400">${idx === currentTeacherIndex ? 'Active ✅' : 'Choose'}</span>
    </div>
  `).join('');
  document.getElementById('teacherVoiceModal').style.display = 'flex';
};

window.selectTeacher = function(idx) {
  currentTeacherIndex = idx;
  safeSetText('currentTeacherAvatar', TEACHER_PROFILES[idx].avatar);
  safeSetText('currentTeacherNamePill', TEACHER_PROFILES[idx].name);
  speakBritishEnglish(TEACHER_PROFILES[idx].intro);
  openTeacherVoiceModal();
};

window.closeTeacherVoiceModal = function() {
  soundTapPop();
  document.getElementById('teacherVoiceModal').style.display = 'none';
};

window.toggleAudioMute = function() {
  isSoundOn = !isSoundOn;
  safeSetText('audioMuteIcon', isSoundOn ? '🔊' : '🔇');
  safeSetText('audioMuteLabel', isSoundOn ? 'Speech' : 'Muted');
  if (!isSoundOn && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  soundTapPop();
};

window.openParentGate = function() {
  soundTapPop();
  document.getElementById('parentGateModal').style.display = 'flex';
};
window.verifyParentPass = function() {
  const val = parseInt(document.getElementById('parentLockInput').value, 10);
  if (val === 72) {
    soundSuccessChime();
    document.getElementById('parentLockChallenge').style.display = 'none';
    document.getElementById('parentDashboardReport').style.display = 'block';
    safeSetText('statTotalSolved', totalQuestions);
    safeSetText('statAccuracy', totalQuestions > 0 ? `${Math.round((correctCount / totalQuestions) * 100)}%` : '100%');
  } else {
    soundEncourageTone();
  }
};
window.closeParentGateModal = function() {
  soundTapPop();
  document.getElementById('parentGateModal').style.display = 'none';
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  renderCurriculumCards();
  updateAlbumBadgeCount();
});
