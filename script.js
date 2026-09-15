// =========================================================
// ARK EVENTS ORGANIZER — script partagé
// =========================================================

const STAR_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.6 4.8 1.6 7.8 3.4 9.6C17.2 11.4 20.2 12.4 24 13c-3.8.6-6.8 1.6-9.6 3.4C12.6 18.2 12 20.8 12 24c-.6-4.8-1.6-7.8-3.4-9.6C6.8 12.6 3.8 12 0 11c3.8-.6 6.8-1.6 9.6-3.4C11.4 5.8 12 3.2 12 0Z"/></svg>';

document.addEventListener("DOMContentLoaded", () => {

  /* --- menu mobile --- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  /* --- constellation de petites étoiles scintillantes, générées en JS --- */
  document.querySelectorAll("[data-stars]").forEach((el) => {
    const count = parseInt(el.dataset.stars, 10) || 0;
    if (!getComputedStyle(el).position || getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.className = "spark";
      span.setAttribute("aria-hidden", "true");
      const size = (8 + Math.random() * 11).toFixed(0);
      const top = (4 + Math.random() * 88).toFixed(1);
      const left = (3 + Math.random() * 92).toFixed(1);
      const delay = (Math.random() * 3).toFixed(2);
      span.style.cssText = `top:${top}%; left:${left}%; width:${size}px; height:${size}px; animation-delay:${delay}s;`;
      span.innerHTML = STAR_SVG;
      el.appendChild(span);
    }
  });

  /* --- révélation douce au défilement (un seul effet, discret) --- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* --- compteur animé pour les chiffres clés (5+, 100%, ...) --- */
  const nums = document.querySelectorAll(".stat .num");
  if ("IntersectionObserver" in window && nums.length) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          countIo.unobserve(el);
          const raw = el.textContent.trim();
          const match = raw.match(/^(\d+)(.*)$/);
          if (!match || prefersReduced) return; // laisse "∞" et texte non numérique tels quels
          const target = parseInt(match[1], 10);
          const suffix = match[2];
          const duration = 900;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((el) => countIo.observe(el));
  }

  /* --- formulaire de contact --- */
  const form = document.querySelector("#devis-form");
  if (form) {
    const msg = form.querySelector(".form-msg");
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // validation simple des champs requis
      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const errorEl = field.closest(".field").querySelector(".field-error");
        if (!field.value.trim()) {
          valid = false;
          if (errorEl) errorEl.classList.add("show");
          field.style.borderColor = "#E6A4A4";
        } else {
          if (errorEl) errorEl.classList.remove("show");
          field.style.borderColor = "";
        }
      });

      if (!valid) {
        msg.textContent = "Merci de compléter les champs obligatoires.";
        msg.className = "form-msg show err";
        return;
      }

      const endpoint = form.getAttribute("action");
      const isPlaceholder = !endpoint || endpoint.includes("VOTRE_ID_FORMSPREE");

      if (isPlaceholder) {
        // Le formulaire n'est pas encore raccordé à un service d'envoi d'e-mail.
        msg.textContent =
          "Formulaire non connecté : suivez les instructions du README pour activer l'envoi des demandes par e-mail.";
        msg.className = "form-msg show err";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours…";

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        if (response.ok) {
          form.reset();
          msg.textContent =
            "Merci ! Votre demande a bien été envoyée, nous revenons vers vous très vite.";
          msg.className = "form-msg show ok";
        } else {
          msg.textContent =
            "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous écrire directement par e-mail.";
          msg.className = "form-msg show err";
        }
      } catch (err) {
        msg.textContent =
          "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous écrire directement par e-mail.";
        msg.className = "form-msg show err";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer ma demande";
      }
    });
  }
});
