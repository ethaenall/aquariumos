---
name: ship-safe
description: Scan AquariumOS for personal data, secrets, slurs, login gates, and missing GitHub/Stardance credit before shipping. Use when the user mentions ship, demo, cover, description, README, GitHub, Stardance, personal data, PII, credit, or push.
---

# Ship safe

Run this before any commit, push, README edit, cover upload, or Stardance ship.

## 1. Scan first

```bash
python3 scripts/ship-safe.py
```

Fix every finding. Do not commit or push until it prints `SHIP SAFE passed.`

## 2. What must never be in tracked files

- Email, phone, home path, school, full legal name
- Real notes, addresses, photos of people
- Secrets, API keys, `.env`, private keys
- Password / login gates
- Slurs or anything a reviewer would bounce

Git author email may stay in git history. That is how GitHub contribution credit works. Do **not** copy that email into README, LICENSE, HTML, or screenshots.

## 3. How to give credit

Use the GitHub username only:

- `ethaenall`
- https://github.com/ethaenall
- https://github.com/ethaenall/aquariumos

Do not add a personal email to any file.

## 4. Cover and copy

**Cover (Stardance + GitHub hero):** `assets/screenshot.png`  
Four apps open, aquarium behind glass. This is the one that looks like an OS.

**Share / Open Graph crop:** `assets/cover.png` (1280×640)

Do not use `01-desktop.png` as the only cover — it is pretty but does not prove windows work.

**Title:** AquariumOS

**One-liner:** A tiny operating system living beneath the surface.

**Stardance / GitHub description (paste as-is):**

> AquariumOS is a browser desktop that lives inside an aquarium. Glass windows float in dark water, fish peel away from your cursor, and the dock sits on the sand like a stone. Notes, a calculator, and a local music player run as real apps. No login.

**Demo URL:** https://ethaenall.github.io/aquariumos/  
**Source URL:** https://github.com/ethaenall/aquariumos

Never put the GitHub repo in the demo field.

## 5. README rules

The README describes the **live** site, not unreleased WebOS 2 work.

Required, in order:

1. Title + one-liner
2. Hero screenshot linking to the demo
3. Bold try-it link
4. 3–7 features a stranger can verify in one minute
5. Local run
6. How it works (one technical choice)
7. Credits as `ethaenall`, not an email
