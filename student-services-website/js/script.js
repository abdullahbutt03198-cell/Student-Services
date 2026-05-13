// ============================================================
//  STUDENT SERVICES WEBSITE — script.js
//  Features: Mobile menu, Dark mode, Form validation,
//            Smooth scroll, Fade-in animations, Search filter
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ──────────────────────────────────────────────
  //  1. MOBILE MENU TOGGLE
  // ──────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (navMenu && hamburger) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      }
    }
  });


  // ──────────────────────────────────────────────
  //  2. DARK / LIGHT MODE TOGGLE
  // ──────────────────────────────────────────────
  const darkToggle = document.querySelector('.dark-toggle');

  // Load saved preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (darkToggle) darkToggle.textContent = '☀️';
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        darkToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
      } else {
        darkToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
      }
    });
  }


  // ──────────────────────────────────────────────
  //  3. ACTIVE NAV LINK — highlight current page
  // ──────────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });


  // ──────────────────────────────────────────────
  //  4. SCROLL-TRIGGERED FADE-IN ANIMATION
  // ──────────────────────────────────────────────
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in, .stagger').forEach(function (el) {
    observer.observe(el);
  });


  // ──────────────────────────────────────────────
  //  5. SERVICE SEARCH / FILTER (services.html)
  // ──────────────────────────────────────────────
  var searchInput = document.getElementById('serviceSearch');
  var serviceCards = document.querySelectorAll('.service-card');
  var noResults = document.getElementById('noResults');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.toLowerCase().trim();
      var visibleCount = 0;

      serviceCards.forEach(function (card) {
        var title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        var desc  = card.querySelector('p')  ? card.querySelector('p').textContent.toLowerCase()  : '';
        var match = title.includes(query) || desc.includes(query);

        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      // Show "no results" message if nothing matches
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  }


  // ──────────────────────────────────────────────
  //  6. CONTACT FORM VALIDATION (contact.html)
  // ──────────────────────────────────────────────
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Stop default form submission

      var valid = true;

      // Helper: show error
      function showError(fieldId, msgId) {
        var field = document.getElementById(fieldId);
        var msg   = document.getElementById(msgId);
        if (field) field.classList.add('error');
        if (msg)   msg.classList.add('show');
        valid = false;
      }

      // Helper: clear error
      function clearError(fieldId, msgId) {
        var field = document.getElementById(fieldId);
        var msg   = document.getElementById(msgId);
        if (field) field.classList.remove('error');
        if (msg)   msg.classList.remove('show');
      }

      // --- Validate Name ---
      var name = document.getElementById('name');
      clearError('name', 'nameError');
      if (!name || name.value.trim().length < 2) {
        showError('name', 'nameError');
      }

      // --- Validate Email ---
      var email = document.getElementById('email');
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      clearError('email', 'emailError');
      if (!email || !emailPattern.test(email.value.trim())) {
        showError('email', 'emailError');
      }

      // --- Validate Subject ---
      var subject = document.getElementById('subject');
      clearError('subject', 'subjectError');
      if (!subject || subject.value.trim().length < 3) {
        showError('subject', 'subjectError');
      }

      // --- Validate Message ---
      var message = document.getElementById('message');
      clearError('message', 'messageError');
      if (!message || message.value.trim().length < 10) {
        showError('message', 'messageError');
      }

      // --- If valid, show success ---
      if (valid) {
        var successBanner = document.getElementById('successBanner');
        if (successBanner) {
          successBanner.classList.add('show');
          contactForm.reset();

          // Hide after 5 seconds
          setTimeout(function () {
            successBanner.classList.remove('show');
          }, 5000);
        }
      }
    });

    // Clear errors on input
    ['name', 'email', 'subject', 'message'].forEach(function (id) {
      var field = document.getElementById(id);
      if (field) {
        field.addEventListener('input', function () {
          field.classList.remove('error');
          var errEl = document.getElementById(id + 'Error');
          if (errEl) errEl.classList.remove('show');
        });
      }
    });
  }


  // ──────────────────────────────────────────────
  //  7. SMOOTH SCROLL for anchor links
  // ──────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ──────────────────────────────────────────────
  //  8. NAVBAR SHADOW ON SCROLL
  // ──────────────────────────────────────────────
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 24px rgba(30,58,138,0.12)';
      } else {
        navbar.style.boxShadow = '0 2px 12px rgba(30,58,138,0.06)';
      }
    });
  }


  // ──────────────────────────────────────────────
  //  9. ANIMATED COUNTER (stats on homepage)
  // ──────────────────────────────────────────────
  function animateCounter(el, target, duration) {
    var start = 0;
    var step  = target / (duration / 16);
    var timer = setInterval(function () {
      start += step;
      if (start >= target) {
        el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString() + (el.dataset.suffix || '');
      }
    }, 16);
  }

  var counters = document.querySelectorAll('.counter');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target, parseInt(entry.target.dataset.target), 1500);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

}); // end DOMContentLoaded
