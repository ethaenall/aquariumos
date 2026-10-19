# AquariumOS

A tiny operating system living beneath the surface.

[![AquariumOS desktop with Notes, Calculator, Music, and About windows](assets/screenshot.png)](https://ethaenall.github.io/aquariumos/)

**[Open the live demo](https://ethaenall.github.io/aquariumos/)** · [Open it at night](https://ethaenall.github.io/aquariumos/?tide=night) · [Source](https://github.com/ethaenall/aquariumos)

Glass windows float in dark water. Fish grow into new forms when you feed them, and apps open from little objects planted in the sand. At night your cursor turns into a lantern and the fish swim over to it.

## Features

- A dive-in intro: the surface drops away, and the school gathers under the title to meet you
- New visitors meet a few grown residents (an angelfish, a koi, a ray, a lanternfish); four more lines start as babies to grow
- A four-step Dive log on your first visit: feed, grow a new form, ping a fish with Sonar, then bring the lantern out at night
- Interactive water with moving light patterns, ripples, kelp, and a sandy seabed
- Feed fish to grow and change their forms; progress stays in this browser
- Field Guide (the bottle in the sand) tracks all 32 forms, shows undiscovered ones as silhouettes, and pings any fish in the tank
- Sonar search: press `/` or `⌘K` / `Ctrl K` to open apps, feed, change the tide, or find a fish by name
- Night lantern: after dark the tank dims around your cursor, and fish gather at the light instead of fleeing
- Fish peel away from the cursor, with jellies and bubbles drifting behind your apps
- Notes, Calculator, Music, Field Guide, and About open from objects in the sand
- Windows minimize into their objects, maximize, snap to an edge, and close with Esc
- Day, dusk, and night lighting, with a button to cycle between them; `?tide=night` links straight to night
- Notes saved in this browser only — no accounts, no login, no analytics

## How to run locally

This project uses ES modules, so it needs a static server.

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

VS Code Live Server or `npx serve` also work.

## How it works

WebGL draws the water and light patterns, with a canvas fallback when WebGL is unavailable. Fish react to the cursor and swim toward food; meals unlock new forms. At night the same steering pulls them toward the cursor and around it in a loose orbit. Sonar pings draw on a canvas above the windows, so you can find a fish even when it is behind the glass. Field Guide portraits use the same painters as the live fish. Windows are ordinary DOM nodes with pointer dragging and z-index focus. The calculator is a small state machine, not `eval()`. Notes and fish progress live in `localStorage` in this browser only.

## Credits

Built by [ethaenall](https://github.com/ethaenall) for [Hack Club Stardance](https://stardance.hackclub.com).

Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) and [Outfit](https://fonts.google.com/specimen/Outfit). Tide Lights is an original generated loop (`scripts/generate-tide-lights.py`).

## Project layout

```text
/
  index.html
  styles.css
  js/
    main.js        # clock, dock, boot
    windows.js     # draggable window manager
    apps.js        # Notes, Calculator, Music, Field Guide, About
    guide.js       # Field Guide: forms found, progress, ping
    sonar.js       # search palette for apps, tides, and fish
    divelog.js     # first-visit steps: feed, grow, ping, lantern
    aquarium.js    # tank, feeding, bubbles, cursor, lantern, pings
    fish.js        # fish forms, movement, growth, saved progress
    water.js       # WebGL water and ripples
    seabed.js      # shared sand geometry
  assets/
    screenshot.png # cover
    cover.png      # 1280×640 share image
    tide-lights.wav
  scripts/
    generate-tide-lights.py
    ship-safe.py   # blocks personal data before ship
    bump-cache.py  # stamps ?v= on scripts and styles before each deploy
```
