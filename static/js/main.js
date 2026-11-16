(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");
  if (toggle && menu) {
    const setOpen = (open) => {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- Countdown ---------- */
  const cd = document.querySelector(".countdown");
  if (cd) {
    const target = new Date(cd.dataset.target).getTime();
    const el = (u) => cd.querySelector(`[data-unit="${u}"]`);
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60); s -= m * 60;
      el("d").textContent = pad(d); el("h").textContent = pad(h);
      el("m").textContent = pad(m); el("s").textContent = pad(s);
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Spears thrown from both sides, driven by scroll ---------- */
  const section = document.getElementById("strike");
  const stage = document.getElementById("strike-stage");
  const left = document.getElementById("spear-l");
  const right = document.getElementById("spear-r");

  if (section && stage && left && right && !reduce) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      const flight = easeOut(Math.min(1, p / 0.62));      // spears fly during the first 62%
      const inv = 1 - flight;

      // slide in from off-screen and level out as they land
      left.style.transform  = `translateX(${-110 * inv}%) rotate(${6 - 16 * inv}deg)`;
      right.style.transform = `translateX(${110 * inv}%) rotate(${-6 + 16 * inv}deg)`;

      stage.classList.toggle("is-struck", p >= 0.66);
    };

    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  } else if (stage) {
    stage.classList.add("is-struck");
    left && (left.style.transform = "rotate(6deg)");
    right && (right.style.transform = "rotate(-6deg)");
  }

  /* ---------- Registration form ---------- */
  const form = document.getElementById("reg-form");
  const status = document.getElementById("form-status");
  if (form) {
    const clearErrors = () => {
      form.querySelectorAll(".err").forEach((n) => (n.textContent = ""));
      form.querySelectorAll(".field").forEach((f) => f.classList.remove("invalid"));
    };
    const showErrors = (errors) => {
      Object.entries(errors).forEach(([name, msg]) => {
        const out = form.querySelector(`.err[data-for="${name}"]`);
        if (out) { out.textContent = msg; out.closest(".field").classList.add("invalid"); }
      });
      const first = Object.keys(errors)[0];
      const input = first && form.elements[first];
      if (input) input.focus();
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors();
      status.className = "form__status";
      status.textContent = "Sending your offering…";
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      try {
        const res = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const data = await res.json();
        if (data.ok) {
          status.classList.add("ok");
          status.textContent = data.message;
          form.reset();
        } else {
          status.classList.add("bad");
          status.textContent = "Fix the highlighted fields and try again.";
          showErrors(data.errors || {});
        }
      } catch {
        status.classList.add("bad");
        status.textContent = "Could not reach the server. Check your connection and try again.";
      } finally {
        btn.disabled = false;
      }
    });
  }
})();
