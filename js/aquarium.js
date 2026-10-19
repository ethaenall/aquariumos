import { DART_LINE, Fish, LINES, loadSchool, mealsToNext, rand, saveSchool } from "./fish.js?v=202610191453";
import { sandBack, sandFront } from "./seabed.js?v=202610191453";

const TAU = Math.PI * 2;
const TIDE_LEVEL = { day: 0, dusk: 1, night: 2 };
const DIVE_MS = 2800;
const FISH_FLOOR = 112;
const WAVE_PUSH = 2.5;
const PING_MS = 3400;
// After the dive, the school gathers under the title for a moment.
const RALLY_FROM = 700;
const RALLY_MS = 4200;
// A first visit meets a few grown residents, so the tank looks alive from the
// first frame. The other four lines still start as babies to grow.
const RESIDENTS = { teal: 6, orange: 6, blue: 6, copper: 6 };

const HAZE = {
  day: [16, 84, 104],
  dusk: [70, 44, 50],
  night: [4, 14, 30],
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mix3(a, b, t) {
  return a.map((value, i) => Math.round(value + (b[i] - value) * t));
}

function sprite(size, paint) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  paint(canvas.getContext("2d"), size / 2);
  return canvas;
}

function glowSprite(rgb) {
  return sprite(64, (g, r) => {
    const grad = g.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, `rgba(${rgb}, 1)`);
    grad.addColorStop(0.18, `rgba(${rgb}, 0.6)`);
    grad.addColorStop(0.5, `rgba(${rgb}, 0.14)`);
    grad.addColorStop(1, `rgba(${rgb}, 0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, r * 2, r * 2);
  });
}

function makeSprites() {
  return {
    bubble: sprite(64, (g, r) => {
      const rim = g.createRadialGradient(r, r, r * 0.5, r, r, r);
      rim.addColorStop(0, "rgba(210, 245, 250, 0.03)");
      rim.addColorStop(0.8, "rgba(210, 245, 250, 0.2)");
      rim.addColorStop(0.94, "rgba(236, 252, 255, 0.8)");
      rim.addColorStop(1, "rgba(236, 252, 255, 0)");
      g.fillStyle = rim;
      g.beginPath();
      g.arc(r, r, r, 0, TAU);
      g.fill();
      g.fillStyle = "rgba(255, 255, 255, 0.9)";
      g.beginPath();
      g.ellipse(r * 0.66, r * 0.6, r * 0.22, r * 0.12, -0.7, 0, TAU);
      g.fill();
    }),
    shadow: sprite(64, (g, r) => {
      const grad = g.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, "rgba(2, 12, 14, 0.9)");
      grad.addColorStop(1, "rgba(2, 12, 14, 0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, r * 2, r * 2);
    }),
    cyan: glowSprite("120, 240, 230"),
    blue: glowSprite("120, 170, 255"),
    pink: glowSprite("240, 150, 220"),
    amber: glowSprite("255, 200, 120"),
    lime: glowSprite("200, 255, 140"),
  };
}

class Kelp {
  constructor(x, { height, width, hue, sat, light, alpha = 1, back = false }) {
    this.x = x;
    this.back = back;
    this.alpha = alpha;
    this.segments = 16;
    this.height = height;
    this.width = width;
    this.phase = rand(0, TAU);
    this.speed = rand(0.75, 1.2);
    this.bladeLen = clamp(height * 0.13, 26, 74);
    this.slots = Array.from({ length: this.segments + 1 }, (_, i) => ({
      on: i >= 2 && i < this.segments && Math.random() > 0.22,
      len: rand(0.7, 1.25),
      curl: rand(0.25, 0.7),
    }));
    this.bend = new Float32Array(this.segments + 1);
    this.points = Array.from({ length: this.segments + 1 }, () => ({ x, y: 0, a: -Math.PI / 2 }));
    this.stalk = `hsl(${hue}, ${sat}%, ${light}%)`;
    this.rib = `hsla(${hue + 10}, ${sat + 15}%, ${light + 30}%, 0.35)`;
    this.blades = this.points.map((_, i) => {
      const k = i / this.segments;
      return `hsl(${hue + k * 10}, ${sat + 6}%, ${light + 6 + k * 14}%)`;
    });
    this.bladder = `hsl(${hue - 50}, ${sat + 10}%, ${light + 18}%)`;
  }

  update(time, current, mouse, ground, reduceMotion) {
    const n = this.segments;
    const step = this.height / n;
    const amp = reduceMotion ? 0.01 : 0.042;
    const pts = this.points;
    let x = this.x;
    let y = ground;
    let a = -Math.PI / 2 + current * 0.03;
    pts[0].x = x;
    pts[0].y = y;
    pts[0].a = a;
    for (let i = 1; i <= n; i += 1) {
      const k = i / n;
      a += Math.sin(time * 0.0007 * this.speed + i * 0.36 + this.phase) * amp * k + current * 0.008 * k;
      let target = 0;
      if (mouse.on && !this.back) {
        const dx = pts[i].x - mouse.x;
        const d = Math.hypot(dx, pts[i].y - mouse.y);
        if (d < 130) target = Math.sign(dx || 1) * (1 - d / 130) ** 2 * 0.07;
      }
      this.bend[i] += (target - this.bend[i]) * 0.05;
      a += this.bend[i];
      x += Math.cos(a) * step;
      y += Math.sin(a) * step;
      pts[i].x = x;
      pts[i].y = y;
      pts[i].a = a;
    }
  }

  draw(ctx, time) {
    const pts = this.points;
    const n = this.segments;
    ctx.globalAlpha = this.alpha;

    for (let i = 2; i < n; i += 1) {
      const slot = this.slots[i];
      if (!slot.on) continue;
      const p = pts[i];
      const side = i % 2 ? 1 : -1;
      const flutter = Math.sin(time * 0.0012 * this.speed + i * 0.9 + this.phase) * 0.3;
      const dir = p.a + side * (0.42 + flutter * 0.5);
      const bendTo = dir - side * slot.curl + flutter * 0.4;
      const len = this.bladeLen * slot.len * (0.6 + Math.sin((i / n) * Math.PI) * 0.5);
      const half = len * 0.5;
      const mx = p.x + Math.cos(dir) * half;
      const my = p.y + Math.sin(dir) * half;
      const tx = mx + Math.cos(bendTo) * half;
      const ty = my + Math.sin(bendTo) * half;
      const bw = len * 0.15;
      const nx = -Math.sin(dir) * bw;
      const ny = Math.cos(dir) * bw;
      ctx.fillStyle = this.blades[i];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(mx + nx, my + ny, tx, ty);
      ctx.quadraticCurveTo(mx - nx * 0.7, my - ny * 0.7, p.x, p.y);
      ctx.fill();
      if (!this.back) {
        ctx.strokeStyle = this.rib;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(mx + nx * 0.15, my + ny * 0.15, tx, ty);
        ctx.stroke();
        ctx.fillStyle = this.bladder;
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(dir) * 3, p.y + Math.sin(dir) * 3, this.width * 0.3, 0, TAU);
        ctx.fill();
      }
    }

    ctx.fillStyle = this.stalk;
    ctx.beginPath();
    for (let i = 0; i <= n; i += 1) {
      const p = pts[i];
      const w = this.width * (1 - (i / n) * 0.65) * 0.5;
      const px = p.x - Math.sin(p.a) * w;
      const py = p.y + Math.cos(p.a) * w;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    for (let i = n; i >= 0; i -= 1) {
      const p = pts[i];
      const w = this.width * (1 - (i / n) * 0.65) * 0.5;
      ctx.lineTo(p.x + Math.sin(p.a) * w, p.y - Math.cos(p.a) * w);
    }
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const GRASS = ["#2f8f5e", "#3aa46a", "#56b06a", "#257a55", "#7cb85a", "#1f6e4c"];
const ALGAE = ["#b5574a", "#c97b6a", "#d48978"];

class Tuft {
  constructor(x) {
    this.x = x;
    this.bend = 0;
    const red = Math.random() < 0.12;
    const count = 3 + Math.floor(Math.random() * 4);
    this.blades = Array.from({ length: count }, () => ({
      off: rand(-5, 5),
      h: rand(9, red ? 20 : 32),
      lean: rand(-0.35, 0.35),
      w: rand(1.4, 2.8),
      phase: rand(0, TAU),
      speed: rand(0.8, 1.3),
      color: red ? ALGAE[Math.floor(Math.random() * ALGAE.length)] : GRASS[Math.floor(Math.random() * GRASS.length)],
    }));
  }

  update(mouse, ground) {
    let target = 0;
    if (mouse.on) {
      const dx = this.x - mouse.x;
      const d = Math.hypot(dx, (ground - 14 - mouse.y) * 1.4);
      if (d < 70) target = Math.sign(dx || 1) * (1 - d / 70) * 0.7;
    }
    this.bend += (target - this.bend) * 0.08;
  }

  draw(ctx, time, ground, motion) {
    this.blades.forEach((b) => {
      const base = this.x + b.off;
      const sway = (Math.sin(time * 0.0013 * b.speed + b.phase + this.x * 0.01) * 0.14 * motion + this.bend) * b.h;
      const tipX = base + b.lean * b.h + sway;
      const tipY = ground - b.h;
      const midX = base + b.lean * b.h * 0.4 + sway * 0.3;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.moveTo(base - b.w, ground);
      ctx.quadraticCurveTo(midX - b.w * 0.3, ground - b.h * 0.55, tipX, tipY);
      ctx.quadraticCurveTo(midX + b.w * 0.6, ground - b.h * 0.5, base + b.w, ground);
      ctx.fill();
    });
  }
}

class Jelly {
  constructor(width, height, reduceMotion) {
    this.x = rand(80, width - 80);
    this.y = rand(height * 0.2, height * 0.7);
    this.size = rand(13, 24);
    this.speed = reduceMotion ? 0.1 : rand(0.22, 0.4);
    this.phase = rand(0, TAU);
    this.beat = 0;
    this.pink = Math.random() > 0.5;
    this.rgb = this.pink ? "226, 190, 238" : "180, 232, 240";
  }

  update(width, height, time) {
    this.beat = Math.max(0, Math.sin(time * 0.0021 + this.phase)) ** 2;
    this.y -= this.speed * (0.3 + this.beat * 1.9);
    this.x += Math.sin(time * 0.0006 + this.phase) * 0.3;
    if (this.y < -70) {
      this.y = height - FISH_FLOOR - rand(0, 60);
      this.x = rand(60, width - 60);
    }
  }

  draw(ctx, time) {
    const s = this.size;
    const w = s * (1 - this.beat * 0.14);
    const h = s * 0.82 * (1 + this.beat * 0.16);
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.strokeStyle = `rgba(${this.rgb}, 0.32)`;
    ctx.lineWidth = 1;
    for (let i = -3; i <= 3; i += 1) {
      const len = s * (2.1 + Math.abs(i) * 0.12 + this.beat * 0.3);
      ctx.beginPath();
      ctx.moveTo(i * w * 0.24, 0);
      for (let k = 1; k <= 6; k += 1) {
        const f = k / 6;
        ctx.lineTo(i * w * 0.24 * (1 - f * 0.3) + Math.sin(time * 0.004 + k * 0.8 + i) * s * 0.16 * f, len * f);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = `rgba(${this.rgb}, 0.28)`;
    ctx.lineWidth = 2.6;
    for (let i = -1; i <= 1; i += 2) {
      ctx.beginPath();
      ctx.moveTo(i * w * 0.12, 0);
      ctx.quadraticCurveTo(i * w * 0.3 + Math.sin(time * 0.003 + i) * s * 0.2, s * 0.7, i * w * 0.08, s * 1.3);
      ctx.stroke();
    }

    const fill = ctx.createRadialGradient(0, -h * 0.55, s * 0.05, 0, -h * 0.2, s * 1.15);
    fill.addColorStop(0, `rgba(${this.rgb}, 0.62)`);
    fill.addColorStop(0.65, `rgba(${this.rgb}, 0.24)`);
    fill.addColorStop(1, `rgba(${this.rgb}, 0.08)`);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(-w, 0);
    ctx.bezierCurveTo(-w, -h * 1.32, w, -h * 1.32, w, 0);
    for (let k = 3; k >= -3; k -= 1) {
      const x = (k / 4) * w;
      ctx.quadraticCurveTo(x + w / 8, s * 0.16, x, 0);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-w * 0.7, -h * 0.5);
    ctx.bezierCurveTo(-w * 0.6, -h * 1.05, w * 0.1, -h * 1.1, w * 0.4, -h * 0.92);
    ctx.stroke();
    ctx.strokeStyle = `rgba(${this.rgb}, 0.5)`;
    for (let i = -1; i <= 1; i += 2) {
      ctx.beginPath();
      ctx.arc(i * w * 0.24, -h * 0.4, s * 0.16, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export function startAquarium(canvas, { water = null, veil = null, overlay = null } = {}) {
  const ctx = canvas.getContext("2d");
  // Pings draw above the windows so a fish behind the glass can still be found.
  const fx = overlay ? overlay.getContext("2d") : ctx;
  let fxDirty = false;
  const mouse = { x: 0, y: 0, on: false, wake: 0 };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const art = makeSprites();
  const fish = [];
  const jellies = [];
  const bubbles = [];
  const motes = [];
  const foods = [];
  const ripples = [];
  const pings = [];
  let frontKelp = [];
  let backKelp = [];
  let tufts = [];
  let vents = [];
  let width = 0;
  let height = 0;
  let lampR = 360;
  let raf = 0;
  let lastRipple = 0;
  let wakeTick = 0;
  let tide = "day";
  let tideBlend = 0;
  let tideSet = false;
  let diveStart = 0;
  let onEvolve = () => {};
  let onFeed = () => {};
  let onPing = () => {};

  const groundFront = (x) => height - sandFront(x) + 4;
  const groundBack = (x) => height - sandBack(x) + 4;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lampR = clamp(Math.min(width, height) * 0.46, 220, 480);
    veil?.style.setProperty("--lr", `${lampR}px`);
    if (overlay) {
      overlay.width = canvas.width;
      overlay.height = canvas.height;
      overlay.style.width = `${width}px`;
      overlay.style.height = `${height}px`;
      fx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function plant() {
    const narrow = width < 720;
    const tall = (min, max) => Math.min(rand(min, max) * height, 640);
    const front = narrow ? [0.02, 0.07, 0.93, 0.98] : [0.012, 0.042, 0.082, 0.918, 0.956, 0.988];
    frontKelp = front.map((f) => new Kelp(f * width + rand(-8, 8), {
      height: tall(0.46, 0.8),
      width: rand(8, 12),
      hue: rand(128, 152),
      sat: rand(38, 50),
      light: rand(20, 27),
    }));
    const backCount = narrow ? 3 : 7;
    backKelp = Array.from({ length: backCount }, (_, i) => new Kelp(((i + rand(0.2, 0.8)) / backCount) * width, {
      height: tall(0.22, 0.5),
      width: rand(5, 8),
      hue: rand(172, 190),
      sat: rand(30, 40),
      light: rand(20, 25),
      alpha: 0.32,
      back: true,
    }));
    backKelp.sort((a, b) => b.height - a.height);

    tufts = [];
    for (let x = rand(0, 12); x < width; x += rand(14, 34)) {
      if (Math.random() < 0.82) tufts.push(new Tuft(x));
    }

    vents = [0.27, 0.64, 0.87].map((f) => ({ x: f * width, next: rand(500, 3000), left: 0 }));

    motes.length = 0;
    const moteCount = Math.round(clamp((width * height) / 14000, 40, 150));
    for (let i = 0; i < moteCount; i += 1) {
      motes.push({
        x: rand(0, width),
        y: rand(0, height),
        r: rand(0.5, 1.4),
        vy: rand(-0.12, -0.03),
        phase: rand(0, TAU),
        flare: 0,
      });
    }
  }

  function seed() {
    fish.length = 0;
    jellies.length = 0;
    bubbles.length = 0;
    // The school is saved in depth order, so match progress by line id, not slot.
    const saved = loadSchool();
    const fresh = saved.length === 0;
    const mealsFor = (id) => {
      if (fresh) return RESIDENTS[id] ?? 0;
      const at = saved.findIndex((entry) => entry?.id === id);
      if (at < 0) return 0;
      const [entry] = saved.splice(at, 1);
      return Number(entry.meals) || 0;
    };
    LINES.forEach((line) => {
      fish.push(new Fish(width, height, line, reduceMotion, mealsFor(line.id)));
    });
    for (let i = 0; i < 5; i += 1) {
      fish.push(new Fish(width, height, DART_LINE, reduceMotion, mealsFor(DART_LINE.id)));
    }
    fish.forEach((item, slot) => {
      item.slot = slot;
    });
    for (let i = 0; i < 3; i += 1) jellies.push(new Jelly(width, height, reduceMotion));
    const ambient = reduceMotion ? 6 : 16;
    for (let i = 0; i < ambient; i += 1) {
      bubbles.push({ x: rand(20, width - 20), y: rand(0, height), r: rand(1.2, 3.6), vy: rand(0.35, 1), phase: rand(0, TAU), wob: 0.35, ambient: true });
    }
    if (!reduceMotion) {
      for (let i = 0; i < 130; i += 1) {
        bubbles.push({ x: rand(0, width), y: rand(height * 0.4, height * 1.35), r: rand(1.5, 8), vy: rand(2.4, 7.5), phase: rand(0, TAU), wob: 0.8 });
      }
    }
  }

  function addBubble(x, y, r, vy) {
    if (bubbles.length > 260) return;
    bubbles.push({ x, y, r, vy, phase: rand(0, TAU), wob: 0.2, grow: true });
  }

  function surfaceLine(time) {
    if (reduceMotion) return -6;
    const t = clamp((time - diveStart) / DIVE_MS, 0, 1);
    const ease = 1 - (1 - t) ** 3;
    return height * 0.42 * (1 - ease) - 6 * ease;
  }

  function drawFx(item, time) {
    if (item.ateAt && time - item.ateAt.t < 520) {
      const age = (time - item.ateAt.t) / 520;
      ctx.beginPath();
      ctx.arc(item.ateAt.x, item.ateAt.y - age * 22, 3 + age * 7, 0, TAU);
      ctx.strokeStyle = `rgba(255, 236, 180, ${0.55 * (1 - age)})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    if (item.evolvedAt && time - item.evolvedAt.t < 900) {
      const age = (time - item.evolvedAt.t) / 900;
      const spark = 1 - age;
      const { x, y } = item.evolvedAt;
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.8 * spark;
      const glow = 40 + age * 70;
      ctx.drawImage(art.amber, x - glow, y - glow, glow * 2, glow * 2);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.arc(x, y, 10 + age * 44, 0, TAU);
      ctx.strokeStyle = `rgba(255, 220, 120, ${0.62 * spark})`;
      ctx.lineWidth = 2.4;
      ctx.stroke();
      for (let i = 0; i < 9; i += 1) {
        const a = age * Math.PI * 1.6 + i * (TAU / 9);
        const r = 14 + age * 40;
        ctx.fillStyle = `rgba(255, 240, 190, ${0.85 * spark})`;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 2, 0, TAU);
        ctx.fill();
      }
    }
  }

  function pill(x, y, title, sub, alpha) {
    fx.font = "600 13px Outfit, system-ui, sans-serif";
    const titleW = fx.measureText(title).width;
    fx.font = "500 11px Outfit, system-ui, sans-serif";
    const subW = fx.measureText(sub).width;
    const w = Math.max(titleW, subW) + 26;
    const h = 42;
    const left = clamp(x - w / 2, 8, width - w - 8);
    const top = clamp(y - h, 62, height - h - 8);
    fx.globalAlpha = alpha;
    fx.beginPath();
    fx.roundRect(left, top, w, h, 14);
    fx.fillStyle = "rgba(6, 28, 38, 0.78)";
    fx.fill();
    fx.strokeStyle = "rgba(126, 224, 214, 0.55)";
    fx.lineWidth = 1;
    fx.stroke();
    fx.textAlign = "center";
    fx.textBaseline = "alphabetic";
    fx.fillStyle = "#e8f7f4";
    fx.font = "600 13px Outfit, system-ui, sans-serif";
    fx.fillText(title, left + w / 2, top + 18);
    fx.fillStyle = "rgba(197, 232, 225, 0.82)";
    fx.font = "500 11px Outfit, system-ui, sans-serif";
    fx.fillText(sub, left + w / 2, top + 33);
    fx.textAlign = "start";
    fx.globalAlpha = 1;
  }

  function drawPings(time) {
    for (let i = pings.length - 1; i >= 0; i -= 1) {
      const ping = pings[i];
      const age = (time - ping.t) / PING_MS;
      if (age >= 1) {
        pings.splice(i, 1);
        continue;
      }
      const { fish: item } = ping;
      for (let k = 0; k < 3; k += 1) {
        const wave = age * 1.8 - k * 0.24;
        if (wave < 0 || wave > 1) continue;
        fx.beginPath();
        fx.arc(item.x, item.y, item.drawn * 0.9 + wave * 120, 0, TAU);
        fx.strokeStyle = `rgba(126, 224, 214, ${0.7 * (1 - wave)})`;
        fx.lineWidth = 1.8 - wave;
        fx.stroke();
      }
      fx.beginPath();
      fx.arc(item.x, item.y, item.drawn * 1.15, 0, TAU);
      fx.strokeStyle = `rgba(232, 247, 244, ${0.5 * (1 - age)})`;
      fx.setLineDash([3, 5]);
      fx.lineWidth = 1.2;
      fx.stroke();
      fx.setLineDash([]);
      if (!ping.tag) continue;
      const left = mealsToNext(item.meals);
      const next = item.line.stages[item.stage + 1]?.name;
      const meals = `${item.meals} meal${item.meals === 1 ? "" : "s"}`;
      const sub = next ? `${meals} · ${left} more to ${next}` : `${meals} · final form`;
      const fade = Math.min(1, age * 8, (1 - age) * 5);
      pill(item.x, item.y - item.drawn * 1.3 - 6, item.name, sub, fade);
    }
  }

  function frame(time) {
    const targetTide = TIDE_LEVEL[tide] ?? 0;
    tideBlend += (targetTide - tideBlend) * (reduceMotion ? 1 : 0.04);
    const dusk = clamp(tideBlend, 0, 1) - clamp(tideBlend - 1, 0, 1);
    const night = clamp(tideBlend - 1, 0, 1);
    const sun = 1 - dusk * 0.4 - night * 0.8;
    const current = Math.sin(time * 0.00016) * 0.9;
    const motion = reduceMotion ? 0.2 : 1;
    const surface = surfaceLine(time);
    const lure = mouse.on ? clamp((night - 0.5) / 0.4, 0, 1) : 0;
    const since = time - diveStart - RALLY_FROM;
    const rally = !reduceMotion && since > 0 && since < RALLY_MS ? Math.sin((since / RALLY_MS) * Math.PI) : 0;
    const rallyPoint = { x: width / 2, y: height * 0.48, on: true };
    let schoolDirty = false;

    water?.render((time / 1000) * (reduceMotion ? 0.25 : 1), tideBlend, surface);
    ctx.clearRect(0, 0, width, height);

    backKelp.forEach((kelp) => {
      kelp.update(time, current, mouse, groundBack(kelp.x), reduceMotion);
      kelp.draw(ctx, time);
    });

    motes.forEach((mote) => {
      mote.y += mote.vy;
      mote.x += Math.sin(time * 0.0008 + mote.phase) * 0.12;
      if (mote.y < -4) {
        mote.y = height + 4;
        mote.x = rand(0, width);
      }
      if (mouse.on) {
        const d = Math.hypot(mote.x - mouse.x, mote.y - mouse.y);
        const reach = lure > 0.05 ? lampR * 0.8 : 130;
        if (d < reach) mote.flare = Math.max(mote.flare, (1 - d / reach) * (lure > 0.05 ? 0.7 : 1));
      }
      mote.flare *= 0.985;
    });
    ctx.fillStyle = `rgba(220, 245, 250, ${0.24 * (1 - night)})`;
    motes.forEach((mote) => {
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.r, 0, TAU);
      ctx.fill();
    });

    jellies.forEach((jelly) => {
      jelly.update(width, height, time);
      jelly.draw(ctx, time);
    });

    fish.forEach((item) => {
      const ground = height - sandFront(item.x) * 0.55;
      const lift = ground - item.y;
      if (lift <= 0) return;
      const near = 1 - clamp(lift / (height * 0.65), 0, 1);
      const alpha = 0.26 * near * near * sun;
      if (alpha < 0.01) return;
      const w = item.drawn * (1.3 + (1 - near) * 1.4);
      ctx.globalAlpha = alpha;
      ctx.drawImage(art.shadow, item.x - w, ground - w * 0.22, w * 2, w * 0.44);
    });
    ctx.globalAlpha = 1;

    for (let i = ripples.length - 1; i >= 0; i -= 1) {
      const ripple = ripples[i];
      ripple.r += ripple.strong ? 1.7 : 0.9;
      ripple.life -= ripple.strong ? 0.012 : 0.02;
      if (ripple.life <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.r, 0, TAU);
      ctx.strokeStyle = ripple.strong
        ? `rgba(240, 214, 150, ${0.42 * ripple.life})`
        : `rgba(210, 245, 250, ${0.2 * ripple.life})`;
      ctx.lineWidth = ripple.strong ? 2 : 1;
      ctx.stroke();
    }

    const hazeRgb = night > 0
      ? mix3(HAZE.dusk, HAZE.night, night)
      : mix3(HAZE.day, HAZE.dusk, dusk);
    const haze = { rgb: hazeRgb.join(", "), amount: 0.42, floor: 0 };
    wakeTick = (wakeTick + 1) % 4;
    fish.forEach((item, index) => {
      if (rally > 0.05 && lure < 0.05) {
        item.update(width, height, rallyPoint, time, current, foods, FISH_FLOOR, rally);
      } else {
        item.update(width, height, mouse, time, current, foods, FISH_FLOOR, lure);
      }
      if (water && !reduceMotion) {
        const flow = water.flow(item.x, item.y);
        if (flow) {
          item.shove(flow.x * WAVE_PUSH, flow.y * WAVE_PUSH);
        }
      }
      item.draw(ctx, time, haze);
      if (water && !reduceMotion && index % 4 === wakeTick) {
        const speed = Math.hypot(item.vx, item.vy);
        const tail = item.face >= 0 ? -1 : 1;
        water.disturb(item.x + tail * item.drawn * 0.9, item.y, speed * 0.28 * (0.5 + item.z * 0.5), item.drawn * 0.55);
      }
      if (night > 0.05) {
        motes.forEach((mote) => {
          if (Math.abs(mote.x - item.x) < item.drawn * 1.6 && Math.abs(mote.y - item.y) < item.drawn) {
            mote.flare = Math.max(mote.flare, 0.75);
          }
        });
      }
      if (item.needsSave) {
        schoolDirty = true;
        item.needsSave = false;
      }
      if (item.justFed) {
        onFeed(item);
        item.justFed = false;
      }
      if (item.justEvolved) {
        onEvolve(item.justEvolved);
        item.justEvolved = null;
      }
    });
    if (schoolDirty) saveSchool(fish);

    for (let i = foods.length - 1; i >= 0; i -= 1) {
      const flake = foods[i];
      if (flake.eaten) {
        foods.splice(i, 1);
        continue;
      }
      flake.y += flake.vy;
      flake.x += Math.sin(time * 0.003 + flake.wobble) * 0.4;
      flake.spin += 0.03;
      const rest = groundFront(flake.x) - 30;
      if (flake.y > rest) {
        flake.y = rest;
        flake.vy = 0;
        flake.life -= 0.004;
        if (flake.life <= 0) {
          foods.splice(i, 1);
          continue;
        }
      }
      ctx.fillStyle = `rgba(232, 176, 92, ${0.9 * flake.life})`;
      ctx.beginPath();
      ctx.ellipse(flake.x, flake.y, flake.r, flake.r * 0.55, flake.spin, 0, TAU);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 244, 210, ${0.5 * flake.life})`;
      ctx.beginPath();
      ctx.ellipse(flake.x - 0.8, flake.y - 0.6, flake.r * 0.35, flake.r * 0.2, flake.spin, 0, TAU);
      ctx.fill();
    }

    frontKelp.forEach((kelp) => {
      kelp.update(time, current, mouse, groundFront(kelp.x), reduceMotion);
      kelp.draw(ctx, time);
    });

    tufts.forEach((tuft) => {
      const ground = groundFront(tuft.x);
      tuft.update(mouse, ground);
      tuft.draw(ctx, time, ground, motion);
    });

    if (!reduceMotion) {
      vents.forEach((vent) => {
        vent.next -= 16;
        if (vent.next > 0) return;
        if (vent.left <= 0) vent.left = 3 + Math.floor(Math.random() * 8);
        addBubble(vent.x + rand(-3, 3), groundFront(vent.x) - 6, rand(1.6, 3.8), rand(0.9, 1.4));
        vent.left -= 1;
        vent.next = vent.left > 0 ? rand(70, 160) : rand(2600, 6500);
      });
    }

    for (let i = bubbles.length - 1; i >= 0; i -= 1) {
      const b = bubbles[i];
      b.y -= b.vy;
      b.x += Math.sin(time * 0.003 + b.phase) * b.wob;
      if (b.grow) {
        b.vy = Math.min(b.vy + 0.012, 2.6);
        b.r *= 1.0012;
        b.wob = Math.min(b.wob + 0.004, 0.8);
      }
      if (b.y < surface - b.r) {
        if (b.ambient) {
          b.y = height - 60;
          b.x = rand(20, width - 20);
        } else {
          if (water && surface > -20) water.disturb(b.x, Math.max(surface, 0) + 3, b.r * 0.35, b.r * 2.4);
          bubbles.splice(i, 1);
          continue;
        }
      }
      const r = b.r * 1.15;
      ctx.drawImage(art.bubble, b.x - r, b.y - r, r * 2, r * 2);
    }

    if (dusk > 0.01 || night > 0.01) {
      ctx.globalCompositeOperation = "source-atop";
      if (dusk > 0.01) {
        ctx.fillStyle = `rgba(70, 30, 12, ${0.22 * dusk})`;
        ctx.fillRect(0, 0, width, height);
      }
      if (night > 0.01) {
        // The lantern keeps fish inside its light in their true colours.
        const dark = 0.6 * night;
        if (lure > 0.01) {
          const shade = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, lampR);
          shade.addColorStop(0, `rgba(2, 8, 24, ${dark * (1 - 0.85 * lure)})`);
          shade.addColorStop(0.6, `rgba(2, 8, 24, ${dark * (1 - 0.5 * lure)})`);
          shade.addColorStop(1, `rgba(2, 8, 24, ${dark})`);
          ctx.fillStyle = shade;
        } else {
          ctx.fillStyle = `rgba(2, 8, 24, ${dark})`;
        }
        ctx.fillRect(0, 0, width, height);
      }
    }

    ctx.globalCompositeOperation = "lighter";
    if (lure > 0.01) {
      const g = lampR * (0.85 + Math.sin(time * 0.003) * 0.03);
      ctx.globalAlpha = 0.4 * lure;
      ctx.drawImage(art.amber, mouse.x - g, mouse.y - g, g * 2, g * 2);
      ctx.globalAlpha = 0.45 * lure;
      ctx.drawImage(art.amber, mouse.x - 12, mouse.y - 12, 24, 24);
    }
    const glowAmt = night + dusk * 0.35;
    if (glowAmt > 0.01) {
      motes.forEach((mote, i) => {
        const g = 5 + mote.flare * 18;
        ctx.globalAlpha = clamp(glowAmt * (0.24 + mote.flare * 0.9), 0, 1);
        ctx.drawImage(i % 7 === 0 ? art.blue : art.cyan, mote.x - g, mote.y - g, g * 2, g * 2);
      });
      jellies.forEach((jelly) => {
        const g = jelly.size * (3 + jelly.beat);
        ctx.globalAlpha = glowAmt * (0.38 + jelly.beat * 0.4);
        ctx.drawImage(jelly.pink ? art.pink : art.cyan, jelly.x - g, jelly.y - jelly.size * 0.4 - g, g * 2, g * 2);
      });
      fish.forEach((item) => {
        if (item.form !== "lantern") return;
        const facing = item.face >= 0 ? 1 : -1;
        const g = item.drawn * 1.8;
        const lx = item.x + facing * item.drawn * 0.85;
        const ly = item.y - item.drawn * 1.15;
        ctx.globalAlpha = glowAmt * 0.9;
        ctx.drawImage(item.stage === 3 ? art.lime : art.cyan, lx - g, ly - g, g * 2, g * 2);
      });
      foods.forEach((flake) => {
        ctx.globalAlpha = glowAmt * 0.35 * flake.life;
        ctx.drawImage(art.amber, flake.x - 10, flake.y - 10, 20, 20);
      });
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    fish.forEach((item) => drawFx(item, time));
    if (fx !== ctx && (pings.length || fxDirty)) fx.clearRect(0, 0, width, height);
    fxDirty = pings.length > 0;
    drawPings(time);

    raf = window.requestAnimationFrame(frame);
  }

  function onMove(event) {
    const fromX = mouse.x;
    const fromY = mouse.y;
    const moved = mouse.on ? Math.hypot(event.clientX - fromX, event.clientY - fromY) : 0;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.on = true;
    if (veil) {
      veil.style.setProperty("--lx", `${mouse.x}px`);
      veil.style.setProperty("--ly", `${mouse.y}px`);
      veil.classList.add("is-lit");
    }
    if (reduceMotion) return;
    if (water) {
      mouse.wake += (Math.min(moved / 18, 1.4) * 1.5 - mouse.wake) * 0.35;
      if (moved > 1 && moved < 400) water.stroke(fromX, fromY, mouse.x, mouse.y, mouse.wake, 13);
      return;
    }
    const now = performance.now();
    if (now - lastRipple > 90) {
      ripples.push({ x: mouse.x, y: mouse.y, r: 6, life: 1 });
      lastRipple = now;
    }
  }

  function onLeave() {
    mouse.on = false;
    veil?.classList.remove("is-lit");
  }

  function sprinkle(x, y) {
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i += 1) {
      if (foods.length >= 22) break;
      foods.push({
        x: x + rand(-22, 22),
        y: y + rand(-10, 10),
        vy: rand(0.35, 0.85),
        r: rand(2.4, 4.2),
        wobble: rand(0, 8),
        spin: rand(0, TAU),
        eaten: false,
        life: 1,
      });
    }
    if (water) {
      water.drop(x, y, reduceMotion ? 2 : 6);
    } else {
      ripples.push({ x, y, r: 10, life: 1, strong: true });
      ripples.push({ x, y, r: 4, life: 1, strong: true });
    }
  }

  function onResize() {
    resize();
    plant();
  }

  resize();
  plant();
  seed();
  fish.sort((a, b) => a.z - b.z);
  diveStart = performance.now();
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onMove);
  document.documentElement.addEventListener("pointerleave", onLeave);
  raf = window.requestAnimationFrame(frame);

  return {
    dropFood(x, y) {
      sprinkle(x, y);
    },
    feedFromSky() {
      sprinkle(rand(width * 0.2, width * 0.8), 48);
    },
    burst(x, y, count = 14) {
      if (reduceMotion) return;
      for (let i = 0; i < count; i += 1) {
        addBubble(x + rand(-18, 18), y + rand(-8, 8), rand(1.4, 4.6), rand(0.8, 2.2));
      }
    },
    school() {
      return fish
        .map((item) => ({
          slot: item.slot,
          line: item.line.id,
          name: item.name,
          stage: item.stage,
          meals: item.meals,
          look: item.look(),
          next: item.line.stages[item.stage + 1]?.name ?? null,
          toNext: mealsToNext(item.meals),
        }))
        .sort((a, b) => a.slot - b.slot);
    },
    ping(slots, source = "user") {
      const wanted = new Set(slots);
      const now = performance.now();
      const found = fish.filter((item) => wanted.has(item.slot));
      found.forEach((item, i) => {
        const existing = pings.findIndex((p) => p.fish === item);
        if (existing >= 0) pings.splice(existing, 1);
        pings.push({ fish: item, t: now + i * 120, tag: i === 0 });
        water?.drop(item.x, item.y, reduceMotion ? 1 : 3);
      });
      if (found.length) onPing(source);
      return found.length;
    },
    setTide(next) {
      if (reduceMotion || !tideSet) tideBlend = TIDE_LEVEL[next] ?? 0;
      tide = next;
      tideSet = true;
    },
    onFeed(handler) {
      onFeed = handler;
    },
    onPing(handler) {
      onPing = handler;
    },
    onEvolve(handler) {
      onEvolve = handler;
    },
    destroy() {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    },
  };
}
