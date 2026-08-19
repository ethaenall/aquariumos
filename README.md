# AquariumOS

A tiny operating system living beneath the surface.

AquariumOS is a browser desktop built for the Hack Club Stardance **WebOS 1** mission. The computer lives inside an aquarium: glass windows float in dark water, fish drift behind your apps, and the dock sits like a smooth stone on the sand.

![AquariumOS desktop with Notes, Calculator, Music, and About windows](assets/screenshot.png)

## Features

- Full-screen underwater desktop with light rays, caustics, kelp, coral, and a sandy seabed
- Animated fish, jellies, motes, and bubbles drawn behind every window
- Fish peel away from the cursor (the extra WebOS 1 feature)
- Aquatic glass dock for Notes, Calculator, Music, and About
- Draggable windows with Esc to close
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

## Stardance

Ship this tree as **WebOS 1**. The extra feature is fish reacting to the cursor.

WebOS 2 work (feeding, day/dusk/night, minimize/maximize/snap) lives on the `webos-2` branch. Do not include those in the first ship, or they will not count as the three new WebOS 2 features.

Post the three logs in `DEVLOGS.md` on the Stardance project page.

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

## Deploy

Upload this folder to any static host (GitHub Pages, Netlify, Cloudflare Pages, or similar). Keep `index.html` at the site root.
