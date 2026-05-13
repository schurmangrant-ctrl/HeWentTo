const map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    maxBounds: L.latLngBounds(L.latLng(24.5, -125.0), L.latLng(49.0, -66.0)), // Tighter bounds for continental US
    maxBoundsViscosity: 1.0,
    minZoom: 5 // Increased to prevent zooming out too far
}).setView(INITIAL_VIEW, INITIAL_ZOOM);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map); // Changed to Positron for higher contrast

map.on('click', (e) => {
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
