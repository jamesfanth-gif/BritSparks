/* =========================================================================
   BritSparks - British Curriculum & Royal Treasury Database
   ========================================================================= */

// 1. Phonics Letters and Sounds Progression - 帶自然拼讀真實發音口訣
const PHONICS_DATA = [
  // Phase 2
  { sound: 's', example: 'sun', icon: '☀️', phase: 'Phase 2', spokenPhonic: 'ssss, like in sun!' },
  { sound: 'a', example: 'ant', icon: '🐜', phase: 'Phase 2', spokenPhonic: 'ah, like in ant!' },
  { sound: 't', example: 'tap', icon: '🚰', phase: 'Phase 2', spokenPhonic: 't, t, like in tap!' },
  { sound: 'p', example: 'pan', icon: '🍳', phase: 'Phase 2', spokenPhonic: 'p, p, like in pan!' },
  { sound: 'i', example: 'ink', icon: '🖋️', phase: 'Phase 2', spokenPhonic: 'ih, like in ink!' },
  { sound: 'n', example: 'net', icon: '🥅', phase: 'Phase 2', spokenPhonic: 'nnn, like in net!' },
  // Phase 3 & 4 Digraphs (雙字母自然拼讀 - 徹底解決字母名念法)
  { sound: 'sh', example: 'ship', icon: '🚢', phase: 'Phase 3', spokenPhonic: 'shhh! Like in ship and shoe!' },
  { sound: 'ch', example: 'chin', icon: '🗣️', phase: 'Phase 3', spokenPhonic: 'ch, ch! Like in chin and chair!' },
  { sound: 'th', example: 'thumb', icon: '👍', phase: 'Phase 3', spokenPhonic: 'th, th! Like in thumb and three!' },
  { sound: 'ee', example: 'queen', icon: '👑', phase: 'Phase 3', spokenPhonic: 'long eee! Like in queen and bee!' },
  { sound: 'oa', example: 'boat', icon: '⛵', phase: 'Phase 3', spokenPhonic: 'oh-ah sound, oh! Like in boat and coat!' },
  { sound: 'ai', example: 'rain', icon: '🌧️', phase: 'Phase 3', spokenPhonic: 'long ay sound! Like in rain and train!' }
];

// 2. Royal Mascot Themes
const ROYAL_MASCOTS = [
  { emoji: '💂', name: 'Royal Guard' },
  { emoji: '🦢', name: 'Royal Swan' },
  { emoji: '🦁', name: 'British Lion' },
  { emoji: '👑', name: 'Crown' },
  { emoji: '🫖', name: 'Teapot' },
  { emoji: '🐴', name: 'Royal Stallion' }
];

// 3. British Currency
const UK_COINS = [
  { val: 1, name: '1 penny (1p)', css: 'coin-1p', label: '1p', spoken: 'one penny' },
  { val: 2, name: '2 pence (2p)', css: 'coin-2p', label: '2p', spoken: 'two pence' },
  { val: 5, name: '5 pence (5p)', css: 'coin-5p', label: '5p', spoken: 'five pence' },
  { val: 10, name: '10 pence (10p)', css: 'coin-10p', label: '10p', spoken: 'ten pence' },
  { val: 20, name: '20 pence (20p)', css: 'coin-20p', label: '20p', spoken: 'twenty pence' },
  { val: 100, name: 'One Pound (£1)', css: 'coin-pound', label: '£1', spoken: 'one pound' }
];

// 4. London Royal Pantry (£ / p)
const UK_STORE_ITEMS = [
  { name: 'Earl Grey Tea', icon: '🫖', price: 4 },
  { name: 'Royal Scones', icon: '🧁', price: 3 },
  { name: 'Farmhouse Milk', icon: '🥛', price: 2 },
  { name: 'English Jam', icon: '🍓', price: 3 },
  { name: 'Cheddar Cheese', icon: '🧀', price: 5 },
  { name: 'Crown Biscuits', icon: '🍪', price: 2 }
];

// 5. 12 Royal Honours Badges
const ROYAL_HONOURS = [
  { id: 'h1', icon: '👑', name: 'Imperial Crown', desc: "Magnificent! The Crown shines with royal brilliance!" },
  { id: 'h2', icon: '🦁', name: 'Courageous Lion', desc: "Superb! The Royal Lion celebrates your great bravery!" },
  { id: 'h3', icon: '🦢', name: 'Palace Swan', desc: "Graceful and elegant! A true scholar of the realm!" },
  { id: 'h4', icon: '💂', name: 'Buckingham Guard', desc: "Splendid discipline! You solved that like a true sentry!" },
  { id: 'h5', icon: '🏰', name: 'Windsor Castle', desc: "A fortress of knowledge! Splendidly achieved!" },
  { id: 'h6', icon: '🫖', name: 'Golden Teapot', desc: "Delightful! Time for tea and celebration!" },
  { id: 'h7', icon: '⚔️', name: 'Royal Sabre', desc: "Sharp and brilliant as a knighthood blade!" },
  { id: 'h8', icon: '🛡️', name: 'Sovereign Shield', desc: "Steadfast defense in mathematics and phonics!" },
  { id: 'h9', icon: '🦄', name: 'Scottish Unicorn', desc: "Magical and rare! An exceptional triumph!" },
  { id: 'h10', icon: '🕰️', name: 'Big Ben Chime', desc: "Right on time, like the chiming clock of London!" },
  { id: 'h11', icon: '📜', name: 'Royal Charter', desc: "Awarded by royal decree for scholarly excellence!" },
  { id: 'h12', icon: '💎', name: 'Crown Jewel', desc: "The pinnacle of our realm! A supreme Royal Genius!" }
];

// 6. British Governess & Teachers (全新 2 女 + 2 男 皇室導師陣容)
const TEACHER_PROFILES = [
  {
    id: 'victoria',
    name: 'Lady Victoria',
    title: 'Royal Governess (RP British Accent)',
    avatar: '👑',
    lang: 'en-GB',
    isFemale: true,
    preferredNames: ['Stephanie', 'Martha', 'Serena', 'Google UK English Female', 'Libby'],
    rate: 0.75,
    pitch: 1.00,
    intro: "Welcome to the Royal Academy! I am Lady Victoria. Let us learn together!"
  },
  {
    id: 'emma',
    name: 'Miss Emma',
    title: 'Friendly Primary Tutor (Sweet Accent)',
    avatar: '🌸',
    lang: 'en-GB',
    isFemale: true,
    preferredNames: ['Hazel', 'Susan', 'Moira', 'Google UK English Female', 'Female'],
    rate: 0.77,
    pitch: 1.02,
    intro: "Hello sweet scholar! I am Miss Emma. Let's play and count!"
  },
  {
    id: 'george',
    name: 'Master George',
    title: 'Oxford Scholar & Tutor',
    avatar: '🎩',
    lang: 'en-GB',
    isFemale: false,
    preferredNames: ['George', 'Oliver', 'Google UK English Male', 'Arthur', 'Male'],
    rate: 0.76,
    pitch: 0.98,
    intro: "Good day! I am Master George. Ready for our mathematics and phonics quests?"
  },
  {
    id: 'arthur',
    name: 'Captain Arthur',
    title: 'Royal Guard Commander (Energetic Voice)',
    avatar: '💂',
    lang: 'en-GB',
    isFemale: false,
    preferredNames: ['Daniel', 'David', 'James', 'Google UK English Male'],
    rate: 0.78,
    pitch: 0.96,
    intro: "Halt! Royal explorer on deck! I am Captain Arthur. Let's conquer these missions!"
  }
];

// 7. Full UK Curriculum Framework (2歲至10歲，每個等級具備 3-4 個遊戲)
const UK_CURRICULUM = {
  toddler: {
    icon: '🧸',
    title: 'Toddler (Age 2-3)',
    desc: 'EYFS Sensory Sounds, Sizing & Early Counting',
    ageRange: 'Age 2 - 3',
    topics: [
      { id: 'toddler_sounds', title: 'Phase 1 Sound Play', subtitle: 'Royal sounds & phonics', icon: '💂', color: 'from-amber-600 to-yellow-600' },
      { id: 'toddler_count', title: 'Count 1 to 3', subtitle: 'Count royal mascots', icon: '👑', color: 'from-teal-600 to-emerald-700' },
      { id: 'toddler_compare', title: 'Big vs Small Sorting', subtitle: 'Visual size comparison', icon: '🐘', color: 'from-indigo-600 to-blue-700' }
    ]
  },
  nursery: {
    icon: '🌱',
    title: 'Nursery (Age 3-4)',
    desc: 'Rhyme, Alliteration, Shapes & Numbers 1-5',
    ageRange: 'Age 3 - 4',
    topics: [
      { id: 'nursery_phonics', title: 'Phase 1 Alliteration', subtitle: 'Initial phonetic sounds', icon: '🔤', color: 'from-sky-600 to-indigo-700' },
      { id: 'nursery_count', title: 'Count 1 to 5', subtitle: 'Palace animals 1-5', icon: '🦢', color: 'from-emerald-600 to-teal-700' },
      { id: 'nursery_shapes', title: '2D Royal Shapes', subtitle: 'Circle, Square, Triangle', icon: '🔷', color: 'from-amber-500 to-orange-600' }
    ]
  },
  reception: {
    icon: '🌸',
    title: 'Reception (Age 4-5)',
    desc: 'Phase 2 Phonics, CVC Words & Bonds to 10',
    ageRange: 'Age 4 - 5',
    topics: [
      { id: 'rec_phonics', title: 'Phase 2 Phonics', subtitle: 's, a, t, p, i, n blending', icon: '☀️', color: 'from-sky-500 to-blue-700' },
      { id: 'rec_bonds', title: 'Ten-Frame Bonds', subtitle: 'Make number 10', icon: '🔟', color: 'from-amber-500 to-orange-700' },
      { id: 'rec_compare', title: 'More or Less?', subtitle: 'Compare quantities', icon: '⚖️', color: 'from-emerald-500 to-teal-700' },
      { id: 'rec_sub', title: 'Take Away Subtraction', subtitle: 'Interactive take-away', icon: '✂️', color: 'from-rose-500 to-pink-700' }
    ]
  },
  year1: {
    icon: '⭐',
    title: 'Year 1 (Age 5-6)',
    desc: 'Digraphs, UK Coins & Telling Time',
    ageRange: 'Age 5 - 6',
    topics: [
      { id: 'y1_digraphs', title: 'Digraphs (sh, ch, th)', subtitle: 'Phase 3 & 4 reading', icon: '🚢', color: 'from-indigo-600 to-purple-800' },
      { id: 'y1_coins', title: 'British Coins', subtitle: '1p, 2p, 5p, 10p, £1', icon: '🪙', color: 'from-amber-500 to-yellow-600' },
      { id: 'y1_math20', title: 'Maths within 20', subtitle: 'Addition to 20', icon: '⚡', color: 'from-rose-600 to-red-700' },
      { id: 'y1_clock', title: "Telling the Time", subtitle: "o'clock & half past", icon: '⏰', color: 'from-sky-600 to-cyan-700' }
    ]
  },
  year2: {
    icon: '🚀',
    title: 'Year 2 (Age 6-7)',
    desc: '2, 5, 10 Times Tables, Tens/Ones & Phase 5',
    ageRange: 'Age 6 - 7',
    topics: [
      { id: 'y2_times', title: '2, 5, 10 Times Tables', subtitle: 'Multiplication basics', icon: '✖️', color: 'from-rose-600 to-pink-700' },
      { id: 'y2_phonics', title: 'Phase 5 Vowels', subtitle: 'Alternative sounds', icon: '📖', color: 'from-cyan-600 to-blue-800' },
      { id: 'y2_place', title: 'Tens & Ones Value', subtitle: 'Crystal place value', icon: '💎', color: 'from-purple-600 to-indigo-800' },
      { id: 'y2_mental', title: 'Rapid Mental Math', subtitle: 'Add tens and units', icon: '🚀', color: 'from-amber-600 to-orange-700' }
    ]
  },
  year3: {
    icon: '🏰',
    title: 'Year 3 (Age 7-8)',
    desc: 'Royal Pantry (£/p), 3, 4, 8 Tables & Listening',
    ageRange: 'Age 7 - 8',
    topics: [
      { id: 'y3_market', title: 'Royal Pantry (£)', subtitle: 'Pound & pence sum', icon: '🧺', color: 'from-emerald-600 to-teal-800' },
      { id: 'y3_times', title: '3, 4, 8 Times Tables', subtitle: 'KS2 multiplication', icon: '⚡', color: 'from-purple-600 to-indigo-800' },
      { id: 'y3_listening', title: '🎧 Word Story Listening', subtitle: 'Listen and solve math', icon: '👂', color: 'from-sky-600 to-blue-700' },
      { id: 'y3_coins', title: 'Change Calculation (£)', subtitle: 'Paying with £10 notes', icon: '💰', color: 'from-amber-500 to-yellow-600' }
    ]
  },
  year4: {
    icon: '⚔️',
    title: 'Year 4 (Age 8-9)',
    desc: 'MTC Tables Check up to 12 × 12 & Reasoning',
    ageRange: 'Age 8 - 9',
    topics: [
      { id: 'y4_tables', title: 'MTC 12 × 12 Tables', subtitle: 'Official UK tables test', icon: '🎯', color: 'from-purple-700 to-pink-800' },
      { id: 'y4_mental', title: 'Mental Speed Rocket', subtitle: 'Two-digit addition', icon: '🚀', color: 'from-rose-600 to-red-700' },
      { id: 'y4_clock', title: 'Quarter Past & To', subtitle: 'Read analogue clock', icon: '🕰️', color: 'from-blue-600 to-indigo-800' }
    ]
  },
  year5: {
    icon: '👑',
    title: 'Year 5 (Age 9-10)',
    desc: 'Prime Numbers, Advanced Tables & Place Value',
    ageRange: 'Age 9 - 10',
    topics: [
      { id: 'y5_primes', title: 'Prime Numbers', subtitle: 'Primes up to 50', icon: '💎', color: 'from-fuchsia-600 to-rose-700' },
      { id: 'y5_tables', title: 'Master Multiplication', subtitle: 'Rapid mental check', icon: '⚡', color: 'from-purple-700 to-indigo-900' },
      { id: 'y5_market', title: 'Multi-Item Checkout', subtitle: '3-item Royal basket', icon: '🛒', color: 'from-emerald-600 to-teal-800' }
    ]
  }
};
