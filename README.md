# AquariumOS

A tiny operating system living beneath the surface.

AquariumOS is a browser desktop built for the Hack Club Stardance **WebOS 1** mission. The computer lives inside an aquarium: glass windows float in dark water, fish drift behind your apps, and the dock sits like a smooth stone on the sand.

![AquariumOS desktop with Notes, Calculator, Music, and About windows](assets/screenshot.png)

## Features

- Full-screen underwater desktop with light rays, caustics, kelp, coral, and a sandy seabed
- Animated fish, jellies, motes, and bubbles drawn behind every window
- Fish peel away from the cursor and swim to food flakes
- Click empty water or the Feed dock icon to sprinkle food
- Day / dusk / night lighting, following the clock, with a manual cycle button
- Aquatic glass dock for Feed, Notes, Calculator, Music, and About
- Draggable windows with minimize, maximize, edge-snap, and Esc to close
- Notes, calculator, and a local music player with `localStorage` persistence

## How to run locally

This project uses ES modules, so it needs a local static server (opening the file directly can block scripts).

```bash
cd webos1
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

Any static server works, including VS Code Live Server or `npx serve`.

## Technologies

- HTML
- CSS
- JavaScript (ES modules)
- Canvas for the aquarium
- `localStorage` for notes
- A generated WAV loop for Music (`scripts/generate-tide-lights.py`)

No UI framework, accounts, or analytics.

## WebOS 1 and WebOS 2

Stardance WebOS 1 needs a custom desktop, draggable windows, and one extra feature. The extra here is fish reacting to the cursor.

WebOS 2 needs at least three new features beyond that first ship. AquariumOS uses the three that score hardest on originality and usability:

1. Fish feeding
2. Day / dusk / night lighting
3. Minimize, maximize, and edge-snap

Voters rate originality, technicality, usability, and storytelling. Feeding and tides are what make this an aquarium OS instead of another taskbar clone. Window controls make it feel usable in the first minute.

**Ship WebOS 1 first** with the three logs in `DEVLOGS.md` (fixed payout). Then post the WebOS 2 logs and ship again for community ratings.

## Replace the music track

Drop any royalty-free file over `assets/tide-lights.wav`, or regenerate the bundled loop:

```bash
python3 scripts/generate-tide-lights.py
```

## Project layout

```text
/
  index.html
  styles.css
  js/
    main.js        # clock, dock, boot
    windows.js     # draggable window manager
    apps.js        # Notes, Calculator, Music, About
    aquarium.js    # fish, bubbles, cursor reaction
  assets/
    tide-lights.wav
    favicon.svg
  scripts/
    generate-tide-lights.py
```

## Devlogs

Stardance needs three progress posts on the project page. Copy from `DEVLOGS.md` and attach the screenshots in `assets/devlogs/`.

## Deploy

Upload the folder to any static host (GitHub Pages, Netlify, Cloudflare Pages, or similar). Keep `index.html` at the site root.
