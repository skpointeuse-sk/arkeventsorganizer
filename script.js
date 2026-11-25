// =========================================================
// ARK EVENTS ORGANIZER : menu, univers, galerie, formulaire, cookies
// Aucune clé d'API ici. Le formulaire poste vers l'adresse publique Formspree.
// =========================================================
(function () {
  "use strict";
  var doc = document;

  /* --- menu plein écran sur mobile --- */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("menu");
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    doc.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* --- univers : la photo suit l'élément survolé ou ciblé au clavier --- */
  var stage = doc.querySelector(".univers-stage");
  if (stage) {
    var pics = stage.querySelectorAll("picture");
    doc.querySelectorAll(".u-item").forEach(function (item, i) {
      var show = function () {
        pics.forEach(function (p, j) { p.classList.toggle("on", j === i); });
        doc.querySelectorAll(".u-item").forEach(function (it, j) { it.classList.toggle("on", j === i); });
      };
      item.addEventListener("mouseenter", show);
      item.addEventListener("focusin", show);
    });
  }

  /* --- galerie : photo en grand --- */
  var box = doc.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var big = box.querySelector("img");
    doc.querySelectorAll(".g-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        big.src = btn.getAttribute("data-full");
        big.alt = img.alt;
        box.showModal();
      });
    });
    box.querySelector(".lightbox-close").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
  }

  /* --- carte Google chargée seulement au clic --- */
  var mapBtn = doc.querySelector("[data-map-load]");
  if (mapBtn) {
    mapBtn.addEventListener("click", function () {
      var holder = mapBtn.closest(".map");
      var f = doc.createElement("iframe");
      f.src = holder.getAttribute("data-src");
      f.title = "Carte Google Maps : ARK Events Organizer à Sannois";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      holder.innerHTML = "";
      holder.classList.add("loaded");
      holder.appendChild(f);
    });
  }

  /* --- formulaire de devis --- */
  var form = doc.getElementById("devis-form");
  if (form) {
    var msg = form.querySelector(".form-msg");
    var btn = form.querySelector('button[type="submit"]');
    var btnLabel = btn.querySelector(".label");
    var set = form.querySelector("fieldset");
    var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
    var phoneOk = function (v) { return v.replace(/[^\d]/g, "").length >= 9; };
    var ERR_SEND = "L'envoi n'a pas fonctionné. Réessayez dans un instant, ou écrivez-moi à ark.eventsorganizer@gmail.com ou sur WhatsApp au 06 78 03 00 66.";

    // type d'événement pré-rempli depuis le lien (/contact?type=mariage)
    var select = form.querySelector("select[name=type_evenement]");
    var wanted = new URLSearchParams(location.search).get("type");
    if (select && wanted) {
      Array.prototype.forEach.call(select.options, function (o) { if (o.getAttribute("data-key") === wanted) select.value = o.value; });
    }

    var check = function (field) {
      var err = doc.getElementById(field.getAttribute("aria-describedby"));
      var v = field.value.trim();
      var bad = false;
      if (field.required && !v) bad = true;
      else if (v && field.type === "email" && !emailOk(v)) bad = true;
      else if (v && field.type === "tel" && !phoneOk(v)) bad = true;
      field.setAttribute("aria-invalid", bad ? "true" : "false");
      if (err) err.classList.toggle("show", bad);
      return !bad;
    };
    form.querySelectorAll("[aria-describedby]").forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value.trim() || f.getAttribute("aria-invalid") === "true") check(f); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") check(f); });
    });

    var busy = function (on) {
      form.classList.toggle("is-sending", on);
      form.setAttribute("aria-busy", on ? "true" : "false");
      btn.disabled = on;
      if (set) set.disabled = on;
      btnLabel.textContent = on ? "Envoi en cours" : "Envoyer ma demande";
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.hidden = true;
      var first = null;
      form.querySelectorAll("[aria-describedby]").forEach(function (f) { if (!check(f) && !first) first = f; });
      if (first) {
        msg.textContent = "Il manque une information. Les champs à corriger sont indiqués en rouge.";
        msg.hidden = false;
        first.focus();
        return;
      }
      var data = new FormData(form);
      busy(true);
      fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: data })
        .then(function (r) {
          if (!r.ok) throw new Error("http " + r.status);
          try { sessionStorage.setItem("ark-devis", "1"); } catch (err) {}
          location.href = "/merci";
        })
        .catch(function () {
          busy(false);
          msg.textContent = ERR_SEND;
          msg.hidden = false;
          msg.focus();
        });
    });
  }

  /* --- cookies : la mesure d'audience ne se charge qu'après accord --- */
  var KEY = "ark-consent";
  var banner = doc.getElementById("consent");
  var read = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var write = function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} };
  var loadStats = function () {
    if (!/arkeventsorganizer\.com$/.test(location.hostname)) return; // jamais en local
    if (doc.querySelector("script[data-stats]")) return;
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    var s = doc.createElement("script");
    s.defer = true; s.src = "/_vercel/insights/script.js"; s.setAttribute("data-stats", "");
    doc.head.appendChild(s);
  };
  var choice = read();
  if (choice === "oui") loadStats();
  if (banner) {
    if (!choice) banner.hidden = false;
    banner.querySelector("[data-consent=oui]").addEventListener("click", function () { write("oui"); banner.hidden = true; loadStats(); });
    banner.querySelector("[data-consent=non]").addEventListener("click", function () { write("non"); banner.hidden = true; });
    doc.querySelectorAll("[data-consent-open]").forEach(function (b) {
      b.addEventListener("click", function () { banner.hidden = false; banner.querySelector("[data-consent=non]").focus(); });
    });
  }
})();
