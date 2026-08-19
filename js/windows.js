function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const POS_KEY = "aquariumos.window-positions";

function readPositions() {
  try {
    return JSON.parse(localStorage.getItem(POS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writePositions(value) {
  try {
    localStorage.setItem(POS_KEY, JSON.stringify(value));
  } catch {
    // Ignore quota / private mode.
  }
}

export class WindowManager {
  constructor(desktop) {
    this.desktop = desktop;
    this.windows = new Map();
    this.focused = null;
    this.z = 100;
    this.onChange = () => {};
  }

  open(app) {
    const existing = this.windows.get(app.id);
    if (existing) {
      if (existing.minimized) this.restore(app.id);
      this.focus(app.id);
      existing.el.classList.remove("is-nudge");
      void existing.el.offsetWidth;
      existing.el.classList.add("is-nudge");
      return existing;
    }

    const el = document.createElement("section");
    el.className = "window";
    el.dataset.app = app.id;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-labelledby", `${app.id}-title`);
    el.style.width = `${app.width}px`;
    el.style.height = `${app.height}px`;

    el.innerHTML = `
      <header class="window-titlebar">
        <span class="window-title" id="${app.id}-title">${app.title}</span>
        <div class="window-controls">
          <button class="window-bead window-min" type="button" aria-label="Minimize ${app.title}"></button>
          <button class="window-bead window-max" type="button" aria-label="Maximize ${app.title}"></button>
          <button class="window-bead window-close" type="button" aria-label="Close ${app.title}"></button>
        </div>
      </header>
      <div class="window-body"></div>
    `;

    const body = el.querySelector(".window-body");
    body.append(app.create());
    this.desktop.append(el);

    const desktop = this.desktop.getBoundingClientRect();
    const saved = readPositions()[app.id];
    const origin = this.windows.size;
    const x = saved
      ? desktop.left + saved.left
      : desktop.left + (app.left ?? 0.05 + origin * 0.06) * desktop.width;
    const y = saved
      ? desktop.top + saved.top
      : desktop.top + (app.top ?? 0.05 + origin * 0.08) * desktop.height;
    this.place(el, x, y, el.offsetWidth, el.offsetHeight);

    const record = { el, app, minimized: false, maximized: false, restoreBox: null };
    this.windows.set(app.id, record);
    this.bind(record);
    this.focus(app.id);
    this.onChange();
    return record;
  }

  bind(record) {
    const { el, app } = record;
    const titlebar = el.querySelector(".window-titlebar");
    const close = el.querySelector(".window-close");
    const min = el.querySelector(".window-min");
    const max = el.querySelector(".window-max");

    el.addEventListener("pointerdown", () => this.focus(app.id));
    close.addEventListener("click", (event) => {
      event.stopPropagation();
      this.close(app.id);
    });
    min.addEventListener("click", (event) => {
      event.stopPropagation();
      this.minimize(app.id);
    });
    max.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleMax(app.id);
    });

    let drag = null;
    titlebar.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      if (event.target.closest(".window-controls")) return;
      this.focus(app.id);
      if (record.maximized) this.toggleMax(app.id);
      const rect = el.getBoundingClientRect();
      drag = {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      };
      titlebar.setPointerCapture(event.pointerId);
    });

    titlebar.addEventListener("pointermove", (event) => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 5) {
        drag.moved = true;
      }
      if (!drag.moved) return;
      this.place(
        el,
        event.clientX - drag.offsetX,
        event.clientY - drag.offsetY,
        el.offsetWidth,
        el.offsetHeight,
      );
      this.showSnapHint(event.clientX);
    });

    const endDrag = (event) => {
      if (!drag) return;
      if (drag.moved) {
        this.applySnap(record, event.clientX);
        this.remember(app.id, el);
      }
      this.hideSnapHint();
      drag = null;
    };
    titlebar.addEventListener("pointerup", endDrag);
    titlebar.addEventListener("pointercancel", endDrag);
    titlebar.addEventListener("dblclick", (event) => {
      if (event.target.closest(".window-controls")) return;
      this.toggleMax(app.id);
    });
  }

  showSnapHint(clientX) {
    const ghost = document.querySelector("#snap-ghost");
    const desktop = this.desktop.getBoundingClientRect();
    if (!ghost) return;
    const edge = 36;
    if (clientX <= desktop.left + edge) {
      ghost.hidden = false;
      ghost.dataset.side = "left";
    } else if (clientX >= desktop.right - edge) {
      ghost.hidden = false;
      ghost.dataset.side = "right";
    } else {
      ghost.hidden = true;
      delete ghost.dataset.side;
    }
  }

  hideSnapHint() {
    const ghost = document.querySelector("#snap-ghost");
    if (ghost) ghost.hidden = true;
  }

  applySnap(record, clientX) {
    const desktop = this.desktop.getBoundingClientRect();
    const edge = 36;
    if (clientX <= desktop.left + edge) this.snap(record, "left");
    else if (clientX >= desktop.right - edge) this.snap(record, "right");
  }

  snap(record, side) {
    const { el } = record;
    record.maximized = false;
    el.classList.remove("is-max");
    el.style.top = "0px";
    el.style.width = "50%";
    el.style.height = "100%";
    el.style.left = side === "left" ? "0px" : "50%";
    el.querySelector(".window-max")?.setAttribute("aria-label", `Maximize ${record.app.title}`);
  }

  captureBox(el) {
    return {
      left: el.style.left,
      top: el.style.top,
      width: el.style.width,
      height: el.style.height,
    };
  }

  minimize(id) {
    const record = this.windows.get(id);
    if (!record) return;
    record.minimized = true;
    record.el.classList.add("is-minimized");
    const remaining = [...this.windows.values()].filter((item) => !item.minimized).at(-1);
    this.focused = remaining?.app.id ?? null;
    if (remaining) this.focus(remaining.app.id);
    else this.onChange();
  }

  toggleMax(id) {
    const record = this.windows.get(id);
    if (!record) return;
    if (record.maximized) {
      record.maximized = false;
      record.el.classList.remove("is-max");
      const box = record.restoreBox;
      if (box) {
        record.el.style.left = box.left;
        record.el.style.top = box.top;
        record.el.style.width = box.width;
        record.el.style.height = box.height;
      }
      record.el.querySelector(".window-max")?.setAttribute("aria-label", `Maximize ${record.app.title}`);
    } else {
      record.restoreBox = this.captureBox(record.el);
      record.maximized = true;
      record.el.classList.add("is-max");
      record.el.style.left = "0px";
      record.el.style.top = "0px";
      record.el.style.width = "100%";
      record.el.style.height = "100%";
      record.el.querySelector(".window-max")?.setAttribute("aria-label", `Restore ${record.app.title}`);
    }
    this.focus(id);
  }

  restore(id) {
    const record = this.windows.get(id);
    if (!record) return;
    record.minimized = false;
    record.el.classList.remove("is-minimized");
    this.focus(id);
  }

  place(el, x, y, width, height) {
    const desktop = this.desktop.getBoundingClientRect();
    const minVisible = 72;
    const nextX = clamp(x, desktop.left - width + minVisible, desktop.right - minVisible);
    const nextY = clamp(y, desktop.top, desktop.bottom - 36);
    el.style.left = `${nextX - desktop.left}px`;
    el.style.top = `${nextY - desktop.top}px`;
  }

  remember(id, el) {
    const desktop = this.desktop.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const all = readPositions();
    all[id] = {
      left: rect.left - desktop.left,
      top: rect.top - desktop.top,
    };
    writePositions(all);
  }

  focus(id) {
    const record = this.windows.get(id);
    if (!record) return;
    this.focused = id;
    this.z += 1;
    record.el.style.zIndex = String(this.z);
    this.windows.forEach((item) => {
      item.el.classList.toggle("is-active", item.app.id === id);
    });
    this.onChange();
  }

  closeFocused() {
    if (this.focused) this.close(this.focused);
  }

  close(id) {
    const record = this.windows.get(id);
    if (!record) return;

    const cleanup = record.el.querySelector(".window-body")?.firstElementChild;
    if (cleanup && typeof cleanup.cleanup === "function") cleanup.cleanup();

    this.windows.delete(id);
    const remaining = [...this.windows.values()].filter((item) => !item.minimized).at(-1);
    this.focused = remaining?.app.id ?? null;
    if (remaining) this.focus(remaining.app.id);
    else this.onChange();

    const finish = () => record.el.remove();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      finish();
      return;
    }

    record.el.classList.add("is-closing");
    const onEnd = (event) => {
      if (event.target !== record.el) return;
      record.el.removeEventListener("animationend", onEnd);
      finish();
    };
    record.el.addEventListener("animationend", onEnd);
    window.setTimeout(() => {
      record.el.removeEventListener("animationend", onEnd);
      if (record.el.isConnected) finish();
    }, 280);
  }

  isOpen(id) {
    return this.windows.has(id);
  }
}
