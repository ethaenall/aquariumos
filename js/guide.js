import { DART_LINE, LINES, STAGE_AT, paintPortrait } from "./fish.js?v=202610191223";

const ALL_LINES = [...LINES, DART_LINE];
const TOTAL = ALL_LINES.reduce((sum, line) => sum + line.stages.length, 0);
const PORTRAIT = 64;

const PING_ICON = `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="1.8" fill="currentColor"/><path d="M4.6 4.6a4.8 4.8 0 0 0 0 6.8M11.4 4.6a4.8 4.8 0 0 1 0 6.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M2.4 2.4a8 8 0 0 0 0 11.2M13.6 2.4a8 8 0 0 1 0 11.2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity="0.6"/></svg>`;

// Group the live school by line. The silver minnows are five fish on one line,
// so a line counts as far as its furthest-grown fish.
function summarize(school) {
  return ALL_LINES.map((line) => {
    const members = school.filter((fish) => fish.line === line.id);
    const lead = members.reduce((best, fish) => (!best || fish.meals > best.meals ? fish : best), null);
    return { line, members, lead, reached: lead ? lead.stage : -1 };
  });
}

export function createGuide(tank) {
  const wrap = document.createElement("div");
  wrap.className = "app-guide";
  wrap.innerHTML = `
    <header class="guide-head">
      <p class="guide-kicker">Field Guide</p>
      <h2 class="guide-title"><span class="guide-count">0</span> of ${TOTAL} forms found</h2>
      <div class="guide-meter" role="progressbar" aria-label="Forms found" aria-valuemin="0" aria-valuemax="${TOTAL}"><span></span></div>
      <p class="guide-help">Feed the tank to grow each fish. Dark shapes are forms you haven't met yet.</p>
    </header>
    <ol class="guide-lines"></ol>
  `;

  const list = wrap.querySelector(".guide-lines");
  const count = wrap.querySelector(".guide-count");
  const meter = wrap.querySelector(".guide-meter");
  const rows = ALL_LINES.map((line) => {
    const item = document.createElement("li");
    item.className = "guide-line";
    item.innerHTML = `
      <div class="guide-forms"></div>
      <div class="guide-meta">
        <p class="guide-now"></p>
        <div class="guide-step" aria-hidden="true"><span></span></div>
        <button type="button" class="guide-ping">${PING_ICON}<span>Ping</span></button>
      </div>
    `;
    const forms = item.querySelector(".guide-forms");
    const cells = line.stages.map((look) => {
      const figure = document.createElement("figure");
      figure.className = "guide-form";
      const canvas = document.createElement("canvas");
      canvas.style.width = `${PORTRAIT}px`;
      canvas.style.height = `${PORTRAIT}px`;
      const caption = document.createElement("figcaption");
      figure.append(canvas, caption);
      forms.append(figure);
      return { figure, canvas, caption, look, painted: null };
    });
    list.append(item);
    return {
      item,
      cells,
      now: item.querySelector(".guide-now"),
      step: item.querySelector(".guide-step span"),
      ping: item.querySelector(".guide-ping"),
      slots: [],
    };
  });

  rows.forEach((row) => {
    row.ping.addEventListener("click", () => {
      if (row.slots.length) tank?.ping(row.slots);
    });
  });

  function render() {
    const school = tank ? tank.school() : [];
    let found = 0;
    summarize(school).forEach(({ members, lead, reached }, index) => {
      const row = rows[index];
      row.slots = members.map((fish) => fish.slot);
      row.cells.forEach((cell, stage) => {
        const known = stage <= reached;
        if (known) found += 1;
        cell.figure.classList.toggle("is-found", known);
        cell.figure.classList.toggle("is-current", stage === reached);
        cell.caption.textContent = known ? cell.look.name : "???";
        cell.figure.setAttribute("aria-label", known ? cell.look.name : "Undiscovered form");
        const state = known ? "known" : "hidden";
        if (cell.painted !== state) {
          paintPortrait(cell.canvas, cell.look, PORTRAIT, !known);
          cell.painted = state;
        }
      });
      if (!lead) {
        row.now.textContent = "Not in this tank";
        row.step.style.width = "0%";
        row.ping.disabled = true;
        return;
      }
      const crowd = members.length > 1 ? ` · ${members.length} in the school` : "";
      const meals = `${lead.meals} meal${lead.meals === 1 ? "" : "s"}`;
      row.now.innerHTML = lead.next
        ? `<strong>${lead.name}</strong> · ${meals}${crowd} · <em>${lead.toNext} more to grow</em>`
        : `<strong>${lead.name}</strong> · ${meals}${crowd} · <em>fully grown</em>`;
      const into = lead.meals - STAGE_AT[lead.stage];
      const done = lead.next ? into / (into + lead.toNext) : 1;
      row.step.style.width = `${Math.round(done * 100)}%`;
      row.ping.disabled = false;
      row.ping.setAttribute("aria-label", `Ping the ${lead.name} in the tank`);
    });
    count.textContent = String(found);
    meter.setAttribute("aria-valuenow", String(found));
    meter.style.setProperty("--fill", `${(found / TOTAL) * 100}%`);
  }

  const onFeed = () => render();
  window.addEventListener("aquarium:feed", onFeed);
  wrap.cleanup = () => window.removeEventListener("aquarium:feed", onFeed);
  render();
  return wrap;
}
