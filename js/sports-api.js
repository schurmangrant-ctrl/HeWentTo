const SPORTS_API_BASE_URL = 'https://v1.american-football.api-sports.io';
const SPORTS_API_KEY = '89364809c1bc6223a7a7a8841811aee1';

let playerImageRequestId = 0;

function clearPlayerImage(cancelPendingRequest = false) {
    if (cancelPendingRequest) {
        playerImageRequestId++;
    }

    playerImageEl.classList.add('hidden');
    playerImageEl.onload = null;
    playerImageEl.onerror = null;
    playerImageEl.removeAttribute('src');
    playerImageEl.alt = '';
}

async function getPlayerImageUrl(playerName) {
    const response = await fetch(`${SPORTS_API_BASE_URL}/players?search=${encodeURIComponent(playerName)}`, {
        headers: {
            'x-apisports-key': SPORTS_API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Sports API returned ${response.status} for "${playerName}".`);
    }

    const data = await response.json();
    const player = data.response?.find((entry) => entry.name?.toLowerCase() === playerName.toLowerCase())
        || data.response?.[0];

    if (!player?.image) {
        throw new Error(`No player image found for "${playerName}".`);
    }

    return player.image;
}

async function displayPlayerImage(player) {
    const requestId = ++playerImageRequestId;
    clearPlayerImage();

    if (player.sport !== 'football') return;

    try {
        const imageUrl = await getPlayerImageUrl(player.name);

        if (requestId !== playerImageRequestId) return;

        return new Promise((resolve) => {
            playerImageEl.onload = () => {
                if (requestId === playerImageRequestId) {
                    playerImageEl.classList.remove('hidden');
                }

                resolve();
            };
            playerImageEl.onerror = () => {
                if (requestId === playerImageRequestId) {
                    console.error(`Unable to load player image for "${player.name}".`, {
                        url: imageUrl
                    });
                    clearPlayerImage();
                }

                resolve();
            };
            playerImageEl.src = imageUrl;
            playerImageEl.alt = `${player.name} headshot`;
        });
    } catch (err) {
        if (requestId !== playerImageRequestId) return;

        console.error(`Unable to display player image for "${player.name}".`, err);
        clearPlayerImage();
    }
}
