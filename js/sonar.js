import { paintPortrait } from "./fish.js?v=202610191453";

const GROUP_LABEL = { app: "Apps", action: "Tank", fish: "Fish" };
const GROUP_ORDER = { app: 0, action: 1, fish: 2 };

function score(query, text) {
  if (!query) return 1;
  const hay = text.toLowerCase();
  if (hay.startsWith(query)) return 4;
  if (hay.includes(` ${query}`)) return 3;
  if (hay.includes(query)) return 2;
  let at = 0;
  for (const ch of hay) {
    if (ch === query[at]) at += 1;
    if (at === query.length) return 1;
  }
  return 0;
}

function isTyping(target) {
  return target instanceof HTMLElement
    && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

// Sonar: a search palette for the tank. Opens apps, runs tank actions, and pings
// fish so you can find them behind the kelp.
export function startSonar({ toggle, sources }) {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const shortcut = mac ? "⌘K" : "Ctrl K";
  const root = document.createElement("div");
  root.className = "sonar";
  root.hidden = true;
  root.innerHTML = `
    <div class="sonar-panel" role="dialog" aria-modal="true" aria-label="Sonar search">
      <div class="sonar-bar">
        <span class="sonar-scope" aria-hidden="true"><span></span></span>
        <input class="sonar-input" type="text" autocomplete="off" spellcheck="false"
          placeholder="Search apps, tides, and fish…" aria-label="Search the tank"
          role="combobox" aria-expanded="true" aria-controls="sonar-results" aria-autocomplete="list" />
        <kbd class="sonar-esc">esc</kbd>
      </div>
      <ul id="sonar-results" class="sonar-results" role="listbox" aria-label="Results"></ul>
      <p class="sonar-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> run</span><span>${shortcut} anywhere</span></p>
    </div>
  `;
  document.body.append(root);

  const input = root.querySelector(".sonar-input");
  const list = root.querySelector(".sonar-results");
  let results = [];
  let active = 0;
  let returnFocus = null;

  toggle?.querySelector(".sonar-key")?.replaceChildren(shortcut);
  toggle?.setAttribute("aria-keyshortcuts", mac ? "Meta+K" : "Control+K");

  function search() {
    const query = input.value.trim().toLowerCase();
    // Title hits outrank keyword hits; groups stay together, best group first.
    results = sources()
      .map((entry) => ({
        ...entry,
        score: Math.max(score(query, entry.title) * 2, score(query, entry.keywords ?? "")),
      }))
      .filter((entry) => entry.score > 0);
    const best = {};
    results.forEach((entry) => {
      best[entry.group] = Math.max(best[entry.group] ?? 0, entry.score);
    });
    results.sort((a, b) => (best[b.group] - best[a.group]) || (GROUP_ORDER[a.group] - GROUP_ORDER[b.group]) || (b.score - a.score));
    if (!query) results = results.filter((entry) => entry.group !== "fish" || entry.featured);
    active = 0;
    paint();
  }

  function paint() {
    list.replaceChildren();
    let lastGroup = null;
    results.forEach((entry, index) => {
      if (entry.group !== lastGroup) {
        lastGroup = entry.group;
        const head = document.createElement("li");
        head.className = "sonar-group";
        head.setAttribute("role", "presentation");
        head.textContent = GROUP_LABEL[entry.group];
        list.append(head);
      }
      const item = document.createElement("li");
      item.className = `sonar-item is-${entry.group}`;
      item.id = `sonar-opt-${index}`;
      item.setAttribute("role", "option");
      item.style.setProperty("--accent", entry.accent ?? "#7ee0d6");
      const icon = document.createElement("span");
      icon.className = "sonar-icon";
      if (entry.look) {
        const canvas = document.createElement("canvas");
        canvas.style.width = "30px";
        canvas.style.height = "30px";
        paintPortrait(canvas, entry.look, 30);
        icon.append(canvas);
      } else {
        icon.innerHTML = entry.icon ?? "";
      }
      const text = document.createElement("span");
      text.className = "sonar-text";
      const title = document.createElement("span");
      title.className = "sonar-title";
      title.textContent = entry.title;
      const sub = document.createElement("span");
      sub.className = "sonar-sub";
      sub.textContent = entry.sub ?? "";
      text.append(title, sub);
      const hint = document.createElement("span");
      hint.className = "sonar-hint";
      hint.textContent = entry.verb ?? "Open";
      item.append(icon, text, hint);
      item.addEventListener("pointermove", () => setActive(index));
      item.addEventListener("click", () => run(index));
      list.append(item);
    });
    if (!results.length) {
      const empty = document.createElement("li");
      empty.className = "sonar-empty";
      empty.textContent = "Nothing on sonar. Try a fish name, an app, or “night”.";
      list.append(empty);
    }
    setActive(0);
  }

  function setActive(index) {
    active = index;
    list.querySelectorAll(".sonar-item").forEach((item, i) => {
      const on = i === index;
      item.classList.toggle("is-active", on);
      item.setAttribute("aria-selected", String(on));
      if (on) item.scrollIntoView({ block: "nearest" });
    });
    if (results.length) input.setAttribute("aria-activedescendant", `sonar-opt-${index}`);
    else input.removeAttribute("aria-activedescendant");
  }

  function run(index) {
    const entry = results[index];
    if (!entry) return;
    close(false);
    entry.run();
  }

  function open() {
    if (!root.hidden) return;
    returnFocus = document.activeElement;
    root.hidden = false;
    input.value = "";
    search();
    input.focus();
  }

  function close(restore = true) {
    if (root.hidden) return;
    input.blur();
    root.hidden = true;
    if (restore && returnFocus instanceof HTMLElement) returnFocus.focus();
    returnFocus = null;
  }

  input.addEventListener("input", search);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!results.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((active + step + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
  });
  root.addEventListener("pointerdown", (event) => {
    if (event.target === root) close();
  });
  toggle?.addEventListener("click", () => (root.hidden ? open() : close()));

  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) return;
    const combo = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    if (combo) {
      event.preventDefault();
      if (root.hidden) open();
      else close();
    } else if (event.key === "/" && root.hidden && !isTyping(event.target)) {
      event.preventDefault();
      open();
    }
  });

  return {
    open,
    close,
    isOpen: () => !root.hidden,
  };
}
