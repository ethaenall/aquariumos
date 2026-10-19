# Stardance devlogs

Post these on your Stardance **project page**, not in the About app. Each one needs its screenshot.

WebOS 1 is a fixed payout. Ratings happen on the **WebOS 2** ship, so post 1–3 first, ship WebOS 1, then post 4–6 and ship again.

Keep them short. First sentence = what changed.

---

## Devlog 1 — the tank

**Attach:** `assets/devlogs/01-desktop.png`

The desktop is an aquarium now, not a wallpaper behind a fake taskbar. I put light rays, kelp, sand, and a glass dock that sits on the floor like a stone. Fish are drawn on a canvas behind everything so they never cover the UI. First capture of the page was just a black rectangle because I hid the body until JS booted — that was a bad idea, so the tank shows immediately now.

---

## Devlog 2 — windows that actually work

**Attach:** `assets/devlogs/02-windows.png`

You can open Notes and Calculator from the dock, drag them, and click to focus. I wrote the calculator as a small state machine instead of `eval()`. First layout stacked every window in the same corner, so they weren't really usable at the same time until each app got its own spot. Notes already type, but they didn't tell you they were saved yet.

---

## Devlog 3 — the fish noticed me

**Attach:** `assets/devlogs/03-polish.png`

I wanted the cursor to feel like something in the water, not a pointer on top of a wallpaper. When it gets close, fish peel away instead of swimming through it, and the water keeps a little ripple. I had to keep the turn gentle — first version looked like they were bouncing off an invisible box. Notes now say when they're saved, windows remember where you left them, and Esc closes the focused one.

---

## After WebOS 1 ships — WebOS 2 (this is the rated one)

Voters score originality, technicality, usability, and storytelling. These three features are the ones that make AquariumOS look like a tank instead of another browser desktop.

### Devlog 4 — feeding

**Attach:** `assets/devlogs/04-feed.png`

Click empty water (or the anemone bowl in the sand) and food sinks. Fish break off from wandering and actually hunt it. If you hold the cursor over them they still flinch, unless they're already going for a flake. The first version let the mouse scare them off the food every time.

### Devlog 5 — day / dusk / night

**Attach:** `assets/devlogs/05-night.png`

The tank follows the clock: daylight, a warmer dusk, then a darker night with a weaker surface. There's a Day button in the top bar so voters can cycle it without waiting. Night was too black at first and the sand props disappeared, so I kept them readable.

### Devlog 6 — windows that dock

**Attach:** `assets/devlogs/06-snap.png`

Windows can minimize into their sand prop, fill the tank, or snap to a side if you drag them to the edge. The snap ghost is a sheet of water, not a Windows rectangle. Minimize was the usability hole — people kept losing windows behind the kelp.

### Devlog 7: field guide, sonar, lantern

**Attach:** a screenshot of the Field Guide open, and one at night with fish around the cursor.

Feeding used to be a guess, so I added a Field Guide. It's the bottle in the sand: every fish line with all four forms, and dark silhouettes for the ones you haven't grown yet. Press `/` and Sonar opens, so you can type a fish name and the tank pings it with rings and a tag. The pings were hidden behind windows at first, so now they draw on their own layer above the glass. At night your cursor becomes a lantern and the fish swim to it instead of away. I also fixed a bug: progress was saved in depth order but loaded in line order, so fish forgot their meals after a reload.

### Devlog 8: the first ten seconds

**Attach:** a short screen recording of a first visit: the dive, the school gathering, then the first feed.

I watched the opening the way a voter would, and it was a wall of text. The old hint popped up before the dive had finished. Now the dive plays with nothing on top, and the fish gather under the title as it fades in. After that a Dive log shows one step at a time, with a little sinking-flake ripple that shows where to click. Feed, grow a fish, ping one with Sonar, then try night. When a fish changes form, Sonar pings it so you can see who changed. You can also share `?tide=night` to send people straight to the lantern.

---

## How to post

1. Create the AquariumOS project on [stardance.hackclub.com](https://stardance.hackclub.com).
2. Post logs 1–3, attach the screenshots, ship **WebOS 1**.
3. Post logs 4–6 (screenshot feeding, night, and a snapped window), ship **WebOS 2**.
