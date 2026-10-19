import { startAquarium } from "./aquarium.js";
import { startWater } from "./water.js";
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
  document.documentElement.dataset.tide = mode;
  tank?.setTide(mode);
  if (!toggle) return;
  const label = toggle.querySelector(".tide-label");
  if (label) label.textContent = TIDE_LABEL[mode];
  else if (!toggle.querySelector("svg, img, .tide-glyph")) toggle.textContent = TIDE_LABEL[mode];
}

function fitWindow(wm, app) {
  const desktop = wm.desktop.getBoundingClientRect();
  const width = Math.min(app.width, Math.max(240, desktop.width - 24));
  const height = Math.min(app.height, Math.max(180, desktop.height - 16));
  return { ...app, width, height };
}

function showToast(text) {
  let toast = document.querySelector(".tank-toast");
  if (!toast) {
    toast = document.createElement("p");
    toast.className = "tank-toast";
    document.body.append(toast);
  }
  toast.textContent = text;
  toast.classList.remove("is-gone");
  window.clearTimeout(toast._hide);
  toast._hide = window.setTimeout(() => {
    toast.classList.add("is-gone");
  }, 2600);
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
  hint.textContent = "Apps live in the sand. Click empty water to feed — they grow and change.";
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
    const propButtons = document.querySelectorAll(".sand-prop, .dock-item");
    let water = null;
    try {
      water = startWater(document.querySelector("#water"));
    } catch {
      water = null;
    }
    document.body.classList.toggle("gl-water", Boolean(water));
    const tank = canvas ? startAquarium(canvas, { water }) : null;
    const diveTitle = document.querySelector(".dive-title");
    diveTitle?.addEventListener("animationend", () => diveTitle.remove());
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
    tank?.onEvolve((change) => {
      const article = (word) => (/^[aeiou]/i.test(word) ? "an" : "a");
      showToast(`${article(change.from)} ${change.from} became ${article(change.to)} ${change.to}`);
    });

    const wm = new WindowManager(desktop);

    function pulseProp(button) {
      button.classList.remove("is-pressed");
      void button.offsetWidth;
      button.classList.add("is-pressed");
      window.setTimeout(() => button.classList.remove("is-pressed"), 420);
    }

    function feedFromSand() {
      if (!tank) return;
      if (typeof tank.feedFromSky === "function") tank.feedFromSky();
      else tank.dropFood(window.innerWidth * 0.5, 90);
    }

    function syncPropState(button) {
      const id = button.dataset.app;
      if (!id) return;
      const open = wm.isOpen(id);
      const sleeping = typeof wm.isMinimized === "function" ? wm.isMinimized(id) : false;
      button.classList.toggle("is-open", open);
      button.classList.toggle("is-sleeping", sleeping);
      button.classList.toggle("is-active", wm.focused === id && !sleeping);
      const name = button.dataset.label || "app";
      if (sleeping) button.setAttribute("aria-label", `Restore ${name}`);
      else if (open) button.setAttribute("aria-label", `Focus ${name}`);
      else button.setAttribute("aria-label", `Open ${name}`);
    }

    wm.onChange = () => {
      propButtons.forEach(syncPropState);
    };
    wm.onClose = (rect) => {
      tank?.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
    };

    propButtons.forEach((button) => {
      button.addEventListener("click", () => {
        pulseProp(button);
        if (button.dataset.action === "feed") {
          button.classList.add("is-feeding");
          window.setTimeout(() => button.classList.remove("is-feeding"), 700);
          feedFromSand();
          return;
        }
        const app = apps[button.dataset.app];
        if (!app) return;
        if (!wm.isOpen(app.id) || wm.isMinimized(app.id)) {
          const rect = button.getBoundingClientRect();
          tank?.burst(rect.left + rect.width / 2, rect.top + rect.height * 0.35);
        }
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
