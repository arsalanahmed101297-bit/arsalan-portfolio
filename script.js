/* =========================================================
   Arsalan Ahmed — Portfolio
   Vanilla JavaScript. No dependencies.
   ========================================================= */

(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Header + scroll progress ---------------- */
  const header = document.getElementById("siteHeader");
  const scrollBar = document.getElementById("scrollBar");

  let ticking = false;
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 12);

    if (scrollBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;
      scrollBar.style.width = (progress * 100).toFixed(2) + "%";
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------------- Mobile navigation ---------------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", isOpen);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------------- Typewriter ---------------- */
  const typedEl = document.getElementById("typedRole");
  const roles = [
    "Agentic AI Engineer",
    "AI Automation Specialist",
    "Prompt Engineer",
    "AI Agent Developer"
  ];

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      typedEl.textContent = "";

      const type = function () {
        const current = roles[roleIndex];

        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);

          if (charIndex === current.length) {
            deleting = true;
            window.setTimeout(type, 1900);
            return;
          }
          window.setTimeout(type, 55 + Math.random() * 45);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);

          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            window.setTimeout(type, 380);
            return;
          }
          window.setTimeout(type, 28);
        }
      };

      window.setTimeout(type, 600);
    }
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- Active nav link ---------------- */
  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-list a[href^="#"]')
  );
  const sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function updateActiveNav() {
    if (!sections.length) return;

    const probe = window.scrollY + (header ? header.offsetHeight : 76) + 120;
    let current = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= probe) current = section;
    });

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 8;
    if (atBottom) current = sections[sections.length - 1];

    navLinks.forEach(function (link) {
      link.classList.toggle(
        "is-active",
        !!current && link.getAttribute("href") === "#" + current.id
      );
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("resize", updateActiveNav);
  updateActiveNav();

  /* ---------------- Toast ---------------- */
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastClose = document.getElementById("toastClose");
  let toastTimer = null;

  function hideToast() {
    if (!toast) return;
    toast.classList.remove("is-visible");
    window.clearTimeout(toastTimer);
  }

  function showToast(message) {
    if (!toast) return;
    if (message && toastMessage) toastMessage.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(hideToast, 5500);
  }

  if (toastClose) toastClose.addEventListener("click", hideToast);

  /* ---------------- Contact buttons ---------------- */
  document.querySelectorAll("[data-contact]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showToast(
        "Thank you for reaching out! Send me a message below and I'll reply within 24 hours."
      );
    });
  });

  /* ---------------- Contact form ---------------- */
  const form = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  const thanksName = document.getElementById("thanksName");
  const resetBtn = document.getElementById("resetForm");

  function markError(field, hasError) {
    const wrapper = field.closest(".field");
    if (wrapper) wrapper.classList.toggle("has-error", hasError);
  }

  function validate() {
    if (!form) return false;
    let valid = true;

    form.querySelectorAll("input, textarea").forEach(function (field) {
      const isEmail = field.type === "email";
      const filled = field.value.trim().length > 0;
      const emailOk =
        !isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim());
      const ok = filled && emailOk;
      markError(field, !ok);
      if (!ok) valid = false;
    });

    return valid;
  }

  if (form && formSuccess) {
    form.addEventListener("input", function (e) {
      if (e.target.matches("input, textarea")) {
        markError(e.target, false);
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validate()) {
        const firstInvalid = form.querySelector(".has-error input, .has-error textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim().split(" ")[0] || "friend";
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.75";
        submitBtn.textContent = "Sending...";
      }

      window.setTimeout(function () {
        if (thanksName) thanksName.textContent = name;
        form.hidden = true;
        formSuccess.hidden = false;
        showToast("Thank you, " + name + "! Your message has been sent — I'll be in touch soon.");

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = "";
          submitBtn.innerHTML = originalHTML;
        }
        formSuccess.focus({ preventScroll: true });
      }, prefersReducedMotion ? 0 : 750);
    });
  }

  if (resetBtn && form && formSuccess) {
    resetBtn.addEventListener("click", function () {
      form.reset();
      form.querySelectorAll(".field").forEach(function (field) {
        field.classList.remove("has-error");
      });
      formSuccess.hidden = true;
      form.hidden = false;
      const firstField = form.querySelector("input, textarea");
      if (firstField) firstField.focus({ preventScroll: true });
    });
  }
})();
