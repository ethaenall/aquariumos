export const STAGE_AT = [0, 2, 6, 12];
const SCHOOL_KEY = "aquariumos.school";

export const LINES = [
  {
    id: "teal",
    stages: [
      { name: "tetra", form: "fish", size: 16, speed: 1.18, body: "#2aa9b8", belly: "#9febe4", fin: "#0e5b66", accent: "#5ff2ff", depth: 0.42, pattern: "stripe" },
      { name: "chromis", form: "fish", size: 24, speed: 1.04, body: "#1f8f9c", belly: "#b7f4ee", fin: "#0a4a54", depth: 0.58 },
      { name: "angelfish", form: "angel", size: 34, speed: 0.82, body: "#2aa9b8", belly: "#f4e27a", fin: "#0e5b66", accent: "#e8c35a" },
      { name: "emperor", form: "angel", size: 46, speed: 0.68, body: "#1d6f9a", belly: "#f6e07a", fin: "#123a58", accent: "#f0d060" },
    ],
  },
  {
    id: "orange",
    stages: [
      { name: "goldfish", form: "fish", size: 18, speed: 0.92, body: "#e07a3d", belly: "#f3c48a", fin: "#c45a24", depth: 0.64, tail: "fan", tailLen: 0.85, tailSpread: 0.75 },
      { name: "carp", form: "fish", size: 26, speed: 0.8, body: "#d86a2c", belly: "#f7d2a0", fin: "#7a3010", depth: 0.5, pattern: "scales" },
      { name: "koi", form: "koi", size: 36, speed: 0.7, body: "#f2efe8", belly: "#fff8ee", fin: "#c45a3a", accent: "#d23a2a" },
      { name: "dragon koi", form: "koi", size: 48, speed: 0.6, body: "#f7f1e4", belly: "#fffaf2", fin: "#9a2a18", accent: "#e24a28" },
    ],
  },
  {
    id: "rose",
    stages: [
      { name: "guppy", form: "fish", size: 14, speed: 1.08, body: "#d9899a", belly: "#f4c9cc", fin: "#d0507a", depth: 0.4, tail: "fan", tailLen: 1, tailSpread: 0.95 },
      { name: "platy", form: "fish", size: 22, speed: 0.96, body: "#e07090", belly: "#f8c8d4", fin: "#7a3048", depth: 0.56 },
      { name: "betta", form: "betta", size: 30, speed: 0.78, body: "#c43a6a", belly: "#f4a0b8", fin: "#7a1840", accent: "#f0c878" },
      { name: "veil betta", form: "betta", size: 40, speed: 0.64, body: "#9a2060", belly: "#f080b0", fin: "#4a1028", accent: "#ffd080" },
    ],
  },
  {
    id: "gold",
    stages: [
      { name: "tang fry", form: "fish", size: 13, speed: 1.34, body: "#e8c35a", belly: "#f6e7ad", fin: "#b8862a", depth: 0.72 },
      { name: "butterfly", form: "fish", size: 22, speed: 1.12, body: "#f0c040", belly: "#fff0b8", fin: "#c07020", depth: 0.82, pattern: "butterfly" },
      { name: "mandarin", form: "lion", size: 30, speed: 0.74, body: "#3a6ec8", belly: "#f0c040", fin: "#e07030", accent: "#70e0c8" },
      { name: "lionfish", form: "lion", size: 42, speed: 0.58, body: "#e8b070", belly: "#fff0d0", fin: "#c04020", accent: "#f0d080" },
    ],
  },
  {
    id: "blue",
    stages: [
      { name: "damsel", form: "fish", size: 20, speed: 0.72, body: "#3d6ea8", belly: "#9ec4e4", fin: "#1c3d66", depth: 0.6 },
      { name: "blue tang", form: "fish", size: 28, speed: 0.78, body: "#2a6ad0", belly: "#5a9ae8", fin: "#f0d050", depth: 0.68, pattern: "band" },
      { name: "ray", form: "ray", size: 36, speed: 0.7, body: "#4a6a88", belly: "#c8d8e8", fin: "#243848" },
      { name: "eagle ray", form: "ray", size: 50, speed: 0.56, body: "#2a3848", belly: "#d8e4ee", fin: "#101820", accent: "#e8f0f6" },
    ],
  },
  {
    id: "mint",
    stages: [
      { name: "wrasse", form: "fish", size: 15, speed: 1.22, body: "#6fbfa0", belly: "#d5f0e4", fin: "#2d6b55", accent: "#f6a8c8", depth: 0.38, pattern: "stripe" },
      { name: "parrot", form: "fish", size: 24, speed: 0.9, body: "#3cb070", belly: "#f0c060", fin: "#1a6040", depth: 0.56, pattern: "scales" },
      { name: "seahorse", form: "horse", size: 28, speed: 0.48, body: "#e0a050", belly: "#f6d090", fin: "#b07030" },
      { name: "leafy", form: "horse", size: 38, speed: 0.4, body: "#7cb050", belly: "#d8f0a8", fin: "#3a6820", accent: "#c8e070" },
    ],
  },
  {
    id: "copper",
    stages: [
      { name: "catfish", form: "fish", size: 17, speed: 0.98, body: "#c27a4a", belly: "#efc7a0", fin: "#7a3d22", depth: 0.42, pattern: "spots" },
      { name: "pleco", form: "fish", size: 25, speed: 0.72, body: "#8a5a38", belly: "#d8b090", fin: "#4a2818", depth: 0.46, pattern: "spots" },
      { name: "lantern", form: "lantern", size: 32, speed: 0.66, body: "#1a2840", belly: "#3a5070", fin: "#0a1420", accent: "#7ee0d6" },
      { name: "angler", form: "lantern", size: 44, speed: 0.5, body: "#0e1828", belly: "#2a3850", fin: "#060c14", accent: "#c8ff8a" },
    ],
  },
];

export const DART_LINE = {
  id: "silver",
  stages: [
    { name: "minnow", form: "fish", size: 10, speed: 1.55, body: "#b8ccd4", belly: "#f4fbfc", fin: "#7ea0aa", accent: "#eefcff", depth: 0.36, pattern: "stripe" },
    { name: "smelt", form: "fish", size: 16, speed: 1.4, body: "#a8c2ce", belly: "#f6fcff", fin: "#5a7a88", accent: "#e8f6ff", depth: 0.34, pattern: "stripe" },
    { name: "needle", form: "eel", size: 22, speed: 1.28, body: "#9ec0c8", belly: "#e8f4f6", fin: "#4a6870" },
    { name: "ribbon eel", form: "eel", size: 30, speed: 1.05, body: "#3a88c8", belly: "#f0d060", fin: "#1a4068", accent: "#f0c040" },
  ],
};

export function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function stageFromMeals(meals) {
  let stage = 0;
  STAGE_AT.forEach((need, index) => {
    if (meals >= need) stage = index;
  });
  return stage;
}

export function mealsToNext(meals) {
  const next = STAGE_AT[stageFromMeals(meals) + 1];
  return next === undefined ? 0 : next - meals;
}

function mixHex(from, to, t) {
  const parse = (hex) => {
    const n = Number.parseInt(hex.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  };
  const a = parse(from);
  const b = parse(to);
  const mix = a.map((value, i) => Math.round(value + (b[i] - value) * t));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
}

export function loadSchool() {
  try {
    const data = JSON.parse(localStorage.getItem(SCHOOL_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveSchool(fish) {
  try {
    localStorage.setItem(
      SCHOOL_KEY,
      JSON.stringify(fish.map((item) => ({ id: item.line.id, meals: item.meals }))),
    );
  } catch {
    // Ignore.
  }
}

function rgbOf(color) {
  if (color[0] === "#") {
    const n = Number.parseInt(color.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }
  return color.match(/\d+/g).slice(0, 3).map(Number);
}

function tone(color, amount, alpha = 1) {
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  const [r, g, b] = rgbOf(color).map((v) => Math.round(v + (target - v) * t));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function paintEye(ctx, s, x = 0.55, y = -0.08, iris = "#efdca8") {
  const r = Math.max(1.6, 0.9 + s * 0.085);
  const cx = s * x;
  const cy = s * y;
  ctx.fillStyle = iris;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(4, 18, 24, 0.5)";
  ctx.lineWidth = Math.max(0.5, r * 0.18);
  ctx.stroke();
  ctx.fillStyle = "#051218";
  ctx.beginPath();
  ctx.arc(cx + r * 0.1, cy, r * 0.64, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.beginPath();
  ctx.arc(cx + r * 0.32, cy - r * 0.3, Math.max(0.45, r * 0.26), 0, Math.PI * 2);
  ctx.fill();
}

function bodyFill(ctx, s, body, belly, top = -0.62, bottom = 0.62) {
  const fill = ctx.createLinearGradient(0, s * top, 0, s * bottom);
  fill.addColorStop(0, tone(body, -0.32));
  fill.addColorStop(0.38, body);
  fill.addColorStop(0.74, belly);
  fill.addColorStop(1, tone(belly, 0.3));
  return fill;
}

function finishBody(ctx, s, fin, shape) {
  ctx.save();
  ctx.clip(shape);
  const shine = ctx.createRadialGradient(s * 0.3, -s * 0.45, 0, s * 0.3, -s * 0.45, s);
  shine.addColorStop(0, "rgba(255, 255, 255, 0.42)");
  shine.addColorStop(0.45, "rgba(255, 255, 255, 0.1)");
  shine.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = shine;
  ctx.fillRect(-s * 2, -s * 2, s * 4, s * 4);
  ctx.restore();
  ctx.strokeStyle = tone(fin, -0.45, 0.5);
  ctx.lineWidth = Math.max(0.6, s * 0.03);
  ctx.stroke(shape);
}

const BODY_LENGTH = 1.78;

function spineAt(u, s, swim) {
  return s * 0.2 * u * u * Math.sin(swim - u * 1.5);
}

function smoothClosed(points) {
  const path = new Path2D();
  const n = points.length;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(points[n - 1], points[0]);
  path.moveTo(start[0], start[1]);
  for (let i = 0; i < n; i += 1) {
    const p = points[i];
    const q = mid(p, points[(i + 1) % n]);
    path.quadraticCurveTo(p[0], p[1], q[0], q[1]);
  }
  path.closePath();
  return path;
}

function fishBody(s, swim, depth, ped) {
  const top = [];
  const bottom = [];
  for (let i = 0; i <= 12; i += 1) {
    const u = i / 12;
    const x = s * (1 - u * BODY_LENGTH);
    const h = (Math.sqrt(u) * (1 - u)) / 0.385;
    const c = spineAt(u, s, swim);
    top.push([x, c - s * (depth * 1.06 * h + ped * u)]);
    bottom.push([x, c + s * (depth * 0.9 * h + ped * u)]);
  }
  const outline = top.concat(bottom.slice(1).reverse());
  return { shape: smoothClosed(outline), top, bottom };
}

function spinePath(ctx, s, swim, from, to, lift) {
  ctx.beginPath();
  for (let i = 0; i <= 10; i += 1) {
    const u = from + ((to - from) * i) / 10;
    const x = s * (1 - u * BODY_LENGTH);
    const y = spineAt(u, s, swim) + lift;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}

function paintTail(ctx, s, swim, ped, fin, len, spread, fan) {
  const tipY = spineAt(1, s, swim);
  const bend = tipY - spineAt(0.9, s, swim);
  const angle = Math.atan2(-bend, 0.1 * BODY_LENGTH * s) * 1.6;
  const L = s * len;
  const W = s * spread;
  ctx.save();
  ctx.translate(s * (1 - BODY_LENGTH), tipY);
  ctx.rotate(angle);
  const tail = new Path2D();
  tail.moveTo(s * 0.12, -s * ped);
  tail.quadraticCurveTo(-L * 0.4, -W * 0.45, -L, -W);
  if (fan) {
    tail.quadraticCurveTo(-L * 1.32, 0, -L, W);
  } else {
    tail.quadraticCurveTo(-L * 0.72, -W * 0.22, -L * 0.6, 0);
    tail.quadraticCurveTo(-L * 0.72, W * 0.22, -L, W);
  }
  tail.quadraticCurveTo(-L * 0.4, W * 0.45, s * 0.12, s * ped);
  tail.closePath();
  const fill = ctx.createLinearGradient(0, 0, -L, 0);
  fill.addColorStop(0, tone(fin, 0, 0.95));
  fill.addColorStop(1, tone(fin, 0.2, fan ? 0.5 : 0.65));
  ctx.fillStyle = fill;
  ctx.fill(tail);
  if (s > 11) {
    ctx.save();
    ctx.clip(tail);
    ctx.strokeStyle = tone(fin, -0.35, 0.28);
    ctx.lineWidth = Math.max(0.5, s * 0.018);
    ctx.beginPath();
    for (let k = 0; k <= 6; k += 1) {
      const t = -1 + k / 3;
      ctx.moveTo(0, 0);
      ctx.lineTo(-L * 1.3, W * t * 1.2);
    }
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function paintFin(ctx, base, back, apex, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(base[0], base[1]);
  ctx.quadraticCurveTo(base[0] - (base[0] - apex[0]) * 0.15, apex[1], apex[0], apex[1]);
  ctx.quadraticCurveTo((apex[0] + back[0]) / 2, (apex[1] + back[1]) / 2, back[0], back[1]);
  ctx.closePath();
  ctx.fill();
}

function paintPattern(ctx, s, p, depth) {
  const at = (u) => s * (1 - u * BODY_LENGTH);
  if (p.pattern === "stripe") {
    spinePath(ctx, s, p.swim, 0.12, 1, -s * depth * 0.12);
    ctx.strokeStyle = tone(p.accent || p.belly, 0, 0.88);
    ctx.lineWidth = s * depth * 0.3;
    ctx.lineCap = "round";
    ctx.stroke();
  } else if (p.pattern === "band") {
    spinePath(ctx, s, p.swim, 0.22, 0.86, -s * depth * 0.28);
    ctx.strokeStyle = tone(p.body, -0.62, 0.85);
    ctx.lineWidth = s * depth * 0.42;
    ctx.lineCap = "round";
    ctx.stroke();
  } else if (p.pattern === "butterfly") {
    ctx.fillStyle = tone(p.fin, -0.2, 0.55);
    [0.18, 0.46].forEach((u) => {
      ctx.fillRect(at(u) - s * 0.07, -s * 2, s * 0.14, s * 4);
    });
    const ex = at(0.74);
    const ey = spineAt(0.74, s, p.swim) - s * depth * 0.35;
    ctx.fillStyle = "#1a1410";
    ctx.beginPath();
    ctx.arc(ex, ey, s * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = tone(p.belly, 0.4, 0.9);
    ctx.lineWidth = Math.max(0.6, s * 0.03);
    ctx.stroke();
  } else if (p.pattern === "spots") {
    ctx.fillStyle = tone(p.fin, -0.25, 0.5);
    ctx.beginPath();
    for (let i = 0; i < 14; i += 1) {
      const u = 0.12 + ((i * 0.618) % 1) * 0.8;
      const v = ((i * 0.381 + 0.17) % 1) * 2 - 1;
      const x = at(u);
      const y = spineAt(u, s, p.swim) + v * s * depth * 0.7;
      ctx.moveTo(x + s * 0.05, y);
      ctx.arc(x, y, s * 0.05, 0, Math.PI * 2);
    }
    ctx.fill();
  } else if (p.pattern === "koi") {
    ctx.fillStyle = p.accent || "#d23a2a";
    [[0.3, -0.35, 0.34, 0.24, -0.3], [0.62, -0.1, 0.24, 0.2, 0.4], [0.12, -0.2, 0.18, 0.14, 0.2]].forEach(([u, v, rx, ry, rot]) => {
      ctx.beginPath();
      ctx.ellipse(at(u), spineAt(u, s, p.swim) + v * s * depth, s * rx, s * ry, rot, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function paintScales(ctx, s, p, depth, strength) {
  if (s < 14) return;
  const step = Math.max(3, s * 0.15);
  ctx.strokeStyle = tone(p.fin, -0.4, strength);
  ctx.lineWidth = Math.max(0.5, s * 0.016);
  ctx.beginPath();
  let row = 0;
  for (let y = -s * depth; y <= s * depth; y += step * 0.8, row += 1) {
    for (let x = -s * 0.7 + (row % 2) * step * 0.5; x < s * 0.62; x += step) {
      const u = (1 - x / s) / BODY_LENGTH;
      const cy = y + spineAt(u, s, p.swim);
      ctx.moveTo(x, cy + step * 0.5);
      ctx.arc(x + step * 0.5, cy, step * 0.5, Math.PI * 0.5, Math.PI * 1.5);
    }
  }
  ctx.stroke();
}

function drawClassic(ctx, s, wag, p) {
  const depth = p.depth ?? 0.55;
  const ped = 0.09 + depth * 0.04;
  const { shape, top, bottom } = fishBody(s, p.swim, depth, ped);
  const finFill = tone(p.fin, 0, 0.82);

  paintTail(ctx, s, p.swim, ped, p.fin, p.tailLen ?? 0.62, (p.tailSpread ?? 0.4) * (0.7 + depth * 0.6), p.tail === "fan");
  paintFin(ctx, top[2], top[9], [top[7][0], Math.min(top[3][1], top[8][1]) - s * (0.1 + depth * 0.16)], finFill);
  paintFin(ctx, bottom[7], bottom[10], [bottom[10][0] - s * 0.04, bottom[9][1] + s * (0.1 + depth * 0.14)], finFill);
  const pelvic = bottom[4];
  paintFin(ctx, pelvic, [pelvic[0] - s * 0.2, pelvic[1] - s * 0.02], [pelvic[0] - s * 0.26, pelvic[1] + s * (0.16 + p.flap * 0.04)], finFill);

  ctx.fillStyle = bodyFill(ctx, s, p.body, p.belly, -depth * 1.1, depth);
  ctx.fill(shape);

  ctx.save();
  ctx.clip(shape);
  paintPattern(ctx, s, p, depth);
  paintScales(ctx, s, p, depth, p.pattern === "scales" ? 0.24 : 0.1);
  spinePath(ctx, s, p.swim, 0.22, 0.95, -s * depth * 0.04);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = Math.max(0.5, s * 0.022);
  ctx.stroke();
  ctx.strokeStyle = tone(p.body, -0.5, 0.32);
  ctx.lineWidth = Math.max(0.7, s * 0.04);
  ctx.beginPath();
  ctx.arc(s * 0.12, spineAt(0.4, s, p.swim), s * 0.42, -0.95, 0.95);
  ctx.stroke();
  ctx.restore();
  finishBody(ctx, s, p.fin, shape);

  ctx.save();
  ctx.translate(s * 0.34, s * depth * 0.22);
  ctx.rotate(0.55 + p.flap * 0.4);
  ctx.fillStyle = tone(p.fin, 0.25, 0.55);
  ctx.beginPath();
  ctx.ellipse(-s * 0.2, 0, s * 0.22, s * 0.075, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  paintEye(ctx, s, 0.6, -depth * 0.2, tone(p.belly, 0.35));
  ctx.strokeStyle = tone(p.body, -0.55, 0.6);
  ctx.lineWidth = Math.max(0.6, s * 0.03);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(s * 0.97, s * depth * 0.08);
  ctx.lineTo(s * 0.84, s * depth * 0.14);
  ctx.stroke();
}

function drawAngel(ctx, s, wag, { body, belly, fin, accent }) {
  ctx.fillStyle = tone(fin, 0, 0.85);
  ctx.beginPath();
  ctx.moveTo(-s * 0.1, -s * 0.2);
  ctx.lineTo(-s * 0.05, -s * 1.55 + wag * s * 0.2);
  ctx.lineTo(s * 0.35, -s * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * 0.1, s * 0.2);
  ctx.lineTo(s * 0.05, s * 1.45 + wag * s * 0.15);
  ctx.lineTo(s * 0.32, s * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * 0.55, 0);
  ctx.quadraticCurveTo(-s * 1.05, wag * s, -s * 1.35, -s * 0.28);
  ctx.lineTo(-s * 1.35, s * 0.28);
  ctx.closePath();
  ctx.fill();
  const shape = new Path2D();
  shape.moveTo(s * 0.85, 0);
  shape.quadraticCurveTo(s * 0.2, -s * 1.05, -s * 0.55, 0);
  shape.quadraticCurveTo(s * 0.2, s * 1.05, s * 0.85, 0);
  ctx.fillStyle = bodyFill(ctx, s, body, belly, -0.55, 0.55);
  ctx.fill(shape);
  ctx.save();
  ctx.clip(shape);
  ctx.strokeStyle = tone(accent || fin, 0, 0.6);
  ctx.lineWidth = Math.max(1.4, s * 0.09);
  ctx.beginPath();
  ctx.moveTo(-s * 0.2, -s * 0.6);
  ctx.lineTo(s * 0.3, s * 0.6);
  ctx.moveTo(s * 0.32, -s * 0.6);
  ctx.lineTo(s * 0.6, s * 0.4);
  ctx.stroke();
  ctx.restore();
  finishBody(ctx, s, fin, shape);
  paintEye(ctx, s, 0.5, -0.12);
}

function drawBetta(ctx, s, wag, { body, belly, fin, accent }) {
  ctx.fillStyle = fin;
  ctx.globalAlpha = 0.78;
  ctx.beginPath();
  ctx.moveTo(-s * 0.4, 0);
  ctx.quadraticCurveTo(-s * 1.1, -s * 1.1 + wag * s, -s * 2.1, -s * 0.2 + wag * s);
  ctx.quadraticCurveTo(-s * 1.4, wag * s * 0.4, -s * 2.05, s * 0.85 + wag * s);
  ctx.quadraticCurveTo(-s * 0.9, s * 0.35, -s * 0.35, 0);
  ctx.fill();
  ctx.fillStyle = accent || belly;
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.moveTo(-s * 0.45, -s * 0.05);
  ctx.quadraticCurveTo(-s * 1.3, -s * 0.85 + wag * s, -s * 1.85, 0);
  ctx.quadraticCurveTo(-s * 1.1, s * 0.2, -s * 0.4, 0);
  ctx.fill();
  ctx.globalAlpha = 1;
  const shape = new Path2D();
  shape.ellipse(0, 0, s * 0.85, s * 0.42, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyFill(ctx, s, body, belly, -0.42, 0.42);
  ctx.fill(shape);
  finishBody(ctx, s, fin, shape);
  paintEye(ctx, s, 0.48, -0.06);
}

function drawLion(ctx, s, wag, { body, belly, fin, accent }) {
  ctx.strokeStyle = fin;
  ctx.lineWidth = Math.max(1.2, s * 0.08);
  ctx.lineCap = "round";
  for (let i = -4; i <= 4; i += 1) {
    const tilt = i * 0.22 + wag * 0.15;
    ctx.beginPath();
    ctx.moveTo(s * 0.1, 0);
    ctx.lineTo(Math.cos(tilt) * s * 1.55, Math.sin(tilt) * s * 1.15);
    ctx.stroke();
  }
  const shape = new Path2D();
  shape.ellipse(0, 0, s * 0.85, s * 0.48, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyFill(ctx, s, body, belly, -0.48, 0.48);
  ctx.fill(shape);
  ctx.save();
  ctx.clip(shape);
  ctx.strokeStyle = tone(accent || "#f0d080", 0, 0.6);
  ctx.lineWidth = Math.max(1.2, s * 0.07);
  ctx.beginPath();
  [-0.45, -0.12, 0.2].forEach((x) => {
    ctx.moveTo(s * x, -s * 0.5);
    ctx.quadraticCurveTo(s * (x + 0.18), 0, s * x, s * 0.5);
  });
  ctx.stroke();
  ctx.restore();
  finishBody(ctx, s, fin, shape);
  paintEye(ctx, s, 0.42, -0.08);
}

function drawHorse(ctx, s, wag, { body, belly, fin, accent }) {
  ctx.rotate(-0.9);
  ctx.strokeStyle = fin;
  ctx.lineWidth = Math.max(2, s * 0.16);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, s * 0.15);
  ctx.quadraticCurveTo(-s * 0.15, s * 0.7, s * 0.35 + wag * s * 0.3, s * 1.35);
  ctx.stroke();
  if (accent) {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-s * 0.12, s * 0.35 + i * s * 0.18);
      ctx.lineTo(-s * 0.55, s * 0.2 + i * s * 0.2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  const shape = new Path2D();
  shape.ellipse(0, -s * 0.15, s * 0.38, s * 0.7, 0.15, 0, Math.PI * 2);
  shape.moveTo(s * 0.4, -s * 0.72);
  shape.ellipse(s * 0.12, -s * 0.72, s * 0.28, s * 0.28, 0, 0, Math.PI * 2);
  shape.moveTo(s * (0.42 + 0.2 * Math.cos(0.5)), s * (-0.7 + 0.2 * Math.sin(0.5)));
  shape.ellipse(s * 0.42, -s * 0.7, s * 0.2, s * 0.08, 0.5, 0, Math.PI * 2);
  const fill = ctx.createLinearGradient(-s * 0.4, 0, s * 0.4, 0);
  fill.addColorStop(0, tone(body, -0.25));
  fill.addColorStop(0.55, body);
  fill.addColorStop(1, belly);
  ctx.fillStyle = fill;
  ctx.fill(shape);
  ctx.save();
  ctx.clip(shape);
  ctx.strokeStyle = tone(fin, -0.2, 0.35);
  ctx.lineWidth = Math.max(0.6, s * 0.03);
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const y = -s * 0.55 + i * s * 0.18;
    ctx.moveTo(-s * 0.4, y);
    ctx.quadraticCurveTo(0, y + s * 0.06, s * 0.4, y);
  }
  ctx.stroke();
  ctx.restore();
  finishBody(ctx, s, fin, shape);
  paintEye(ctx, s, 0.2, -0.78);
}

function drawRay(ctx, s, wag, { body, belly, fin, accent }) {
  const shape = new Path2D();
  shape.moveTo(s * 1.05, 0);
  shape.quadraticCurveTo(s * 0.1, -s * 1.15 + wag * s * 0.4, -s * 1.05, 0);
  shape.quadraticCurveTo(s * 0.1, s * 1.15 + wag * s * 0.4, s * 1.05, 0);
  ctx.fillStyle = bodyFill(ctx, s, body, belly, -0.7, 0.7);
  ctx.fill(shape);
  finishBody(ctx, s, fin, shape);
  ctx.fillStyle = fin;
  ctx.beginPath();
  ctx.moveTo(-s * 0.7, 0);
  ctx.lineTo(-s * 1.45, -s * 0.12 + wag * s * 0.2);
  ctx.lineTo(-s * 1.45, s * 0.12 + wag * s * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = accent || "rgba(255,255,255,0.25)";
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(s * 0.15, -s * 0.18, s * 0.12, 0, Math.PI * 2);
  ctx.arc(-s * 0.2, -s * 0.12, s * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  paintEye(ctx, s, 0.55, -0.06);
}

function drawLantern(ctx, s, wag, { body, belly, fin, accent }) {
  ctx.strokeStyle = accent || "#7ee0d6";
  ctx.lineWidth = Math.max(1.4, s * 0.07);
  ctx.beginPath();
  ctx.moveTo(s * 0.55, -s * 0.25);
  ctx.quadraticCurveTo(s * 1.05, -s * 0.95, s * 0.85, -s * 1.15);
  ctx.stroke();
  ctx.fillStyle = accent || "#7ee0d6";
  ctx.shadowColor = accent || "#7ee0d6";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(s * 0.85, -s * 1.15, Math.max(2.4, s * 0.14), 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = fin;
  ctx.beginPath();
  ctx.moveTo(-s * 0.65, 0);
  ctx.quadraticCurveTo(-s * 1.2, wag * s, -s * 1.55, 0);
  ctx.quadraticCurveTo(-s * 1.2, -wag * s, -s * 0.65, 0);
  ctx.fill();
  const shape = new Path2D();
  shape.ellipse(0, 0, s * 0.95, s * 0.62, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyFill(ctx, s, body, belly, -0.62, 0.62);
  ctx.fill(shape);
  finishBody(ctx, s, fin, shape);
  ctx.strokeStyle = tone(belly, 0.5, 0.75);
  ctx.lineWidth = Math.max(0.8, s * 0.04);
  ctx.beginPath();
  for (let i = 0; i < 4; i += 1) {
    const x = s * (0.88 - i * 0.07);
    ctx.moveTo(x, s * 0.12);
    ctx.lineTo(x - s * 0.03, s * 0.24);
  }
  ctx.stroke();
  paintEye(ctx, s, 0.42, -0.12, tone(accent || "#7ee0d6", 0.2));
}

function drawKoi(ctx, s, wag, p) {
  drawClassic(ctx, s, wag, { ...p, depth: 0.56, pattern: "koi", tail: "fan", tailLen: 0.72, tailSpread: 0.42 });
  ctx.strokeStyle = tone(p.fin, 0, 0.8);
  ctx.lineWidth = Math.max(1, s * 0.035);
  ctx.beginPath();
  ctx.moveTo(s * 0.9, s * 0.06);
  ctx.quadraticCurveTo(s * 1.1, s * 0.2, s * 1.12, s * 0.36);
  ctx.moveTo(s * 0.92, s * 0.02);
  ctx.quadraticCurveTo(s * 1.14, s * 0.04, s * 1.22, s * 0.16);
  ctx.stroke();
}

function drawEel(ctx, s, wag, { body, belly, fin, accent }) {
  const shape = new Path2D();
  shape.moveTo(s * 1.1, 0);
  shape.quadraticCurveTo(s * 0.2, -s * 0.42 + wag * s * 0.2, -s * 0.4, 0);
  shape.quadraticCurveTo(-s * 1.3, s * 0.35 + wag * s, -s * 2.2, wag * s * 0.8);
  shape.quadraticCurveTo(-s * 1.2, -s * 0.1, -s * 0.4, s * 0.08);
  shape.quadraticCurveTo(s * 0.2, s * 0.38, s * 1.1, 0);
  ctx.fillStyle = bodyFill(ctx, s, body, belly, -0.3, 0.3);
  ctx.fill(shape);
  finishBody(ctx, s, fin, shape);
  ctx.strokeStyle = accent || fin;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(-s * 0.1, -s * 0.18);
  ctx.quadraticCurveTo(-s * 0.8, -s * 0.55 + wag * s, -s * 1.6, -s * 0.1);
  ctx.stroke();
  ctx.globalAlpha = 1;
  paintEye(ctx, s, 0.72, -0.06);
}

const FORMS = {
  fish: drawClassic,
  angel: drawAngel,
  betta: drawBetta,
  lion: drawLion,
  horse: drawHorse,
  ray: drawRay,
  lantern: drawLantern,
  koi: drawKoi,
  eel: drawEel,
};

const FISH_SCALE = 1.28;

// Still portrait of one stage, for the Field Guide and Sonar. Undiscovered
// forms paint as a dark silhouette so the shape is a hint, not a spoiler.
export function paintPortrait(canvas, look, size, hidden = false) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  const g = canvas.getContext("2d");
  const tall = look.form === "horse";
  const s = size / (tall ? 3.1 : 3.4);
  g.setTransform(dpr, 0, 0, dpr, size * (tall ? 0.5 : 0.56) * dpr, size * (tall ? 0.56 : 0.52) * dpr);
  g.clearRect(-size, -size, size * 2, size * 2);
  const paint = FORMS[look.form] || drawClassic;
  paint(g, s, 0.12, {
    body: look.body,
    belly: look.belly,
    fin: look.fin,
    accent: look.accent,
    depth: look.depth,
    pattern: look.pattern,
    tail: look.tail,
    tailLen: look.tailLen,
    tailSpread: look.tailSpread,
    swim: 0.6,
    flap: 0.4,
  });
  if (!hidden) return;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = "source-atop";
  g.fillStyle = "rgba(6, 26, 36, 0.94)";
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.globalCompositeOperation = "source-over";
}

export class Fish {
  constructor(width, height, line, reduceMotion, meals = 0) {
    this.line = line;
    this.meals = meals;
    this.reduceMotion = reduceMotion;
    this.z = Math.random();
    this.depthScale = (0.8 + this.z * 0.38) * FISH_SCALE * (width < 720 ? 0.78 : 1);
    this.x = rand(80, width - 80);
    this.y = rand(90, height - 160);
    this.theta = rand(0, Math.PI * 2);
    this.phase = rand(0, Math.PI * 2);
    this.pop = 0;
    this.morph = 1;
    this.prevLook = null;
    this.applyStage(stageFromMeals(meals), true);
    this.vx = Math.cos(this.theta) * this.speed;
    this.vy = Math.sin(this.theta) * this.speed * 0.35;
    this.heading = this.vx >= 0 ? 1 : -1;
    this.face = this.heading;
    this.drawn = this.size;
    this.px = 0;
    this.py = 0;
    this.jolt = 0;
    this.layer = document.createElement("canvas");
    this.layerCtx = this.layer.getContext("2d");
  }

  look() {
    return this.line.stages[this.stage];
  }

  grownSize(look) {
    return look.size * (1 + Math.min(this.meals, 18) * 0.018) * this.depthScale;
  }

  applyStage(stage, instant = false) {
    const look = this.line.stages[stage];
    if (!instant) this.prevLook = { ...this.look() };
    this.stage = stage;
    this.form = look.form;
    this.name = look.name;
    this.speed = look.speed * (0.82 + this.z * 0.18);
    this.size = this.grownSize(look);
    this.morph = instant ? 1 : 0;
  }

  eat(time) {
    const before = this.name;
    this.meals += 1;
    this.pop = 1;
    this.needsSave = true;
    this.ateAt = { x: this.x, y: this.y, t: time };
    const next = stageFromMeals(this.meals);
    if (next !== this.stage) {
      this.applyStage(next);
      this.evolvedAt = { x: this.x, y: this.y, t: time, from: before, to: this.name, slot: this.slot };
      return this.evolvedAt;
    }
    this.size = this.grownSize(this.look());
    return null;
  }

  update(width, height, mouse, time, current, foods, floor, lure = 0) {
    const max = this.reduceMotion ? this.speed * 0.28 : this.speed;
    this.theta += (Math.random() - 0.5) * (this.reduceMotion ? 0.01 : 0.045);
    this.vx += Math.cos(this.theta) * 0.025;
    this.vy += Math.sin(this.theta) * 0.012;
    this.pop *= 0.9;
    this.morph = Math.min(1, this.morph + 0.045);
    this.drawn += (this.size * (1 + this.pop * 0.28) - this.drawn) * 0.12;

    if (this.form === "horse") {
      this.vy -= 0.012;
      this.vx *= 0.985;
    } else if (this.form === "eel") {
      this.theta += Math.sin(time * 0.01 + this.phase) * 0.03;
    } else if (this.form === "ray") {
      this.vy *= 0.97;
    }

    const marginX = 48 + this.drawn;
    const marginTop = 70 + this.drawn;
    const marginBottom = floor + this.drawn;
    if (this.x < marginX) this.vx += 0.07;
    if (this.x > width - marginX) this.vx -= 0.07;
    if (this.y < marginTop) this.vy += 0.05;
    if (this.y > height - marginBottom) this.vy -= 0.06;

    let hunting = false;
    let nearest = null;
    let nearestDist = Infinity;
    foods.forEach((flake) => {
      if (flake.eaten) return;
      const dist = Math.hypot(flake.x - this.x, flake.y - this.y);
      if (dist < nearestDist) {
        nearest = flake;
        nearestDist = dist;
      }
    });
    const notice = this.drawn < 18 ? 340 : 280;
    if (nearest && nearestDist < notice && nearestDist > 0.001) {
      hunting = true;
      const pull = 0.11 + (1 - nearestDist / notice) * 0.08;
      this.vx += ((nearest.x - this.x) / nearestDist) * pull;
      this.vy += ((nearest.y - this.y) / nearestDist) * pull;
      if (nearestDist < this.drawn + 8) {
        nearest.eaten = true;
        this.justEvolved = this.eat(time);
        this.justFed = true;
      }
    }

    this.fleeing = false;
    let cap = hunting ? max * 1.55 : max * (1 + lure * 0.6);
    // At night the cursor is a lantern: fish drift in and circle the light.
    if (mouse.on && !hunting && lure > 0) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.hypot(dx, dy);
      const reach = 420 + this.drawn * 2;
      if (dist < reach && dist > 0.001) {
        const ring = 58 + this.drawn * 1.6;
        const pull = ((dist - ring) / reach) * 0.09 * lure;
        const swirl = 0.03 * lure * (this.z > 0.5 ? 1 : -1);
        this.vx += (dx / dist) * pull - (dy / dist) * swirl;
        this.vy += (dy / dist) * pull + (dx / dist) * swirl;
      }
    }

    if (mouse.on && !hunting && lure < 1) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const radius = 128 + this.drawn;
      if (dist < radius && dist > 0.001) {
        const falloff = (1 - dist / radius) ** 2 * (1 - lure);
        const force = 0.28 * falloff;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
        this.theta += (dx >= 0 ? 0.04 : -0.04) * falloff;
        this.fleeing = falloff > 0.12;
        cap = max * (1 + 0.22 * falloff);
      }
    }

    this.vx += current * 0.015;
    this.vy *= 0.992;

    const speed = Math.hypot(this.vx, this.vy);
    if (speed > cap) {
      this.vx = (this.vx / speed) * cap;
      this.vy = (this.vy / speed) * cap;
    } else if (speed < max * 0.38) {
      this.vx += Math.cos(this.theta) * 0.04;
      this.vy += Math.sin(this.theta) * 0.016;
    }

    this.x += this.vx + this.px;
    this.y += this.vy + this.py + Math.sin(time * 0.0022 + this.phase) * 0.16;
    this.px *= 0.9;
    this.py *= 0.9;
    this.jolt *= 0.94;

    if (Math.abs(this.vx) > 0.06) this.heading = this.vx > 0 ? 1 : -1;
    this.face += (this.heading - this.face) * (this.reduceMotion ? 1 : 0.085);
  }

  shove(x, y) {
    if (Math.hypot(x, y) < 0.02) return;
    const mass = 0.7 + this.drawn / 36;
    this.px += x / mass;
    this.py += y / mass;
    const push = Math.hypot(this.px, this.py);
    if (push > 2.4) {
      this.px *= 2.4 / push;
      this.py *= 2.4 / push;
    }
    this.jolt = Math.min(1, this.jolt + Math.hypot(x, y) / mass * 0.6);
  }

  colors() {
    const look = this.look();
    if (!this.prevLook || this.morph >= 1) {
      return { body: look.body, belly: look.belly, fin: look.fin, accent: look.accent };
    }
    const t = this.morph;
    return {
      body: mixHex(this.prevLook.body, look.body, t),
      belly: mixHex(this.prevLook.belly, look.belly, t),
      fin: mixHex(this.prevLook.fin, look.fin, t),
      accent: look.accent && this.prevLook.accent
        ? mixHex(this.prevLook.accent, look.accent, t)
        : look.accent,
    };
  }

  draw(ctx, time, haze) {
    const s = this.drawn;
    const box = Math.ceil(s * 5.2);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = Math.ceil(box * dpr);
    const layer = this.layer;
    const g = this.layerCtx;
    if (layer.width < px) {
      layer.width = px;
      layer.height = px;
    }

    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, px, px);
    g.setTransform(dpr, 0, 0, dpr, (box / 2) * dpr, (box / 2) * dpr);

    const facing = this.face >= 0 ? 1 : -1;
    const turn = facing * Math.max(0.14, Math.abs(this.face));
    const pitch = this.form === "horse"
      ? 0
      : Math.atan2(this.vy * facing, Math.abs(this.vx) + 0.05) * 0.38;
    const beat = (this.fleeing ? 1.55 : 1) + this.jolt * 0.9;
    const dt = Math.min(50, Math.max(0, time - (this.drawnAt ?? time)));
    this.drawnAt = time;
    this.swim = (this.swim ?? this.phase) + 0.012 * dt * (this.speed + 0.4) * beat;
    const wag = Math.sin(this.swim) * 0.34;
    const look = this.look();
    const palette = {
      ...this.colors(),
      depth: look.depth,
      pattern: look.pattern,
      tail: look.tail,
      tailLen: look.tailLen,
      tailSpread: look.tailSpread,
      swim: this.swim,
      flap: Math.sin(time * 0.009 + this.phase * 1.7),
    };
    g.scale(turn, 1);
    g.rotate(pitch);

    if (this.form === "lantern") {
      const glow = g.createRadialGradient(s * 0.85, -s * 1.15, 0, s * 0.85, -s * 1.15, s * 1.1);
      glow.addColorStop(0, tone(palette.accent || palette.belly, 0, 0.32));
      glow.addColorStop(1, tone(palette.accent || palette.belly, 0, 0));
      g.fillStyle = glow;
      g.fillRect(-s * 0.4, -s * 2.4, s * 2.5, s * 2.5);
    }

    const paint = FORMS[this.form] || drawClassic;
    paint(g, s, wag, palette);

    const fog = haze.amount * (1 - this.z) + haze.floor;
    if (fog > 0.01) {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = "source-atop";
      g.fillStyle = `rgba(${haze.rgb}, ${fog})`;
      g.fillRect(0, 0, px, px);
    }
    g.restore();

    ctx.drawImage(layer, 0, 0, px, px, this.x - box / 2, this.y - box / 2, box, box);
  }
}
