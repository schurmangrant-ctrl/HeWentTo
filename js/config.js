// Constants
const MAX_PLAYERS = 5;
const INITIAL_VIEW = [39.82, -98.57];
const INITIAL_ZOOM = 4;
const MILES_PER_METER = 0.000621371;
const PERFECT_DISTANCE = 10; // Changed to 10 miles
const MAX_SCORE = 5000;
const SCORE_DECAY_FACTOR = 250;

// Cached DOM elements
const modeSelector = document.getElementById('mode-selector');
const basketballModeBtn = document.getElementById('basketball-mode');
const footballModeBtn = document.getElementById('football-mode');
const mixModeBtn = document.getElementById('mix-mode');
const playerNameEl = document.getElementById('player-name');
const playerInfoEl = document.getElementById('player-info');
const guessBtn = document.getElementById('guess-btn');
const totalScoreEl = document.getElementById('total-score');
const resultModal = document.getElementById('result-modal');
const modalCollegeLogo = document.getElementById('modal-college-logo');
const modalCollegeLocated = document.getElementById('modal-result-title');
const modalCollegeName = document.getElementById('modal-college-name');
const modalDistance = document.getElementById('modal-distance');
const modalScoreEarned = document.getElementById('modal-score-earned');
const nextBtn = document.getElementById('next-btn');
const scoreList = document.getElementById('score-list');
const endSeasonBtn = document.getElementById('end-season-btn');

// Game state variables
let players = [];
let currentRound = 0;
let totalScore = 0;
let currentGuess = null;
let guessMarker = null;
let flightPath = null;
let targetMarker = null;
let playerScores = []; // New array to track individual player scores
let gameMode = null; // 'basketball', 'football', or 'mix'
let seasonEnded = false;
let guessLocked = false;

// Utility functions
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
const calculateScore = (dist) => dist <= PERFECT_DISTANCE ? MAX_SCORE : Math.max(0, Math.floor(MAX_SCORE * Math.exp(-(dist - PERFECT_DISTANCE) / SCORE_DECAY_FACTOR)));
const formatPlayerInfo = (player) => {
    const sport = player.sport.charAt(0).toUpperCase() + player.sport.slice(1);
    const years = player.startYear === player.endYear ? player.startYear : `${player.startYear}-${player.endYear}`;

    return `${sport} • ${years}`;
};
