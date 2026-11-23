(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  /* ---------- Language ---------- */
  var LANGS = ["fr", "en"];
  function getLang() {
    var params = new URLSearchParams(location.search);
    var q = params.get("lang");
    if (LANGS.indexOf(q) > -1) return q;
    try {
      var saved = localStorage.getItem("om-lang");
      if (LANGS.indexOf(saved) > -1) return saved;
    } catch (e) {}
    var nav = (navigator.language || "fr").slice(0, 2).toLowerCase();
    return nav === "en" ? "en" : "fr";
  }
  var lang = getLang();

  function t(key) {
    var dict = window.I18N[lang] || {};
    return dict[key] != null ? dict[key] : (window.I18N.fr[key] || "");
  }

  function applyLang(l) {
    lang = l;
    doc.lang = l;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    var titleKey = document.body.getAttribute("data-title");
    if (titleKey) document.title = t(titleKey);
    var desc = document.querySelector('meta[name="description"]');
    if (desc && t("meta.home.desc")) desc.setAttribute("content", t("meta.home.desc"));
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === l ? "true" : "false");
    });
    try { localStorage.setItem("om-lang", l); } catch (e) {}
    updateOpenStatus();
    if (typeof renderGallery === "function") renderGallery();
  }

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });

  /* ---------- Header ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
    });
  }

  /* ---------- Hero slideshow ---------- */
  var show = document.querySelector(".slideshow");
  if (show) {
    var slides = show.querySelectorAll("img");
    var dotsWrap = show.querySelector(".slide-dots");
    var idx = 0, timer;
    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Slide " + (i + 1));
      d.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll("button");
    function go(i) {
      slides[idx].classList.remove("is-active"); dots[idx].classList.remove("is-active");
      idx = (i + slides.length) % slides.length;
      var img = slides[idx];
      if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); }
      img.classList.add("is-active"); dots[idx].classList.add("is-active");
      // preload next
      var nx = slides[(idx + 1) % slides.length];
      if (nx.dataset.src) { nx.src = nx.dataset.src; nx.removeAttribute("data-src"); }
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 5000); }
    dots[0].classList.add("is-active");
    var first = slides[1]; if (first && first.dataset.src) { first.src = first.dataset.src; first.removeAttribute("data-src"); }
    restart();
  }

  /* ---------- Open / closed (Tunisia time) ---------- */
  function updateOpenStatus() {
    var els = document.querySelectorAll(".open-status");
    if (!els.length) return;
    var parts;
    try {
      parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Tunis", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    } catch (e) { return; }
    var get = function (type) { var p = parts.find(function (x) { return x.type === type; }); return p ? p.value : ""; };
    var day = get("weekday"), h = parseInt(get("hour"), 10), m = parseInt(get("minute"), 10);
    var mins = h * 60 + m;
    var open = day !== "Sun" && mins >= 9 * 60 && mins < 20 * 60;
    els.forEach(function (el) {
      el.classList.toggle("is-open", open);
      el.classList.toggle("is-closed", !open);
      el.textContent = t(open ? "status.open" : "status.closed");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Collection gallery ---------- */
  var gallery = document.getElementById("gallery");
  var currentFilter = (location.hash || "").replace("#", "") || "all";
  if (["all", "optical", "sun", "kids"].indexOf(currentFilter) < 0) currentFilter = "all";
  var visibleItems = [];

  var renderGallery = gallery ? function () {
    var items = window.COLLECTION || [];
    gallery.innerHTML = "";
    items.forEach(function (item, i) {
      var fig = document.createElement("figure");
      fig.dataset.cat = item.cat;
      fig.dataset.index = i;
      var img = document.createElement("img");
      img.src = "assets/img/" + item.img + ".webp";
      img.alt = item.brand + " — " + t("cat." + item.cat + ".sub");
      img.loading = "lazy";
      if (item.w) { img.width = item.w; img.height = item.h; }
      var cap = document.createElement("figcaption");
      cap.innerHTML = "<strong></strong><span></span>";
      cap.querySelector("strong").textContent = item.brand;
      cap.querySelector("span").textContent = t("cat." + item.cat);
      fig.appendChild(img); fig.appendChild(cap);
      fig.addEventListener("click", function () { window.openLightbox(fig); });
      gallery.appendChild(fig);
    });
    applyFilter(currentFilter);
  } : null;

  function applyFilter(f) {
    currentFilter = f;
    document.querySelectorAll(".filters button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.filter === f ? "true" : "false");
    });
    visibleItems = [];
    gallery.querySelectorAll("figure").forEach(function (fig) {
      var show = f === "all" || fig.dataset.cat === f;
      fig.classList.toggle("is-hidden", !show);
      if (show) visibleItems.push(fig);
    });
  }

  if (gallery) {
    document.querySelectorAll(".filters button").forEach(function (b) {
      b.addEventListener("click", function () {
        applyFilter(b.dataset.filter);
        history.replaceState(null, "", b.dataset.filter === "all" ? location.pathname + location.search : "#" + b.dataset.filter);
      });
    });
    window.addEventListener("hashchange", function () {
      var h = location.hash.replace("#", "");
      if (["optical", "sun", "kids"].indexOf(h) > -1) applyFilter(h);
    });

    var lb = document.querySelector(".lightbox");
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".lightbox-caption");
    var lbPos = 0;
    function showAt(pos) {
      lbPos = (pos + visibleItems.length) % visibleItems.length;
      var fig = visibleItems[lbPos];
      var im = fig.querySelector("img");
      lbImg.src = im.src; lbImg.alt = im.alt;
      lbCap.textContent = fig.querySelector("strong").textContent;
    }
    window.openLightbox = function (fig) {
      showAt(visibleItems.indexOf(fig));
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lb.querySelector(".lb-close").focus();
    };
    function closeLb() { lb.classList.remove("is-open"); document.body.style.overflow = ""; }
    lb.querySelector(".lb-close").addEventListener("click", closeLb);
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); showAt(lbPos - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); showAt(lbPos + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showAt(lbPos - 1);
      if (e.key === "ArrowRight") showAt(lbPos + 1);
    });
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  applyLang(lang);
})();
