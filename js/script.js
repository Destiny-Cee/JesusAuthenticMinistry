/* ============================================================
   JESUS THE AUTHENTIC SOLUTION MINISTRY — SOLUTION GROUND
   Main script · Vanilla JavaScript only · No libraries
   ------------------------------------------------------------
   1. Navigation (hamburger, sticky, active state, smooth scroll)
   2. Scroll reveal animations (IntersectionObserver)
   3. Form validation (prayer + contact)
   4. Back to top button
   5. Current year in footer
============================================================ */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     1. NAVIGATION
  ---------------------------------------------------------- */

  const header = document.getElementById("siteHeader");
  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");
  const linkEls = navLinks ? Array.from(navLinks.querySelectorAll(".nav__link")) : [];

  /** Toggle mobile menu */
  function setMenu(open) {
    if (!burger || !navLinks) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navLinks.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  }

  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      const open = burger.getAttribute("aria-expanded") !== "true";
      setMenu(open);
    });

    // Close when a menu item is selected
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });

    // Close when clicking outside the menu
    document.addEventListener("click", function (e) {
      if (
        burger.getAttribute("aria-expanded") === "true" &&
        !navLinks.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        setMenu(false);
      }
    });

    // Close if resized to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) setMenu(false);
    });
  }

  /** Sticky nav shrink on scroll */
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    updateBackToTop();
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /** Active navigation state via IntersectionObserver */
  if ("IntersectionObserver" in window && linkEls.length) {
    const sectionIds = linkEls.map(function (a) {
      return a.getAttribute("href").slice(1);
    });

    const sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    let currentId = "home";

    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) currentId = entry.target.id;
        });

        linkEls.forEach(function (link) {
          const match = link.getAttribute("href") === "#" + currentId;
          link.classList.toggle("is-active", match);
          if (match) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      {
        // Band around the middle of the viewport
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (sec) { sectionObserver.observe(sec); });
  }

  /* ----------------------------------------------------------
     2. SCROLL REVEAL ANIMATIONS
  ---------------------------------------------------------- */

  const revealEls = document.querySelectorAll(".reveal");

  // Apply stagger delays from data-delay attribute
  revealEls.forEach(function (el) {
    const delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--delay", delay);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----------------------------------------------------------
     3. FORM VALIDATION
     NOTE: Client-side only. No backend is connected — success
     messages must NOT claim the message was delivered.
  ---------------------------------------------------------- */

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[+()\-.\s0-9]{7,20}$/;

  /** Show an inline error on a field */
  function setError(field, errorEl, message) {
    field.setAttribute("aria-invalid", "true");
    if (errorEl) errorEl.textContent = message;
  }

  /** Clear an inline error */
  function clearError(field, errorEl) {
    field.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
  }

  /** Validate a single field; returns true when valid */
  function validateField(field, errorEl, rules) {
    const value = (field.value || "").trim();

    // Required check
    if (rules.required && value === "") {
      setError(field, errorEl, rules.requiredMsg || "This field is required.");
      return false;
    }

    // Email format
    if (rules.email && value !== "" && !EMAIL_RE.test(value)) {
      setError(field, errorEl, "Please enter a valid email address.");
      return false;
    }

    // Phone format (optional)
    if (rules.phone && value !== "" && !PHONE_RE.test(value)) {
      setError(field, errorEl, "Please enter a valid phone number.");
      return false;
    }

    // Minimum length
    if (rules.min && value.length < rules.min) {
      setError(field, errorEl, rules.minMsg || ("Please enter at least " + rules.min + " characters."));
      return false;
    }

    clearError(field, errorEl);
    return true;
  }

  /** Wire live re-validation once a field has an error */
  function watchField(field, errorEl, rules) {
    if (!field) return;
    const evt = field.type === "checkbox" ? "change" : "input";
    field.addEventListener(evt, function () {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field, errorEl, rules);
      }
    });
  }

  /** Display a status message */
  function showStatus(el, type, html) {
    if (!el) return;
    el.className = "form__status is-visible is-" + type;
    el.innerHTML = html;
  }

  function hideStatus(el) {
    if (!el) return;
    el.className = "form__status";
    el.textContent = "";
  }

  /** Set up validation for one form */
  function setupForm(config) {
    const form = document.getElementById(config.formId);
    const status = document.getElementById(config.statusId);
    if (!form) return;

    const fields = config.fields.map(function (f) {
      const el = document.getElementById(f.id);
      const err = document.getElementById(f.errorId);
      watchField(el, err, f.rules);
      return { el: el, err: err, rules: f.rules };
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideStatus(status);

      let firstInvalid = null;
      let valid = true;

      fields.forEach(function (f) {
        if (!f.el) return;
        const ok = validateField(f.el, f.err, f.rules);
        if (!ok) {
          valid = false;
          if (!firstInvalid) firstInvalid = f.el;
        }
      });

      if (!valid) {
        showStatus(
          status,
          "error",
          "Please correct the highlighted fields and try again."
        );
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Client-side validation passed.
      // IMPORTANT: no backend/API is connected — be honest about that.
      showStatus(status, "success", config.successMsg);
      form.reset();

      fields.forEach(function (f) {
        if (f.el) clearError(f.el, f.err);
      });
    });
  }

  // Prayer request form
  setupForm({
    formId: "prayerForm",
    statusId: "prayerStatus",
    fields: [
      {
        id: "pName",
        errorId: "pNameError",
        rules: { required: true, requiredMsg: "Please enter your full name." }
      },
      {
        id: "pEmail",
        errorId: "pEmailError",
        rules: { required: true, email: true, requiredMsg: "Please enter your email address." }
      },
      {
        id: "pPhone",
        errorId: "pPhoneError",
        rules: { phone: true }
      },
      {
        id: "pRequest",
        errorId: "pRequestError",
        rules: {
          required: true,
          min: 10,
          requiredMsg: "Please share your prayer request.",
          minMsg: "Please provide a little more detail (at least 10 characters)."
        }
      }
    ],
    successMsg:
      "<strong>Thank you — your prayer request passed validation.</strong><br>" +
      "Please note: online submission is not yet connected to the church. " +
      "Your request has <em>not</em> been sent. Kindly contact the church directly " +
      "by phone (08035149852 / 08038409686) or email (jtasministry1@gmail.com) " +
      "until backend submission is configured."
  });

  // Contact form
  setupForm({
    formId: "contactForm",
    statusId: "contactStatus",
    fields: [
      {
        id: "cName",
        errorId: "cNameError",
        rules: { required: true, requiredMsg: "Please enter your name." }
      },
      {
        id: "cEmail",
        errorId: "cEmailError",
        rules: { required: true, email: true, requiredMsg: "Please enter your email address." }
      },
      {
        id: "cPhone",
        errorId: "cPhoneError",
        rules: { phone: true }
      },
      {
        id: "cMessage",
        errorId: "cMessageError",
        rules: {
          required: true,
          min: 10,
          requiredMsg: "Please enter your message.",
          minMsg: "Please write a little more (at least 10 characters)."
        }
      }
    ],
    successMsg:
      "<strong>Thank you — your message passed validation.</strong><br>" +
      "Please note: online submission is not yet connected to the church. " +
      "Your message has <em>not</em> been sent. Kindly contact the church directly " +
      "by phone (08035149852 / 08038409686) or email (jtasministry1@gmail.com) " +
      "until backend submission is configured."
  });

  /* ----------------------------------------------------------
     4. BACK TO TOP
  ---------------------------------------------------------- */

  const backToTop = document.getElementById("backToTop");

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 400);
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Return focus to the top of the page for keyboard users
      const skip = document.querySelector(".skip-link");
      if (skip) skip.focus({ preventScroll: true });
    });
  }

  /* ----------------------------------------------------------
     5. CURRENT YEAR
  ---------------------------------------------------------- */

  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Initial state call
  onScroll();
})();
