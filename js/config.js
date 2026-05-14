// Constants
const MAX_PLAYERS = 5;
const DEFAULT_MAP_BOUNDS = L.latLngBounds(L.latLng(24.5, -125.0), L.latLng(49.0, -66.0));
const MOBILE_MAP_BOUNDS = L.latLngBounds(L.latLng(10.0, -150.0), L.latLng(65.0, -45.0));
const MILES_PER_METER = 0.000621371;
const PERFECT_DISTANCE = 10; // Changed to 10 miles
const MAX_SCORE = 5000;
const SCORE_DECAY_FACTOR = 250;

// Cached DOM elements
const modeSelector = document.getElementById('mode-selector');
const basketballModeBtn = document.getElementById('basketball-mode');
const footballModeBtn = document.getElementById('football-mode');
const mixModeBtn = document.getElementById('mix-mode');
const playerCard = document.getElementById('player-card');
const playerNameEl = document.getElementById('player-name');
const playerInfoEl = document.getElementById('player-info');
const playerImageEl = document.getElementById('player-image');
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
const scoreToggleBtn = document.getElementById('score-toggle-btn');
const scoreToggleIcon = document.getElementById('score-toggle-icon');
const endSeasonBtn = document.getElementById('end-season-btn');

// Game state variables
let players = [];
let currentRound = 0;
let totalScore = 0;
let currentGuess = null;
let guessMarker = null;
let flightPath = null;
let targetMarker = null;
let flightAnimationFrame = null;
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
const getResultMapFitOptions = () => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) {
        return {
            paddingTopLeft: [56, 360],
            paddingBottomRight: [56, 160],
            duration: 2.2
        };
    }

    return {
        paddingTopLeft: [420, 160],
        paddingBottomRight: [220, 160],
        duration: 2.2
    };
};
const getDefaultMapFitOptions = (duration = 0) => ({
    padding: [16, 16],
    duration
});
const getMapMaxBounds = () => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    return isMobile ? MOBILE_MAP_BOUNDS : DEFAULT_MAP_BOUNDS;
};
const animateFlightPath = (start, end, duration = 2200) => new Promise((resolve) => {
    const startLat = start.lat;
    const startLng = start.lng;
    const endLat = end.lat;
    const endLng = end.lng;
    const startedAt = performance.now();

    flightPath = L.polyline([start], {
        color: '#2563eb',
        weight: 5,
        dashArray: '10, 15',
        opacity: 0.8
    }).addTo(map);

    const drawFrame = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentPoint = L.latLng(
            startLat + ((endLat - startLat) * easedProgress),
            startLng + ((endLng - startLng) * easedProgress)
        );

        flightPath.setLatLngs([start, currentPoint]);

        if (progress < 1) {
            flightAnimationFrame = requestAnimationFrame(drawFrame);
            return;
        }

        flightPath.setLatLngs([start, end]);
        flightAnimationFrame = null;
        resolve();
    };

    flightAnimationFrame = requestAnimationFrame(drawFrame);
});
