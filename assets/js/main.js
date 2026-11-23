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

  /* ---------- Brand index ---------- */
  function renderBrands() {
    var box = document.getElementById("brand-index");
    if (!box) return;
    box.innerHTML = (window.BRANDS || []).map(function (b) {
      return "<li><strong>" + esc(b.name) + "</strong><span>" + b.cats.map(function (c) { return esc(t("cat." + c)); }).join(" · ") + "</span></li>";
    }).join("");
  }

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
