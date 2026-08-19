import { startAquarium } from "./aquarium.js";
import { WindowManager } from "./windows.js";
import { apps } from "./apps.js";

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
  hint.textContent = "Move around — the fish notice you.";
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
  window.setTimeout(dismiss, 8000);
}

function boot() {
  try {
    const canvas = document.querySelector("#tank");
    const desktop = document.querySelector("#desktop");
    const clock = document.querySelector("#clock");
    const readout = document.querySelector("#tank-readout");
    const dockButtons = document.querySelectorAll(".dock-item");

    if (canvas) startAquarium(canvas);
    if (clock) startClock(clock);
    if (readout) startReadout(readout);

    const wm = new WindowManager(desktop);
    wm.onChange = () => {
      dockButtons.forEach((button) => {
        button.classList.toggle("is-open", wm.isOpen(button.dataset.app));
        button.classList.toggle("is-active", wm.focused === button.dataset.app);
      });
    };

    dockButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const app = apps[button.dataset.app];
        if (!app) return;
        wm.open(fitWindow(wm, app));
      });
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
