// ==========================================
// GÜLHAN YAPI TASARIM - MAIN JS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- HERO SLIDER ----
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  let current = 0;
  let sliderInterval;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startSlider() {
    sliderInterval = setInterval(() => goToSlide(current + 1), 5500);
  }

  function resetSlider() {
    clearInterval(sliderInterval);
    startSlider();
  }

  if (slides.length > 0) {
    startSlider();
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); resetSlider(); });
    });
    document.querySelector('.slider-prev')?.addEventListener('click', () => { goToSlide(current - 1); resetSlider(); });
    document.querySelector('.slider-next')?.addEventListener('click', () => { goToSlide(current + 1); resetSlider(); });
  }

  // ---- MOBILE MENU ----
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.menu-overlay');
  const menuClose = document.querySelector('.menu-close');

  function openMenu() {
    navMenu?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMenu);
  overlay?.addEventListener('click', closeMenu);
  menuClose?.addEventListener('click', closeMenu);

  // ---- SCROLL ANIMATIONS ----
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.count-up');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.target);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          e.target.textContent = Math.floor(current);
        }, 16);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ---- ACTIVE NAV LINK ----
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });

  // ---- GALLERY FILTER ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-full-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 350);
        }
      });
    });
  });

  // ---- CONTACT FORM ----
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    btn.textContent = 'Gönderiliyor...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Mesajınız İletildi ✓';
      btn.style.background = '#2ecc71';
      setTimeout(() => {
        btn.textContent = 'Mesaj Gönder';
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1200);
  });

  // ---- STICKY HEADER SHADOW ----
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
      header?.style.setProperty('box-shadow', '0 4px 24px rgba(0,0,0,0.15)');
    } else {
      header?.style.setProperty('box-shadow', '0 2px 20px rgba(0,0,0,0.1)');
    }
  });

});
