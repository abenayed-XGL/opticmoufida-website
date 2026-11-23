(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  /* ---------- Language ---------- */
  var LANGS = ["fr", "en"];
  function getLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (LANGS.indexOf(q) > -1) return q;
    try { var s = localStorage.getItem("om-lang"); if (LANGS.indexOf(s) > -1) return s; } catch (e) {}
    return (navigator.language || "fr").slice(0, 2).toLowerCase() === "en" ? "en" : "fr";
  }
  var lang = getLang();
  function t(key) {
    var d = window.I18N[lang] || {};
    return d[key] != null ? d[key] : (window.I18N.fr[key] || "");
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  function applyLang(l) {
    lang = l;
    doc.lang = l;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"); if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    var titleKey = document.body.getAttribute("data-title");
    if (titleKey) document.title = t(titleKey);
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.home.desc"));
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === l ? "true" : "false");
    });
    try { localStorage.setItem("om-lang", l); } catch (e) {}
    updateOpenStatus();
    renderBrands();
    renderReviews();
  }
  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });

  /* ---------- Header & menu ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
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

  /* ---------- Dynamic numbers ---------- */
  document.querySelectorAll("[data-years]").forEach(function (el) { el.textContent = new Date().getFullYear() - 1991; });
  document.querySelectorAll("[data-brand-count]").forEach(function (el) { el.textContent = (window.BRANDS || []).length + "+"; });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Open / closed (Tunisia time) ---------- */
  function updateOpenStatus() {
    var els = document.querySelectorAll(".open-status");
    if (!els.length) return;
    var parts;
    try {
      parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Tunis", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    } catch (e) { return; }
    var get = function (k) { var p = parts.find(function (x) { return x.type === k; }); return p ? p.value : ""; };
    var mins = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
    var open = get("weekday") !== "Sun" && mins >= 540 && mins < 1200;
    els.forEach(function (el) {
      el.classList.toggle("is-open", open); el.classList.toggle("is-closed", !open);
      el.textContent = t(open ? "status.open" : "status.closed");
    });
  }

  /* ---------- Brands ---------- */
  var brandFilter = (location.hash || "").replace("#", "");
  if (["optical", "sun", "kids"].indexOf(brandFilter) < 0) brandFilter = "all";

  function brandCard(b) {
    var tags = b.cats.map(function (c) { return '<span class="tag">' + esc(t("cat." + c)) + "</span>"; }).join("");
    var ex = b.examples && b.examples.length
      ? '<p class="ex">' + esc(t("brands.examples")) + " " + b.examples.map(esc).join(" · ") + "</p>" : "";
    if (b.img) {
      return '<article class="brand-card" data-cats="' + b.cats.join(" ") + '">' +
        '<img src="assets/img/brands/' + b.img + '.webp" alt="' + esc(b.name) + '" loading="lazy" width="800" height="1000">' +
        '<div class="brand-info"><h3>' + esc(b.name) + '</h3><div class="tags">' + tags + "</div>" + ex + "</div></article>";
    }
    return '<article class="brand-text" data-cats="' + b.cats.join(" ") + '"><h3>' + esc(b.name) + '</h3><div class="tags">' + tags + "</div>" + ex + "</article>";
  }

  function renderBrands() {
    var all = window.BRANDS || [];
    var home = document.getElementById("home-brands");
    if (home) home.innerHTML = all.filter(function (b) { return b.home && b.img; }).map(brandCard).join("");
    var grid = document.getElementById("brand-grid");
    var also = document.getElementById("brand-also");
    if (grid) grid.innerHTML = all.filter(function (b) { return b.img; }).map(brandCard).join("");
    if (also) also.innerHTML = all.filter(function (b) { return !b.img; }).map(brandCard).join("") +
      '<article class="brand-text brand-more" data-cats="optical sun kids"><h3>' + esc(t("brands.more.title")) + "</h3><p>" + esc(t("brands.more.text")) + "</p></article>";
    applyBrandFilter(brandFilter);
  }
  function applyBrandFilter(f) {
    brandFilter = f;
    document.querySelectorAll(".segmented button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.filter === f ? "true" : "false");
    });
    document.querySelectorAll("#brand-grid > *, #brand-also > *").forEach(function (el) {
      var show = f === "all" || (el.dataset.cats || "").split(" ").indexOf(f) > -1;
      el.classList.toggle("is-hidden", !show);
    });
  }
  document.querySelectorAll(".segmented button").forEach(function (b) {
    b.addEventListener("click", function () {
      applyBrandFilter(b.dataset.filter);
      history.replaceState(null, "", b.dataset.filter === "all" ? location.pathname + location.search : "#" + b.dataset.filter);
    });
  });

  /* ---------- Google reviews ---------- */
  function stars(r) {
    var s = "";
    for (var i = 1; i <= 5; i++) s += '<span class="star' + (r >= i - 0.25 ? " on" : r >= i - 0.75 ? " half" : "") + '">★</span>';
    return s;
  }
  function renderReviews() {
    var box = document.getElementById("reviews");
    if (!box) return;
    var R = window.REVIEWS || {};
    var html = "";
    if (R.rating) {
      html += '<div class="rating-card"><div class="rating-num">' + String(R.rating).replace(".", lang === "fr" ? "," : ".") + '</div><div class="stars">' + stars(R.rating) + "</div>" +
        '<p class="rating-meta">' + (R.count ? R.count + " " + esc(t("reviews.count")) + " " : "") + esc(t("reviews.on")) + "</p></div>";
    }
    (R.reviews || []).slice(0, 3).forEach(function (rv) {
      html += '<figure class="review-card"><div class="stars small">' + stars(5) + "</div><blockquote>" + esc(rv.text) + "</blockquote><figcaption>" + esc(rv.author || "") + "</figcaption></figure>";
    });
    box.innerHTML = html;
    box.classList.toggle("is-empty", !html);
  }

  /* ---------- Reveal ---------- */
  function observeReveals() {
    var els = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  applyLang(lang);
  observeReveals();
})();
