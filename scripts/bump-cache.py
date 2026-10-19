#!/usr/bin/env python3
"""Stamp a fresh ?v= on every script and stylesheet link before shipping.

GitHub Pages lets browsers cache each file for 10 minutes, one file at a time.
Without a version, a returning visitor can get the new page with old modules,
and the app breaks. Run this before each deploy:

    python3 scripts/bump-cache.py
"""

import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STAMP = sys.argv[1] if len(sys.argv) > 1 else time.strftime("%Y%m%d%H%M")
LINK = re.compile(r'((?:\./[\w-]+\.js)|(?:js/main\.js)|(?:styles\.css))(?:\?v=[\w.-]+)?(")')


def stamp(path):
    text = path.read_text()
    updated = LINK.sub(lambda m: f"{m.group(1)}?v={STAMP}{m.group(2)}", text)
    if updated != text:
        path.write_text(updated)
        return True
    return False


changed = [p.relative_to(ROOT) for p in [ROOT / "index.html", *sorted((ROOT / "js").glob("*.js"))] if stamp(p)]
print(f"Cache stamp v={STAMP} on {len(changed)} files")
