#!/usr/bin/env python3
"""Scan AquariumOS for personal data, secrets, and ship-breaking mistakes.

Exit 0 if clean. Exit 1 if a blocker is found.
Use --hook when Cursor runs this before a git commit or push.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP_DIR_NAMES = {
    ".git",
    "node_modules",
    ".cursor",
    "__pycache__",
}

SKIP_SUFFIXES = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".wav",
    ".mp3",
    ".woff",
    ".woff2",
    ".ttf",
}

# Credit lives on GitHub. These strings are allowed in docs/links only.
ALLOWED_EMAILS = {
    "noreply@github.com",
}

ALLOWED_EMAIL_DOMAINS = {
    "github.com",
    "hackclub.com",
    "googleapis.com",
    "gstatic.com",
}

DEMO_URL = "https://ethaenall.github.io/aquariumos/"
SOURCE_URL = "https://github.com/ethaenall/aquariumos"

EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)
PHONE_RE = re.compile(
    r"\b(?:\+1[\s.-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}\b"
)
HOME_PATH_RE = re.compile(r"(?:/Users/|/home/)[A-Za-z0-9._-]+")
SECRET_RES = [
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{20,}"),
    re.compile(r"-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----"),
    re.compile(r"(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*['\"][^'\"]{8,}"),
]
SLUR_RE = re.compile(
    r"\b(?:nigg(?:a|er)s?|fag(?:got)?s?|kikes?|retards?|trann(?:y|ies))\b",
    re.I,
)

# Words that look personal when they appear as identity, not as theme copy.
IDENTITY_RES = [
    re.compile(r"\bethan\.birchenall\b", re.I),
    re.compile(r"\b[A-Z0-9._%+-]+@gmail\.com\b", re.I),
    re.compile(r"\b[A-Z0-9._%+-]+@icloud\.com\b", re.I),
    re.compile(r"\b[A-Z0-9._%+-]+@yahoo\.com\b", re.I),
]


def git_files() -> list[Path]:
    tracked = subprocess.check_output(
        ["git", "ls-files", "-z"], cwd=ROOT, text=True
    ).split("\0")
    extra = subprocess.check_output(
        ["git", "ls-files", "-z", "-o", "--exclude-standard"],
        cwd=ROOT,
        text=True,
    ).split("\0")
    paths = []
    for raw in tracked + extra:
        if not raw:
            continue
        path = ROOT / raw
        if not path.is_file():
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        if path.suffix.lower() in SKIP_SUFFIXES:
            continue
        paths.append(path)
    return sorted(set(paths))


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def email_allowed(address: str) -> bool:
    lower = address.lower()
    if lower in ALLOWED_EMAILS:
        return True
    domain = lower.rsplit("@", 1)[-1]
    return domain in ALLOWED_EMAIL_DOMAINS


def scan_text(path: Path, text: str, findings: list[str]) -> None:
    name = rel(path)

    for match in EMAIL_RE.finditer(text):
        address = match.group(0)
        if not email_allowed(address):
            findings.append(f"{name}: personal or stray email `{address}`")

    for match in PHONE_RE.finditer(text):
        findings.append(f"{name}: phone-like number `{match.group(0)}`")

    for match in HOME_PATH_RE.finditer(text):
        findings.append(f"{name}: home path `{match.group(0)}`")

    for regex in SECRET_RES:
        for match in regex.finditer(text):
            findings.append(f"{name}: possible secret `{match.group(0)[:24]}…`")

    for match in SLUR_RE.finditer(text):
        findings.append(f"{name}: blocked slur `{match.group(0)}`")

    for regex in IDENTITY_RES:
        for match in regex.finditer(text):
            findings.append(f"{name}: personal identity `{match.group(0)}`")

    if path.name == ".env" or path.name.startswith(".env."):
        findings.append(f"{name}: env files must not be shipped")


def scan_repo() -> list[str]:
    findings: list[str] = []
    files = git_files()
    names = {rel(path) for path in files}

    if "LICENSE" not in names and "LICENSE.md" not in names:
        findings.append("LICENSE: missing — GitHub credit and Stardance both want one")

    readme = ROOT / "README.md"
    if readme.exists():
        readme_text = readme.read_text(encoding="utf-8", errors="replace")
        if DEMO_URL not in readme_text:
            findings.append(f"README.md: missing live demo link `{DEMO_URL}`")
        if SOURCE_URL not in readme_text and "github.com/ethaenall/aquariumos" not in readme_text:
            findings.append("README.md: missing public GitHub source link")
        if re.search(r"this is my stardance project", readme_text, re.I):
            findings.append("README.md: describe the product, not that it is homework")
    else:
        findings.append("README.md: missing")

    index = ROOT / "index.html"
    if index.exists():
        html = index.read_text(encoding="utf-8", errors="replace")
        if re.search(r'type=["\']password["\']', html, re.I):
            findings.append("index.html: password field — reviewers cannot test a gate")
        if "login" in html.lower() and "password" in html.lower():
            findings.append("index.html: looks like a login gate")

    for path in files:
        if path.name == "ship-safe.py":
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            findings.append(f"{rel(path)}: could not read ({exc})")
            continue
        scan_text(path, text, findings)

    return findings


def print_report(findings: list[str]) -> int:
    if findings:
        print("SHIP SAFE failed — fix these before commit, push, or ship:\n")
        for item in findings:
            print(f"  - {item}")
        print(
            "\nKeep credit as GitHub user `ethaenall`. "
            "Do not put an email, phone, school, or home path in tracked files."
        )
        return 1

    print("SHIP SAFE passed.")
    print(f"  Demo:   {DEMO_URL}")
    print(f"  Source: {SOURCE_URL}")
    print("  No personal data, secrets, slurs, or login gate in tracked files.")
    return 0


def hook_mode() -> int:
    raw = sys.stdin.read()
    try:
        payload = json.loads(raw or "{}")
    except json.JSONDecodeError:
        payload = {}
    command = str(payload.get("command") or "")
    if not re.search(r"\bgit\s+(commit|push|commit-tree)\b", command):
        print(json.dumps({"permission": "allow"}))
        return 0

    findings = scan_repo()
    if findings:
        summary = "; ".join(findings[:4])
        print(
            json.dumps(
                {
                    "permission": "deny",
                    "user_message": "Ship-safe blocked this git command. "
                    + summary,
                    "agent_message": "Ship-safe found personal data or a ship-breaking issue. "
                    "Run `python3 scripts/ship-safe.py` and fix the report before committing or pushing.",
                }
            )
        )
        return 0

    print(json.dumps({"permission": "allow"}))
    return 0


def main() -> int:
    if "--hook" in sys.argv:
        return hook_mode()
    return print_report(scan_repo())


if __name__ == "__main__":
    sys.exit(main())
