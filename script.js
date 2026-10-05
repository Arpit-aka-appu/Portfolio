/**
 * ARPIT SINGH PATEL — PORTFOLIO JAVASCRIPT
 * Comprehensive interactivity, live GitHub data, canvas animations, and state management.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all portfolio modules
  initAmbientCanvas();
  initThemeToggle();
  initTypewriter();
  initNavigation();
  initSkillsFilter();
  initProjectsFilter();
  initArchitectureModal();
  initClipboardActions();
  initContactForm();
  initGitHubIntegration();
  initScrollAnimations();
});

/* ===================================================================
   1. AMBIENT INTERACTIVE CANVAS PARTICLES
   =================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 55);
  const particles = [];

  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.size = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.5 ? '99, 102, 241' : '6, 182, 212';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.baseColor}, 0.65)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. THEME TOGGLE (DARK / LIGHT)
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('arpit_theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('arpit_theme', newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} mode`);
  });
}

/* ===================================================================
   3. TYPEWRITER EFFECT
   =================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const phrases = [
    'Real-Time Web Applications.',
    'Scalable MERN Stack Systems.',
    'Collaborative Live Platforms.',
    'AI & Python ML Workflows.',
    'High-Throughput Caching Solutions.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      element.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      delay = 40;
    } else {
      element.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      delay = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 2000; // Pause at end of sentence
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ===================================================================
   4. NAVIGATION & SCROLL SPY
   =================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll Spy for active nav highlight
  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ===================================================================
   5. SKILLS FILTERING
   =================================================================== */
function initSkillsFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   6. PROJECTS FILTERING
   =================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.p-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-pfilter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   7. PROJECT ARCHITECTURE MODAL (DEEP DIVE)
   =================================================================== */
const ARCH_DATA = {
  vibecode: {
    title: 'VibeCodeLive — System Architecture',
    subtitle: 'Real-Time Collaborative Coding & Interactive Classroom',
    summary:
      'VibeCodeLive is designed for multi-user low-latency collaboration where teachers and students can write and execute code simultaneously.',
    diagram: `[ React / Monaco Editor ]
          |  (WebSocket Events - JSON Diffs)
          v
[ Node.js + Socket.io Server ] <---> [ Redis Room Pub/Sub ]
          |
          +---> [ Conflict Resolution Engine (Operational Transforms) ]
          +---> [ MongoDB State & Session Persistence ]`,
    highlights: [
      'Bi-directional synchronization with sub-30ms typing broadcast.',
      'Room-based isolation allowing hundreds of independent live classes.',
      'Role-based permissions (Mentor control, Student interactive workspace).',
      'Monaco Editor integration with language syntax and indentation sync.'
    ]
  },
  chat: {
    title: 'Real-Time Instant Messaging Engine',
    subtitle: 'WhatsApp-Inspired Full-Stack Chat Architecture',
    summary:
      'Engineered to deliver instantaneous messaging with delivery status receipts, active user presence, and persistent conversation storage.',
    diagram: `[ React Client UI ] <==== (WebSocket) ====> [ Express/Socket.io Cluster ]
          |                                               |
  (REST: Auth / Media)                             (Event Dispatcher)
          |                                               |
          v                                               v
[ MongoDB User & Message Store ]                 [ Online Presence Cache ]`,
    highlights: [
      'Optimistic message rendering ensuring zero-perceived-latency for senders.',
      'JWT Authentication with refresh token rotation for stateful security.',
      'Typing indicator events throttled with debounce handlers.',
      'Full conversation history search and indexed message retrieval.'
    ]
  },
  cache: {
    title: 'Cache-Project — Low-Latency In-Memory Storage',
    subtitle: 'Deterministic Caching with LRU/LFU Algorithms',
    summary:
      'A high-performance cache engine designed to minimize database roundtrips and accelerate hot data reads.',
    diagram: `[ Read Request ] ---> [ Hash Map (O(1) Lookup) ]
                             | (Hit) -> Return Value
                             | (Miss) -> Fetch from DB & Update Cache
                                         |
                                         v
                         [ Eviction Queue: LRU / LFU Doubly-Linked List ]`,
    highlights: [
      'O(1) average time complexity for both Get and Set operations.',
      'Configurable eviction policies (Least Recently Used / Least Frequently Used).',
      'Thread-safe concurrency handling with memory footprint caps.',
      'Automated background TTL purge for expired tokens and session values.'
    ]
  },
  ai: {
    title: 'AI--Project & Machine Learning Workflows',
    subtitle: 'Python-Powered Intelligence & Data Pipelines',
    summary:
      'A modular suite of Python algorithms, predictive modeling scripts, and data preprocessing workflows.',
    diagram: `[ Raw Dataset ] ---> [ Preprocessing & Vectorization (NumPy/Pandas) ]
                                 |
                                 v
                     [ Scikit-Learn Model Training ]
                                 |
                                 v
                     [ Inference Endpoint / Predictions Output ]`,
    highlights: [
      'Data normalization and feature engineering for regression & classification.',
      'Model validation with cross-validation and hyperparameter scoring.',
      'Lightweight Python API wrappers for serving model predictions.',
      'Algorithmic utilities for customer segmentation and pattern detection.'
    ]
  }
};

function initArchitectureModal() {
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-content');
  const quickViewBtns = document.querySelectorAll('.btn-quick-view');

  if (!modal || !modalContent) return;

  function openModal(projectId) {
    const data = ARCH_DATA[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <div class="modal-content-inner">
        <h3>${data.title}</h3>
        <p class="modal-subtitle">${data.subtitle}</p>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
          ${data.summary}
        </p>

        <h4 class="modal-section-title">Architecture & Data Flow</h4>
        <pre class="modal-arch-diagram"><code>${data.diagram}</code></pre>

        <h4 class="modal-section-title">Key Engineering Highlights</h4>
        <ul class="modal-list">
          ${data.highlights.map((h) => `<li>${h}</li>`).join('')}
        </ul>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  quickViewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ===================================================================
   8. CLIPBOARD COPY & TOAST NOTIFICATION
   =================================================================== */
function initClipboardActions() {
  const copyBtns = document.querySelectorAll('.btn-copy-email');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'arpitsinghpatel9399@gmail.com';
      navigator.clipboard
        .writeText(email)
        .then(() => {
          showToast(`Copied ${email} to clipboard!`);
        })
        .catch(() => {
          showToast('Failed to copy. Please manually copy: ' + email);
        });
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `
    <svg style="width: 18px; height: 18px; color: var(--accent-emerald);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ===================================================================
   9. CONTACT FORM VALIDATION & HANDLING
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const subjectInput = document.getElementById('subject');

    let isValid = true;

    // Reset error messages
    document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));

    if (!nameInput.value.trim()) {
      document.getElementById('name-error').textContent = 'Please enter your name.';
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      document.getElementById('email-error').textContent = 'Please provide a valid email address.';
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      document.getElementById('message-error').textContent = 'Please enter your message.';
      isValid = false;
    }

    if (!isValid) return;

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `<span>Sending...</span>`;
    submitBtn.disabled = true;

    // Construct mailto link as fallback or open email client directly
    const subject = encodeURIComponent(subjectInput.value.trim() || 'Portfolio Contact from ' + nameInput.value.trim());
    const body = encodeURIComponent(
      `Hi Arpit,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
    );

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showToast('Thank you! Opening your email client to complete sending...');

      window.location.href = `mailto:arpitsinghpatel9399@gmail.com?subject=${subject}&body=${body}`;
      form.reset();
    }, 700);
  });
}

/* ===================================================================
   10. GITHUB LIVE STATS INTEGRATION
   =================================================================== */
async function initGitHubIntegration() {
  const reposCountEl = document.getElementById('gh-public-repos');
  const reposContainer = document.getElementById('gh-repos-list');

  try {
    const userRes = await fetch('https://api.github.com/users/Arpit-aka-appu');
    if (userRes.ok) {
      const userData = await userRes.json();
      if (reposCountEl && userData.public_repos !== undefined) {
        reposCountEl.textContent = userData.public_repos;
      }
    }

    // Fetch public repositories
    const reposRes = await fetch('https://api.github.com/users/Arpit-aka-appu/repos?sort=updated&per_page=4');
    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos) && repos.length > 0 && reposContainer) {
        reposContainer.innerHTML = ''; // Replace fallback with live fetched repos

        repos.forEach((repo) => {
          const lang = repo.language || 'Code';
          const dotClass = lang === 'JavaScript' ? 'js-dot' : 'py-dot';

          const card = document.createElement('div');
          card.className = 'repo-card glass-panel';
          card.innerHTML = `
            <div class="repo-header">
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
                <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <span>${repo.name}</span>
              </a>
              <span class="repo-badge">Public</span>
            </div>
            <p class="repo-desc">${repo.description || 'Public repository on GitHub.'}</p>
            <div class="repo-meta">
              <span class="repo-lang"><span class="lang-dot ${dotClass}"></span>${lang}</span>
              <span class="repo-stars">⭐ ${repo.stargazers_count || 0} stars</span>
            </div>
          `;
          reposContainer.appendChild(card);
        });
      }
    }
  } catch (err) {
    console.log('GitHub API offline or rate-limited; using pre-rendered fallback repositories.');
  }
}

/* ===================================================================
   11. SCROLL TRIGGER ANIMATIONS & NUMBER COUNTERS
   =================================================================== */
function initScrollAnimations() {
  const metricCards = document.querySelectorAll('.metric-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.glass-panel, .timeline-item').forEach((el) => {
      el.style.opacity = '0.9';
      observer.observe(el);
    });
  }
}
