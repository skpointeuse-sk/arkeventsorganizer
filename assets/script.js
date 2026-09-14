// =========================================================
// ARK EVENTS ORGANIZER — script partagé
// =========================================================

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
