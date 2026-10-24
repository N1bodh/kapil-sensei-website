/**
 * KAPIL SENSEI OFFICIAL WEBSITE - INTERACTIVE ENGINE
 * Features: Falling Sakura Canvas, Audio Flashcards (Web Speech API),
 * JFT/JLPT Quiz Arena, Video Showcase, SSW Hub & Theme Toggler.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSakuraCanvas();
  initNavigation();
  initTopicDropdownNavigator();
  initVideoShowcase();
  initFlashcardLab();
  initQuizArena();
  initSSWModals();
  initFAQ();
  initConsultationForm();
  initStudentAuth();
});

/* ===================================================================
   1. THEME SWITCHER (Dark / Light Mode)
   =================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Retrieve saved preference or check OS preference
  const savedTheme = localStorage.getItem('kapil_sensei_theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('kapil_sensei_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

/* ===================================================================
   2. FALLING SAKURA BLOSSOMS CANVAS
   =================================================================== */
let sakuraAnimationId = null;
let sakuraEnabled = true;

function initSakuraCanvas() {
  const canvas = document.getElementById('sakura-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const toggleBtn = document.getElementById('sakura-toggle');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = Math.min(35, Math.floor(width / 35));
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 8;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.8;
      this.flip = Math.random() * 360;
      this.flipSpeed = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.4 + 0.5;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, Math.sin((this.flip * Math.PI) / 180));

      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size);
      ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size / 2);
      
      const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
      gradient.addColorStop(0, `rgba(255, 220, 230, ${this.opacity})`);
      gradient.addColorStop(0.7, `rgba(251, 113, 133, ${this.opacity * 0.85})`);
      gradient.addColorStop(1, `rgba(225, 29, 72, ${this.opacity * 0.6})`);

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < petalsCount; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    if (sakuraEnabled) {
      for (const p of petals) {
        p.update();
        p.draw();
      }
    }
    sakuraAnimationId = requestAnimationFrame(animate);
  }

  animate();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sakuraEnabled = !sakuraEnabled;
      toggleBtn.style.opacity = sakuraEnabled ? '1' : '0.4';
      showToast(sakuraEnabled ? '🌸 Sakura effect enabled' : 'Sakura effect paused');
    });
  }
}

/* ===================================================================
   3. NAVIGATION & MOBILE MENU
   =================================================================== */
function closeMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navDropdown = document.getElementById('nav-topic-dropdown');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (navLinks) navLinks.classList.remove('open');
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
  if (navDropdown) navDropdown.classList.remove('open');
  if (backdrop) backdrop.classList.remove('visible');
  document.body.classList.remove('mobile-menu-open');
}

function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const navDropdown = document.getElementById('nav-topic-dropdown');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      mobileMenuBtn.classList.toggle('open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (backdrop) backdrop.classList.toggle('visible', isOpen);
      document.body.classList.toggle('mobile-menu-open', isOpen);
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu on click outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open')) {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close when any link or button inside drawer is clicked
    navLinks.querySelectorAll('a, button:not(.nav-dropdown-btn)').forEach(el => {
      el.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }

  // Floating Back to Top Button
  initBackToTop();
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 320) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===================================================================
   3.5. TOPIC & SUBJECT SELECTOR / DROPDOWN NAVIGATOR
   Drastically reduces front web page size by displaying the chosen subject
   =================================================================== */
const TOPIC_CONFIG = [
  { id: 'featured-video', name: 'Video Lessons & Showcase', kanji: '動画授業', icon: '🎥' },
  { id: 'ssw-hub', name: 'SSW Japan Career Hub', kanji: '特定技能', icon: '💼' },
  { id: 'practice-lab', name: 'Interactive Audio Flashcards', kanji: '単語帳・発音', icon: '🗂️' },
  { id: 'quiz-hub', name: 'JFT & JLPT Practice Quiz Arena', kanji: '模擬試験', icon: '⏱️' },
  { id: 'courses', name: 'Structured Study Programs', kanji: '講座一覧', icon: '📖' },
  { id: 'about', name: 'About Kapil Sensei', kanji: '講師紹介', icon: '👨‍🏫' },
  { id: 'faq', name: 'Frequently Asked Questions (FAQ)', kanji: 'よくある質問', icon: '❓' }
];

let currentActiveTopic = 'all';

function initTopicDropdownNavigator() {
  const selectDropdown = document.getElementById('topic-select-dropdown');
  const topicPills = document.querySelectorAll('.topic-pill');
  const resetBtn = document.getElementById('reset-all-topics-btn');
  const bannerShowAllBtn = document.getElementById('banner-show-all-btn');
  const prevTopicBtn = document.getElementById('prev-topic-btn');
  const nextTopicBtn = document.getElementById('next-topic-btn');
  const activeSubjectBanner = document.getElementById('active-subject-banner');
  const activeSubjectTitle = document.getElementById('active-subject-title');
  const activeSubjectKanji = document.getElementById('active-subject-kanji');
  const topicStatusText = document.getElementById('topic-status-text');

  // Navbar Dropdown Elements
  const navDropdown = document.getElementById('nav-topic-dropdown');
  const navDropdownTrigger = document.getElementById('nav-dropdown-trigger');
  const navDropdownItems = document.querySelectorAll('.nav-dropdown-item');

  function displayTopic(topicId, scroll = true) {
    closeMobileMenu();
    currentActiveTopic = topicId;
    const allSections = document.querySelectorAll('.topic-section');

    if (topicId === 'all') {
      // Reveal all sections
      allSections.forEach(sec => {
        sec.classList.remove('topic-hidden');
        sec.classList.remove('topic-active-focus');
      });

      if (selectDropdown) selectDropdown.value = 'all';
      if (activeSubjectBanner) activeSubjectBanner.style.display = 'none';
      if (topicStatusText) topicStatusText.textContent = 'Mode: Full Overview (All Topics)';

      // Update pills
      topicPills.forEach(pill => {
        const isAll = pill.getAttribute('data-topic') === 'all';
        pill.classList.toggle('active', isAll);
        pill.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });

      // Update navbar dropdown active class
      navDropdownItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-topic') === 'all');
      });

      showToast('🌸 Showing all topics (Full Page)');
    } else {
      // Find topic metadata
      const topicMeta = TOPIC_CONFIG.find(t => t.id === topicId);
      const topicName = topicMeta ? `${topicMeta.icon} ${topicMeta.name}` : topicId;
      const topicKanji = topicMeta ? topicMeta.kanji : '';

      // Hide all other sections, reveal chosen one
      allSections.forEach(sec => {
        if (sec.getAttribute('data-topic-id') === topicId) {
          sec.classList.remove('topic-hidden');
          sec.classList.add('topic-active-focus');
        } else {
          sec.classList.add('topic-hidden');
          sec.classList.remove('topic-active-focus');
        }
      });

      if (selectDropdown) selectDropdown.value = topicId;

      // Update Active Subject Banner
      if (activeSubjectBanner) {
        activeSubjectBanner.style.display = 'flex';
        if (activeSubjectTitle) activeSubjectTitle.textContent = topicName;
        if (activeSubjectKanji) activeSubjectKanji.textContent = topicKanji;
      }

      if (topicStatusText) {
        topicStatusText.textContent = `Mode: 1 Topic Focused (${topicMeta ? topicMeta.icon : ''} Compact View)`;
      }

      // Update pills
      topicPills.forEach(pill => {
        const isMatch = pill.getAttribute('data-topic') === topicId;
        pill.classList.toggle('active', isMatch);
        pill.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      // Update navbar dropdown active class
      navDropdownItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-topic') === topicId);
      });

      showToast(`Showing subject: ${topicName}`);

      if (scroll) {
        const targetElement = document.getElementById(topicId) || document.getElementById('topic-navigator');
        if (targetElement) {
          const navOffset = 80;
          const elemPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elemPosition - navOffset,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  // Dropdown Select Change Event
  if (selectDropdown) {
    selectDropdown.addEventListener('change', (e) => {
      displayTopic(e.target.value);
    });
  }

  // Quick Topic Pills
  topicPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const topic = pill.getAttribute('data-topic');
      if (topic) displayTopic(topic);
    });
  });

  // Reset / Show All Buttons
  if (resetBtn) {
    resetBtn.addEventListener('click', () => displayTopic('all'));
  }
  if (bannerShowAllBtn) {
    bannerShowAllBtn.addEventListener('click', () => displayTopic('all'));
  }

  // Previous Topic Button
  if (prevTopicBtn) {
    prevTopicBtn.addEventListener('click', () => {
      const currentIndex = TOPIC_CONFIG.findIndex(t => t.id === currentActiveTopic);
      if (currentIndex > 0) {
        displayTopic(TOPIC_CONFIG[currentIndex - 1].id);
      } else {
        displayTopic(TOPIC_CONFIG[TOPIC_CONFIG.length - 1].id);
      }
    });
  }

  // Next Topic Button
  if (nextTopicBtn) {
    nextTopicBtn.addEventListener('click', () => {
      const currentIndex = TOPIC_CONFIG.findIndex(t => t.id === currentActiveTopic);
      if (currentIndex >= 0 && currentIndex < TOPIC_CONFIG.length - 1) {
        displayTopic(TOPIC_CONFIG[currentIndex + 1].id);
      } else {
        displayTopic(TOPIC_CONFIG[0].id);
      }
    });
  }

  // Navbar Dropdown Toggle & Items
  if (navDropdownTrigger && navDropdown) {
    navDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.contains('open');
      navDropdown.classList.toggle('open');
      navDropdownTrigger.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        navDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  navDropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = item.getAttribute('data-topic');
      if (navDropdown) navDropdown.classList.remove('open');
      if (topic) displayTopic(topic);
    });
  });

  // Global anchor interceptor for topics and smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const targetTopicId = href.replace('#', '');

      // Check if target is a known topic
      const isTopic = TOPIC_CONFIG.some(t => t.id === targetTopicId);
      if (isTopic) {
        e.preventDefault();
        displayTopic(targetTopicId);
      } else if (targetTopicId === 'all') {
        e.preventDefault();
        displayTopic('all');
      } else {
        // Standard in-page anchor
        const targetEl = document.getElementById(targetTopicId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Handle URL hash on page load
  if (window.location.hash) {
    const initialHash = window.location.hash.replace('#', '');
    if (TOPIC_CONFIG.some(t => t.id === initialHash)) {
      displayTopic(initialHash, false);
    }
  }
}


/* ===================================================================
   4. VIDEO SHOWCASE & MODAL PLAYER
   =================================================================== */
const VIDEO_DATABASE = [
  {
    id: 'tkrewbc9kuc',
    title: 'Welcome to Kapil Sensei! Your daily Japanese class for JLPT, JFT-Basic & SSW.',
    category: 'all',
    catLabel: 'Orientation',
    duration: 'Shorts ⚡',
    thumbnail: 'https://img.youtube.com/vi/tkrewbc9kuc/hqdefault.jpg',
    views: 'Featured Short',
    url: 'https://youtube.com/shorts/tkrewbc9kuc?si=vI0ehSdfG82wOblG',
    isShort: true
  },
  {
    id: 'OwOxFUSe6ts', // Fallback link to channel intro
    title: 'JFT-Basic A2 Grammar: Essential Particles は, が, を, に & で',
    category: 'jft',
    catLabel: 'JFT-Basic A2',
    duration: '18:40',
    thumbnail: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=640&q=80',
    views: 'Lesson 1'
  },
  {
    id: 'OwOxFUSe6ts',
    title: 'JLPT N5 Masterclass: Complete Verb Conjugation (Te-form & Ta-form)',
    category: 'jlpt',
    catLabel: 'JLPT N5/N4',
    duration: '22:15',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=640&q=80',
    views: 'Lesson 2'
  },
  {
    id: 'A4cK_lst5XE',
    title: 'SSW Kaigo (介護) Specialized Vocabulary: Transfer & Meal Support Terms',
    category: 'kaigo',
    catLabel: 'Kaigo Caregiving',
    duration: 'Shorts ⚡',
    thumbnail: 'https://img.youtube.com/vi/A4cK_lst5XE/hqdefault.jpg',
    views: 'YouTube Shorts',
    url: 'https://youtube.com/shorts/A4cK_lst5XE?feature=share',
    isShort: true
  },
  {
    id: 'OwOxFUSe6ts',
    title: 'SSW Agriculture & Food Service: Prometric CBT Exam Strategy 2026',
    category: 'ssw',
    catLabel: 'SSW Industry',
    duration: '16:30',
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=640&q=80',
    views: 'Exam Guide'
  },
  {
    id: 'OwOxFUSe6ts',
    title: 'Life in Japan as an International Worker: Salary, Taxes, Dorms & Visa Renewal',
    category: 'culture',
    catLabel: 'Life in Japan',
    duration: '14:20',
    thumbnail: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=640&q=80',
    views: 'Guide'
  }
];

function initVideoShowcase() {
  const grid = document.getElementById('video-cards-grid');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const openIntroBtn = document.getElementById('open-intro-video-btn');
  const videoModal = document.getElementById('video-modal');
  const modalIframe = document.getElementById('modal-iframe');
  const closeVideoModal = document.getElementById('close-video-modal');
  const videoModalTitle = document.getElementById('video-modal-title');

  function renderVideos(filter = 'all') {
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = filter === 'all' 
      ? VIDEO_DATABASE 
      : VIDEO_DATABASE.filter(v => v.category === filter || v.category === 'all');

    filtered.forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.innerHTML = `
        <div class="video-card-thumb-wrap">
          <img src="${video.thumbnail}" alt="${video.title}" class="video-card-thumb" loading="lazy">
          <div class="video-play-overlay">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span class="video-duration-tag ${video.isShort ? 'short-tag' : ''}">${video.duration}</span>
        </div>
        <div class="video-card-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span class="video-category-tag">${video.catLabel}</span>
            ${video.isShort ? '<span style="font-size:0.7rem; font-weight:800; color:#ef4444; background:rgba(239,68,68,0.12); padding:2px 8px; border-radius:12px; border:1px solid rgba(239,68,68,0.35);">⚡ SHORTS</span>' : ''}
          </div>
          <h4 class="video-card-title">${video.title}</h4>
          <div class="video-card-meta">
            <span>Kapil Sensei</span>
            <span>${video.views}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openVideoModal(video.id, video.title, video.url);
      });

      grid.appendChild(card);
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderVideos(tab.dataset.filter);
    });
  });

  function openVideoModal(videoId, title, directUrl) {
    if (videoModal && modalIframe) {
      if (videoModalTitle) videoModalTitle.textContent = title;
      modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      const ytLink = document.getElementById('video-modal-yt-link');
      if (ytLink) {
        const targetUrl = directUrl || `https://www.youtube.com/watch?v=${videoId}`;
        ytLink.href = targetUrl;
        ytLink.innerHTML = targetUrl.includes('shorts')
          ? '<span>⚡ Watch on YouTube Shorts ↗</span>'
          : '<span>Watch on YouTube ↗</span>';
      }
      videoModal.classList.add('open');
    }
  }

  if (openIntroBtn) {
    openIntroBtn.addEventListener('click', () => {
      openVideoModal('tkrewbc9kuc', 'Welcome to Kapil Sensei! Japanese class for JLPT, JFT-Basic & SSW', 'https://youtube.com/shorts/tkrewbc9kuc?si=vI0ehSdfG82wOblG');
    });
  }

  const closeVideoFooterBtn = document.getElementById('close-video-modal-btn');
  if (closeVideoFooterBtn && videoModal && modalIframe) {
    closeVideoFooterBtn.addEventListener('click', () => {
      modalIframe.src = '';
      videoModal.classList.remove('open');
    });
  }

  if (closeVideoModal && videoModal && modalIframe) {
    closeVideoModal.addEventListener('click', () => {
      modalIframe.src = '';
      videoModal.classList.remove('open');
    });

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        modalIframe.src = '';
        videoModal.classList.remove('open');
      }
    });
  }

  renderVideos('all');
}

/* ===================================================================
   5. INTERACTIVE JAPANESE AUDIO FLASHCARDS ENGINE
   =================================================================== */
const FLASHCARD_DECKS = {
  n5_essential: [
    {
      jp: '<ruby>先生<rt>せんせい</rt></ruby>',
      reading: 'せんせい (Sensei)',
      type: 'Noun / Title',
      tag: 'JLPT N5 • CORE',
      meaning: 'Teacher / Instructor / Master',
      exJp: 'カピル<ruby>先生<rt>せんせい</rt></ruby>はとても<ruby>熱心<rt>ねっしん</rt></ruby>に<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてくれます。',
      exRomaji: 'Kapiru sensei wa totemo nesshin ni nihongo o oshiete kuremasu.',
      exEn: 'Kapil Sensei teaches Japanese with great passion.'
    },
    {
      jp: '<ruby>勉強<rt>べんきょう</rt></ruby>',
      reading: 'べんきょう (Benkyou)',
      type: 'Noun / Suru Verb',
      tag: 'JLPT N5 • VOCABULARY',
      meaning: 'Study / Diligence',
      exJp: '<ruby>毎日<rt>まいにち</rt></ruby>２<ruby>時間<rt>じかん</rt></ruby><ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>します。',
      exRomaji: 'Mainichi ni-jikan nihongo o benkyou shimasu.',
      exEn: 'I study Japanese for two hours every day.'
    },
    {
      jp: '<ruby>夢<rt>ゆめ</rt></ruby>',
      reading: 'ゆめ (Yume)',
      type: 'Noun',
      tag: 'JLPT N5 • VOCABULARY',
      meaning: 'Dream / Vision',
      exJp: '<ruby>私<rt>わたし</rt></ruby>の<ruby>夢<rt>ゆめ</rt></ruby>は<ruby>日本<rt>にほん</rt></ruby>で<ruby>働<rt>はたら</rt></ruby>くことです。',
      exRomaji: 'Watashi no yume wa Nihon de hataraku koto desu.',
      exEn: 'My dream is to work in Japan.'
    },
    {
      jp: '<ruby>働<rt>はたら</rt></ruby>く',
      reading: 'はたらく (Hataraku)',
      type: 'Godan Verb (Group 1)',
      tag: 'JLPT N5 • VERBS',
      meaning: 'To work / To labor',
      exJp: '<ruby>特定技能<rt>とくていぎのう</rt></ruby>ビザで<ruby>東京<rt>とうきょう</rt></ruby>の<ruby>会社<rt>かいしゃ</rt></ruby>で<ruby>働<rt>はたら</rt></ruby>きます。',
      exRomaji: 'Tokutei ginou biza de Toukyou no kaisha de hatarakimasu.',
      exEn: 'I will work at a Tokyo company under the SSW visa.'
    },
    {
      jp: '<ruby>合格<rt>ごうかく</rt></ruby>',
      reading: 'ごうかく (Goukaku)',
      type: 'Noun / Suru Verb',
      tag: 'JLPT N5 • GOALS',
      meaning: 'Passing an exam / Success',
      exJp: 'JFT-Basic<ruby>試験<rt>しけん</rt></ruby>に<ruby>一回<rt>いっかい</rt></ruby>で<ruby>合格<rt>ごうかく</rt></ruby>しました！',
      exRomaji: 'JFT-Basic shiken ni ikkai de goukaku shimashita!',
      exEn: 'I passed the JFT-Basic exam on my first attempt!'
    }
  ],
  kaigo_vocab: [
    {
      jp: '<ruby>介護<rt>かいご</rt></ruby>',
      reading: 'かいご (Kaigo)',
      type: 'Nursing Care Term',
      tag: 'SSW 介護 • ESSENTIAL',
      meaning: 'Nursing care / Caregiving',
      exJp: '<ruby>介護施設<rt>かいごしせつ</rt></ruby>で<ruby>利用<rt>りよう</rt></ruby><ruby>者様<rt>しゃさま</rt></ruby>を<ruby>大切<rt>たいせつ</rt></ruby>にお<ruby>世話<rt>せわ</rt></ruby>します。',
      exRomaji: 'Kaigo shisetsu de riyousha-sama o taisetsu ni osewa shimasu.',
      exEn: 'We care with utmost respect for residents in the nursing facility.'
    },
    {
      jp: '<ruby>車椅子<rt>くるまいす</rt></ruby>',
      reading: 'くるまいす (Kurumaisu)',
      type: 'Equipment Term',
      tag: 'SSW 介護 • TOOLS',
      meaning: 'Wheelchair',
      exJp: '<ruby>車椅子<rt>くるまいす</rt></ruby>のブレーキをしっかり<ruby>確認<rt>かくにん</rt></ruby>してください。',
      exRomaji: 'Kurumaisu no bureeki o shikkari kakunin shite kudasai.',
      exEn: 'Please make sure to firmly check the wheelchair brakes.'
    },
    {
      jp: '<ruby>移乗<rt>いじょう</rt></ruby>',
      reading: 'いじょう (Ijou)',
      type: 'Care Action',
      tag: 'SSW 介護 • SKILLS',
      meaning: 'Transfer (Bed to wheelchair / vice versa)',
      exJp: 'ベッドから<ruby>車椅子<rt>くるまいす</rt></ruby>への<ruby>移乗<rt>いじょう</rt></ruby>を<ruby>介助<rt>かいじょ</rt></ruby>します。',
      exRomaji: 'Beddo kara kurumaisu e no ijou o kaijo shimasu.',
      exEn: 'Assisting with transfer from the bed to the wheelchair.'
    },
    {
      jp: '<ruby>体調<rt>たいちょう</rt></ruby>',
      reading: 'たいちょう (Taichou)',
      type: 'Health Assessment',
      tag: 'SSW 介護 • DAILY',
      meaning: 'Physical condition / Health state',
      exJp: '<ruby>今日<rt>きょう</rt></ruby>の<ruby>体調<rt>たいちょう</rt></ruby>はいかがですか。',
      exRomaji: 'Kyou no taichou wa ikaga desu ka.',
      exEn: 'How are you feeling today?'
    }
  ],
  agri_vocab: [
    {
      jp: '<ruby>農業<rt>のうぎょう</rt></ruby>',
      reading: 'のうぎょう (Nōgyō)',
      type: 'Industry Term',
      tag: 'SSW 農業 • CORE',
      meaning: 'Agriculture / Farming',
      exJp: '<ruby>日本<rt>にほん</rt></ruby>の<ruby>先進的<rt>せんしんてき</rt></ruby>な<ruby>農業技術<rt>のうぎょうぎじゅつ</rt></ruby>を<ruby>学<rt>まな</rt></ruby>びます。',
      exRomaji: 'Nihon no senshinteki na nougyou gijutsu o manabimasu.',
      exEn: 'Learning advanced Japanese agricultural techniques.'
    },
    {
      jp: '<ruby>収穫<rt>しゅうかく</rt></ruby>',
      reading: 'しゅうかく (Shuukaku)',
      type: 'Farm Operation',
      tag: 'SSW 農業 • FIELD',
      meaning: 'Harvest / Harvesting crops',
      exJp: '<ruby>朝早<rt>あさはや</rt></ruby>くから<ruby>新鮮<rt>しんせん</rt></ruby>な<ruby>野菜<rt>やさい</rt></ruby>を<ruby>収穫<rt>しゅうかく</rt></ruby>します。',
      exRomaji: 'Asa hayaku kara shinsen na yasai o shuukaku shimasu.',
      exEn: 'Harvesting fresh vegetables from early in the morning.'
    },
    {
      jp: '<ruby>温室<rt>おんしつ</rt></ruby> / ハウス',
      reading: 'おんしつ / はうす (Onshitsu / Hausu)',
      type: 'Facility',
      tag: 'SSW 農業 • FACILITY',
      meaning: 'Greenhouse / Vinyl plastic house',
      exJp: 'ビニールハウスの<ruby>中<rt>なか</rt></ruby>でイチゴを<ruby>育<rt>そだ</rt></ruby>てています。',
      exRomaji: 'Biniiru hausu no naka de ichigo o sodatete imasu.',
      exEn: 'Growing strawberries inside the greenhouse.'
    }
  ],
  food_vocab: [
    {
      jp: 'いらっしゃいませ',
      reading: 'いらっしゃいませ (Irasshaimase)',
      type: 'Greeting / Keigo',
      tag: 'SSW 外食 • CUSTOMER',
      meaning: 'Welcome (to our store/restaurant)',
      exJp: '<ruby>明<rt>あか</rt></ruby>るい<ruby>笑顔<rt>えがお</rt></ruby>でお<ruby>客様<rt>きゃくさま</rt></ruby>にいらっしゃいませと<ruby>言<rt>い</rt></ruby>います。',
      exRomaji: 'Akarui egao de okyakusama ni irasshaimase to iimasu.',
      exEn: 'Welcome customers with a bright smile.'
    },
    {
      jp: '<ruby>衛生管理<rt>えいせいかんり</rt></ruby>',
      reading: 'えいせいかんり (Eiseikanri)',
      type: 'Safety Standard',
      tag: 'SSW 外食 • HYGIENE',
      meaning: 'Hygiene & Sanitation Management',
      exJp: '<ruby>調理前<rt>ちょうりまえ</rt></ruby>に<ruby>必<rt>かなら</rt></ruby>ず<ruby>正<rt>ただ</rt></ruby>しい<ruby>手洗<rt>てあら</rt></ruby>いと<ruby>衛生管理<rt>えいせいかんり</rt></ruby>を<ruby>行<rt>おこな</rt></ruby>います。',
      exRomaji: 'Chouri mae ni kanarazu tadashii tearai to eiseikanri o okonaimasu.',
      exEn: 'Always perform proper hand washing and hygiene checks before cooking.'
    },
    {
      jp: '<ruby>賞味期限<rt>しょうみきげん</rt></ruby>',
      reading: 'しょうみきげん (Shoumikigen)',
      type: 'Food Label',
      tag: 'SSW 外食 • SAFETY',
      meaning: 'Best-before date (Peak quality)',
      exJp: '<ruby>材料<rt>ざいりょう</rt></ruby>の<ruby>賞味期限<rt>しょうみきげん</rt></ruby>をチェックしてください。',
      exRomaji: 'Zairyou no shoumikigen o chekku shite kudasai.',
      exEn: 'Please check the best-before date of the ingredients.'
    }
  ],
  jft_phrases: [
    {
      jp: 'お<ruby>疲<rt>つか</rt></ruby>れ<ruby>様<rt>さま</rt></ruby>でした',
      reading: 'おつかれさまでした (Otsukaresama deshita)',
      type: 'Workplace Greeting',
      tag: 'JFT-BASIC • CONVERSATION',
      meaning: 'Thank you for your hard work / Good job today',
      exJp: '<ruby>仕事<rt>しごと</rt></ruby>が<ruby>終<rt>お</rt></ruby>わった<ruby>時<rt>とき</rt></ruby>に<ruby>皆<rt>みな</rt></ruby>にお<ruby>疲<rt>つか</rt></ruby>れ<ruby>様<rt>さま</rt></ruby>でしたと<ruby>挨拶<rt>あいさつ</rt></ruby>します。',
      exRomaji: 'Shigoto ga owatta toki ni mina ni otsukaresama deshita to aisatsu shimasu.',
      exEn: 'Saying Otsukaresama deshita to everyone when work is finished.'
    },
    {
      jp: '<ruby>少々<rt>しょうしょう</rt></ruby>お<ruby>待<rt>ま</rt></ruby>ちください',
      reading: 'しょうしょうおまちください (Shoushou omachi kudasai)',
      type: 'Keigo Phrase',
      tag: 'JFT-BASIC • POLITE',
      meaning: 'Please wait a moment',
      exJp: 'ただいま<ruby>確認<rt>かくにん</rt></ruby>いたしますので、<ruby>少々<rt>しょうしょう</rt></ruby>お<ruby>待<rt>ま</rt></ruby>ちください。',
      exRomaji: 'Tadaima kakunin itashimasu node, shoushou omachi kudasai.',
      exEn: 'I will verify that right now, please wait a moment.'
    },
    {
      jp: '<ruby>手伝<rt>てつだ</rt></ruby>っていただけませんか',
      reading: 'てつだっていただきませんか (Tetsudatte itadakimasen ka)',
      type: 'Polite Request',
      tag: 'JFT-BASIC • REQUEST',
      meaning: 'Could you please help me?',
      exJp: 'すみません、<ruby>荷物<rt>にもつ</rt></ruby>の<ruby>運搬<rt>うんぱん</rt></ruby>を<ruby>手伝<rt>てつだ</rt></ruby>っていただけませんか。',
      exRomaji: 'Sumimasen, nimotsu no unpan o tetsudatte itadakimasen ka.',
      exEn: 'Excuse me, could you please help me carry these packages?'
    }
  ]
};

let currentDeckName = 'n5_essential';
let currentCardIndex = 0;

function initFlashcardLab() {
  const card = document.getElementById('flashcard');
  const deckBtns = document.querySelectorAll('.deck-btn');
  const nextBtn = document.getElementById('next-card-btn');
  const prevBtn = document.getElementById('prev-card-btn');
  const shuffleBtn = document.getElementById('shuffle-card-btn');
  const audioBtn = document.getElementById('audio-pronounce-btn');
  const counterEl = document.getElementById('card-counter');

  function renderCard() {
    const deck = FLASHCARD_DECKS[currentDeckName];
    if (!deck || deck.length === 0) return;

    if (currentCardIndex >= deck.length) currentCardIndex = 0;
    if (currentCardIndex < 0) currentCardIndex = deck.length - 1;

    const data = deck[currentCardIndex];

    // Reset flip
    if (card) card.classList.remove('flipped');

    // Populate elements (using innerHTML for Japanese fields to support furigana ruby tags)
    document.getElementById('card-tag').textContent = data.tag;
    document.getElementById('card-japanese').innerHTML = data.jp;
    document.getElementById('card-reading').textContent = data.reading;
    document.getElementById('card-type').textContent = data.type;
    document.getElementById('card-meaning').textContent = data.meaning;
    document.getElementById('card-example-jp').innerHTML = data.exJp;
    document.getElementById('card-example-romaji').textContent = data.exRomaji;
    document.getElementById('card-example-en').textContent = data.exEn;

    if (counterEl) {
      counterEl.innerHTML = `Card <strong>${currentCardIndex + 1}</strong> of <strong>${deck.length}</strong>`;
    }
  }

  // Flip interaction
  if (card) {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  }

  // Next & Prev
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentCardIndex++;
      renderCard();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentCardIndex--;
      renderCard();
    });
  }

  // Shuffle Deck
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      const deck = FLASHCARD_DECKS[currentDeckName];
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      currentCardIndex = 0;
      renderCard();
      showToast('🔀 Deck shuffled!');
    });
  }

  // Deck category tabs
  deckBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deckBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDeckName = btn.dataset.deck;
      currentCardIndex = 0;
      renderCard();
    });
  });

  // Native Japanese Audio Pronunciation (Web Speech API)
  if (audioBtn) {
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playJapaneseAudio();
    });
  }

  function playJapaneseAudio() {
    const deck = FLASHCARD_DECKS[currentDeckName];
    const data = deck[currentCardIndex];
    if (!data) return;

    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    // Clean out furigana ruby tags and annotations for pure spoken Japanese
    const cleanJp = data.jp.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]*>/g, '');
    const cleanExJp = data.exJp.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]*>/g, '');
    const textToSpeak = `${cleanJp}。${cleanExJp}`;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85; // Slightly slower for language learners

    // Find a Japanese voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja') || v.lang === 'ja-JP');
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    utterance.onstart = () => {
      audioBtn.classList.add('speaking');
      audioBtn.innerHTML = '🔊 Speaking...';
    };

    utterance.onend = () => {
      audioBtn.classList.remove('speaking');
      audioBtn.innerHTML = '🔊 Pronounce (聞いて)';
    };

    utterance.onerror = () => {
      audioBtn.classList.remove('speaking');
      audioBtn.innerHTML = '🔊 Pronounce (聞いて)';
    };

    window.speechSynthesis.speak(utterance);
  }

  renderCard();
}

/* ===================================================================
   6. JFT-BASIC & JLPT PRACTICE QUIZ ARENA
   =================================================================== */
const QUIZ_QUESTIONS = [
  {
    q: '<ruby>田中<rt>たなか</rt></ruby>さんは <ruby>今<rt>いま</rt></ruby>、<ruby>図書室<rt>としょしつ</rt></ruby>（＿＿＿）<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んでいます。',
    sub: 'Choose the appropriate particle for the location of action.',
    options: ['に', 'で', 'へ', 'を'],
    correct: 1,
    explanation: '「で」 indicates the location where an action takes place (<ruby>図書室<rt>としょしつ</rt></ruby>で<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みます - Reading a book in the library). 「に」 indicates existence or destination.'
  },
  {
    q: '<ruby>介護施設<rt>かいごしせつ</rt></ruby>で、お<ruby>年寄<rt>としよ</rt></ruby>りが<ruby>転<rt>ころ</rt></ruby>ばないように（＿＿＿）を<ruby>確認<rt>かくにん</rt></ruby>します。',
    sub: 'SSW Kaigo Essential Safety Term.',
    options: ['ブレーキ', 'メニュー', '<ruby>切符<rt>きっぷ</rt></ruby>', 'エレベーター'],
    correct: 0,
    explanation: 'Correct! 「ブレーキ」(Brakes) of wheelchairs or walkers must be locked to prevent falls (<ruby>転倒防止<rt>てんとうぼうし</rt></ruby>).'
  },
  {
    q: '<ruby>来週<rt>らいしゅう</rt></ruby>の<ruby>月曜日<rt>げつようび</rt></ruby>に JFT-Basicの<ruby>試験<rt>しけん</rt></ruby>を（＿＿＿）<ruby>予定<rt>よてい</rt></ruby>です。',
    sub: 'Verb collocation with taking an exam.',
    options: ['<ruby>受<rt>う</rt></ruby>けます', '<ruby>受<rt>う</rt></ruby>ける', '<ruby>受<rt>う</rt></ruby>けて', '<ruby>受<rt>う</rt></ruby>けた'],
    correct: 1,
    explanation: 'Verb dictionary form + <ruby>予定<rt>よてい</rt></ruby>です (yotei desu) is used to express planned actions:「<ruby>受<rt>う</rt></ruby>ける<ruby>予定<rt>よてい</rt></ruby>です」(plan to take).'
  },
  {
    q: 'お<ruby>客様<rt>きゃくさま</rt></ruby>：ごちそうさまでした。とても<ruby>美味<rt>おい</rt></ruby>しかったです。<br><ruby>店員<rt>てんいん</rt></ruby>：（＿＿＿＿＿＿＿＿）。',
    sub: 'Customer service (Food service / Omotenashi greeting).',
    options: [
      'どういたしまして',
      'ありがとうございました。またお<ruby>越<rt>こ</rt></ruby>しくださいませ。',
      'お<ruby>疲<rt>つか</rt></ruby>れ<ruby>様<rt>さま</rt></ruby>でした',
      'こちらこそ<ruby>失礼<rt>しつれい</rt></ruby>します'
    ],
    correct: 1,
    explanation: 'In Japanese restaurant hospitality (<ruby>外食業<rt>がいしょくぎょう</rt></ruby>), when a customer leaves saying the food was delicious, staff respond politely with「ありがとうございました。またお<ruby>越<rt>こ</rt></ruby>しくださいませ。」.'
  },
  {
    q: '「<ruby>農業<rt>のうぎょう</rt></ruby>」の<ruby>正<rt>ただ</rt></ruby>しい<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>はどれですか。',
    sub: 'Kanji reading test.',
    options: ['のうぎょう (Nōgyō)', 'どうぎょう (Dōgyō)', 'のうこう (Nōkō)', 'のうさく (Nōsaku)'],
    correct: 0,
    explanation: '「<ruby>農業<rt>のうぎょう</rt></ruby>」 is read as のうぎょう (Nōgyō), meaning Agriculture / Farming.'
  }
];

let quizCurrentIndex = 0;
let quizScore = 0;
let quizTimerSeconds = 45;
let quizTimerInterval = null;

function initQuizArena() {
  const qText = document.getElementById('quiz-question-text');
  const qSub = document.getElementById('quiz-question-sub');
  const optionsContainer = document.getElementById('quiz-options');
  const explanationBox = document.getElementById('quiz-explanation');
  const currentQNum = document.getElementById('quiz-current-q');
  const totalQNum = document.getElementById('quiz-total-q');
  const scoreBadge = document.getElementById('quiz-score');
  const nextBtn = document.getElementById('quiz-next-btn');
  const restartBtn = document.getElementById('quiz-restart-btn');
  const timerEl = document.getElementById('quiz-timer');

  if (!qText) return;
  totalQNum.textContent = QUIZ_QUESTIONS.length;

  function loadQuestion() {
    clearInterval(quizTimerInterval);
    quizTimerSeconds = 45;
    updateTimerDisplay();
    startTimer();

    const q = QUIZ_QUESTIONS[quizCurrentIndex];
    currentQNum.textContent = quizCurrentIndex + 1;
    qText.innerHTML = q.q;
    qSub.textContent = q.sub;
    explanationBox.style.display = 'none';
    explanationBox.textContent = '';
    nextBtn.disabled = true;

    optionsContainer.innerHTML = '';
    q.options.forEach((optText, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<strong>${String.fromCharCode(65 + index)}.</strong> ${optText}`;
      btn.addEventListener('click', () => selectAnswer(index, btn));
      optionsContainer.appendChild(btn);
    });
  }

  function startTimer() {
    quizTimerInterval = setInterval(() => {
      quizTimerSeconds--;
      updateTimerDisplay();
      if (quizTimerSeconds <= 0) {
        clearInterval(quizTimerInterval);
        handleTimeUp();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (timerEl) {
      const mins = Math.floor(quizTimerSeconds / 60).toString().padStart(2, '0');
      const secs = (quizTimerSeconds % 60).toString().padStart(2, '0');
      timerEl.textContent = `⏱️ ${mins}:${secs}`;
    }
  }

  function handleTimeUp() {
    showToast('⏰ Time is up for this question!');
    const q = QUIZ_QUESTIONS[quizCurrentIndex];
    const buttons = optionsContainer.querySelectorAll('.quiz-option-btn');
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
    });
    explanationBox.style.display = 'block';
    explanationBox.innerHTML = `⏰ <strong>Time up!</strong> ${q.explanation}`;
    nextBtn.disabled = false;
  }

  function selectAnswer(selectedIndex, selectedBtn) {
    clearInterval(quizTimerInterval);
    const q = QUIZ_QUESTIONS[quizCurrentIndex];
    const buttons = optionsContainer.querySelectorAll('.quiz-option-btn');

    buttons.forEach(b => (b.disabled = true));

    if (selectedIndex === q.correct) {
      selectedBtn.classList.add('correct');
      quizScore += 20;
      scoreBadge.textContent = quizScore;
      explanationBox.innerHTML = `✅ <strong>Correct! 正解です！</strong> ${q.explanation}`;
    } else {
      selectedBtn.classList.add('wrong');
      buttons[q.correct].classList.add('correct');
      explanationBox.innerHTML = `❌ <strong>Not quite!</strong> ${q.explanation}`;
    }

    explanationBox.style.display = 'block';
    nextBtn.disabled = false;
  }

  nextBtn.addEventListener('click', () => {
    quizCurrentIndex++;
    if (quizCurrentIndex < QUIZ_QUESTIONS.length) {
      loadQuestion();
    } else {
      finishQuiz();
    }
  });

  function finishQuiz() {
    clearInterval(quizTimerInterval);
    qText.textContent = `🎉 Quiz Completed! Final Score: ${quizScore} / ${QUIZ_QUESTIONS.length * 20}`;
    qSub.textContent = quizScore >= 80 
      ? '🌟 Excellent! You have strong grasp of JFT-Basic & SSW vocabulary. 一緒に頑張りました！' 
      : '👍 Good attempt! Review Kapil Sensei’s video lessons to strengthen your grammar & score 100%.';

    optionsContainer.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <p style="font-size: 1.1rem; margin-bottom: 16px;">Want more full-length mock exams and PDF notes?</p>
        <a href="https://www.youtube.com/@KapilSensei?sub_confirmation=1" target="_blank" class="btn btn-youtube">
          Subscribe to @KapilSensei on YouTube
        </a>
      </div>
    `;
    explanationBox.style.display = 'none';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'inline-flex';
  }

  restartBtn.addEventListener('click', () => {
    quizCurrentIndex = 0;
    quizScore = 0;
    scoreBadge.textContent = '0';
    nextBtn.style.display = 'inline-flex';
    restartBtn.style.display = 'none';
    loadQuestion();
  });

  loadQuestion();
}

/* ===================================================================
   7. SSW SECTOR MODALS (Detailed breakdowns)
   =================================================================== */
const SECTOR_DATA = {
  kaigo: {
    title: '<ruby>介護<rt>かいご</rt></ruby> (Kaigo - Caregiving) Sector Details',
    content: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <p><strong>Overview:</strong> Japan faces high demand for compassionate care workers. Under SSW-1, foreign care workers enjoy equal wages, pension, and healthcare coverage as Japanese peers.</p>
        <h4>Examinations Required:</h4>
        <ul style="padding-left:20px; line-height:1.7;">
          <li><strong>Japanese Language:</strong> JFT-Basic (A2) or JLPT N4</li>
          <li><strong>Technical Skills:</strong> Nursing Care Skills Evaluation Test (<ruby>介護技能評価試験<rt>かいごぎのうひょうかしけん</rt></ruby>)</li>
          <li><strong>Technical Japanese:</strong> Nursing Care Japanese Language Evaluation Test (<ruby>介護日本語評価試験<rt>かいごにほんごひょうかしけん</rt></ruby>)</li>
        </ul>
        <h4>Career Pathway:</h4>
        <p>After 3 years of work in Japan, you become eligible to sit for the national certification exam (Kaigofukushishi <ruby>介護福祉士<rt>かいごふくしし</rt></ruby>). Passing unlocks indefinite residency and family sponsorship!</p>
        <div style="background: rgba(225, 29, 72, 0.12); border: 1px solid rgba(225, 29, 72, 0.35); padding: 14px 16px; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--accent-sakura);">
            <span>⚡ Featured Lesson:</span>
            <span style="font-size: 0.72rem; background: #ea4335; color: #fff; padding: 2px 7px; border-radius: 4px;">YOUTUBE SHORTS</span>
          </div>
          <p style="margin: 6px 0 10px 0; font-size: 0.9rem; color: var(--text-secondary);">
            <strong>SSW Kaigo (介護) Specialized Vocabulary:</strong> Transfer &amp; Meal Support Terms.
          </p>
          <a href="https://youtube.com/shorts/A4cK_lst5XE?feature=share" target="_blank" rel="noopener" class="btn btn-youtube-sm" style="display: inline-flex; align-items: center; gap: 6px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <span>Watch on YouTube Shorts (Transfer &amp; Meal Support) ↗</span>
          </a>
        </div>
      </div>
    `
  },
  nogyo: {
    title: '<ruby>農業<rt>のうぎょう</rt></ruby> (Nōgyō - Agriculture) Sector Details',
    content: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <p><strong>Overview:</strong> Work in smart farming, greenhouse horticulture, vegetable cultivation, fruit harvesting, and livestock across Hokkaido, Nagano, Chiba, and Kumamoto.</p>
        <h4>Examinations Required:</h4>
        <ul style="padding-left:20px; line-height:1.7;">
          <li><strong>Japanese Language:</strong> JFT-Basic (A2) or JLPT N4</li>
          <li><strong>Technical Skills:</strong> General Crop Farming Skills Test (<ruby>栽培農業<rt>さいばいのうぎょう</rt></ruby>) OR Livestock Farming Test (<ruby>畜産農業<rt>ちくさんのうぎょう</rt></ruby>)</li>
        </ul>
        <h4>Key Benefits:</h4>
        <p>Comprehensive training in automated machinery, hydroponics, and Japanese crop quality management.</p>
      </div>
    `
  },
  gaisyoku: {
    title: '<ruby>外食業<rt>がいしょくぎょう</rt></ruby> (Gaisyoku - Food Service) Sector Details',
    content: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <p><strong>Overview:</strong> Experience modern Japanese culinary service in restaurants, hotels, cafes, and food franchises throughout Tokyo, Osaka, and Fukuoka.</p>
        <h4>Examinations Required:</h4>
        <ul style="padding-left:20px; line-height:1.7;">
          <li><strong>Japanese Language:</strong> JFT-Basic (A2) or JLPT N4</li>
          <li><strong>Technical Skills:</strong> Food Service Industry Skills Proficiency Test (<ruby>外食業技能測定試験<rt>がいしょくぎょうぎのうそくていしけん</rt></ruby>)</li>
        </ul>
        <h4>Job Duties:</h4>
        <p>Cooking, food prep, customer welcoming, register handling, kitchen sanitation (HACCP), and inventory control.</p>
      </div>
    `
  },
  shukuhaku: {
    title: '<ruby>宿泊業<rt>しゅくはくぎょう</rt></ruby> (Shukuhaku - Hospitality) Sector Details',
    content: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <p><strong>Overview:</strong> Welcome world travelers in premier Japanese hotels and traditional Ryokan resorts.</p>
        <h4>Examinations Required:</h4>
        <ul style="padding-left:20px; line-height:1.7;">
          <li><strong>Japanese Language:</strong> JFT-Basic (A2) or JLPT N4</li>
          <li><strong>Technical Skills:</strong> Accommodation Industry Skills Test (<ruby>宿泊業技能測定試験<rt>しゅくはくぎょうぎのうそくていしけん</rt></ruby>)</li>
        </ul>
        <h4>Key Focus:</h4>
        <p>Omotenashi hospitality, polite business Japanese (Keigo), front desk check-in, concierge assistance, and restaurant operations.</p>
      </div>
    `
  }
};

function initSSWModals() {
  const sectorModal = document.getElementById('sector-modal');
  const sectorTitle = document.getElementById('sector-modal-title');
  const sectorContent = document.getElementById('sector-modal-content');
  const closeBtn = document.getElementById('close-sector-modal');
  const closeFooterBtn = document.getElementById('sector-close-btn');

  document.querySelectorAll('.open-sector-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectorKey = btn.dataset.sector;
      const data = SECTOR_DATA[sectorKey];
      if (data && sectorModal) {
        sectorTitle.innerHTML = data.title;
        sectorContent.innerHTML = data.content;
        sectorModal.classList.add('open');
      }
    });
  });

  const closeModal = () => {
    if (sectorModal) sectorModal.classList.remove('open');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);
  if (sectorModal) {
    sectorModal.addEventListener('click', (e) => {
      if (e.target === sectorModal) closeModal();
    });
  }
}

/* ===================================================================
   8. FAQ ACCORDION
   =================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}

/* ===================================================================
   9. VALIDATION HELPERS
   =================================================================== */
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim());
}

function validateName(name) {
  const trimmed = String(name).trim();
  if (trimmed.length < 2) return false;
  // Allow letters, Japanese characters, hyphens, and spaces
  const re = /^[a-zA-Z\s.'\-\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]+$/;
  return re.test(trimmed);
}

function validatePhoneNumber(countryCode, rawNumber) {
  const clean = String(rawNumber).replace(/[\s\-\(\)\.]/g, '');

  if (!clean || !/^\d+$/.test(clean)) {
    return { valid: false, message: 'Please enter a valid mobile number with digits only.' };
  }

  switch (countryCode) {
    case '+977': // Nepal
      if (clean.length !== 10) {
        return { valid: false, message: 'Nepal mobile numbers must be exactly 10 digits (e.g. 98XXXXXXXX).' };
      }
      if (!/^9[678]\d{8}$/.test(clean)) {
        return { valid: false, message: 'Valid Nepal mobile numbers start with 98 or 97 (e.g. 9812345678).' };
      }
      return { valid: true, formatted: `+977 ${clean}`, clean, country: 'Nepal' };

    case '+81': // Japan
      if (clean.length < 10 || clean.length > 11) {
        return { valid: false, message: 'Japan phone numbers must be 10 or 11 digits (e.g. 080XXXXXXXX).' };
      }
      return { valid: true, formatted: `+81 ${clean}`, clean, country: 'Japan' };

    case '+91': // India
      if (clean.length !== 10) {
        return { valid: false, message: 'India mobile numbers must be exactly 10 digits.' };
      }
      if (!/^[6-9]\d{9}$/.test(clean)) {
        return { valid: false, message: 'Valid Indian mobile numbers start with 6, 7, 8, or 9.' };
      }
      return { valid: true, formatted: `+91 ${clean}`, clean, country: 'India' };

    case '+880': // Bangladesh
      if (clean.length !== 10 && clean.length !== 11) {
        return { valid: false, message: 'Bangladesh numbers must be 10 or 11 digits (e.g. 1XXXXXXXXX).' };
      }
      return { valid: true, formatted: `+880 ${clean}`, clean, country: 'Bangladesh' };

    case '+94': // Sri Lanka
      if (clean.length !== 9 && clean.length !== 10) {
        return { valid: false, message: 'Sri Lanka numbers must be 9 digits (e.g. 7XXXXXXXX).' };
      }
      return { valid: true, formatted: `+94 ${clean}`, clean, country: 'Sri Lanka' };

    case '+63': // Philippines
      if (clean.length !== 10) {
        return { valid: false, message: 'Philippines mobile numbers must be 10 digits (e.g. 9XXXXXXXXX).' };
      }
      return { valid: true, formatted: `+63 ${clean}`, clean, country: 'Philippines' };

    case '+84': // Vietnam
      if (clean.length < 9 || clean.length > 10) {
        return { valid: false, message: 'Vietnam phone numbers must be 9 or 10 digits.' };
      }
      return { valid: true, formatted: `+84 ${clean}`, clean, country: 'Vietnam' };

    case '+95': // Myanmar
      if (clean.length < 8 || clean.length > 10) {
        return { valid: false, message: 'Myanmar phone numbers must be between 8 and 10 digits.' };
      }
      return { valid: true, formatted: `+95 ${clean}`, clean, country: 'Myanmar' };

    case '+62': // Indonesia
      if (clean.length < 9 || clean.length > 12) {
        return { valid: false, message: 'Indonesia phone numbers must be between 9 and 12 digits.' };
      }
      return { valid: true, formatted: `+62 ${clean}`, clean, country: 'Indonesia' };

    case '+1': // US / Canada
      if (clean.length !== 10) {
        return { valid: false, message: 'US/Canada phone numbers must be exactly 10 digits.' };
      }
      return { valid: true, formatted: `+1 ${clean}`, clean, country: 'USA/Canada' };

    case '+44': // UK
      if (clean.length !== 10 && clean.length !== 11) {
        return { valid: false, message: 'UK phone numbers must be 10 or 11 digits.' };
      }
      return { valid: true, formatted: `+44 ${clean}`, clean, country: 'UK' };

    case '+61': // Australia
      if (clean.length !== 9 && clean.length !== 10) {
        return { valid: false, message: 'Australia phone numbers must be 9 digits.' };
      }
      return { valid: true, formatted: `+61 ${clean}`, clean, country: 'Australia' };

    case '+971': // UAE
      if (clean.length !== 9) {
        return { valid: false, message: 'UAE phone numbers must be 9 digits (e.g. 5XXXXXXXX).' };
      }
      return { valid: true, formatted: `+971 ${clean}`, clean, country: 'UAE' };

    default: // Generic International
      if (clean.length < 7 || clean.length > 15) {
        return { valid: false, message: 'Please enter a valid international mobile number (7 to 15 digits).' };
      }
      return { valid: true, formatted: `${countryCode !== 'other' ? countryCode : ''} ${clean}`.trim(), clean, country: 'International' };
  }
}

function bindCountryCodeListeners(selectId, inputId, hintId, errorId) {
  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);
  const hint = document.getElementById(hintId);
  const error = document.getElementById(errorId);
  if (!select || !input) return;

  const updateHint = () => {
    const selectedOption = select.options[select.selectedIndex];
    const hintText = selectedOption ? selectedOption.getAttribute('data-hint') : '';
    const country = selectedOption ? selectedOption.getAttribute('data-country') : '';
    if (hint && hintText) {
      hint.textContent = `Format for ${country}: ${hintText}`;
    }
    if (input) {
      if (select.value === '+977') input.placeholder = 'e.g. 9812345678';
      else if (select.value === '+81') input.placeholder = 'e.g. 08012345678';
      else if (select.value === '+91') input.placeholder = 'e.g. 9876543210';
      else if (select.value === '+1') input.placeholder = 'e.g. 2025550143';
      else input.placeholder = 'e.g. Mobile number';
    }
    if (error) {
      error.classList.remove('active');
      error.textContent = '';
    }
    input.classList.remove('input-invalid');
  };

  select.addEventListener('change', updateHint);
  input.addEventListener('input', () => {
    if (error) {
      error.classList.remove('active');
      error.textContent = '';
    }
    input.classList.remove('input-invalid');
  });

  updateHint();
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem('kapil_sensei_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setStoredUser(user) {
  try {
    localStorage.setItem('kapil_sensei_user', JSON.stringify(user));
  } catch (e) {}
}

function clearStoredUser() {
  try {
    localStorage.removeItem('kapil_sensei_user');
  } catch (e) {}
}

/* ===================================================================
   10. ACADEMIC EXCELLENCE & CONSULTATION QUERY REDIRECTION
   Redirects all course queries to official Gmail: kapilsensei777@gmail.com
   =================================================================== */
function initConsultationForm() {
  const modal = document.getElementById('consultation-modal');
  const closeBtn = document.getElementById('close-consult-modal');
  const form = document.getElementById('consultation-form');
  const successAlert = document.getElementById('consult-success-message');
  const courseBadgeGroup = document.getElementById('consult-course-group');
  const courseBadge = document.getElementById('consult-selected-course-badge');
  const hiddenCourse = document.getElementById('consult-course-name');
  const goalSelect = document.getElementById('consult-goal');
  const gmailDirectBtn = document.getElementById('consult-gmail-direct-btn');
  const mailtoBtn = document.getElementById('consult-mailto-btn');
  const copyEmailBtn = document.getElementById('consult-copy-email-btn');
  const successDetails = document.getElementById('consult-success-details');

  const nameInput = document.getElementById('consult-name');
  const emailInput = document.getElementById('consult-email');
  const countryCodeSelect = document.getElementById('consult-country-code');
  const phoneInput = document.getElementById('consult-phone');
  const messageInput = document.getElementById('consult-message');

  const nameError = document.getElementById('consult-name-error');
  const emailError = document.getElementById('consult-email-error');
  const phoneError = document.getElementById('consult-phone-error');

  // Bind dynamic country code change listener
  bindCountryCodeListeners('consult-country-code', 'consult-phone', 'consult-phone-hint', 'consult-phone-error');

  // Open modal when any consultation / course query button is clicked
  document.querySelectorAll('.open-consultation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseName = btn.getAttribute('data-course');
      const defaultGoal = btn.getAttribute('data-default-goal');

      if (courseName && courseBadge && courseBadgeGroup && hiddenCourse) {
        courseBadgeGroup.style.display = 'block';
        courseBadge.textContent = courseName;
        hiddenCourse.value = courseName;
      } else if (courseBadgeGroup && hiddenCourse) {
        courseBadgeGroup.style.display = 'none';
        hiddenCourse.value = 'Academic Excellence Study Programs';
      }

      if (defaultGoal && goalSelect) {
        goalSelect.value = defaultGoal;
      }

      // Pre-fill user details if logged in
      const savedUser = getStoredUser();
      if (savedUser) {
        if (nameInput && !nameInput.value) nameInput.value = savedUser.name || '';
        if (emailInput && !emailInput.value) emailInput.value = savedUser.email || '';
        if (phoneInput && !phoneInput.value && savedUser.phone) {
          phoneInput.value = savedUser.phone;
          if (countryCodeSelect && savedUser.countryCode) {
            countryCodeSelect.value = savedUser.countryCode;
            countryCodeSelect.dispatchEvent(new Event('change'));
          }
        }
      }

      if (modal) {
        modal.classList.add('open');
        if (successAlert) successAlert.style.display = 'none';
        if (form) form.style.display = 'block';
      }
    });
  });

  const closeModal = () => {
    if (modal) modal.classList.remove('open');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Copy Sensei's official email button
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('kapilsensei777@gmail.com').then(() => {
        showToast('📋 Copied: kapilsensei777@gmail.com');
        copyEmailBtn.textContent = 'Copied! ✅';
        setTimeout(() => {
          copyEmailBtn.textContent = 'Copy Email Address 📋';
        }, 2500);
      }).catch(() => {
        showToast('Sensei Email: kapilsensei777@gmail.com');
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const countryCode = countryCodeSelect ? countryCodeSelect.value : '+977';
      const rawPhone = phoneInput ? phoneInput.value.trim() : '';
      const goal = goalSelect ? goalSelect.value : '';
      const goalText = goalSelect && goalSelect.selectedOptions[0] ? goalSelect.selectedOptions[0].textContent : goal;
      const course = hiddenCourse ? hiddenCourse.value : 'Structured Study Programs';
      const message = messageInput ? messageInput.value.trim() : '';

      let hasError = false;

      // Validate student name
      if (!validateName(name)) {
        if (nameError) {
          nameError.textContent = 'Please enter a valid student name (at least 2 characters).';
          nameError.classList.add('active');
        }
        nameInput.classList.add('input-invalid');
        hasError = true;
      } else {
        if (nameError) nameError.classList.remove('active');
        nameInput.classList.remove('input-invalid');
      }

      // Validate email ID
      if (!validateEmail(email)) {
        if (emailError) {
          emailError.textContent = 'Please enter a valid email address (e.g. name@gmail.com).';
          emailError.classList.add('active');
        }
        emailInput.classList.add('input-invalid');
        hasError = true;
      } else {
        if (emailError) emailError.classList.remove('active');
        emailInput.classList.remove('input-invalid');
      }

      // Validate phone with selected country code structure
      const phoneValidation = validatePhoneNumber(countryCode, rawPhone);
      if (!phoneValidation.valid) {
        if (phoneError) {
          phoneError.textContent = phoneValidation.message;
          phoneError.classList.add('active');
        }
        if (phoneInput) phoneInput.classList.add('input-invalid');
        hasError = true;
      } else {
        if (phoneError) phoneError.classList.remove('active');
        if (phoneInput) phoneInput.classList.remove('input-invalid');
      }

      if (hasError) return;

      const formattedPhone = phoneValidation.formatted;
      const recipient = 'kapilsensei777@gmail.com';
      const subject = `[Course Query] Academic Excellence: ${course} - ${name}`;
      const emailBody = `Konnichiwa Kapil Sensei,

I would like to submit an academic query regarding your Structured Study Programs:

STUDENT DETAILS:
• Full Name: ${name}
• Email: ${email}
• WhatsApp / Mobile: ${formattedPhone} (${phoneValidation.country || 'Verified'})
• Selected Program / Course: ${course}
• Target Learning Goal: ${goalText}

MY INQUIRY & QUESTIONS:
${message || 'Please send me details regarding syllabus, schedule, and enrollment for this course.'}

---
Submitted via Kapil Sensei Official Portal (kapil-sensei-website)`;

      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(emailBody);

      // Direct Gmail Compose URL
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodedSubject}&body=${encodedBody}`;
      // Universal mailto URL
      const mailtoUrl = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

      if (gmailDirectBtn) gmailDirectBtn.href = gmailUrl;
      if (mailtoBtn) mailtoBtn.href = mailtoUrl;

      if (successDetails) {
        successDetails.innerHTML = `Your query for <strong>${course}</strong> with verified contact <strong>${formattedPhone}</strong> has been prepared for Kapil Sensei at <strong>kapilsensei777@gmail.com</strong>. Click below to launch your email!`;
      }

      form.style.display = 'none';
      if (successAlert) {
        successAlert.style.display = 'block';
      }

      showToast(`Arigatou ${name}! Redirecting query to kapilsensei777@gmail.com...`);

      // Attempt to launch Gmail compose directly
      try {
        window.open(gmailUrl, '_blank');
      } catch (err) {
        // Fallback handled by buttons
      }
    });
  }
}

/* ===================================================================
   11. STUDENT AUTHENTICATION SYSTEM (Sign In / Sign Up)
   =================================================================== */
function initStudentAuth() {
  const authModal = document.getElementById('auth-modal');
  const closeAuthBtn = document.getElementById('close-auth-modal');
  const authOpenBtn = document.getElementById('auth-open-btn');
  const mobileAuthBtn = document.getElementById('mobile-auth-btn');

  const tabSignIn = document.getElementById('auth-tab-signin');
  const tabSignUp = document.getElementById('auth-tab-signup');
  const formSignIn = document.getElementById('signin-form');
  const formSignUp = document.getElementById('signup-form');

  const switchToSignUp = document.getElementById('switch-to-signup');
  const switchToSignIn = document.getElementById('switch-to-signin');

  const navUserProfile = document.getElementById('nav-user-profile');
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  const authLogoutBtn = document.getElementById('auth-logout-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  const mobileUserCard = document.getElementById('mobile-user-card');

  // Password visibility toggle buttons
  document.querySelectorAll('.pwd-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-input-id');
      const input = document.getElementById(targetId);
      if (input) {
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        btn.textContent = isPassword ? '🙈' : '👁️';
      }
    });
  });

  // Switch tabs
  const setTab = (tab) => {
    if (tab === 'signup') {
      if (tabSignUp) tabSignUp.classList.add('active');
      if (tabSignIn) tabSignIn.classList.remove('active');
      if (formSignUp) formSignUp.classList.add('active');
      if (formSignIn) formSignIn.classList.remove('active');
    } else {
      if (tabSignIn) tabSignIn.classList.add('active');
      if (tabSignUp) tabSignUp.classList.remove('active');
      if (formSignIn) formSignIn.classList.add('active');
      if (formSignUp) formSignUp.classList.remove('active');
    }
  };

  if (tabSignIn) tabSignIn.addEventListener('click', () => setTab('signin'));
  if (tabSignUp) tabSignUp.addEventListener('click', () => setTab('signup'));
  if (switchToSignUp) switchToSignUp.addEventListener('click', () => setTab('signup'));
  if (switchToSignIn) switchToSignIn.addEventListener('click', () => setTab('signin'));

  // Open & Close Modal
  const openAuth = (initialTab = 'signin') => {
    setTab(initialTab);
    if (authModal) authModal.classList.add('open');
  };

  const closeAuth = () => {
    if (authModal) authModal.classList.remove('open');
  };

  if (authOpenBtn) authOpenBtn.addEventListener('click', () => openAuth('signin'));
  if (mobileAuthBtn) mobileAuthBtn.addEventListener('click', () => openAuth('signin'));
  if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuth);
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuth();
    });
  }

  // Update navbar & mobile drawer based on auth state
  const syncAuthState = () => {
    const user = getStoredUser();
    if (user && user.isLoggedIn) {
      if (authOpenBtn) authOpenBtn.style.display = 'none';
      if (navUserProfile) navUserProfile.style.display = 'block';

      const initial = user.name ? user.name.charAt(0).toUpperCase() : 'S';
      const displayName = document.getElementById('user-display-name');
      const avatarBadge = document.getElementById('user-avatar-badge');
      const dropdownName = document.getElementById('user-dropdown-name');
      const dropdownEmail = document.getElementById('user-dropdown-email');
      const dropdownGoal = document.getElementById('user-dropdown-goal');

      if (displayName) displayName.textContent = user.name.split(' ')[0];
      if (avatarBadge) avatarBadge.textContent = initial;
      if (dropdownName) dropdownName.textContent = user.name;
      if (dropdownEmail) dropdownEmail.textContent = user.email;
      if (dropdownGoal && user.goal) dropdownGoal.textContent = `🎯 ${user.goal}`;

      // Mobile sync
      if (mobileAuthBtn) mobileAuthBtn.style.display = 'none';
      if (mobileUserCard) mobileUserCard.style.display = 'flex';
      const mAvatar = document.getElementById('mobile-user-avatar');
      const mName = document.getElementById('mobile-user-name');
      const mEmail = document.getElementById('mobile-user-email');
      if (mAvatar) mAvatar.textContent = initial;
      if (mName) mName.textContent = user.name;
      if (mEmail) mEmail.textContent = user.email;
    } else {
      if (authOpenBtn) authOpenBtn.style.display = 'inline-flex';
      if (navUserProfile) navUserProfile.style.display = 'none';
      if (userDropdownMenu) userDropdownMenu.classList.remove('active');

      if (mobileAuthBtn) mobileAuthBtn.style.display = 'block';
      if (mobileUserCard) mobileUserCard.style.display = 'none';
    }
  };

  // User menu dropdown toggle
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (userDropdownMenu) {
        userDropdownMenu.classList.toggle('active');
      }
    });
  }

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (userDropdownMenu && !userDropdownMenu.contains(e.target) && (!userMenuBtn || !userMenuBtn.contains(e.target))) {
      userDropdownMenu.classList.remove('active');
    }
  });

  // Sign out
  const handleLogout = () => {
    clearStoredUser();
    syncAuthState();
    showToast('Signed out successfully. またね (See you soon)!');
  };

  // Bind Country Code dynamic listener for Student Sign Up
  bindCountryCodeListeners('signup-country-code', 'signup-phone', 'signup-phone-hint', 'signup-phone-error');

  if (authLogoutBtn) authLogoutBtn.addEventListener('click', handleLogout);
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);

  // Sign Up Form Submission
  if (formSignUp) {
    formSignUp.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('signup-name');
      const emailInput = document.getElementById('signup-email');
      const countryCodeSelect = document.getElementById('signup-country-code');
      const phoneInput = document.getElementById('signup-phone');
      const pwdInput = document.getElementById('signup-password');
      const goalInput = document.getElementById('signup-goal');

      const nameError = document.getElementById('signup-name-error');
      const emailError = document.getElementById('signup-email-error');
      const phoneError = document.getElementById('signup-phone-error');
      const pwdError = document.getElementById('signup-password-error');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const countryCode = countryCodeSelect ? countryCodeSelect.value : '+977';
      const rawPhone = phoneInput ? phoneInput.value.trim() : '';
      const password = pwdInput.value;
      const goal = goalInput ? goalInput.value : 'General Japanese';

      let hasError = false;

      // Validate Student Name
      if (!validateName(name)) {
        if (nameError) {
          nameError.textContent = 'Please enter a valid student name (letters only, min 2 characters).';
          nameError.classList.add('active');
        }
        nameInput.classList.add('input-invalid');
        hasError = true;
      } else {
        if (nameError) nameError.classList.remove('active');
        nameInput.classList.remove('input-invalid');
      }

      // Validate Email ID
      if (!validateEmail(email)) {
        if (emailError) {
          emailError.textContent = 'Please enter a valid email address (e.g. student@gmail.com).';
          emailError.classList.add('active');
        }
        emailInput.classList.add('input-invalid');
        hasError = true;
      } else {
        if (emailError) emailError.classList.remove('active');
        emailInput.classList.remove('input-invalid');
      }

      // Validate Mobile Number with Country Code Structure
      const phoneValidation = validatePhoneNumber(countryCode, rawPhone);
      if (!phoneValidation.valid) {
        if (phoneError) {
          phoneError.textContent = phoneValidation.message;
          phoneError.classList.add('active');
        }
        if (phoneInput) phoneInput.classList.add('input-invalid');
        hasError = true;
      } else {
        if (phoneError) phoneError.classList.remove('active');
        if (phoneInput) phoneInput.classList.remove('input-invalid');
      }

      // Validate Password
      if (password.length < 6) {
        if (pwdError) {
          pwdError.textContent = 'Password must be at least 6 characters.';
          pwdError.classList.add('active');
        }
        pwdInput.classList.add('input-invalid');
        hasError = true;
      } else {
        if (pwdError) pwdError.classList.remove('active');
        pwdInput.classList.remove('input-invalid');
      }

      if (hasError) return;

      const newUser = {
        name,
        email,
        countryCode,
        phone: phoneValidation.clean,
        fullPhone: phoneValidation.formatted,
        country: phoneValidation.country,
        goal,
        isLoggedIn: true,
        registeredAt: new Date().toISOString()
      };

      setStoredUser(newUser);
      syncAuthState();
      closeAuth();
      formSignUp.reset();
      showToast(`🎉 Welcome to Kapil Sensei Academy, ${name}!`);
    });
  }

  // Sign In Form Submission
  if (formSignIn) {
    formSignIn.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('signin-email');
      const pwdInput = document.getElementById('signin-password');
      const emailError = document.getElementById('signin-email-error');
      const pwdError = document.getElementById('signin-password-error');

      const email = emailInput.value.trim();
      const password = pwdInput.value;

      let hasError = false;

      if (!validateEmail(email)) {
        if (emailError) {
          emailError.textContent = 'Please enter a valid email address.';
          emailError.classList.add('active');
        }
        emailInput.classList.add('input-invalid');
        hasError = true;
      } else {
        if (emailError) emailError.classList.remove('active');
        emailInput.classList.remove('input-invalid');
      }

      if (password.length < 1) {
        if (pwdError) {
          pwdError.textContent = 'Please enter your password.';
          pwdError.classList.add('active');
        }
        pwdInput.classList.add('input-invalid');
        hasError = true;
      } else {
        if (pwdError) pwdError.classList.remove('active');
        pwdInput.classList.remove('input-invalid');
      }

      if (hasError) return;

      const existingUser = getStoredUser();
      let userName = 'Student';
      let userGoal = 'JLPT / SSW';

      if (existingUser && existingUser.email.toLowerCase() === email.toLowerCase()) {
        userName = existingUser.name;
        userGoal = existingUser.goal || userGoal;
      } else {
        // Derive clean name from email prefix
        const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
        userName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }

      const activeUser = {
        name: userName,
        email: email,
        goal: userGoal,
        isLoggedIn: true,
        lastLogin: new Date().toISOString()
      };

      setStoredUser(activeUser);
      syncAuthState();
      closeAuth();
      formSignIn.reset();
      showToast(`🌸 おかえりなさい! Welcome back, ${userName}!`);
    });
  }

  // Initial session check
  syncAuthState();
}

/* ===================================================================
   12. TOAST NOTIFICATIONS
   =================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3400);
}
