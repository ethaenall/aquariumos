# AquariumOS

A tiny operating system living beneath the surface.

[![AquariumOS desktop with Notes, Calculator, Music, and About windows](assets/screenshot.png)](https://ethaenall.github.io/aquariumos/)

**[Open the live demo](https://ethaenall.github.io/aquariumos/)** · [Source](https://github.com/ethaenall/aquariumos)

Glass windows float in dark water. Fish drift behind your apps and peel away from the cursor. The dock sits on the sand like a stone.

## Features

- Full-screen aquarium desktop with light rays, kelp, coral, and a sandy seabed
- Animated fish, jellies, and bubbles drawn behind every window
- Fish peel away from the cursor instead of swimming through it
- Glass dock for Notes, Calculator, Music, and About
- Draggable windows with click-to-focus and Esc to close
- Notes saved in this browser only — no accounts, no login, no analytics

## How to run locally

This project uses ES modules, so it needs a static server.

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

VS Code Live Server or `npx serve` also work.

## How it works

The tank is a canvas sitting behind the windows. Fish wander, then change heading when the cursor gets close — a slow turn, not a bounce off an invisible box. Windows are ordinary DOM nodes with pointer dragging and z-index focus. The calculator is a small state machine, not `eval()`. Notes live in `localStorage` in this browser only.

## Credits

Built by [ethaenall](https://github.com/ethaenall) for [Hack Club Stardance](https://stardance.hackclub.com) WebOS 1.

Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) and [Outfit](https://fonts.google.com/specimen/Outfit). Tide Lights is an original generated loop (`scripts/generate-tide-lights.py`).

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
    screenshot.png # cover
    cover.png      # 1280×640 share image
    tide-lights.wav
  scripts/
    generate-tide-lights.py
    ship-safe.py   # blocks personal data before ship
```
