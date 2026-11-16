/* Pantheon: spotlight the hovered god, dim the rest, show their challenge. */
(() => {
  const art = document.getElementById("pantheon-art");
  if (!art) return;
  const hots = [...art.querySelectorAll(".hot")];
  const caption = document.getElementById("pantheon-caption");
  const compact = window.matchMedia("(max-width: 900px), (hover: none)");
  let clearTimer = null;

  const fillCaption = (hot) => {
    if (!caption) return;
    const d = hot.querySelector(".hot__data").dataset;
    caption.textContent = "";
    const name = document.createElement("b");   name.textContent = d.god;
    const domain = document.createElement("em"); domain.textContent = d.domain;
    const text = document.createElement("p");   text.textContent = d.blurb;
    const link = document.createElement("a");   link.className = "btn btn--small"; link.href = hot.href; link.textContent = "See challenges";
    caption.append(name, domain, text, link);
  };

  const activate = (hot) => {
    clearTimeout(clearTimer);
    hots.forEach((h) => h.classList.toggle("is-active", h === hot));
    art.style.setProperty("--spot-x", hot.dataset.x + "%");
    art.style.setProperty("--spot-r", hot.dataset.r + "%");
    art.classList.add("is-active");
    if (compact.matches) fillCaption(hot);
  };

  const clear = () => {
    if (compact.matches) return;            // on touch the last tapped god stays lit
    clearTimer = setTimeout(() => {         // small delay avoids flicker when moving between gods
      hots.forEach((h) => h.classList.remove("is-active"));
      art.classList.remove("is-active");
    }, 70);
  };

  hots.forEach((hot) => {
    hot.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") activate(hot); });
    hot.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") clear(); });
    hot.addEventListener("focus", () => activate(hot));
    hot.addEventListener("blur", clear);
    hot.addEventListener("click", (e) => {
      if (compact.matches) { e.preventDefault(); activate(hot); }   // tap to preview, use the button to open
    });
  });

  if (compact.matches && hots.length) activate(hots[0]);   // touch screens start with Zeus selected
})();
