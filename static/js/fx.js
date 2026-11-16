/* Ambient particles: embers roam the whole screen over red sections,
   leaves drift in from the edges over green ones. Reacts to the cursor and to scrolling. */
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "fx";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let W = 0, H = 0;
  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const small = () => W < 700;
  const MAX = () => (small() ? 38 : 85);
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ----- which kind of section is in the middle of the screen? ----- */
  const sections = [...document.querySelectorAll("[data-fx]")];
  let mode = "none";
  const detect = () => {
    const mid = H * 0.5;
    mode = "none";
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { mode = s.dataset.fx; break; }
    }
  };
  detect();
  setInterval(detect, 180);

  /* ----- pointer ----- */
  const pointer = { x: -999, y: -999, active: false, lastSpawn: 0 };
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    if (e.pointerType === "mouse" && performance.now() - pointer.lastSpawn > 90 && parts.length < MAX()) {
      pointer.lastSpawn = performance.now();
      if (mode === "fire") spawnFire(e.clientX, e.clientY, true);
      else if (mode === "leaf") spawnLeaf(e.clientX, e.clientY, true);
    }
  }, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; });

  /* ----- particles ----- */
  const parts = [];
  const LEAF_COLORS = ["#00A878", "#3be0b0", "#0f8a63", "#7cf0c8", "#0A6B50"];

  function spawnFire(x, y, fromCursor) {
    // embers appear anywhere on screen and wander, instead of entering from the sides
    const ang = rand(0, 6.2832), speed = fromCursor ? rand(15, 50) : rand(10, 50);
    parts.push({
      kind: "fire",
      x: fromCursor ? x : rand(0, W),
      y: fromCursor ? y : rand(0, H),
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed - 12,
      size: fromCursor ? rand(1.2, 2.4) : rand(1.3, 3.4),
      life: fromCursor ? rand(.9, 1.6) : rand(4, 8), age: 0, seed: Math.random() * 10,
    });
  }

  function spawnLeaf(x, y, fromCursor) {
    const left = Math.random() < 0.5;
    parts.push({
      kind: "leaf", x: fromCursor ? x : (left ? -14 : W + 14),
      y: fromCursor ? y : rand(-20, H * 0.85),
      vx: fromCursor ? rand(-40, 40) : (left ? 1 : -1) * rand(50, 140),
      vy: rand(18, 55),
      size: rand(5, 11), rot: rand(0, 6.28), vr: rand(-1.8, 1.8),
      color: LEAF_COLORS[(Math.random() * LEAF_COLORS.length) | 0],
      life: fromCursor ? rand(3, 5) : rand(6.5, 11), age: 0, seed: Math.random() * 10,
    });
  }

  function drawFire(p) {
    const k = p.age / p.life;
    const a = Math.min(1, k / 0.15) * Math.pow(1 - k, 1.2);      // fade in, then burn out
    const r = p.size * (1.5 - k * 0.8) * (0.85 + 0.25 * Math.sin(p.age * 18 + p.seed));
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.6);
    g.addColorStop(0, `rgba(255,240,170,${a})`);
    g.addColorStop(0.3, `rgba(255,176,40,${a * 0.75})`);
    g.addColorStop(0.65, `rgba(224,43,32,${a * 0.3})`);
    g.addColorStop(1, "rgba(224,43,32,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.6, 0, 6.2832); ctx.fill();
  }

  function drawLeaf(p) {
    const k = p.age / p.life;
    const a = Math.min(1, p.age / 0.6) * Math.min(1, (1 - k) / 0.2) * 0.88;
    const s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, 0.55 + 0.45 * Math.cos(p.age * 2.2 + p.seed));   // tumbling
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.85, -s * 0.15, 0, s);
    ctx.quadraticCurveTo(-s * 0.85, -s * 0.15, 0, -s);
    ctx.fill();
    ctx.strokeStyle = "rgba(6,41,31,.55)"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.9); ctx.lineTo(0, s * 0.9); ctx.stroke();
    ctx.restore();
  }

  /* ----- loop ----- */
  let last = performance.now(), acc = 0, lastScroll = window.scrollY;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // spawn from the edges of the current section type
    const rate = mode === "fire" ? 15 : mode === "leaf" ? 6.5 : 0;
    acc += rate * dt * (small() ? 0.55 : 1);
    while (acc >= 1) {
      acc -= 1;
      if (parts.length < MAX()) (mode === "fire" ? spawnFire : spawnLeaf)();
    }

    // scrolling drags particles along so they feel part of the page
    const sy = window.scrollY, scrollDelta = sy - lastScroll; lastScroll = sy;

    ctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.age += dt;
      if (p.age >= p.life || p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) { parts.splice(i, 1); continue; }

      if (p.kind === "fire") {
        // lazy wandering drift in every direction, with a slight upward float
        p.vx += (Math.sin(p.age * 1.3 + p.seed) * 40 + Math.cos(p.age * 2.1 + p.seed * 1.7) * 28) * dt;
        p.vy += (Math.sin(p.age * 1.1 + p.seed * 2) * 34 - 10) * dt;
        p.vx *= 1 - 0.35 * dt; p.vy *= 1 - 0.35 * dt;
      } else {
        p.vx += Math.sin(p.age * 1.7 + p.seed) * 70 * dt;
        p.vx *= 1 - 0.45 * dt;
        p.rot += p.vr * dt;
      }

      // cursor pushes particles away
      if (pointer.active) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy, R = 130;
        if (d2 < R * R && d2 > 1) {
          const d = Math.sqrt(d2), f = Math.pow(1 - d / R, 2) * 700;
          p.vx += (dx / d) * f * dt; p.vy += (dy / d) * f * dt;
        }
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt - scrollDelta * 0.4;
    }

    // fire glows add together, leaves paint normally
    ctx.globalCompositeOperation = "lighter";
    for (const p of parts) if (p.kind === "fire") drawFire(p);
    ctx.globalCompositeOperation = "source-over";
    for (const p of parts) if (p.kind === "leaf") drawLeaf(p);

    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
