# AquariumOS agent notes

This repo is the public Hack Club Stardance ship. Treat every edit as something a stranger will open.

## Before you change or commit anything

```bash
python3 scripts/ship-safe.py
```

Stop if it fails.

Before each deploy to `main`, refresh the cache stamp so returning visitors never mix old and new modules:

```bash
python3 scripts/bump-cache.py
```

## Credit

Author credit is GitHub user **ethaenall**.

- Demo: https://ethaenall.github.io/aquariumos/
- Source: https://github.com/ethaenall/aquariumos

Do not add an email, phone, school, home path, or legal name to any tracked file. Git commit author metadata is enough for contribution credit.

## Cover and description

- Cover: `assets/screenshot.png`
- Open Graph crop: `assets/cover.png`
- One-liner: A tiny operating system living beneath the surface.

## Live site vs this branch

GitHub Pages serves `main`, including feeding, fish growth, tides, sand app props, and window snap. Keep the README aligned with the deployed version; branch-only work is not live until Pages deploys it.
