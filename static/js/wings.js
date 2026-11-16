/* Winged cursor: a pair of golden-red wings flanks the mouse pointer. */
(() => {
  // mouse and trackpad only
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const wingSVG = `
    <svg class="wing wing--{SIDE}" viewBox="0 0 64 40" aria-hidden="true">
      <defs>
        <linearGradient id="wg-{SIDE}" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stop-color="#FFE27A"/>
          <stop offset=".55" stop-color="#FFC529"/>
          <stop offset="1" stop-color="#E02B20"/>
        </linearGradient>
      </defs>
      <g fill="url(#wg-{SIDE})" stroke="#7E0F12" stroke-width="1" stroke-linejoin="round">
        <path d="M62 20 C48 5 24 1 2 6 C20 10 40 16 62 24Z"/>
        <path d="M62 23 C48 14 26 11 5 18 C24 20 42 24 62 27Z"/>
        <path d="M62 26 C50 22 32 22 11 30 C28 29 44 30 62 30Z"/>
        <path d="M62 29 C52 28 38 30 21 38 C38 35 50 34 62 32Z"/>
      </g>
    </svg>`;

  const root = document.createElement("div");
  root.className = "wings";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `<div class="wings__tilt">${wingSVG.replace(/\{SIDE\}/g, "l")}${wingSVG.replace(/\{SIDE\}/g, "r")}</div>`;
  document.body.appendChild(root);
  const tilt = root.querySelector(".wings__tilt");

  // wings are anchored just beside the pointer tip, level with the arrow's body
  const OFFSET_X = 6, OFFSET_Y = 10;
  let tx = -100, ty = -100, x = -100, y = -100, vx = 0, tiltDeg = 0, seen = false, fastTimer = null;

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    tx = e.clientX; ty = e.clientY;
    if (!seen) { seen = true; x = tx; y = ty; root.classList.add("on"); }
    root.classList.add("fast");                       // flap quicker while moving
    clearTimeout(fastTimer);
    fastTimer = setTimeout(() => root.classList.remove("fast"), 140);
  }, { passive: true });

  document.addEventListener("pointerleave", () => root.classList.remove("on"));
  document.addEventListener("pointerenter", () => { if (seen) root.classList.add("on"); });
  window.addEventListener("pointerdown", () => {
    root.classList.add("burst");
    setTimeout(() => root.classList.remove("burst"), 260);
  });

  const loop = () => {
    const px = x;
    x += (tx - x) * 0.45; y += (ty - y) * 0.45;       // light follow for a floaty feel
    vx += ((x - px) - vx) * 0.25;
    tiltDeg += (Math.max(-18, Math.min(18, vx * 0.9)) - tiltDeg) * 0.2;
    root.style.transform = `translate3d(${x + OFFSET_X}px, ${y + OFFSET_Y}px, 0)`;
    tilt.style.transform = `rotate(${tiltDeg}deg)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
