import { createGuide } from "./guide.js?v=202610191223";

const NOTES_KEY = "aquariumos.notes";
const context = { tank: null };

export function bindTank(tank) {
  context.tank = tank;
}

function storageGet(key) {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage should not break the app.
  }
}

function createNotes() {
  const wrap = document.createElement("div");
  wrap.className = "app-notes";
  const editor = document.createElement("textarea");
  editor.className = "notes-editor";
  editor.setAttribute("aria-label", "Notes");
  editor.placeholder = "Write something that might float away…";
  editor.value = storageGet(NOTES_KEY);
  const status = document.createElement("p");
  status.className = "notes-status";
  status.textContent = editor.value ? "Saved in this tank" : "Notes stay in this browser";
  let timer = 0;
  editor.addEventListener("input", () => {
    status.textContent = "Saving…";
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      storageSet(NOTES_KEY, editor.value);
      status.textContent = "Saved in this tank";
    }, 180);
  });
  wrap.append(editor, status);
  return wrap;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "Error";
  const rounded = Number.parseFloat(value.toPrecision(12));
  return String(rounded);
}

function compute(left, operator, right) {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return right === 0 ? Number.NaN : left / right;
    default:
      return right;
  }
}

function createCalculator() {
  const wrap = document.createElement("div");
  wrap.className = "app-calc";
  wrap.tabIndex = 0;
  wrap.setAttribute("aria-label", "Calculator");

  const display = document.createElement("div");
  display.className = "calc-display";
  const tape = document.createElement("div");
  tape.className = "calc-tape";
  tape.setAttribute("aria-hidden", "true");
  const value = document.createElement("div");
  value.className = "calc-value";
  value.setAttribute("aria-live", "polite");
  value.textContent = "0";
  display.append(tape, value);

  const keys = document.createElement("div");
  keys.className = "calc-keys";

  const state = {
    display: "0",
    stored: null,
    operator: null,
    fresh: true,
  };

  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  function render() {
    value.textContent = state.display;
    tape.textContent =
      state.operator && state.stored !== null
        ? `${formatNumber(state.stored)} ${symbols[state.operator]}`
        : "";
  }

  function inputDigit(digit) {
    if (state.display === "Error") clearAll();
    if (state.fresh) {
      state.display = digit === "." ? "0." : digit;
      state.fresh = false;
      render();
      return;
    }
    if (digit === "." && state.display.includes(".")) return;
    if (state.display.replace(".", "").length >= 12) return;
    state.display = state.display === "0" && digit !== "." ? digit : `${state.display}${digit}`;
    render();
  }

  function setOperator(next) {
    if (state.display === "Error") clearAll();
    const current = Number(state.display);
    if (state.operator && !state.fresh) {
      const result = compute(state.stored, state.operator, current);
      state.display = formatNumber(result);
      state.stored = Number(state.display);
    } else {
      state.stored = current;
    }
    state.operator = next;
    state.fresh = true;
    render();
  }

  function equals() {
    if (!state.operator || state.stored === null) return;
    const result = compute(state.stored, state.operator, Number(state.display));
    state.display = formatNumber(result);
    state.stored = null;
    state.operator = null;
    state.fresh = true;
    render();
  }

  function clearAll() {
    state.display = "0";
    state.stored = null;
    state.operator = null;
    state.fresh = true;
    render();
  }

  const layout = [
    ["7", "7"], ["8", "8"], ["9", "9"], ["÷", "/", "op"],
    ["4", "4"], ["5", "5"], ["6", "6"], ["×", "*", "op"],
    ["1", "1"], ["2", "2"], ["3", "3"], ["−", "-", "op"],
    ["0", "0"], [".", "."], ["C", "clear", "op"], ["+", "+", "op"],
    ["=", "equals", "eq"],
  ];

  layout.forEach(([label, value, kind]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    if (kind) button.className = kind;
    button.addEventListener("click", () => {
      if (value === "clear") clearAll();
      else if (value === "equals") equals();
      else if ("+-*/".includes(value)) setOperator(value);
      else inputDigit(value);
    });
    keys.append(button);
  });

  wrap.addEventListener("keydown", (event) => {
    const { key } = event;
    if (/^[0-9.]$/.test(key)) {
      event.preventDefault();
      inputDigit(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
      event.preventDefault();
      setOperator(key);
    } else if (key === "Enter" || key === "=") {
      event.preventDefault();
      equals();
    } else if (key === "Backspace") {
      event.preventDefault();
      if (!state.fresh && state.display.length > 1) {
        state.display = state.display.slice(0, -1);
      } else {
        state.display = "0";
        state.fresh = true;
      }
      render();
    }
  });

  wrap.append(display, keys);
  queueMicrotask(() => wrap.focus());
  return wrap;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(whole / 60);
  const secs = String(whole % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function iconPlay() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>`;
}

function iconPause() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>`;
}

function createMusic() {
  const wrap = document.createElement("div");
  wrap.className = "app-music";

  wrap.innerHTML = `
    <div class="music-head">
      <div class="music-disc" aria-hidden="true"><span></span></div>
      <div>
        <h2 class="music-title">Tide Lights</h2>
        <p class="music-sub">Original ambient loop · replaceable local track</p>
      </div>
    </div>
    <div class="music-eq" aria-hidden="true">${"<span></span>".repeat(14)}</div>
    <div class="music-row">
      <button class="play-btn" type="button" aria-label="Play">${iconPlay()}</button>
      <input class="music-progress" type="range" min="0" max="0" value="0" step="0.01" aria-label="Track progress" />
    </div>
    <div class="time-row">
      <span class="time-now">0:00</span>
      <span class="time-total">0:00</span>
    </div>
    <div class="volume-row">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9h5l6-5v16l-6-5H4zm13.5 3a3.5 3.5 0 0 0-1.8-3.1v6.2A3.5 3.5 0 0 0 17.5 12z"/></svg>
      <input class="music-volume" type="range" min="0" max="1" step="0.01" value="0.72" aria-label="Volume" />
    </div>
  `;

  const audio = new Audio("assets/tide-lights.wav");
  audio.preload = "metadata";
  audio.loop = true;
  const savedVolume = Number.parseFloat(storageGet("aquariumos.volume"));
  const startVolume = Number.isFinite(savedVolume) ? savedVolume : 0.72;
  audio.volume = startVolume;
  wrap.querySelector(".music-volume").value = String(startVolume);

  const playBtn = wrap.querySelector(".play-btn");
  const progress = wrap.querySelector(".music-progress");
  const volume = wrap.querySelector(".music-volume");
  const timeNow = wrap.querySelector(".time-now");
  const timeTotal = wrap.querySelector(".time-total");

  function syncPlayState() {
    const playing = !audio.paused;
    wrap.classList.toggle("is-playing", playing);
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    playBtn.innerHTML = playing ? iconPause() : iconPlay();
  }

  playBtn.addEventListener("click", async () => {
    try {
      if (audio.paused) await audio.play();
      else audio.pause();
    } catch {
      playBtn.setAttribute("aria-label", "Audio could not play");
    }
    syncPlayState();
  });

  audio.addEventListener("loadedmetadata", () => {
    progress.max = String(audio.duration || 0);
    timeTotal.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (wrap._seeking) return;
    progress.value = String(audio.currentTime);
    timeNow.textContent = formatTime(audio.currentTime);
  });

  progress.addEventListener("input", () => {
    wrap._seeking = true;
    timeNow.textContent = formatTime(Number(progress.value));
  });

  progress.addEventListener("change", () => {
    audio.currentTime = Number(progress.value);
    wrap._seeking = false;
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    storageSet("aquariumos.volume", String(audio.volume));
  });

  wrap.tabIndex = 0;
  wrap.addEventListener("keydown", async (event) => {
    if (event.key !== " " && event.code !== "Space") return;
    event.preventDefault();
    playBtn.click();
  });

  audio.addEventListener("ended", syncPlayState);
  wrap.cleanup = () => {
    audio.pause();
  };

  return wrap;
}

function createAbout() {
  const wrap = document.createElement("div");
  wrap.className = "app-about";
  wrap.innerHTML = `
    <p class="about-kicker">Hack Club Stardance</p>
    <h2 class="about-title">AquariumOS</h2>
    <p class="about-lead">A tiny operating system living beneath the surface.</p>
    <p class="about-copy">
      This desktop is an aquarium first and a computer second. Fish drift behind glass windows
      and peel away from the cursor. Apps live in the sand; feeding grows fish into new forms.
    </p>
    <p class="about-copy">
      Click empty water to sprinkle food, or tap the anemone bowl. The Field Guide bottle
      tracks every form you've grown. Press / or ${navigator.platform?.startsWith("Mac") ? "⌘K" : "Ctrl K"} for Sonar to
      open apps, change the tide, or ping a fish. At night your cursor is a lantern, and
      the fish come to it.
    </p>
    <p class="about-copy">Hack Club Stardance · WebOS 2.</p>
  `;
  return wrap;
}

const ICONS = {
  notes: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h6l2.5 2.5v8.5H4z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M6 7h4.5M6 9.5h4.5M6 12h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  calculator: `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="10" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="5" y="4" width="6" height="2.4" rx="0.6" fill="currentColor"/><circle cx="6" cy="9" r="0.9" fill="currentColor"/><circle cx="10" cy="9" r="0.9" fill="currentColor"/><circle cx="6" cy="11.6" r="0.9" fill="currentColor"/><circle cx="10" cy="11.6" r="0.9" fill="currentColor"/></svg>`,
  music: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12V3.5l7-1.5V10.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="4.4" cy="12" r="1.8" fill="currentColor"/><circle cx="11.4" cy="10.5" r="1.8" fill="currentColor"/></svg>`,
  guide: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 5.5h7.5l2.5 2.5-2.5 2.5H3z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M13 8h1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5 8h4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`,
  about: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 9.5Q8 1 14 9.5Q8 7 2 9.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M2 9.5Q8 15.5 14 9.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="9" r="1.9" fill="currentColor"/></svg>`,
};

export const apps = {
  notes: {
    id: "notes",
    title: "Notes",
    accent: "#86e3a8",
    icon: ICONS.notes,
    width: 460,
    height: 440,
    left: 0.025,
    top: 0.03,
    create: createNotes,
  },
  calculator: {
    id: "calculator",
    title: "Calculator",
    accent: "#f2cf6a",
    icon: ICONS.calculator,
    width: 330,
    height: 480,
    left: 0.74,
    top: 0.03,
    create: createCalculator,
  },
  music: {
    id: "music",
    title: "Music",
    accent: "#f4a6c8",
    icon: ICONS.music,
    width: 400,
    height: 360,
    left: 0.355,
    top: 0.05,
    create: createMusic,
  },
  guide: {
    id: "guide",
    title: "Field Guide",
    accent: "#a8c4ff",
    icon: ICONS.guide,
    width: 560,
    height: 560,
    left: 0.31,
    top: 0.03,
    create: () => createGuide(context.tank),
  },
  about: {
    id: "about",
    title: "About AquariumOS",
    accent: "#7ee0d6",
    icon: ICONS.about,
    width: 460,
    height: 400,
    left: 0.37,
    top: 0.42,
    create: createAbout,
  },
};
