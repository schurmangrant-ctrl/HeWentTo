# He Went To

A browser game where you guess which college a professional athlete attended by placing a pin on the map.

## Project Structure

- `index.html` - Page markup and script/style for the main game UI.
- `css/*.css` - Custom styles that are not handled by Tailwind or Leaflet.
- `js/*.js` - All of the logic for the app containing map setup and game updates.
- `players.json` - Player data used by the game. This will eventually be replaced with API calls.

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
  "sport": "basketball",
  "startYear": 2018,
  "endYear": 2020,
  "college": "College Name",
  "lat": 0,
  "lng": 0,
  "difficulty": "Easy"
}
```

Supported `sport` values are `basketball` and `football`. Basketball and football modes filter by this field; mix mode uses all players. The game displays player info from `sport`, `startYear`, and `endYear`.

## Dependencies

The app loads these browser dependencies from CDNs:

- Tailwind CSS
- Leaflet
- CartoDB Positron map tiles
