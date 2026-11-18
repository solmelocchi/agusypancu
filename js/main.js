/**
 * MAIN.JS
 * Toma todos los datos de WEDDING_CONFIG (config.js) y arma la página.
 * No hay datos "hardcodeados" de la pareja acá: todo sale del config.
 */
(function () {
  "use strict";
  const cfg = window.WEDDING_CONFIG;
  if (!cfg) { console.error("WEDDING_CONFIG no encontrado — revisá config.js"); return; }

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $all = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const weddingDate = new Date(cfg.couple.weddingDate);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const fmtDate = (opts) => capitalize(weddingDate.toLocaleDateString("es-AR", opts));
  const fmtTime = () => weddingDate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  const sep = () => (cfg.couple.monogramSeparator || "&");
  const sepHtml = () => sep() === "&" ? "&amp;" : sep();
  const initials = () => [
    cfg.couple.brideInitial || cfg.couple.brideName.charAt(0),
    cfg.couple.groomInitial || cfg.couple.groomName.charAt(0)
  ];

  /* ---------------------------------------------------------
     ÍCONOS DE LÍNEA FINA (SVG), en vez de emojis, para que se
     mantengan acordes a la estética en cualquier dispositivo.
     Se usan en ceremonia/fiesta, itinerario y dress code.
  --------------------------------------------------------- */
  const svg = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const ICONS = {
    // Itinerario / eventos
    rings: svg('<circle cx="9" cy="14.5" r="5"/><circle cx="15" cy="14.5" r="5"/><path d="M7.5 7.5L9 9.5l1.5-2L9 5.5z"/>'),
    church: svg('<path d="M12 2v4M10 4h4"/><path d="M6 21V11l6-5 6 5v10"/><path d="M3 21h18"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/>'),
    cheers: svg('<path d="M5.5 3h5l-.4 5.2a2.1 2.1 0 0 1-4.2 0z"/><path d="M8 10.3V18M5.5 18h5"/><path d="M13.5 3h5l-.4 5.2a2.1 2.1 0 0 1-4.2 0z"/><path d="M16 10.3V18M13.5 18h5"/><path d="M10.5 1.5l1.5 1M13.5 1.5L12 2.5"/>'),
    dinner: svg('<circle cx="12" cy="13" r="5.5"/><circle cx="12" cy="13" r="3"/><path d="M3.5 4v5M2.5 4v3a1 1 0 0 0 2 0V4M3.5 9v11"/><path d="M21 4c-1.5.8-2 3-2 6h2v10"/>'),
    dance: svg('<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/><path d="M9 9.5l10-2"/>'),
    cake: svg('<path d="M4 21h16M5 21v-7h14v7"/><path d="M5 17.5c2 1 3-1 4.7 0s3.6 1 5.3 0 2.5-1 4 0"/><path d="M8 14v-3h8v3M12 11V8.5"/><path d="M12 7c.8 0 1.2-.6 1.2-1.3S12 3.5 12 3.5s-1.2 1.5-1.2 2.2S11.2 7 12 7z"/>'),
    camera: svg('<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13.5" r="3.8"/>'),
    moon: svg('<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10z"/><path d="M17 3.5v3M15.5 5h3"/>'),
    clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    gift: svg('<rect x="3.5" y="9" width="17" height="11.5"/><path d="M2.5 6h19v3h-19zM12 6v14.5"/><path d="M12 6C10.5 3 7 2.5 7 4.5S10 6 12 6zM12 6c1.5-3 5-3.5 5-1.5S14 6 12 6z"/>'),
    card: svg('<rect x="2.5" y="5.5" width="19" height="13" rx="1.5"/><path d="M2.5 9.5h19M6 15h4"/>'),
    globe: svg('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z"/>'),
    heart: svg('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>'),
    // Dress code
    dress: svg('<path d="M9 3l3 2 3-2 1 4-2 1.5 4.5 12.5h-13L10 8.5 8 7z"/>'),
    suit: svg('<path d="M8 3.5l4 2.5 4-2.5 3.5 3-2 2.5v12H6.5V9l-2-2.5z"/><path d="M12 6v6l-2 3M12 12l2 3"/>'),
    noWhite: svg('<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>'),
    heels: svg('<path d="M3.5 17.5c0-1.6 1.2-2.4 2.6-2.4 1.6 0 3-.6 4.2-1.8l4-4.3 5.2 2.2c-.3 2.6-1.8 4.3-4 5.3-1.4.6-2.2 1.4-2.2 3H5.5c-1.2 0-2-.8-2-2z"/><path d="M19.5 11.2V20"/>'),
    ring: svg('<circle cx="12" cy="15" r="5.5"/><path d="M12 9.5L9 4.5h6z"/>')
  };
  const icon = (key, fallback) => ICONS[key] || ICONS[fallback] || ICONS.clock;

  /* ---------------------------------------------------------
     RAMITA DE OLIVO — se dibuja en cada [data-sprig]
     (tallo que se traza + hojas que crecen al aparecer)
  --------------------------------------------------------- */
  function sprigSVG(count) {
    const leaves = count || 7;
    const stemY = (t) => 32 - 11 * Math.sin(Math.PI * t * 0.85);
    const pts = Array.from({ length: 13 }, (_, i) => {
      const t = i / 12;
      return [4 + t * 186, stemY(t)];
    });
    const stem = "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L");
    const leaf = "M0 0C6-6.4 17-6.4 24 0C17 6.4 6 6.4 0 0Z";
    const groups = Array.from({ length: leaves }, (_, i) => {
      const t = 0.1 + i * (0.8 / leaves);
      const x = 4 + t * 186;
      const y = stemY(t);
      const side = i % 2 ? 1 : -1;
      const angle = side * (44 - i * 2.5);
      const scale = 1 - i * 0.045;
      return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(2)})"><path class="leaf" style="--i:${i}" d="${leaf}"/></g>`;
    });
    const tip = pts[pts.length - 1];
    groups.push(`<g transform="translate(${tip[0].toFixed(1)} ${tip[1].toFixed(1)}) rotate(-8) scale(.72)"><path class="leaf" style="--i:${leaves}" d="${leaf}"/></g>`);
    return `<svg class="sprig-svg" viewBox="0 0 200 60" aria-hidden="true" focusable="false"><path class="sprig-stem" pathLength="1" d="${stem}"/>${groups.join("")}</svg>`;
  }
  function renderOrnaments() {
    $all("[data-sprig]").forEach((el) => { el.innerHTML = sprigSVG(); });
  }

  /* ---------------------------------------------------------
     1. COLORES — se inyectan como variables CSS
  --------------------------------------------------------- */
  function applyColors() {
    const root = document.documentElement.style;
    const c = cfg.colors || {};
    if (c.background) root.setProperty("--color-bg", c.background);
    if (c.ink) root.setProperty("--color-ink", c.ink);
    if (c.primary) root.setProperty("--color-primary", c.primary);
    if (c.accent) root.setProperty("--color-accent", c.accent);
    if (c.blush) root.setProperty("--color-blush", c.blush);
    if (c.surface) root.setProperty("--color-surface", c.surface);
    // Color propio del sobre de apertura (si no, se arma con el principal)
    if (c.envelope) {
      root.setProperty("--color-envelope", c.envelope);
      document.documentElement.classList.add("sobre-propio");
    }
    document.querySelector('meta[name="theme-color"]').setAttribute("content", c.background || "#FAF3EA");
  }

  /* ---------------------------------------------------------
     1b. TIPOGRAFÍAS — opcional: config.fonts cambia las letras
     (por ejemplo las del manual de marca de la pareja)
  --------------------------------------------------------- */
  function applyFonts() {
    const f = cfg.fonts;
    if (!f) return;
    const root = document.documentElement.style;
    if (f.display) root.setProperty("--font-display", `"${f.display}", Georgia, serif`);
    if (f.body) root.setProperty("--font-body", `"${f.body}", system-ui, sans-serif`);
    // Fuentes sin cursiva: los títulos van rectos en vez de una cursiva falsa
    if (f.italic === false) document.documentElement.classList.add("sin-cursiva");
  }

  /* ---------------------------------------------------------
     2. META / SEO / OPEN GRAPH
  --------------------------------------------------------- */
  function applyMeta() {
    const m = cfg.meta || {};
    document.title = m.pageTitle || "Invitación de Boda";
    $("#page-title").textContent = m.pageTitle || "";
    $("#meta-description").setAttribute("content", m.description || "");
    $("#og-title").setAttribute("content", m.pageTitle || "");
    $("#og-description").setAttribute("content", m.description || "");
    $("#og-image").setAttribute("content", m.ogImage || "");
    $("#og-url").setAttribute("content", m.url || "");
    if (m.favicon) $("#favicon").setAttribute("href", m.favicon);
  }

  /* ---------------------------------------------------------
     3. SOBRE DE APERTURA
     Al tocar el lacre se abre el sobre, sale la tarjeta y arranca
     la música (como es un toque del invitado, el navegador sí deja
     reproducir audio, cosa que no permite al cargar la página).
  --------------------------------------------------------- */
  function revealPage() {
    document.body.classList.add("is-revealed");
    launchPetals();
  }
  function setupIntro() {
    const html = document.documentElement;
    const intro = $("#intro");
    const c = cfg.couple;
    const conf = cfg.intro || {};

    if (conf.enabled === false || !intro) {
      html.classList.remove("intro-pending");
      if (intro) intro.remove();
      revealPage();
      return;
    }

    const [a, b] = initials();
    $("#env-seal-mono").innerHTML = `${a}<i>${sepHtml()}</i>${b}`;
    $("#env-names").textContent = `${c.brideName} & ${c.groomName}`;
    $("#env-date").textContent = c.weddingDateLabel || "";
    if (conf.eyebrow) $("#intro-eyebrow").textContent = conf.eyebrow;
    if (conf.hint) $("#intro-hint").textContent = conf.hint;

    let opened = false;
    const wait = (ms) => (reduceMotion ? ms * 0.15 : ms);
    function open() {
      if (opened) return;
      opened = true;
      if (cfg.music?.enabled && cfg.music.playOnOpen !== false) playMusic();
      intro.classList.add("is-opening");
      setTimeout(() => intro.classList.add("is-flap-open"), wait(450));
      setTimeout(() => intro.classList.add("is-letter-out"), wait(650));
      setTimeout(() => { intro.classList.add("is-done"); revealPage(); }, wait(2000));
      setTimeout(() => { html.classList.remove("intro-pending"); intro.remove(); }, wait(3100));
    }
    $("#env-seal").addEventListener("click", open);
    $("#envelope").addEventListener("click", open);
    window.__inviteReady = true;
  }

  /* ---------------------------------------------------------
     4. HERO
  --------------------------------------------------------- */
  function renderHero() {
    const c = cfg.couple;
    $("#hero-image").src = c.heroImage;
    $("#hero-image").alt = `${c.brideName} y ${c.groomName}`;
    $("#bride-name").textContent = c.brideName;
    $("#groom-name").textContent = c.groomName;
    $("#hero-phrase").textContent = c.heroPhrase;

    // Fecha estilo tarjeta impresa: DOMINGO | 14 | MARZO, y abajo el año y la hora
    $("#hd-weekday").textContent = fmtDate({ weekday: "long" });
    $("#hd-day").textContent = weddingDate.getDate();
    $("#hd-month").textContent = fmtDate({ month: "long" });
    $("#hd-year").textContent = `${weddingDate.getFullYear()} · ${fmtTime()} hs`;
  }

  /* ---------------------------------------------------------
     5. CUENTA REGRESIVA
  --------------------------------------------------------- */
  function startCountdown() {
    const target = weddingDate.getTime();
    const els = { d: $("#cd-days"), h: $("#cd-hours"), m: $("#cd-minutes"), s: $("#cd-seconds") };
    const pad = (n) => String(n).padStart(2, "0");
    $("#countdown-date").textContent = `${fmtDate({ weekday: "long" })} ${cfg.couple.weddingDateLabel || ""}`.trim();

    function set(el, value) {
      if (el.textContent === value) return;
      el.textContent = value;
      el.classList.remove("tick");
      void el.offsetWidth; // reinicia la animación
      el.classList.add("tick");
    }
    function tick() {
      const diff = Math.max(0, target - Date.now());
      set(els.d, pad(Math.floor(diff / 86400000)));
      set(els.h, pad(Math.floor((diff % 86400000) / 3600000)));
      set(els.m, pad(Math.floor((diff % 3600000) / 60000)));
      set(els.s, pad(Math.floor((diff % 60000) / 1000)));
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     6. AGREGAR AL CALENDARIO (Google Calendar link)
  --------------------------------------------------------- */
  function setupCalendarButton() {
    $("#add-to-calendar").addEventListener("click", () => {
      const start = weddingDate;
      const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);
      const fmt = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
      const title = encodeURIComponent(`Boda de ${cfg.couple.brideName} & ${cfg.couple.groomName}`);
      const details = encodeURIComponent(`${cfg.couple.heroPhrase || ""}\n\n${cfg.meta?.url || window.location.href}`);
      const loc = encodeURIComponent(cfg.ceremony?.address || cfg.party?.address || "");
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${loc}`;
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------------------------------------------------------
     7. NUESTRA HISTORIA
  --------------------------------------------------------- */
  function renderStory() {
    const s = cfg.story;
    if (s.enabled === false) { $("#story").remove(); return; }
    $("#story-title").textContent = s.title;
    $("#story-text").textContent = s.text.replace(/\s+/g, " ").trim();
    $("#story-image").src = s.image;
    $("#story-image").alt = s.title;
  }

  /* ---------------------------------------------------------
     8. GALERÍA + LIGHTBOX (con flechas, teclado y deslizar)
  --------------------------------------------------------- */
  function renderGallery() {
    const grid = $("#gallery-grid");
    const photos = cfg.gallery || [];
    if (!photos.length) { $("#gallery").remove(); return; }
    grid.innerHTML = photos.map((src, i) => `
      <button type="button" class="gallery-item reveal" data-index="${i}" style="--d:${(i % 3) * 0.1}s" aria-label="Ver foto ${i + 1}">
        <img src="${src}" loading="lazy" alt="Foto de la pareja ${i + 1}">
      </button>
    `).join("");

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-label", "Galería de fotos");
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Cerrar">&times;</button>
      <button class="lightbox-prev" aria-label="Anterior">&#10094;</button>
      <img alt="">
      <button class="lightbox-next" aria-label="Siguiente">&#10095;</button>
      <p class="lightbox-count"></p>
    `;
    document.body.appendChild(lightbox);
    const lbImg = $("img", lightbox);
    const lbCount = $(".lightbox-count", lightbox);
    let current = 0;

    function show(i) {
      current = (i + photos.length) % photos.length;
      lbImg.src = photos[current];
      lbCount.textContent = `${current + 1} / ${photos.length}`;
    }
    function open(i) { show(i); lightbox.classList.add("is-open"); }
    function close() { lightbox.classList.remove("is-open"); }

    $all(".gallery-item", grid).forEach((el) => {
      el.addEventListener("click", () => open(Number(el.dataset.index)));
    });
    $(".lightbox-close", lightbox).addEventListener("click", close);
    $(".lightbox-prev", lightbox).addEventListener("click", () => show(current - 1));
    $(".lightbox-next", lightbox).addEventListener("click", () => show(current + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    let touchX = null;
    lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });

    observeReveals(grid);
  }

  /* ---------------------------------------------------------
     9. CEREMONIA / FIESTA
  --------------------------------------------------------- */
  function renderEvent(prefix, data, defaultIcon) {
    if (!data || data.enabled === false) { $(`#${prefix}-card`).remove(); return; }
    $(`#${prefix}-icon`).className = "event-icon line-icon";
    $(`#${prefix}-icon`).innerHTML = icon(data.icon, defaultIcon);
    $(`#${prefix}-name`).textContent = data.name;
    $(`#${prefix}-time`).textContent = data.time;
    $(`#${prefix}-venue`).textContent = data.venue;
    $(`#${prefix}-address`).textContent = data.address;
    $(`#${prefix}-map`).src = `https://maps.google.com/maps?q=${encodeURIComponent(data.mapEmbedQuery)}&z=15&output=embed`;
    $(`#${prefix}-directions`).href = data.mapsLink ||
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.mapDirectionsQuery)}`;
  }
  function renderEvents() {
    renderEvent("ceremony", cfg.ceremony, "rings");
    renderEvent("party", cfg.party, "cheers");
  }

  /* ---------------------------------------------------------
     10. ITINERARIO
  --------------------------------------------------------- */
  function renderTimeline() {
    const t = cfg.timeline;
    if (!t || t.enabled === false || !(t.items || []).length) { $("#timeline").remove(); return; }
    if (t.title) $("#timeline-title").textContent = t.title;
    $("#timeline-list").innerHTML = t.items.map((item, i) => `
      <li class="timeline-item reveal" style="--d:${i * 0.08}s">
        <span class="tl-time">${item.time}</span>
        <span class="tl-icon line-icon" aria-hidden="true">${icon(item.icon)}</span>
        <span class="tl-title">${item.title}${item.detail ? `<small>${item.detail}</small>` : ""}</span>
      </li>
    `).join("");
  }

  /* ---------------------------------------------------------
     11. DRESS CODE
  --------------------------------------------------------- */
  function renderDressCode() {
    const d = cfg.dressCode;
    $("#dresscode-title").textContent = d.title;
    $("#dresscode-text").textContent = d.text;
    $("#dresscode-icons").innerHTML = (d.icons || []).map((i, n) => `
      <div class="dresscode-icon${i.text ? " con-texto" : ""}" style="--d:${n * 0.1}s">
        <span class="icon-glyph line-icon">${icon(i.icon, "dress")}</span>
        <span class="icon-label">${i.label}</span>
        ${i.text ? `<span class="icon-text">${i.text}</span>` : ""}
      </div>
    `).join("");

    const palette = d.palette || [];
    if (palette.length) {
      const box = $("#dresscode-palette");
      box.hidden = false;
      box.innerHTML = `
        <p class="palette-title">${d.paletteTitle || "Paleta sugerida"}</p>
        <div class="palette-swatches">${palette.map((c) => `<span style="background:${c}"></span>`).join("")}</div>
      `;
    }
  }

  /* ---------------------------------------------------------
     12. REGALOS
  --------------------------------------------------------- */
  function copyToClipboard(text, btn) {
    const done = () => {
      const original = btn.textContent;
      btn.textContent = "¡Copiado!";
      btn.classList.add("is-copied");
      setTimeout(() => { btn.textContent = original; btn.classList.remove("is-copied"); }, 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text) && done());
    } else if (fallbackCopy(text)) {
      done();
    }
  }
  // Para navegadores viejos o páginas abiertas sin https
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  function giftCard({ iconKey, title, value, details, foot }, i) {
    return `
      <div class="gift-card reveal" style="--d:${i * 0.1}s">
        <div class="gift-card-body">
          <span class="gift-icon line-icon" aria-hidden="true">${icon(iconKey)}</span>
          <h3>${title}</h3>
          ${value ? `<div class="gift-value">${value}</div>` : ""}
          ${details ? `<p class="gift-details">${details}</p>` : ""}
        </div>
        <div class="gift-card-foot">${foot}</div>
      </div>
    `;
  }
  function renderGifts() {
    const g = cfg.gifts;
    if (!g || g.enabled === false) { $("#gifts").remove(); return; }
    $("#gifts-intro").textContent = g.intro;
    const cards = [];
    const copyBtn = (text) => `<button class="gift-copy-btn" data-copy="${text}">Copiar alias</button>`;
    const holder = (acc) => [acc.holder ? `Titular: ${acc.holder}` : "", acc.details || ""].filter(Boolean).join("<br>");

    if (g.arsAlias?.enabled) {
      cards.push({ iconKey: "card", title: g.arsAlias.label, value: g.arsAlias.alias, details: holder(g.arsAlias), foot: copyBtn(g.arsAlias.alias) });
    }
    if (g.usdAccount?.enabled) {
      cards.push({ iconKey: "globe", title: g.usdAccount.label, value: g.usdAccount.alias, details: holder(g.usdAccount), foot: copyBtn(g.usdAccount.alias) });
    }
    if (g.giftList?.enabled) {
      cards.push({
        iconKey: "gift", title: g.giftList.label,
        details: g.giftList.text || "Elegimos algunas cosas que nos gustaría tener en nuestro nuevo hogar.",
        foot: `<a class="btn btn-outline" href="${g.giftList.url}" target="_blank" rel="noopener">Ver lista</a>`
      });
    }
    let html = cards.map(giftCard).join("");
    if (g.qr?.enabled) {
      html += `
        <div class="gift-card gift-qr-card reveal">
          <div class="gift-card-body">
            <h3>${g.qr.label}</h3>
            <img src="${g.qr.image}" loading="lazy" alt="Código QR para transferencia">
          </div>
        </div>
      `;
    }
    $("#gifts-grid").innerHTML = html;
    $all(".gift-copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => copyToClipboard(btn.dataset.copy, btn));
    });
  }

  /* ---------------------------------------------------------
     13. PREGUNTAS FRECUENTES
  --------------------------------------------------------- */
  function renderFaq() {
    const f = cfg.faq;
    if (!f || f.enabled === false || !(f.items || []).length) { $("#faq").remove(); return; }
    if (f.title) $("#faq-title").textContent = f.title;
    $("#faq-list").innerHTML = f.items.map((item, i) => `
      <details class="faq-item reveal" style="--d:${i * 0.06}s">
        <summary>${item.q}<span class="faq-plus" aria-hidden="true"></span></summary>
        <p class="faq-answer">${item.a}</p>
      </details>
    `).join("");
  }

  /* ---------------------------------------------------------
     14. RSVP — textos y opciones de menú (el envío vive en rsvp.js)
  --------------------------------------------------------- */
  function renderRsvp() {
    const r = cfg.rsvp;
    $("#rsvp-menu").innerHTML = (r.menuOptions || []).map((opt) => `<option value="${opt}">${opt}</option>`).join("");
    $("#rsvp-subtitle").innerHTML = r.deadlineLabel
      ? `Te pedimos que nos confirmes antes del <strong>${r.deadlineLabel}</strong>.`
      : "Te pedimos que nos confirmes lo antes posible.";
    // Confirmación por persona: no se pregunta cuántos vienen
    if (r.perPerson) {
      const fila = $("#rsvp-guests").closest(".form-row");
      if (fila) fila.remove();
    }
    if (r.comments === false) {
      const fila = $("#rsvp-comments") && $("#rsvp-comments").closest(".form-row");
      if (fila) fila.remove();
    }
    if (r.perPersonNote) {
      $("#rsvp-subtitle").insertAdjacentHTML("beforeend", `<span class="rsvp-note">${r.perPersonNote}</span>`);
    }
    selectorPropio($("#rsvp-menu"));
    if (r.menuNote) {
      $("#rsvp-menu").closest(".form-row").insertAdjacentHTML("beforeend", `<p class="form-note">${r.menuNote}</p>`);
    }
    $(".rsvp-thanks-icon").classList.add("line-icon");
    $(".rsvp-thanks-icon").innerHTML = ICONS.heart;
  }

  /* ---------------------------------------------------------
     14a. DESPLEGABLE CON EL ESTILO DE LA INVITACIÓN
     Reemplaza la lista nativa (gris, distinta en cada celular) por
     una propia; el <select> original sigue guardando el valor.
  --------------------------------------------------------- */
  function selectorPropio(select) {
    if (!select || !select.options.length) return;
    const caja = document.createElement("div");
    caja.className = "selector";
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "selector-boton";
    boton.id = select.id + "-boton";
    boton.setAttribute("aria-haspopup", "listbox");
    boton.setAttribute("aria-expanded", "false");
    const lista = document.createElement("ul");
    lista.className = "selector-lista";
    lista.setAttribute("role", "listbox");
    lista.hidden = true;

    const pintar = () => {
      boton.textContent = select.options[select.selectedIndex] ? select.options[select.selectedIndex].textContent : "";
      Array.from(lista.children).forEach((li) => li.setAttribute("aria-selected", String(li.dataset.valor === select.value)));
    };
    const cerrar = () => { lista.hidden = true; boton.setAttribute("aria-expanded", "false"); caja.classList.remove("abierto"); };
    const abrir = () => {
      lista.hidden = false;
      boton.setAttribute("aria-expanded", "true");
      caja.classList.add("abierto");
      (lista.querySelector('[aria-selected="true"]') || lista.firstElementChild).focus();
    };

    Array.from(select.options).forEach((op) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.tabIndex = -1;
      li.dataset.valor = op.value;
      li.textContent = op.textContent;
      li.addEventListener("click", () => {
        select.value = op.value;
        select.dispatchEvent(new Event("change"));
        pintar();
        cerrar();
        boton.focus();
      });
      lista.appendChild(li);
    });

    boton.addEventListener("click", () => (lista.hidden ? abrir() : cerrar()));
    lista.addEventListener("keydown", (e) => {
      const items = Array.from(lista.children);
      const i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); document.activeElement.click(); }
      if (e.key === "Escape" || e.key === "Tab") { cerrar(); boton.focus(); }
    });
    document.addEventListener("click", (e) => { if (!caja.contains(e.target)) cerrar(); });
    if (select.form) select.form.addEventListener("reset", () => setTimeout(pintar));

    select.hidden = true;
    const etiqueta = document.querySelector(`label[for="${select.id}"]`);
    if (etiqueta) etiqueta.htmlFor = boton.id;
    caja.append(boton, lista);
    select.after(caja);
    pintar();
  }

  /* ---------------------------------------------------------
     14b. CÁMARA DESCARTABLE — botón a la app de la cámara de la boda
  --------------------------------------------------------- */
  function renderCamera() {
    const c = cfg.camara;
    const seccion = $("#camara");
    if (!seccion) return;
    if (!c || !c.enabled || !c.url) { seccion.remove(); return; }
    if (c.text) $("#camara-text").textContent = c.text;
    $("#camara-link").href = c.url;
    $("#camara-icon").innerHTML = ICONS.camera;
  }

  /* ---------------------------------------------------------
     15. MÚSICA DE FONDO
  --------------------------------------------------------- */
  let setPlaying = () => {};
  function playMusic() {
    const audio = $("#bg-music");
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }
  function setupMusic() {
    const toggle = $("#music-toggle");
    if (!cfg.music?.enabled) { toggle.remove(); return; }
    const audio = $("#bg-music");
    audio.src = cfg.music.src;
    if (cfg.music.volume) audio.volume = cfg.music.volume;

    setPlaying = (on) => {
      toggle.setAttribute("aria-pressed", String(on));
      toggle.setAttribute("aria-label", on ? "Pausar música" : "Activar música");
    };
    toggle.addEventListener("click", () => {
      if (audio.paused) playMusic();
      else { audio.pause(); setPlaying(false); }
    });
  }

  /* ---------------------------------------------------------
     16. PÉTALOS (al abrir la invitación)
  --------------------------------------------------------- */
  function launchPetals() {
    const container = $("#petals");
    if (!container || reduceMotion || cfg.petals === false) return;
    const total = 22;
    for (let i = 0; i < total; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.animationDuration = 7 + Math.random() * 6 + "s";
      petal.style.animationDelay = Math.random() * 2.5 + "s";
      petal.style.opacity = 0.45 + Math.random() * 0.45;
      petal.style.setProperty("--drift", (Math.random() * 160 - 60).toFixed(0) + "px");
      petal.style.transform = `scale(${0.55 + Math.random() * 0.8})`;
      container.appendChild(petal);
    }
    setTimeout(() => container.remove(), 16000);
  }

  /* ---------------------------------------------------------
     17. COMPARTIR INVITACIÓN
  --------------------------------------------------------- */
  function setupShare() {
    if (!$("#share-invite")) return;
    $("#share-invite").addEventListener("click", async () => {
      const shareData = {
        title: cfg.meta.pageTitle,
        text: cfg.meta.description,
        url: cfg.meta.url || window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) { /* el invitado canceló */ }
      } else {
        const btn = $("#share-invite");
        copyToClipboard(shareData.url, btn);
      }
    });
  }

  /* ---------------------------------------------------------
     18. FOOTER
  --------------------------------------------------------- */
  function renderFooter() {
    const f = cfg.footer;
    // footer.share = false saca el botón de compartir
    if (f.share === false) { const acc = $(".footer-actions"); if (acc) acc.remove(); }
    const [a, b] = initials();
    $("#footer-monogram").innerHTML = `${a} <i>${sepHtml()}</i> ${b}`;
    $("#footer-date").textContent = `${weddingDate.getDate()} · ${String(weddingDate.getMonth() + 1).padStart(2, "0")} · ${weddingDate.getFullYear()}`;
    $("#footer-contact").innerHTML = f.contactEmail ? `<a href="mailto:${f.contactEmail}">${f.contactEmail}</a>` : "";
    $("#footer-agency").innerHTML = f.agencyUrl
      ? `<a href="${f.agencyUrl}"${f.agencyUrl.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener"'}>${f.agencyName}</a>`
      : (f.agencyName || "");

    const socials = [];
    if (f.social?.instagram) socials.push({ href: f.social.instagram, label: "Instagram", path: "M12 2C9.3 2 8.9 2 7.9 2 6 2.1 4.6 2.5 3.5 3.6 2.4 4.7 2 6.1 2 8v8c0 1.9.4 3.3 1.5 4.4 1.1 1.1 2.5 1.5 4.4 1.5h8c1.9 0 3.3-.4 4.4-1.5 1.1-1.1 1.5-2.5 1.5-4.4V8c0-1.9-.4-3.3-1.5-4.4C19.2 2.5 17.8 2.1 15.9 2H12zm0 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.2-3.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" });
    if (f.social?.whatsapp) socials.push({ href: f.social.whatsapp, label: "WhatsApp", path: "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.9 9.9 0 0 0 4.62 1.15h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.05c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.02.24-3.43-.72-2.9-1.16-4.76-4.12-4.9-4.31-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.57-.36.77-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.29.14.46.12.63-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.63-.14.26.09 1.65.78 1.93.92.29.14.48.21.55.33.07.12.07.7-.17 1.38Z" });
    $("#footer-social").innerHTML = socials.map((s) => `
      <a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="${s.path}"/></svg>
      </a>
    `).join("");
  }

  /* ---------------------------------------------------------
     19. SCROLL REVEAL (Intersection Observer)
     Observa los bloques .reveal y también las ramitas, que se
     dibujan cuando entran en pantalla.
  --------------------------------------------------------- */
  let revealObserver;
  function initRevealObserver() {
    if (!("IntersectionObserver" in window)) {
      $all(".reveal, .sprig").forEach((el) => el.classList.add("is-visible"));
      revealObserver = { observe: (el) => el.classList.add("is-visible"), unobserve() {} };
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    observeReveals(document);
  }
  function observeReveals(ctx) {
    $all(".reveal, .sprig", ctx).forEach((el) => {
      if (!el.classList.contains("is-visible")) revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  function init() {
    // Cada función se corre por separado: si una sección falla (por ejemplo
    // por una imagen o un mapa que no cargó), se avisa por consola pero el
    // resto de la página se sigue armando con normalidad. El sobre va
    // primero para que nunca quede la página tapada.
    const steps = [
      setupIntro, applyColors, applyFonts, applyMeta, renderOrnaments, renderHero, startCountdown,
      setupCalendarButton, renderStory, renderEvents, renderTimeline, renderDressCode,
      renderGifts, renderFaq, renderRsvp, renderCamera, renderFooter, setupMusic, setupShare,
      initRevealObserver, renderGallery
    ];
    steps.forEach((step) => {
      try { step(); }
      catch (err) {
        console.error(`Error en ${step.name}:`, err);
        if (step === setupIntro) {
          document.documentElement.classList.remove("intro-pending");
          revealPage();
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
