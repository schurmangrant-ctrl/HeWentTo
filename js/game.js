// Mode selection
basketballModeBtn.addEventListener('click', () => {
    gameMode = 'basketball';
    startGame();
});
footballModeBtn.addEventListener('click', () => {
    gameMode = 'football';
    startGame();
});
mixModeBtn.addEventListener('click', () => {
    gameMode = 'mix';
    startGame();
});

function startGame() {
    modeSelector.classList.add('hidden');
    initGame();
}

// --- FETCH AND INITIALIZE DATABASE ---
async function initGame() {
    try {
        const response = await fetch('players.json');
        const data = await response.json();
        let filteredData = data;
        if (gameMode === 'basketball') {
            filteredData = data.filter(p => p.sport === 'basketball');
        } else if (gameMode === 'football') {
            filteredData = data.filter(p => p.sport === 'football');
        }
        players = shuffleArray(filteredData).slice(0, MAX_PLAYERS);
        loadPlayer();
    } catch (err) {
        console.error("Failed to load players.json:", err);
        playerNameEl.innerText = "Load Error";
    }
}

function loadPlayer() {
    if (currentRound >= players.length) {
        showFinalResults();
        return;
    }
    const p = players[currentRound];
    playerNameEl.innerText = p.name;
    playerInfoEl.innerText = p.info;
    guessBtn.innerText = "Place Your Pin";
    guessBtn.className = "mt-4 w-full bg-slate-200 text-slate-400 font-black py-4 rounded-xl cursor-not-allowed uppercase italic";

    // Clear previous markers
    if (guessMarker) map.removeLayer(guessMarker);
    if (flightPath) map.removeLayer(flightPath);
    if (targetMarker) map.removeLayer(targetMarker);
    currentGuess = null;

    map.flyTo(INITIAL_VIEW, INITIAL_ZOOM, { duration: 1.5 });
}

guessBtn.addEventListener('click', () => {
    if (!currentGuess) return;
    const p = players[currentRound];
    const target = L.latLng(p.lat, p.lng);
    const dist = map.distance(currentGuess, target) * MILES_PER_METER;

    flightPath = L.polyline([currentGuess, target], {
        color: '#2563eb', weight: 4, dashArray: '10, 15', opacity: 0.6
    }).addTo(map);

    targetMarker = L.circleMarker(target, {
        radius: 10, fillColor: "#16a34a", color: "white", weight: 4, fillOpacity: 1
    }).addTo(map);

    const group = new L.featureGroup([guessMarker, targetMarker]);
    map.fitBounds(group.getBounds(), { padding: [100, 100], duration: 1.2 });

    const score = calculateScore(dist);
    totalScore += score;
    playerScores.push({ name: p.name, score: score }); // Add to player scores
    updateScoreTracker(); // Update the tracker

    setTimeout(() => {
        modalCollegeName.innerText = p.college;
        modalDistance.innerText = dist <= PERFECT_DISTANCE ? "PERFECT SCOUTING" : `${dist.toFixed(1)} miles away`;
        modalScoreEarned.innerText = `+${score.toLocaleString()}`;
        resultModal.classList.remove('hidden');
        totalScoreEl.innerText = totalScore.toLocaleString();
    }, 1300);
});

nextBtn.addEventListener('click', () => {
    resultModal.classList.add('hidden');
    currentRound++;
    loadPlayer();
});

function updateScoreTracker() {
    scoreList.innerHTML = playerScores.map(s => `<li>${s.name}: ${s.score.toLocaleString()}</li>`).join('');
}

function showFinalResults() {
    document.getElementById('modal-result-title').innerText = "Draft Complete";
    modalCollegeName.innerText = "Career Score";
    modalDistance.innerText = "Game Over";
    modalScoreEarned.innerText = totalScore.toLocaleString();
    nextBtn.innerText = "New Season";
    nextBtn.onclick = () => window.location.reload();
    resultModal.classList.remove('hidden');
}
