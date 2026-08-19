#!/usr/bin/env python3
"""Generate a short royalty-free ambient loop for the AquariumOS music app."""

from __future__ import annotations

import math
import struct
import wave
from pathlib import Path

RATE = 44100
DURATION = 16.0
N = int(RATE * DURATION)


def clamp(value: float, low: float = -1.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def adsr(t: float, hold: float, attack: float = 0.12, decay: float = 0.35, sustain: float = 0.55, release: float = 1.4) -> float:
    if t < 0 or t > hold + release:
        return 0.0
    if t < attack:
        return t / attack
    if t < attack + decay:
        return 1.0 - (1.0 - sustain) * ((t - attack) / decay)
    if t < hold:
        return sustain
    return sustain * max(0.0, 1.0 - (t - hold) / release)


def tone(freq: float, t: float) -> float:
    a = math.sin(2 * math.pi * freq * t)
    b = math.sin(2 * math.pi * freq * 2.003 * t)
    c = math.sin(2 * math.pi * freq * 3.01 * t)
    return a * 0.72 + b * 0.2 + c * 0.08


def main() -> None:
    samples = [0.0] * N

    pad_freqs = (146.83, 220.00, 329.63)
    melody = [
        (0.0, 329.63, 2.4),
        (2.0, 392.00, 2.2),
        (4.0, 440.00, 2.6),
        (6.2, 392.00, 1.8),
        (8.0, 293.66, 2.4),
        (10.0, 523.25, 2.0),
        (12.0, 440.00, 2.2),
        (14.0, 329.63, 2.4),
    ]

    for i in range(N):
        t = i / RATE
        breath = 0.5 + 0.5 * math.sin(2 * math.pi * t / DURATION)
        pad = 0.0
        for idx, freq in enumerate(pad_freqs):
            wobble = 1.0 + 0.0018 * math.sin(2 * math.pi * (0.07 + idx * 0.03) * t)
            pad += math.sin(2 * math.pi * freq * wobble * t) * (0.11 - idx * 0.02)
        pad *= 0.72 + 0.28 * breath

        lead = 0.0
        for start, freq, hold in melody:
            env = adsr(t - start, hold)
            if env:
                lead += tone(freq, t - start) * env * 0.16
                lead += tone(freq * 2.0, t - start) * env * 0.03

        shimmer = math.sin(2 * math.pi * 880 * t) * (0.012 + 0.01 * breath) * math.sin(2 * math.pi * t / 8.0) ** 2
        samples[i] = pad + lead + shimmer

    delay = int(RATE * 0.31)
    wet = [0.0] * N
    for i in range(N):
        echo = wet[i - delay] * 0.28 if i >= delay else 0.0
        wet[i] = samples[i] + echo

    peak = max(abs(v) for v in wet) or 1.0
    gain = 0.72 / peak

    fade = int(RATE * 0.04)
    out = bytearray()
    for i, value in enumerate(wet):
        amp = 1.0
        if i < fade:
            amp = i / fade
        elif i > N - fade:
            amp = (N - i) / fade
        sample = int(clamp(value * gain * amp) * 32767)
        out.extend(struct.pack("<h", sample))

    dest = Path(__file__).resolve().parent.parent / "assets" / "tide-lights.wav"
    dest.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(dest), "w") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes(bytes(out))
    print(f"wrote {dest}")


if __name__ == "__main__":
    main()
