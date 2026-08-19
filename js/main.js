import { startAquarium } from "./aquarium.js";
import { WindowManager } from "./windows.js";
import { apps } from "./apps.js";

const TIDES = ["day", "dusk", "night"];
const TIDE_LABEL = { day: "Day", dusk: "Dusk", night: "Night" };
const TIDE_KEY = "aquariumos.tide";

function tideFromClock() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "dusk";
  return "night";
}

function startClock(el) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  function tick() {
    const now = new Date();
    el.textContent = formatter.format(now);
    el.dateTime = now.toISOString();
  }

  tick();
  window.setInterval(tick, 1000);
}

function startReadout(el) {
  function tick() {
    const t = Date.now() / 14000;
    const depth = (12.2 + Math.sin(t) * 0.35).toFixed(1);
    const temp = (23.6 + Math.cos(t * 0.7) * 0.5).toFixed(1);
    el.textContent = `${depth} m · ${temp}°C`;
  }

  tick();
  window.setInterval(tick, 2000);
}

function applyTide(mode, tank, toggle) {
  document.body.dataset.tide = mode;
  tank?.setTide(mode);
  if (toggle) toggle.textContent = TIDE_LABEL[mode];
}

function fitWindow(wm, app) {
  const desktop = wm.desktop.getBoundingClientRect();
  const width = Math.min(app.width, Math.max(240, desktop.width - 24));
  const height = Math.min(app.height, Math.max(180, desktop.height - 16));
  return { ...app, width, height };
}

function showHint() {
  try {
    if (localStorage.getItem("aquariumos.hint")) return;
  } catch {
    return;
  }

  const hint = document.createElement("button");
  hint.type = "button";
  hint.className = "tank-hint";
  hint.textContent = "Click empty water to feed. Fish notice the cursor too.";
  document.body.append(hint);

  const dismiss = () => {
    hint.classList.add("is-gone");
    try {
      localStorage.setItem("aquariumos.hint", "1");
    } catch {
      // Ignore.
    }
    window.setTimeout(() => hint.remove(), 400);
  };

  hint.addEventListener("click", dismiss);
  window.setTimeout(dismiss, 9000);
}

function boot() {
  try {
    const canvas = document.querySelector("#tank");
    const desktop = document.querySelector("#desktop");
    const clock = document.querySelector("#clock");
    const readout = document.querySelector("#tank-readout");
    const tideToggle = document.querySelector("#tide-toggle");
    const dockButtons = document.querySelectorAll(".dock-item");
    const tank = canvas ? startAquarium(canvas) : null;
    let tide = tideFromClock();
    try {
      const saved = localStorage.getItem(TIDE_KEY);
      if (TIDES.includes(saved)) tide = saved;
    } catch {
      // Ignore.
    }

    if (clock) startClock(clock);
    if (readout) startReadout(readout);
    applyTide(tide, tank, tideToggle);

    const wm = new WindowManager(desktop);
    wm.onChange = () => {
      dockButtons.forEach((button) => {
        const id = button.dataset.app;
        if (!id) return;
        button.classList.toggle("is-open", wm.isOpen(id));
        button.classList.toggle("is-active", wm.focused === id);
      });
    };

    dockButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.action === "feed") {
          tank?.dropFood(window.innerWidth * 0.5, 90);
          return;
        }
        const app = apps[button.dataset.app];
        if (!app) return;
        wm.open(fitWindow(wm, app));
      });
    });

    desktop.addEventListener("pointerdown", (event) => {
      if (event.target !== desktop) return;
      tank?.dropFood(event.clientX, event.clientY);
    });

    tideToggle?.addEventListener("click", () => {
      const index = TIDES.indexOf(tide);
      tide = TIDES[(index + 1) % TIDES.length];
      applyTide(tide, tank, tideToggle);
      try {
        localStorage.setItem(TIDE_KEY, tide);
      } catch {
        // Ignore.
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") wm.closeFocused();
    });

    document.querySelector(".logo")?.addEventListener("click", () => {
      wm.open(fitWindow(wm, apps.about));
    });

    showHint();
  } finally {
    document.body.classList.add("is-ready");
  }
}

boot();
