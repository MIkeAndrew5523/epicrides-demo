/* ============================================================
   Epic Rides — Main JavaScript
   Handles: mobile menu, dropdowns, sliders, FAQ accordion,
   contact form, smooth scroll
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // ---- MOBILE MENU ----
  var toggle = document.querySelector('.mobile-menu-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
      toggle.classList.add('active');
      nav.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('active');
      nav.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    // Close on nav link click (mobile)
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });
  }

  // ---- SERVICES DROPDOWN (click-based on mobile) ----
  var dropdownWrap = document.querySelector('.nav-dropdown-wrap');
  var dropdownToggle = document.querySelector('.nav-dropdown-toggle');

  if (dropdownToggle && dropdownWrap) {
    dropdownToggle.addEventListener('click', function (e) {
      e.preventDefault();
      dropdownWrap.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!dropdownWrap.contains(e.target)) {
        dropdownWrap.classList.remove('open');
      }
    });
  }

  // ---- TESTIMONIALS SLIDER ----
  var testimonialTrack = document.getElementById('testimonialTrack');
  var testimonialDots = document.getElementById('testimonialDots');
  var prevBtn = document.getElementById('testimonialPrev');
  var nextBtn = document.getElementById('testimonialNext');

  if (testimonialTrack) {
    var slides = testimonialTrack.querySelectorAll('.testimonial-slide');
    var dotBtns = testimonialDots ? testimonialDots.querySelectorAll('.slider-dot') : [];
    var currentSlide = 0;
    var slideCount = slides.length;
    var testimonialTimer;

    function goToSlide(index) {
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;
      currentSlide = index;
      testimonialTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      dotBtns.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function startTestimonialAuto() {
      testimonialTimer = setInterval(function () {
        goToSlide(currentSlide + 1);
      }, 5000);
    }

    function resetTestimonialAuto() {
      clearInterval(testimonialTimer);
      startTestimonialAuto();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(currentSlide - 1);
        resetTestimonialAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(currentSlide + 1);
        resetTestimonialAuto();
      });
    }

    dotBtns.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToSlide(parseInt(this.dataset.index));
        resetTestimonialAuto();
      });
    });

    if (slideCount > 1) {
      startTestimonialAuto();
    }
  }

  // ---- DID YOU KNOW SLIDER ----
  var dykSlider = document.getElementById('dykSlider');
  var dykDotsContainer = document.getElementById('dykDots');

  if (dykSlider) {
    var dykSlides = dykSlider.querySelectorAll('.dyk-slide');
    var dykDotBtns = dykDotsContainer ? dykDotsContainer.querySelectorAll('.dyk-dot') : [];
    var currentDyk = 0;
    var dykCount = dykSlides.length;

    function goToDyk(index) {
      if (index < 0) index = dykCount - 1;
      if (index >= dykCount) index = 0;
      currentDyk = index;
      dykSlides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === currentDyk);
      });
      dykDotBtns.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentDyk);
      });
    }

    dykDotBtns.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToDyk(parseInt(this.dataset.index));
      });
    });

    if (dykCount > 1) {
      setInterval(function () {
        goToDyk(currentDyk + 1);
      }, 4000);
    }
  }

  // ---- FAQ ACCORDION ----
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(function (other) {
        other.classList.remove('active');
        var btn = other.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- CONTACT FORM ----
  var contactFormEl = document.getElementById('contactFormEl');
  var contactSuccess = document.getElementById('contactSuccess');

  if (contactFormEl) {
    contactFormEl.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('contactName').value.trim();
      var email = document.getElementById('contactEmail').value.trim();
      var subject = document.getElementById('contactSubject').value.trim();
      var message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      var submitBtn = contactFormEl.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, subject: subject, message: message }),
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          contactFormEl.reset();
          contactFormEl.style.display = 'none';
          if (contactSuccess) {
            contactSuccess.style.display = 'block';
          }
        } else {
          alert(data.error || 'Something went wrong. Please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      })
      .catch(function () {
        alert('Network error. Please check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
    });
  }

  // ---- HEADER SCROLL SHADOW ----
  var header = document.querySelector('.site-header');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY > 10) {
        header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.12)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

});
