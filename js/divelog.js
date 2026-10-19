const KEY = "aquariumos.divelog";

const STEPS = [
  { id: "feed", mouse: "Click the water to feed the fish", touch: "Tap the water to feed the fish" },
  { id: "evolve", mouse: "Keep feeding until a fish changes form", touch: "Keep feeding until a fish changes form" },
  { id: "sonar", mouse: "Press / and ping a fish by name", touch: "Tap Sonar and ping a fish" },
  { id: "lantern", mouse: "Switch to Night, then move into the water", touch: "Switch to Night, then touch the water" },
];

function read() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { done: Array.isArray(data.done) ? data.done : [], hidden: Boolean(data.hidden) };
  } catch {
    return { done: [], hidden: false };
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Ignore.
  }
}

// Dive log: a first-visit trail through the tank, one step at a time, so a
// stranger finds feeding, growth, Sonar, and the lantern in the first minute.
export function startDiveLog({ delay = 0, onGuide, onFinish } = {}) {
  const state = read();
  const touch = window.matchMedia("(hover: none)").matches;
  const done = new Set(state.done);
  const finished = () => STEPS.every((step) => done.has(step.id));
  if (state.hidden || finished()) return { complete() {} };

  const card = document.createElement("aside");
  card.className = "divelog";
  card.setAttribute("aria-live", "polite");
  card.setAttribute("aria-label", "Dive log");
  card.innerHTML = `
    <span class="divelog-kicker">Dive log</span>
    <span class="divelog-dots" aria-hidden="true">${"<i></i>".repeat(STEPS.length)}</span>
    <p class="divelog-text"></p>
    <button type="button" class="divelog-action" hidden>Open the guide</button>
    <button type="button" class="divelog-hide" aria-label="Hide the dive log">
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
  `;
  const cue = document.createElement("div");
  cue.className = "feed-cue";
  cue.setAttribute("aria-hidden", "true");
  cue.innerHTML = `<span></span><span></span><i></i><i></i><i></i><b>${touch ? "tap" : "click"} to feed</b>`;

  const text = card.querySelector(".divelog-text");
  const dots = [...card.querySelectorAll(".divelog-dots i")];
  const action = card.querySelector(".divelog-action");
  let shown = false;
  let swap = 0;

  function current() {
    return STEPS.find((step) => !done.has(step.id));
  }

  function render() {
    STEPS.forEach((step, i) => {
      dots[i].classList.toggle("is-done", done.has(step.id));
      dots[i].classList.toggle("is-now", step === current());
    });
    const step = current();
    if (!step) {
      text.textContent = "Log complete. Can you find all 32 forms?";
      action.hidden = false;
      card.classList.add("is-finished");
      const box = card.getBoundingClientRect();
      onFinish?.(box.left + box.width / 2, box.top);
      cue.remove();
      window.setTimeout(hide, 12000);
      return;
    }
    text.textContent = touch ? step.touch : step.mouse;
    cue.classList.toggle("is-on", step.id === "feed");
  }

  function hide() {
    card.classList.add("is-gone");
    cue.remove();
    window.setTimeout(() => card.remove(), 450);
  }

  card.querySelector(".divelog-hide").addEventListener("click", () => {
    write({ done: [...done], hidden: true });
    hide();
  });
  action.addEventListener("click", () => {
    onGuide?.();
    hide();
  });

  window.setTimeout(() => {
    shown = true;
    document.body.append(cue, card);
    render();
  }, delay);

  return {
    complete(id) {
      if (done.has(id) || !STEPS.some((step) => step.id === id)) return;
      const wasCurrent = current()?.id === id;
      done.add(id);
      write({ done: [...done], hidden: false });
      if (!shown) return;
      if (!wasCurrent) {
        render();
        return;
      }
      card.classList.remove("is-ticked");
      void card.offsetWidth;
      card.classList.add("is-ticked");
      window.clearTimeout(swap);
      swap = window.setTimeout(render, 650);
      if (id === "feed") cue.classList.remove("is-on");
    },
  };
}
