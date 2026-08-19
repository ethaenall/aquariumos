const NOTES_KEY = "aquariumos.notes";

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
    <div>
      <h2 class="music-title">Tide Lights</h2>
      <p class="music-sub">Original ambient loop · replaceable local track</p>
    </div>
    <div class="eq" aria-hidden="true">${"<span></span>".repeat(8)}</div>
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
      This desktop is an aquarium first and a computer second. Fish drift behind glass windows,
      peel away from the cursor, and the dock sits like a smooth stone on the sand.
    </p>
    <p class="about-copy">
      Click empty water to sprinkle food. Cycle Day / Dusk / Night from the top bar.
      Drag a window to the edge to dock it. The tank starts empty so the fish can show off.
    </p>
    <p class="about-copy">Hack Club Stardance · WebOS 1 and the start of WebOS 2.</p>
  `;
  return wrap;
}

export const apps = {
  notes: {
    id: "notes",
    title: "Notes",
    width: 400,
    height: 380,
    left: 0.03,
    top: 0.03,
    create: createNotes,
  },
  calculator: {
    id: "calculator",
    title: "Calculator",
    width: 300,
    height: 420,
    left: 0.75,
    top: 0.03,
    create: createCalculator,
  },
  music: {
    id: "music",
    title: "Music",
    width: 360,
    height: 300,
    left: 0.03,
    top: 0.54,
    create: createMusic,
  },
  about: {
    id: "about",
    title: "About AquariumOS",
    width: 400,
    height: 340,
    left: 0.42,
    top: 0.5,
    create: createAbout,
  },
};
