import './index.css';

// Vanilla TS Exhibition Layout Controller
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const cursorOuter = document.getElementById('cursor-outer');
  const cursorInner = document.getElementById('cursor-inner');
  const sysTick = document.getElementById('sys-tick');
  const coordX = document.getElementById('coord-x');
  const coordY = document.getElementById('coord-y');
  const scrollVal = document.getElementById('scroll-val');
  const scrollBar = document.getElementById('scroll-bar');
  const scrollRail = document.getElementById('scroll-rail');
  const logoTrigger = document.getElementById('logo-trigger');
  const btnExplore = document.getElementById('btn-explore');

  // Navigation Links array
  const navLinks = [
    { id: 'nav-hero', target: 'hero' },
    { id: 'nav-human', target: 'human' },
    { id: 'nav-scale', target: 'scale' },
    { id: 'nav-skills', target: 'skills' },
    { id: 'nav-vision', target: 'vision' }
  ];

  // 1. Clock Updates in UTC
  const updateClock = () => {
    if (sysTick) {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      sysTick.textContent = `SYS_TICK : ${now.toLocaleString('en-US', options)} UTC`;
    }
  };
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Custom Cursor, Hover state detect, and Coordinate prints
  let clientX = 0;
  let clientY = 0;

  window.addEventListener('mousemove', (e) => {
    clientX = e.clientX;
    clientY = e.clientY;

    if (coordX) coordX.textContent = `X_COORD : ${clientX.toString().padStart(4, '0')} PX`;
    if (coordY) coordY.textContent = `Y_COORD : ${clientY.toString().padStart(4, '0')} PX`;

    if (cursorOuter) {
      cursorOuter.style.left = `${clientX}px`;
      cursorOuter.style.top = `${clientY}px`;
    }
    if (cursorInner) {
      cursorInner.style.left = `${clientX}px`;
      cursorInner.style.top = `${clientY}px`;
    }

    // Interactive element detection for cursor sizing
    const target = e.target as HTMLElement;
    if (target) {
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.interactive-node') ||
        target.classList.contains('btn-cyan') ||
        target.closest('.metric-card') ||
        target.closest('.skill-category-card');

      if (isInteractive) {
        document.body.classList.add('hovering-interactive');
      } else {
        document.body.classList.remove('hovering-interactive');
      }
    }
  });

  // 3. Coordinate Scroll %, Bar Progress & Coordinates Update
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollBar) {
      scrollBar.style.width = `${progress}%`;
    }
    if (scrollVal) {
      scrollVal.textContent = `SCROLL : ${Math.round(progress).toString().padStart(3, '0')}%`;
    }
  };
  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress();

  // Scroll Rail Navigation Click interaction
  if (scrollRail) {
    scrollRail.addEventListener('click', (e) => {
      const bounds = scrollRail.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      const targetY = percent * (document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  }

  // 4. Smooth Scrolling helpers
  const scrollToId = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (logoTrigger) {
    logoTrigger.addEventListener('click', () => scrollToId('hero'));
  }
  if (btnExplore) {
    btnExplore.addEventListener('click', () => scrollToId('human'));
  }

  navLinks.forEach((linkObj) => {
    const el = document.getElementById(linkObj.id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToId(linkObj.target);
      });
    }
  });

  // 5. Intersection Observer: Scroll reveals & Navigation Synchronizer
  const sectionIds = ['hero', 'human', 'scale', 'skills', 'vision'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -20% 0px', // Center Viewport Anchor trigger
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        const sId = entry.target.getAttribute('data-section-id');
        
        // Synchronize active nav tabs
        navLinks.forEach((linkObj) => {
          const tab = document.getElementById(linkObj.id);
          if (tab) {
            if (linkObj.target === sId) {
              tab.classList.add('active');
            } else {
              tab.classList.remove('active');
            }
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
});
