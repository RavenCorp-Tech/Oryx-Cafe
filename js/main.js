/* ╔══════════════════════════════════════════════╗
   ║  ORYX CAFE — main.js                         ║
   ║  Interactions · Animations · Bilingual        ║
   ╚══════════════════════════════════════════════╝ */

(() => {
  "use strict";

  /* ═══════════ HELPERS ═══════════ */
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  /* ═══════════ PRELOADER ═══════════ */
  window.addEventListener("load", () => {
    setTimeout(() => {
      const pre = $("#preloader");
      pre.classList.add("hidden");
      setTimeout(() => pre.remove(), 700);
    }, 1800);
  });

  /* ═══════════ LUCIDE ICONS ═══════════ */
  document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) lucide.createIcons();
  });

  /* ═══════════ NAVBAR SCROLL ═══════════ */
  const navbar = $("#navbar");
  const sections = $$("section[id]");

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle("scrolled", scrollY > 60);

    // Back to top
    const btt = $("#backToTop");
    if (btt) btt.classList.toggle("visible", scrollY > 600);

    // Active nav link
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (scrollY >= top) current = sec.id;
    });
    $$(".nav-links a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ═══════════ BACK TO TOP ═══════════ */
  const backToTop = $("#backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ═══════════ MOBILE MENU ═══════════ */
  const burger = $("#navBurger");
  const mobileMenu = $("#mobileMenu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });

    $$(".mobile-menu-links a").forEach((a) => {
      a.addEventListener("click", () => {
        burger.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ═══════════ SMOOTH SCROLL for nav links ═══════════ */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = $(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ═══════════ HERO PARTICLES ═══════════ */
  const particlesContainer = $("#heroParticles");
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.classList.add("particle");
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        --size: ${size}px;
        --dur: ${Math.random() * 6 + 4}s;
        --delay: ${Math.random() * 4}s;
        --tx: ${(Math.random() - 0.5) * 100}px;
        --ty: ${(Math.random() - 0.5) * 80}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ═══════════ SCROLL REVEAL ═══════════ */
  const revealElements = $$(".reveal-up, .reveal-left, .reveal-right, .reveal-scale");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children with --delay
          const delay = getComputedStyle(entry.target).getPropertyValue("--delay");
          const ms = delay ? parseInt(delay) * 120 : 0;
          setTimeout(() => entry.target.classList.add("revealed"), ms);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  /* ═══════════ COUNTER ANIMATION ═══════════ */
  const counters = $$(".stat-number[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          let current = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current;
          }, 35);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ═══════════ MENU SYSTEM ═══════════ */
  const menuGrid = $("#menuGrid");
  const menuTabs = $$(".menu-tab");

  function renderMenu(category) {
    if (!menuGrid || !window.MENU_DATA) return;
    const items = MENU_DATA[category] || [];
    menuGrid.innerHTML = items
      .map(
        (item, i) => `
      <div class="menu-card" style="--i:${i}">
        <div class="menu-card-body">
          <div class="menu-card-info">
            <div class="menu-card-name">${item.en}</div>
            <div class="menu-card-name-ar">${item.ar}</div>
          </div>
          <div class="menu-card-price">
            <span>AED</span> ${item.price}
          </div>
        </div>
      </div>`
      )
      .join("");
  }

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      menuTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderMenu(tab.dataset.category);
    });
  });

  // Initial render
  renderMenu("cold-drinks");

  /* ═══════════ GALLERY HORIZONTAL SCROLL ═══════════ */
  const galleryScroll = $("#galleryScroll");
  const galleryPrev = $("#galleryPrev");
  const galleryNext = $("#galleryNext");
  const galleryCounter = $("#galleryCounter");
  const galleryProgressFill = $("#galleryProgressFill");
  const galleryItems = $$(".gallery-item img");
  const totalItems = galleryItems.length;

  // Scroll by a set of items on button click
  function galleryScrollBy(dir) {
    if (!galleryScroll) return;
    const itemW = galleryScroll.querySelector(".gallery-item")?.offsetWidth || 320;
    const gap = 20;
    const scrollAmount = (itemW + gap) * 3 * dir;
    galleryScroll.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  if (galleryPrev) galleryPrev.addEventListener("click", () => galleryScrollBy(-1));
  if (galleryNext) galleryNext.addEventListener("click", () => galleryScrollBy(1));

  // Update counter, progress bar, and nav button states on scroll
  function updateGalleryUI() {
    if (!galleryScroll) return;
    const { scrollLeft, scrollWidth, clientWidth } = galleryScroll;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;

    // Figure out which item is roughly in view
    const itemW = galleryScroll.querySelector(".gallery-item")?.offsetWidth || 320;
    const gap = 20;
    const currentIndex = Math.round(scrollLeft / (itemW + gap)) + 1;
    const clampedIndex = Math.min(Math.max(currentIndex, 1), totalItems);

    if (galleryCounter) galleryCounter.textContent = `${clampedIndex} / ${totalItems}`;
    if (galleryProgressFill) galleryProgressFill.style.width = `${progress * 100}%`;

    // Disable buttons at edges
    if (galleryPrev) galleryPrev.classList.toggle("disabled", scrollLeft <= 2);
    if (galleryNext) galleryNext.classList.toggle("disabled", scrollLeft >= maxScroll - 2);
  }

  if (galleryScroll) {
    galleryScroll.addEventListener("scroll", updateGalleryUI, { passive: true });
    updateGalleryUI();
  }

  // Drag-to-scroll
  let isDragging = false, hasDragged = false, dragStartX = 0, dragScrollLeft = 0;
  const DRAG_THRESHOLD = 5; // px – ignore tiny movements so clicks still work

  function onDragStart(e) {
    if (!galleryScroll) return;
    isDragging = true;
    hasDragged = false;
    dragStartX = (e.touches ? e.touches[0].pageX : e.pageX) - galleryScroll.offsetLeft;
    dragScrollLeft = galleryScroll.scrollLeft;
  }
  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (galleryScroll) galleryScroll.classList.remove("is-dragging");
  }
  function onDragMove(e) {
    if (!isDragging || !galleryScroll) return;
    const x = (e.touches ? e.touches[0].pageX : e.pageX) - galleryScroll.offsetLeft;
    const distance = Math.abs(x - dragStartX);
    if (!hasDragged && distance < DRAG_THRESHOLD) return; // still within click tolerance
    hasDragged = true;
    galleryScroll.classList.add("is-dragging");
    e.preventDefault();
    const walk = (x - dragStartX) * 1.5;
    galleryScroll.scrollLeft = dragScrollLeft - walk;
  }

  if (galleryScroll) {
    galleryScroll.addEventListener("mousedown", onDragStart);
    galleryScroll.addEventListener("mouseleave", onDragEnd);
    galleryScroll.addEventListener("mouseup", onDragEnd);
    galleryScroll.addEventListener("mousemove", onDragMove);
    galleryScroll.addEventListener("touchstart", onDragStart, { passive: true });
    galleryScroll.addEventListener("touchend", onDragEnd);
    galleryScroll.addEventListener("touchmove", onDragMove, { passive: false });
  }

  /* ═══════════ GALLERY LIGHTBOX ═══════════ */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    currentLightboxIndex = index;
    lightboxImg.src = galleryItems[index].src;
    lightboxImg.alt = galleryItems[index].alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  galleryItems.forEach((img, i) => {
    img.closest(".gallery-item").addEventListener("click", (e) => {
      // Don't open lightbox if user was dragging
      if (hasDragged) return;
      openLightbox(i);
    });
  });

  if (lightbox) {
    $(".lightbox-close", lightbox).addEventListener("click", closeLightbox);
    $(".lightbox-prev", lightbox).addEventListener("click", () => {
      currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
      lightboxImg.src = galleryItems[currentLightboxIndex].src;
    });
    $(".lightbox-next", lightbox).addEventListener("click", () => {
      currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
      lightboxImg.src = galleryItems[currentLightboxIndex].src;
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") $(".lightbox-prev", lightbox).click();
    if (e.key === "ArrowRight") $(".lightbox-next", lightbox).click();
  });

  /* ═══════════ BUTTON GLOW EFFECT ═══════════ */
  $$(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty("--x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      btn.style.setProperty("--y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });

  /* ═══════════ LANGUAGE TOGGLE (EN ↔ AR) ═══════════ */
  const langBtn = $("#langToggle");
  let isArabic = false;

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      isArabic = !isArabic;
      const html = document.documentElement;
      html.setAttribute("dir", isArabic ? "rtl" : "ltr");
      html.setAttribute("lang", isArabic ? "ar" : "en");

      // Toggle button label
      $(".lang-en", langBtn).style.display = isArabic ? "none" : "inline";
      $(".lang-ar", langBtn).style.display = isArabic ? "inline" : "none";

      // Swap all [data-en] / [data-ar] text
      $$("[data-en][data-ar]").forEach((el) => {
        el.textContent = isArabic ? el.dataset.ar : el.dataset.en;
      });

      // Re-render active menu category (to keep card layout correct)
      const activeTab = $(".menu-tab.active");
      if (activeTab) renderMenu(activeTab.dataset.category);

      // Re-init Lucide icons (some may have been removed by textContent swap)
      if (window.lucide) lucide.createIcons();
    });
  }

  /* ═══════════ TILT EFFECT ON CARDS (desktop) ═══════════ */
  if (window.matchMedia("(pointer: fine)").matches) {
    $$(".menu-card, .highlight-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ═══════════ PARALLAX ON HERO (subtle) ═══════════ */
  const heroContent = $(".hero-content");
  if (heroContent && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroContent.style.transform = `translateY(${y * 0.25}px)`;
          heroContent.style.opacity = 1 - y / (window.innerHeight * 0.8);
        }
      },
      { passive: true }
    );
  }
})();
