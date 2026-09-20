document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".nav-toggle");
  const overlay = document.querySelector(".nav-overlay");

  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;

    navbar.classList.toggle("nav-solid", y > 12);

    if (!overlay.classList.contains("open")) {
      if (y > lastY && y > var_navH()) {
        navbar.classList.add("nav-hidden");
      } else {
        navbar.classList.remove("nav-hidden");
      }
    }

    lastY = y;
    ticking = false;
  }

  function var_navH() {
    return (
      parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--nav-h")
      ) || 72
    );
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });

  // Menu mobile
  if (toggle && overlay) {
    toggle.addEventListener("click", () => {
      const isOpen = overlay.classList.toggle("open");

      toggle.classList.toggle("open", isOpen);

      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    overlay.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        overlay.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // Página atual
  const current = document.body.dataset.page;

  document
    .querySelectorAll(".nav-links a, .nav-overlay a")
    .forEach((a) => {
      if (a.dataset.page === current) {
        a.classList.add("active");
      }
    });

  // Animações de entrada
  const revealTargets = document.querySelectorAll(
    ".reveal, .card, .benefit, .step, .stitch"
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealTargets.forEach((el) => io.observe(el));

  // Efeito ripple dos botões
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");

      const size = Math.max(rect.width, rect.height);

      ripple.className = "ripple";

      ripple.style.width = ripple.style.height = size + "px";

      ripple.style.left =
        e.clientX - rect.left - size / 2 + "px";

      ripple.style.top =
        e.clientY - rect.top - size / 2 + "px";

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 650);
    });

    btn.addEventListener(
      "touchstart",
      () => {
        if (navigator.vibrate) {
          navigator.vibrate(8);
        }
      },
      { passive: true }
    );
  });

  // WhatsApp
  const defaultWaMessage =
    "Olá! Vim pelo site de vocês e gostaria de mais informações.";

  fetch("data/links.json")
    .then((res) => res.json())
    .then((links) => {
      const waBase = links.whatsapp;

      document.querySelectorAll("a.wa-link").forEach((a) => {
        a.setAttribute("href", waBase);

        a.addEventListener("click", function (e) {
          e.preventDefault();

          const url =
            waBase +
            "?text=" +
            encodeURIComponent(defaultWaMessage);

          window.open(url, "_blank", "noopener");
        });
      });
    })
    .catch(() => {
      
    });
});