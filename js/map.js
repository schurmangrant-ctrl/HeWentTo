const map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    maxBounds: getMapMaxBounds(),
    maxBoundsViscosity: 0.25,
    minZoom: 3
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map); // Changed to Positron for higher contrast

map.fitBounds(DEFAULT_MAP_BOUNDS, getDefaultMapFitOptions());

map.on('click', (e) => {
    if (seasonEnded || guessLocked) return;

    if (guessMarker) map.removeLayer(guessMarker);
    currentGuess = e.latlng;

    const pinIcon = L.divIcon({
        className: 'pin-drop',
        html: `<div style="background: #2563eb; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    guessMarker = L.marker(currentGuess, {icon: pinIcon}).addTo(map);
    guessBtn.className = "mt-4 w-full bg-blue-600 text-white font-black py-4 rounded-xl cursor-pointer shadow-xl hover:scale-105 active:scale-95 transition-all uppercase italic text-lg";
    guessBtn.innerText = "Lock It In";
});
