import { duneGlsl } from "./seabed.js?v=202610191453";

const VERTEX = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;

uniform vec2 uRes;
uniform float uScale;
uniform float uTime;
uniform float uTide;
uniform float uSurface;
uniform sampler2D uRipple;
uniform vec2 uRippleSize;

${duneGlsl}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float cellEdge(vec2 p, float t) {
  vec2 ip = floor(p);
  vec2 fp = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 h = vec2(hash(ip + g), hash(ip + g + 17.31));
      vec2 o = 0.5 + 0.42 * sin(t + 6.2831 * h);
      float d = length(g + o - fp);
      if (d < f1) {
        f2 = f1;
        f1 = d;
      } else if (d < f2) {
        f2 = d;
      }
    }
  }
  return f2 - f1;
}

float caustics(vec2 p, float t) {
  vec2 warp = vec2(noise(p * 0.6 + t * 0.12), noise(p * 0.6 + 5.3 - t * 0.12));
  p += (warp - 0.5) * 1.3;
  p += 0.22 * vec2(sin(p.y * 1.7 + t * 0.8), cos(p.x * 1.5 - t * 0.7));
  float a = exp(-cellEdge(p, t) * 10.0);
  float b = exp(-cellEdge(p * 1.6 + 3.7, t * 1.3) * 12.0);
  return a * 0.5 + b * 0.25 + a * b * 1.1;
}

vec4 rock(vec2 p, float cx, float rx, float ry, float seed, vec3 base, vec3 light, float caus) {
  vec2 c = vec2(cx, sandFront(cx) - ry * 0.3);
  vec2 q = (p - c) / vec2(rx, ry);
  float wobble = noise(q * 2.6 + seed) * 0.22 + noise(q * 7.0 + seed) * 0.05;
  float d = length(q) * (1.0 + wobble - 0.1);
  if (d > 1.0) return vec4(0.0);
  vec3 n = normalize(vec3(q.x, q.y + 0.15, sqrt(max(1.0 - d * d, 0.0))));
  float diff = max(dot(n, normalize(vec3(-0.35, 0.85, 0.45))), 0.0);
  float moss = smoothstep(0.25, 0.75, n.y + noise(q * 5.0 + seed) * 0.35);
  vec3 col = mix(base, base * vec3(0.7, 1.15, 0.85), moss * 0.6);
  col *= 0.32 + diff * 0.85;
  col += light * caus * max(n.y, 0.0) * 0.45;
  float edge = 1.0 - smoothstep(1.0 - 2.0 / ry, 1.0, d);
  return vec4(col, edge);
}

void main() {
  vec2 p = gl_FragCoord.xy / uScale;
  vec2 size = uRes / uScale;
  float W = size.x;
  float H = size.y;
  float t = uTime;

  vec3 wave = texture2D(uRipple, vec2(p.x, H - p.y) / uRippleSize).rgb - 0.5;
  vec2 slope = wave.xy;
  p += vec2(slope.x, -slope.y) * 26.0;
  float fromTop = H - p.y;

  float dusk = clamp(uTide, 0.0, 1.0) - clamp(uTide - 1.0, 0.0, 1.0);
  float night = clamp(uTide - 1.0, 0.0, 1.0);
  float day = 1.0 - dusk - night;

  vec3 topC = day * vec3(0.17, 0.56, 0.62) + dusk * vec3(0.58, 0.33, 0.27) + night * vec3(0.05, 0.14, 0.24);
  vec3 midC = day * vec3(0.04, 0.27, 0.35) + dusk * vec3(0.07, 0.2, 0.27) + night * vec3(0.018, 0.07, 0.13);
  vec3 deepC = day * vec3(0.012, 0.09, 0.13) + dusk * vec3(0.016, 0.08, 0.12) + night * vec3(0.006, 0.03, 0.06);
  vec3 lightC = day * vec3(0.8, 1.0, 0.95) + dusk * vec3(1.0, 0.68, 0.42) + night * vec3(0.5, 0.66, 1.0);
  float lightAmt = day * 1.0 + dusk * 0.7 + night * 0.32;

  float below = fromTop - uSurface;
  float depth = clamp(below / H, 0.0, 1.2);

  vec3 col = mix(topC, midC, smoothstep(0.0, 0.5, depth));
  col = mix(col, deepC, smoothstep(0.42, 1.05, depth));

  float sway = sin(t * 0.06) * W * 0.06;
  vec2 src = vec2(mix(W * 0.4, W * 0.78, night) + sway, H - uSurface + H * 0.55);
  vec2 dir = p - src;
  float ang = atan(dir.x, -dir.y);
  float rays = noise(vec2(ang * 34.0, t * 0.16)) * 0.6 + noise(vec2(ang * 83.0 + 7.0, t * 0.27)) * 0.4;
  rays = pow(rays, 2.6) * 1.6;
  float rayFade = exp(-depth * 2.1) * smoothstep(-0.05, 0.08, depth);
  float rayWidth = mix(1.0, 0.35, night);
  rays *= smoothstep(rayWidth, 0.0, abs(ang) * 1.4);
  col += lightC * rays * rayFade * (0.42 * lightAmt);

  vec2 sp = vec2(p.x * 0.011, fromTop * 0.034) + vec2(t * 0.04, 0.0);
  float ripple = caustics(sp, t * 0.9);
  float band = exp(-max(below, 0.0) / 70.0);
  col += lightC * band * (0.14 + 0.3 * ripple) * lightAmt;
  col += lightC * exp(-abs(below) / 2.5) * 0.35 * lightAmt;

  vec2 moon = vec2(W * 0.78, uSurface + 26.0);
  float moonGlow = exp(-length(vec2(p.x - moon.x, (fromTop - moon.y) * 1.8)) / 120.0);
  col += vec3(0.75, 0.85, 1.0) * moonGlow * night * (0.45 + 0.25 * ripple);

  col += lightC * caustics(p * 0.006 + vec2(0.0, t * 0.01), t * 0.45) * 0.035 * exp(-depth * 3.0) * lightAmt;

  if (below < 0.0) {
    vec3 sky = day * vec3(0.72, 0.93, 0.96) + dusk * vec3(0.98, 0.66, 0.46) + night * vec3(0.08, 0.14, 0.24);
    float sheen = caustics(vec2(p.x * 0.008, fromTop * 0.02) + t * 0.03, t * 1.1);
    col = mix(col, sky * (0.86 + sheen * 0.22), smoothstep(0.0, -6.0, below));
  }

  vec3 sandC = day * vec3(0.66, 0.55, 0.4) + dusk * vec3(0.55, 0.38, 0.27) + night * vec3(0.12, 0.14, 0.19);
  float grain = hash(floor(p * 1.5)) * 0.08 - 0.04;

  float backTop = sandBack(p.x);
  if (p.y < backTop + 1.5) {
    float c = caustics(vec2(p.x, p.y * 2.6) * 0.016, t * 0.6);
    vec3 s = sandC * (0.55 + grain) + lightC * c * 0.22 * lightAmt;
    s = mix(s, midC, 0.55);
    col = mix(col, s, smoothstep(backTop + 1.5, backTop - 1.0, p.y));
  }

  float sandCaus = caustics(vec2(p.x, p.y * 2.4) * 0.016, t * 0.7);
  vec3 rockBase = day * vec3(0.24, 0.3, 0.29) + dusk * vec3(0.24, 0.22, 0.22) + night * vec3(0.06, 0.08, 0.11);
  vec4 r;
  r = rock(p, W * 0.05, 74.0, 36.0, 1.0, rockBase, lightC * lightAmt, sandCaus); col = mix(col, r.rgb, r.a);
  r = rock(p, W * 0.17, 40.0, 21.0, 4.0, rockBase * 1.1, lightC * lightAmt, sandCaus); col = mix(col, r.rgb, r.a);
  r = rock(p, W * 0.37, 56.0, 25.0, 7.0, rockBase * 0.92, lightC * lightAmt, sandCaus); col = mix(col, r.rgb, r.a);
  r = rock(p, W * 0.59, 34.0, 17.0, 9.0, rockBase * 1.05, lightC * lightAmt, sandCaus); col = mix(col, r.rgb, r.a);
  r = rock(p, W * 0.8, 66.0, 31.0, 12.0, rockBase, lightC * lightAmt, sandCaus); col = mix(col, r.rgb, r.a);
  r = rock(p, W * 0.96, 48.0, 27.0, 15.0, rockBase * 0.9, lightC * lightAmt, sandCaus); col = mix(col, r.rgb, r.a);

  float frontTop = sandFront(p.x);
  if (p.y < frontTop + 1.5) {
    float into = clamp((frontTop - p.y) / frontTop, 0.0, 1.0);
    float ridges = sin(p.x * 0.09 + sin(p.y * 0.07 + p.x * 0.012) * 2.2 + p.y * 0.42) * 0.045;
    vec3 s = sandC * (0.92 - into * 0.38 + grain + ridges);
    s += lightC * sandCaus * (0.36 - into * 0.18) * lightAmt;
    s += lightC * exp(-(frontTop - p.y) / 3.0) * 0.18 * lightAmt;
    s = mix(s, midC, 0.18);
    col = mix(col, s, smoothstep(frontTop + 1.5, frontTop - 1.0, p.y));
  }

  float facing = dot(slope, vec2(-0.45, -0.89));
  float crest = pow(clamp(facing * 2.6, 0.0, 1.0), 4.0);
  col += lightC * (max(facing, 0.0) * 0.3 + crest * 0.9) * (0.35 + 0.65 * lightAmt);
  col *= 1.0 - clamp(-facing, 0.0, 0.5) * 0.38;
  col += vec3(0.7, 0.95, 1.0) * clamp(abs(wave.z) * 1.6 - 0.05, 0.0, 1.0) * 0.06 * (0.4 + lightAmt);

  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

const CELL = 4;
const DAMPING = 0.966;
const STEP_MS = 1000 / 60;

class RippleField {
  constructor() {
    this.resize();
  }

  resize() {
    this.cols = Math.ceil(window.innerWidth / CELL) + 2;
    this.rows = Math.ceil(window.innerHeight / CELL) + 2;
    this.cur = new Float32Array(this.cols * this.rows);
    this.prev = new Float32Array(this.cols * this.rows);
    this.pixels = new Uint8Array(this.cols * this.rows * 4).fill(128);
    this.active = 0;
    this.dirty = true;
    this.pulses = [];
  }

  disturb(x, y, amount, radius) {
    const cx = x / CELL;
    const cy = y / CELL;
    const r = Math.max(1.2, radius / CELL);
    const { cols, rows, cur } = this;
    for (let j = Math.max(1, Math.floor(cy - r)); j <= Math.min(rows - 2, Math.ceil(cy + r)); j += 1) {
      for (let i = Math.max(1, Math.floor(cx - r)); i <= Math.min(cols - 2, Math.ceil(cx + r)); i += 1) {
        const d = Math.hypot(i - cx, j - cy);
        if (d < r) cur[j * cols + i] += amount * (0.5 + 0.5 * Math.cos((Math.PI * d) / r));
      }
    }
    this.active = 240;
  }

  stroke(x0, y0, x1, y1, amount, radius) {
    const spacing = Math.max(2, radius * 0.35);
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / spacing));
    const each = amount * (spacing / radius) * 0.42;
    for (let s = 1; s <= steps; s += 1) {
      const t = s / steps;
      this.disturb(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, each, radius);
    }
  }

  flow(x, y) {
    if (this.active <= 0) return null;
    const { cols, rows, cur, prev } = this;
    const ci = Math.round(x / CELL);
    const cj = Math.round(y / CELL);
    let fx = 0;
    let fy = 0;
    for (let j = cj - 2; j <= cj + 2; j += 2) {
      for (let i = ci - 2; i <= ci + 2; i += 2) {
        if (i < 1 || j < 1 || i > cols - 2 || j > rows - 2) continue;
        const k = j * cols + i;
        const rise = cur[k] - prev[k];
        fx -= rise * (cur[k + 1] - cur[k - 1]);
        fy -= rise * (cur[k + cols] - cur[k - cols]);
      }
    }
    return { x: fx / 9, y: fy / 9 };
  }

  drop(x, y, strength) {
    this.disturb(x, y, strength, 18);
    this.pulses.push(
      { x, y, amount: -strength * 0.6, radius: 12, wait: 5 },
      { x, y, amount: strength * 0.35, radius: 9, wait: 10 },
    );
  }

  step() {
    for (let i = this.pulses.length - 1; i >= 0; i -= 1) {
      const pulse = this.pulses[i];
      pulse.wait -= 1;
      if (pulse.wait <= 0) {
        this.disturb(pulse.x, pulse.y, pulse.amount, pulse.radius);
        this.pulses.splice(i, 1);
      }
    }
    const { cols, rows } = this;
    const cur = this.cur;
    const next = this.prev;
    for (let j = 1; j < rows - 1; j += 1) {
      let k = j * cols + 1;
      for (let i = 1; i < cols - 1; i += 1, k += 1) {
        next[k] = ((cur[k - 1] + cur[k + 1] + cur[k - cols] + cur[k + cols]) * 0.5 - next[k]) * DAMPING;
      }
    }
    this.prev = cur;
    this.cur = next;
    this.active -= 1;
    if (this.active <= 0) {
      this.cur.fill(0);
      this.prev.fill(0);
    }
    this.dirty = true;
  }

  encode() {
    const { cols, rows, cur, pixels } = this;
    for (let j = 1; j < rows - 1; j += 1) {
      for (let i = 1; i < cols - 1; i += 1) {
        const k = j * cols + i;
        const o = k * 4;
        pixels[o] = Math.max(0, Math.min(255, 128 + (cur[k + 1] - cur[k - 1]) * 150));
        pixels[o + 1] = Math.max(0, Math.min(255, 128 + (cur[k + cols] - cur[k - cols]) * 150));
        pixels[o + 2] = Math.max(0, Math.min(255, 128 + cur[k] * 90));
        pixels[o + 3] = 255;
      }
    }
    return pixels;
  }
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

export function startWater(canvas) {
  const gl = canvas?.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(program, "uRes"),
    scale: gl.getUniformLocation(program, "uScale"),
    time: gl.getUniformLocation(program, "uTime"),
    tide: gl.getUniformLocation(program, "uTide"),
    surface: gl.getUniformLocation(program, "uSurface"),
    ripple: gl.getUniformLocation(program, "uRipple"),
    rippleSize: gl.getUniformLocation(program, "uRippleSize"),
  };

  const field = new RippleField();
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(u.ripple, 0);

  let lost = false;
  let lastStep = 0;
  let textureSize = "";

  function upload() {
    const pixels = field.encode();
    const size = `${field.cols}x${field.rows}`;
    if (size !== textureSize) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, field.cols, field.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      textureSize = size;
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, field.cols, field.rows, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    field.dirty = false;
  }

  function resize() {
    const scale = (window.devicePixelRatio || 1) > 1 ? 1 : 0.85;
    canvas.width = Math.round(window.innerWidth * scale);
    canvas.height = Math.round(window.innerHeight * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    field.resize();
  }

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    document.body.classList.remove("gl-water");
  });

  resize();
  window.addEventListener("resize", resize);

  return {
    disturb(x, y, amount, radius) {
      field.disturb(x, y, amount, radius);
    },
    stroke(x0, y0, x1, y1, amount, radius) {
      field.stroke(x0, y0, x1, y1, amount, radius);
    },
    drop(x, y, strength) {
      field.drop(x, y, strength);
    },
    flow(x, y) {
      return field.flow(x, y);
    },
    render(seconds, tide, surface) {
      if (lost) return;
      const now = performance.now();
      if (field.active > 0) {
        if (now - lastStep > 250) lastStep = now - STEP_MS;
        while (now - lastStep >= STEP_MS && field.active > 0) {
          field.step();
          lastStep += STEP_MS;
        }
      } else {
        lastStep = now;
      }
      if (field.dirty) upload();
      gl.uniform2f(u.rippleSize, field.cols * CELL, field.rows * CELL);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.scale, canvas.width / window.innerWidth);
      gl.uniform1f(u.time, seconds);
      gl.uniform1f(u.tide, tide);
      gl.uniform1f(u.surface, surface);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}
