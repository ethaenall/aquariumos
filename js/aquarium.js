const SPECIES = [
  { body: "#2aa9b8", belly: "#9febe4", fin: "#0e5b66", size: 22, speed: 1.18 },
  { body: "#e07a3d", belly: "#f3c48a", fin: "#9a4318", size: 20, speed: 0.92 },
  { body: "#d9899a", belly: "#f4c9cc", fin: "#8a4458", size: 16, speed: 1.08 },
  { body: "#e8c35a", belly: "#f6e7ad", fin: "#b8862a", size: 14, speed: 1.34 },
  { body: "#3d6ea8", belly: "#9ec4e4", fin: "#1c3d66", size: 26, speed: 0.72 },
  { body: "#6fbfa0", belly: "#d5f0e4", fin: "#2d6b55", size: 15, speed: 1.22 },
  { body: "#c27a4a", belly: "#efc7a0", fin: "#7a3d22", size: 18, speed: 0.98 },
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

class Fish {
  constructor(width, height, species, reduceMotion) {
    this.applySpecies(species);
    this.x = rand(80, width - 80);
    this.y = rand(90, height - 140);
    this.theta = rand(0, Math.PI * 2);
    this.vx = Math.cos(this.theta) * this.speed;
    this.vy = Math.sin(this.theta) * this.speed * 0.35;
    this.phase = rand(0, Math.PI * 2);
    this.reduceMotion = reduceMotion;
  }

  applySpecies(species) {
    this.body = species.body;
    this.belly = species.belly;
    this.fin = species.fin;
    this.size = species.size * 1.12;
    this.speed = species.speed;
  }

  update(width, height, mouse, time, current) {
    const max = this.reduceMotion ? this.speed * 0.28 : this.speed;
    this.theta += (Math.random() - 0.5) * (this.reduceMotion ? 0.01 : 0.045);
    this.vx += Math.cos(this.theta) * 0.025;
    this.vy += Math.sin(this.theta) * 0.012;

    const marginX = 48 + this.size;
    const marginTop = 70 + this.size;
    const marginBottom = 100 + this.size;
    if (this.x < marginX) this.vx += 0.07;
    if (this.x > width - marginX) this.vx -= 0.07;
    if (this.y < marginTop) this.vy += 0.05;
    if (this.y > height - marginBottom) this.vy -= 0.06;

    // Unique WebOS 1 feature: nearby fish turn aside instead of swimming through the cursor.
    this.fleeing = false;
    let cap = max;
    if (mouse.on) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const radius = 128 + this.size;
      if (dist < radius && dist > 0.001) {
        const falloff = (1 - dist / radius) ** 2;
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

    this.x += this.vx;
    this.y += this.vy + Math.sin(time * 0.0022 + this.phase) * 0.16;
  }

  draw(ctx, time) {
    const facing = this.vx >= 0 ? 1 : -1;
    const pitch = Math.atan2(this.vy * facing, Math.abs(this.vx)) * 0.38;
    const wag = Math.sin(time * 0.012 * (this.speed + 0.4) * (this.fleeing ? 1.55 : 1) + this.phase) * 0.34;
    const s = this.size;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(facing, 1);
    ctx.rotate(pitch);

    ctx.fillStyle = "rgba(0, 8, 14, 0.18)";
    ctx.beginPath();
    ctx.ellipse(2, s * 0.55, s * 1.05, s * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.fin;
    ctx.beginPath();
    ctx.moveTo(-s * 0.75, 0);
    ctx.quadraticCurveTo(-s * 1.15, wag * s, -s * 1.55, -s * 0.42 + wag * s);
    ctx.lineTo(-s * 1.55, s * 0.42 + wag * s);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(s * 0.05, -s * 0.18);
    ctx.quadraticCurveTo(s * 0.1, -s * 0.85, s * 0.45, -s * 0.12);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(s * 0.05, s * 0.18, s * 0.28, s * 0.12, 0.5 + wag * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const body = ctx.createLinearGradient(-s, 0, s, s * 0.4);
    body.addColorStop(0, this.body);
    body.addColorStop(0.55, this.body);
    body.addColorStop(1, this.belly);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = this.fin;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, -s * 0.18);
    ctx.quadraticCurveTo(s * 0.05, 0, -s * 0.1, s * 0.22);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    ctx.beginPath();
    ctx.ellipse(s * 0.18, -s * 0.18, s * 0.38, s * 0.14, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#082028";
    ctx.beginPath();
    ctx.arc(s * 0.55, -s * 0.08, Math.max(1.4, s * 0.09), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4fffb";
    ctx.beginPath();
    ctx.arc(s * 0.58, -s * 0.11, Math.max(0.5, s * 0.03), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class Jelly {
  constructor(width, height, reduceMotion) {
    this.x = rand(80, width - 80);
    this.y = rand(90, height * 0.55);
    this.size = rand(14, 22);
    this.speed = reduceMotion ? 0.08 : rand(0.18, 0.32);
    this.phase = rand(0, Math.PI * 2);
    this.color = Math.random() > 0.5 ? "180, 230, 235" : "210, 190, 230";
  }

  update(width, height, time) {
    this.y -= this.speed;
    this.x += Math.sin(time * 0.001 + this.phase) * 0.35;
    if (this.y < 40) {
      this.y = height - 110;
      this.x = rand(80, width - 80);
    }
  }

  draw(ctx, time) {
    const pulse = 1 + Math.sin(time * 0.003 + this.phase) * 0.08;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = `rgb(${this.color})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * pulse, this.size * 0.62 * pulse, 0, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = `rgba(${this.color}, 0.5)`;
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * 4, 2);
      ctx.quadraticCurveTo(
        i * 4 + Math.sin(time * 0.004 + i) * 6,
        this.size * 1.1,
        i * 3,
        this.size * 1.8,
      );
      ctx.stroke();
    }
    ctx.restore();
  }
}

function makeBubble(width, height) {
  return {
    x: rand(20, width - 20),
    y: rand(0, height),
    r: rand(1.4, 4.2),
    vy: rand(0.35, 1.05),
    phase: rand(0, Math.PI * 2),
  };
}

function makeMote(width, height) {
  return {
    x: rand(0, width),
    y: rand(0, height),
    r: rand(0.4, 1.3),
    vy: rand(-0.12, -0.03),
    phase: rand(0, Math.PI * 2),
  };
}

export function startAquarium(canvas) {
  const ctx = canvas.getContext("2d");
  const mouse = { x: 0, y: 0, on: false };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fish = [];
  const jellies = [];
  const bubbles = [];
  const motes = [];
  const ripples = [];
  let width = 0;
  let height = 0;
  let raf = 0;
  let lastRipple = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    fish.length = 0;
    jellies.length = 0;
    bubbles.length = 0;
    motes.length = 0;
    SPECIES.forEach((species) => {
      fish.push(new Fish(width, height, species, reduceMotion));
    });
    const dart = { body: "#d5e6ea", belly: "#f4fbfc", fin: "#7ea0aa", size: 9, speed: 1.55 };
    for (let i = 0; i < 5; i += 1) fish.push(new Fish(width, height, dart, reduceMotion));
    jellies.push(new Jelly(width, height, reduceMotion), new Jelly(width, height, reduceMotion));
    const bubbleCount = reduceMotion ? 8 : 22;
    for (let i = 0; i < bubbleCount; i += 1) bubbles.push(makeBubble(width, height));
    for (let i = 0; i < 40; i += 1) motes.push(makeMote(width, height));
  }

  function drawBubble(bubble) {
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(210, 245, 250, 0.55)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(bubble.x - bubble.r * 0.28, bubble.y - bubble.r * 0.3, bubble.r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.fill();
  }

  function frame(time) {
    ctx.clearRect(0, 0, width, height);
    const current = Math.sin(time * 0.00016) * 0.9;

    motes.forEach((mote) => {
      mote.y += mote.vy;
      mote.x += Math.sin(time * 0.0008 + mote.phase) * 0.12;
      if (mote.y < -4) {
        mote.y = height + 4;
        mote.x = rand(0, width);
      }
      ctx.fillStyle = "rgba(220, 245, 250, 0.22)";
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
      ctx.fill();
    });

    jellies.forEach((jelly) => {
      jelly.update(width, height, time);
      jelly.draw(ctx, time);
    });

    if (mouse.on && !reduceMotion) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 16, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(190, 240, 245, 0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = ripples.length - 1; i >= 0; i -= 1) {
      const ripple = ripples[i];
      ripple.r += 0.9;
      ripple.life -= 0.018;
      if (ripple.life <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(210, 245, 250, ${0.28 * ripple.life})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    fish.forEach((item) => {
      item.update(width, height, mouse, time, current);
      item.draw(ctx, time);
    });

    bubbles.forEach((bubble) => {
      bubble.y -= bubble.vy;
      bubble.x += Math.sin(time * 0.002 + bubble.phase) * 0.35;
      if (bubble.y < -8) {
        bubble.y = height - 30;
        bubble.x = rand(20, width - 20);
      }
      drawBubble(bubble);
    });

    raf = window.requestAnimationFrame(frame);
  }

  function onMove(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.on = true;
    const now = performance.now();
    if (!reduceMotion && now - lastRipple > 90) {
      ripples.push({ x: mouse.x, y: mouse.y, r: 6, life: 1 });
      lastRipple = now;
    }
  }

  function onLeave() {
    mouse.on = false;
  }

  resize();
  seed();
  window.addEventListener("resize", () => {
    resize();
  });
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerleave", onLeave);
  raf = window.requestAnimationFrame(frame);

  return () => {
    window.cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerleave", onLeave);
  };
}
