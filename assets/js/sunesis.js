// Sunesis Medical Services — site behavior
(function () {
  "use strict";

  // Dynamic year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Scroll-to-top button
  var top = document.querySelector(".scroll-top");
  if (top) {
    window.addEventListener("scroll", function () {
      top.classList.toggle("is-visible", window.scrollY > 600);
    });
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Scroll-reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // How It Works active step on scroll-into-view + hover
  var steps = document.querySelectorAll(".step");
  if (steps.length) {
    var setActive = function (target) {
      steps.forEach(function (s) { s.classList.remove("is-active"); });
      target.classList.add("is-active");
    };
    steps.forEach(function (s) {
      s.addEventListener("mouseenter", function () { setActive(s); });
    });
    if ("IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { setActive(e.target); } });
      }, { threshold: 0.6 });
      steps.forEach(function (s) { sio.observe(s); });
    }
  }

  // Graceful fallbacks for client-supplied image slots not yet provided
  var broken = function (img) { return img.complete && img.naturalWidth === 0; };
  document.querySelectorAll("img.avatar[data-initials]").forEach(function (img) {
    var swap = function () {
      if (!img.isConnected) return;
      var s = document.createElement("span");
      s.className = "avatar avatar--mono";
      s.setAttribute("aria-hidden", "true");
      s.textContent = img.getAttribute("data-initials");
      img.replaceWith(s);
    };
    img.addEventListener("error", swap);
    if (broken(img)) swap();
  });
  document.querySelectorAll("img.partner-logo, img.team-photo, img.team-member__photo").forEach(function (img) {
    var mark = function () { img.classList.add("img-missing"); };
    img.addEventListener("error", mark);
    if (broken(img)) mark();
  });

  // Forms -> WhatsApp composer
  var WA = "https://wa.me/256785065560?text=";
  document.querySelectorAll("form[data-wa]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var intro = form.getAttribute("data-wa-intro") || "Hello Sunesis, I'd like to get in touch.";
      var lines = [intro, ""];
      form.querySelectorAll("[name]").forEach(function (input) {
        if (!input.value) return;
        var label = input.getAttribute("data-label") || input.name;
        lines.push(label + ": " + input.value);
      });
      window.open(WA + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      var ok = form.querySelector(".form-success");
      if (ok) { ok.classList.add("is-visible"); ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
      form.reset();
    });
  });
})();
