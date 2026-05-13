# He Went To

A browser game where you guess which college a professional athlete attended by placing a pin on the map.

## Project Structure

- `index.html` - Page markup and script/style includes.
- `css/styles.css` - Custom styles that are not handled by Tailwind or Leaflet.
- `js/config.js` - Shared constants for game limits, scoring, and map defaults.
- `js/dom.js` - Cached DOM element references.
- `js/state.js` - Mutable game state.
- `js/utils.js` - Small reusable helpers.
- `js/map.js` - Leaflet map setup and map click handling.
- `js/game.js` - Mode selection, player loading, scoring, rounds, and modal flow.
- `players.json` - Player data used by the game.

## Running Locally

Serve the folder from a local web server so the browser can fetch `players.json`.

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Player Data

Each entry in `players.json` should include:

```json
{
  "name": "Player Name",
  "info": "Short hint or player details",
  "college": "College Name",
  "lat": 0,
  "lng": 0,
  "sport": "basketball"
}
```

Supported `sport` values are `basketball` and `football`. Mix mode uses all players.

## Dependencies

The app loads these browser dependencies from CDNs:

- Tailwind CSS
- Leaflet
- CartoDB Positron map tiles
