import { startAquarium } from "./aquarium.js?v=202610191223";
import { startWater } from "./water.js?v=202610191223";
import { WindowManager } from "./windows.js?v=202610191223";
import { apps, bindTank } from "./apps.js?v=202610191223";
import { startSonar } from "./sonar.js?v=202610191223";
import { startDiveLog } from "./divelog.js?v=202610191223";

const TIDES = ["day", "dusk", "night"];
const TIDE_LABEL = { day: "Day", dusk: "Dusk", night: "Night" };
const TIDE_KEY = "aquariumos.tide";
const TIDE_NOTE = {
  day: "Bright water, fish keep their distance",
  dusk: "Warm light through the surface",
  night: "Your cursor becomes a lantern",
};
const ACTION_ICON = {
  feed: `<svg viewBox="0 0 16 16" aria-hidden="true"><ellipse cx="8" cy="11" rx="5.5" ry="2.2" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="6" cy="5" r="1.1" fill="currentColor"/><circle cx="9.5" cy="3.5" r="0.9" fill="currentColor"/><circle cx="8.6" cy="7" r="1" fill="currentColor"/></svg>`,
  day: `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3" fill="currentColor"/><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  dusk: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 10.5a4.5 4.5 0 0 1 9 0z" fill="currentColor"/><path d="M1.5 12.5h13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  night: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.8 2.2a5.8 5.8 0 1 0 3 9.4 4.8 4.8 0 0 1-3-9.4z" fill="currentColor"/></svg>`,
  close: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

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

function boot() {
  try {
    const canvas = document.querySelector("#tank");
    const desktop = document.querySelector("#desktop");
    const clock = document.querySelector("#clock");
    const readout = document.querySelector("#tank-readout");
    const tideToggle = document.querySelector("#tide-toggle");
    const sonarToggle = document.querySelector("#sonar-toggle");
    const propButtons = document.querySelectorAll(".sand-prop, .dock-item");
    let water = null;
    try {
      water = startWater(document.querySelector("#water"));
    } catch {
      water = null;
    }
    document.body.classList.toggle("gl-water", Boolean(water));
    const veil = document.querySelector(".night-veil");
    const tank = canvas ? startAquarium(canvas, { water, veil, overlay: document.querySelector("#sonar-layer") }) : null;
    bindTank(tank);
    const diveTitle = document.querySelector(".dive-title");
    diveTitle?.addEventListener("animationend", () => diveTitle.remove());
    let tide = tideFromClock();
    try {
      const saved = localStorage.getItem(TIDE_KEY);
      if (TIDES.includes(saved)) tide = saved;
    } catch {
      // Ignore.
    }
    // ?tide=night links straight to the lantern without changing the saved tide.
    const linked = new URLSearchParams(window.location.search).get("tide");
    if (TIDES.includes(linked)) tide = linked;

    if (clock) startClock(clock);
    if (readout) startReadout(readout);
    applyTide(tide, tank, tideToggle);
    const wm = new WindowManager(desktop);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const diveLog = startDiveLog({
      delay: reduceMotion ? 400 : 3600,
      onGuide: () => openApp("guide"),
      onFinish: (x, y) => tank?.burst(x, y, 36),
    });

    tank?.onFeed(() => {
      window.dispatchEvent(new CustomEvent("aquarium:feed"));
    });
    tank?.onPing((source) => {
      if (source !== "evolve") diveLog.complete("sonar");
    });
    tank?.onEvolve((change) => {
      const article = (word) => (/^[aeiou]/i.test(word) ? "an" : "a");
      showToast(`${article(change.from)} ${change.from} became ${article(change.to)} ${change.to}`);
      if (change.slot !== undefined) tank.ping([change.slot], "evolve");
      diveLog.complete("evolve");
    });

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

    function openApp(id, button = document.querySelector(`.sand-prop[data-app="${id}"]`)) {
      const app = apps[id];
      if (!app) return;
      if (button && (!wm.isOpen(app.id) || wm.isMinimized(app.id))) {
        const rect = button.getBoundingClientRect();
        tank?.burst(rect.left + rect.width / 2, rect.top + rect.height * 0.35);
      }
      wm.open(fitWindow(wm, app));
    }

    function feedProp(button = document.querySelector(".sand-prop-feed")) {
      if (button) {
        pulseProp(button);
        button.classList.add("is-feeding");
        window.setTimeout(() => button.classList.remove("is-feeding"), 700);
      }
      feedFromSand();
      diveLog.complete("feed");
    }

    function setTide(next) {
      tide = next;
      applyTide(tide, tank, tideToggle);
      try {
        localStorage.setItem(TIDE_KEY, tide);
      } catch {
        // Ignore.
      }
    }

    propButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.action === "feed") {
          feedProp(button);
          return;
        }
        pulseProp(button);
        openApp(button.dataset.app, button);
      });
    });

    function sonarSources() {
      const entries = Object.values(apps).map((app) => ({
        group: "app",
        title: app.title,
        sub: wm.isMinimized(app.id) ? "Asleep in the sand · wake it" : wm.isOpen(app.id) ? "Open · bring to front" : "Planted in the sand",
        keywords: app.id,
        icon: app.icon,
        accent: app.accent,
        verb: wm.isOpen(app.id) ? "Focus" : "Open",
        run: () => openApp(app.id),
      }));
      entries.push({
        group: "action",
        title: "Feed the fish",
        sub: "Sprinkle food from the surface",
        keywords: "food sprinkle flakes",
        icon: ACTION_ICON.feed,
        accent: "#f0b860",
        verb: "Feed",
        run: () => feedProp(),
      });
      TIDES.forEach((mode) => {
        entries.push({
          group: "action",
          title: `Switch to ${TIDE_LABEL[mode].toLowerCase()}`,
          sub: mode === tide ? `${TIDE_NOTE[mode]} · now` : TIDE_NOTE[mode],
          keywords: `tide light ${mode} ${mode === "night" ? "lantern dark moon" : mode === "day" ? "sun bright" : "sunset evening"}`,
          icon: ACTION_ICON[mode],
          accent: mode === "night" ? "#b8c8ff" : mode === "dusk" ? "#ff9a5a" : "#ffd66b",
          verb: "Set",
          run: () => setTide(mode),
        });
      });
      if (wm.windows.size) {
        entries.push({
          group: "action",
          title: "Close every window",
          sub: "Clear the glass",
          keywords: "tidy clear all",
          icon: ACTION_ICON.close,
          accent: "#e08978",
          verb: "Close",
          run: () => [...wm.windows.keys()].forEach((id) => wm.close(id)),
        });
      }
      const seen = new Map();
      (tank?.school() ?? []).forEach((fish) => {
        const group = seen.get(fish.name);
        if (group) group.slots.push(fish.slot);
        else seen.set(fish.name, { ...fish, slots: [fish.slot] });
      });
      [...seen.values()].forEach((fish, index) => {
        const meals = `${fish.meals} meal${fish.meals === 1 ? "" : "s"}`;
        const many = fish.slots.length > 1 ? ` · school of ${fish.slots.length}` : "";
        entries.push({
          group: "fish",
          title: fish.name,
          sub: fish.next ? `${meals}${many} · ${fish.toNext} more to ${fish.next}` : `${meals}${many} · fully grown`,
          keywords: `fish ping find ${fish.line}`,
          look: fish.look,
          featured: index < 3,
          verb: "Ping",
          run: () => tank?.ping(fish.slots),
        });
      });
      return entries;
    }

    const sonar = startSonar({ toggle: sonarToggle, sources: sonarSources });

    desktop.addEventListener("pointerdown", (event) => {
      if (event.target !== desktop) return;
      tank?.dropFood(event.clientX, event.clientY);
      diveLog.complete("feed");
      if (tide === "night") diveLog.complete("lantern");
    });

    tideToggle?.addEventListener("click", () => {
      setTide(TIDES[(TIDES.indexOf(tide) + 1) % TIDES.length]);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !sonar.isOpen()) wm.closeFocused();
    });

    desktop.addEventListener("pointermove", () => {
      if (tide === "night") diveLog.complete("lantern");
    });

    document.querySelector(".logo")?.addEventListener("click", () => {
      wm.open(fitWindow(wm, apps.about));
    });

  } finally {
    document.body.classList.add("is-ready");
  }
}

boot();
