/* ============================================
   main.js — Academic Portfolio
   Author: Tanay K.
   ============================================
   TABLE OF CONTENTS:
   1. Navbar — scroll effect + mobile toggle
   2. Smooth scroll + active nav link
   3. Scroll animations (fade-in on scroll)
   4. Publication filter buttons
   5. Dark/Light theme toggle
   6. Contact form validation + EmailJS
   7. Legacy guards (old code kept but protected)
   ============================================ */


/* ============================================
   1. NAVBAR — SCROLL EFFECT + MOBILE TOGGLE
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  const navbar    = document.querySelector('.navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');
  const navClose  = document.getElementById('nav-close');
  const navLinks  = document.querySelectorAll('.nav-link');

  // Add 'scrolled' class to navbar on scroll (triggers shadow + border)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Open mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('open');
    });
  }

  // Close mobile menu
  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  }

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('open');
    });
  });

});


/* ============================================
   2. SMOOTH SCROLL + ACTIVE NAV LINK
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 80;   // offset for fixed navbar
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); // run once on load

});


/* ============================================
   3. SCROLL ANIMATIONS
   Watches elements with [data-animate] attribute
   and adds 'animated' class when they enter view
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  const animatedElements = document.querySelectorAll('[data-animate]');

  if (!animatedElements.length) return; // nothing to animate

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.15,   // trigger when 15% of element is visible
    rootMargin: '0px'
  });

  animatedElements.forEach(el => observer.observe(el));

});


/* ============================================
   4. PUBLICATION FILTER BUTTONS
   Reads data-filter on buttons
   Reads data-type on pub-cards
   Adds/removes .hidden class
   ============================================ */
/* ============================================
   4. PUBLICATION FILTER + BIBTEX TOGGLE
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  // --- Filter buttons ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubCards   = document.querySelectorAll('.pub-card');

  if (filterBtns.length && pubCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards
        const filter = btn.getAttribute('data-filter');
        pubCards.forEach(card => {
          const type = card.getAttribute('data-type');
          if (filter === 'all' || type === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // --- BibTeX toggle ---
  const bibtexBtns = document.querySelectorAll('.bibtex-toggle-btn');

  bibtexBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const bibBox   = document.getElementById(targetId);
      const isOpen   = bibBox.classList.contains('open');

      // Close ALL open bibtex boxes first
      document.querySelectorAll('.bibtex-box.open').forEach(box => {
        box.classList.remove('open');
      });
      document.querySelectorAll('.bibtex-toggle-btn.active').forEach(b => {
        b.classList.remove('active');
      });

      // If it was closed, open it now (toggle behaviour)
      if (!isOpen) {
        bibBox.classList.add('open');
        btn.classList.add('active');
      }
    });
  });

});

/* ============================================
   COPY BIBTEX TO CLIPBOARD
   ============================================ */
function copyBibtex(id) {
  const pre  = document.querySelector(`#${id} pre`);
  const text = pre.innerText;

  navigator.clipboard.writeText(text).then(() => {
    const copyBtn = document.querySelector(`#${id} .bibtex-copy-btn`);
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    }, 2000);
  });
}


/* ============================================
   5. DARK / LIGHT THEME TOGGLE
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  const themeButton = document.getElementById('theme-button');

  // Only run if theme button exists
  if (!themeButton) return;

  const darkTheme = 'dark-theme';
  const iconTheme = 'uil-sun';

  // Restore previously saved theme from localStorage
  const savedTheme = localStorage.getItem('selected-theme');
  const savedIcon  = localStorage.getItem('selected-icon');

  const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? 'dark' : 'light';

  const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun';

  if (savedTheme) {
    document.body.classList[savedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[savedIcon  === 'uil-moon' ? 'add' : 'remove'](iconTheme);
  }

  themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon',  getCurrentIcon());
  });

});


/* ============================================
   6. CONTACT FORM VALIDATION + EMAILJS
   ============================================ */

// Only run validation if form elements exist
const nameError    = document.getElementById('name-error');
const emailError   = document.getElementById('email-error');
const messageError = document.getElementById('message-error');

function validateName() {
  if (!nameError) return true;
  const name = document.getElementById('fullName').value;

  if (name.length === 0) {
    nameError.innerHTML = 'Full name is required!';
    return false;
  }
  if (!name.match(/[a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?/)) {
    nameError.innerHTML = 'Enter your full name!';
    return false;
  }
  nameError.innerHTML = '<i class="uil uil-check-circle"></i>';
  return true;
}

function validateEmail() {
  if (!emailError) return true;
  const email = document.getElementById('email_id').value;

  if (email.length === 0) {
    emailError.innerHTML = 'A valid email address is required!';
    return false;
  }
  if (!email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
    emailError.innerHTML = 'Invalid email address!';
    return false;
  }
  emailError.innerHTML = '<i class="uil uil-check-circle"></i>';
  return true;
}

function validateMessage() {
  if (!messageError) return true;
  const message  = document.getElementById('message').value;
  const required = 30;
  const left     = required - message.length;

  if (left > 0) {
    messageError.innerHTML = `${left} more characters required!`;
    return false;
  }
  messageError.innerHTML = '<i class="uil uil-check-circle"></i>';
  return true;
}

function SendMail() {
  if (!validateName() || !validateEmail() || !validateMessage()) {
    swal("Sorry!", "Please fix the errors before sending.", "warning");
    return false;
  }

  const params = {
    from_name : document.getElementById("fullName").value,
    email_id  : document.getElementById("email_id").value,
    subject   : document.getElementById("subject").value,
    message   : document.getElementById("message").value
  };

  emailjs.send("service_4ajtfo5", "template_ryff15a", params)
    .then(() => {
      swal("Success!", "Your message has been sent!", "success");
    });
}


/* ============================================
   7. LEGACY GUARDS
   Old code from previous website version.
   Kept in case elements reappear but wrapped
   in null checks so they don't crash the page.
   ============================================ */

// --- Swiper: Paper carousel ---
if (document.querySelector('.paper__container')) {
  new Swiper('.paper__container', {
    cssMode: true,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}

// --- Swiper: Testimonial carousel ---
if (document.querySelector('.testimonial__container')) {
  new Swiper('.testimonial__container', {
    loop: true,
    grabCursor: true,
    spaceBetween: 48,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      568: { slidesPerView: 2 }
    }
  });
}

// --- Load More button (old paper filter) ---
const loadMoreBtn = document.querySelector('.load-more-btn');
const paperCards  = document.querySelectorAll('.paper__card');
const filterBtnsLegacy = document.querySelectorAll('.filter__btn');
let visibleCards  = 6;

if (loadMoreBtn) {

  function updateLoadMoreVisibility(filteredCards) {
    const hasHidden = filteredCards.some(card => card.classList.contains('hidden'));
    loadMoreBtn.style.display = hasHidden ? 'block' : 'none';
  }

  function filterPapers(filter) {
    const filteredCards = [];

    paperCards.forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      if (match) {
        filteredCards.push(card);
      } else {
        card.classList.add('hidden');
      }
    });

    filteredCards.forEach((card, index) => {
      card.classList.toggle('hidden', index >= visibleCards);
    });

    updateLoadMoreVisibility(filteredCards);
  }

  filterBtnsLegacy.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtnsLegacy.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPapers(btn.getAttribute('data-filter'));
    });
  });

  loadMoreBtn.addEventListener('click', () => {
    const activeFilter = document.querySelector('.filter__btn.active')?.getAttribute('data-filter') || 'all';
    const hidden = [...paperCards].filter(card =>
      card.classList.contains('hidden') &&
      (activeFilter === 'all' || card.getAttribute('data-category') === activeFilter)
    );
    hidden.slice(0, 3).forEach(card => card.classList.remove('hidden'));
    updateLoadMoreVisibility([...paperCards].filter(card =>
      activeFilter === 'all' || card.getAttribute('data-category') === activeFilter
    ));
  });

  // Initialize on load
  filterPapers('all');
}