'use strict';
(() => {
  const menuButton = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const toast = document.getElementById('toast');
  const progress = document.getElementById('scrollProgress');
  const email = 'workfor.jhalakagrahari@gmail.com';
  let toastTimeout;
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    mobileNav.hidden = true;
  };
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
    mobileNav.hidden = !opening;
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-header') && menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
  });
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.max(0, Math.min(100, window.scrollY / max * 100)) : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { if (window.innerWidth > 950) closeMenu(); onScroll(); });
  onScroll();
  document.getElementById('year').textContent = new Date().getFullYear();
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  document.getElementById('copyEmail').addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const temp = document.createElement('textarea');
        temp.value = email;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.focus(); temp.select();
        try {
          if (!document.execCommand('copy')) throw new Error('Copy not supported');
        } finally {
          temp.remove();
          document.getElementById('copyEmail').focus();
        }
      }
      showToast('Email address copied ✓');
    } catch (_) { showToast('Email: ' + email); }
  });
})();

(() => {
  const root = document.documentElement;
  const theme = document.getElementById('theme');
  const motion = document.getElementById('motion');
  const portrait = document.querySelector('.portrait');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  theme.hidden = false;
  theme.addEventListener('click', () => {
    const light = root.dataset.theme !== 'light';
    root.dataset.theme = light ? 'light' : 'dark';
    theme.textContent = light ? 'Dark theme' : 'Light theme';
  });

  const resetTilt = () => {
    portrait.style.removeProperty('--tilt-x');
    portrait.style.removeProperty('--tilt-y');
  };
  const updateMotion = () => {
    motion.hidden = reduced.matches;
    motion.textContent = root.dataset.motion === 'off' ? 'Resume motion' : 'Pause motion';
    resetTilt();
  };
  updateMotion();
  reduced.addEventListener('change', updateMotion);
  motion.addEventListener('click', () => {
    root.dataset.motion = root.dataset.motion === 'off' ? 'on' : 'off';
    updateMotion();
  });
  portrait.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reduced.matches || root.dataset.motion === 'off') return;
    const bounds = portrait.getBoundingClientRect();
    portrait.style.setProperty('--tilt-x', (0.5 - (event.clientY - bounds.top) / bounds.height) * 16 + 'deg');
    portrait.style.setProperty('--tilt-y', ((event.clientX - bounds.left) / bounds.width - 0.5) * 16 + 'deg');
  });
  portrait.addEventListener('pointerleave', resetTilt);

  function addSwitcher(selector, className, label, labels) {
    const grid = document.querySelector(selector);
    const panels = [...grid.children];
    const controls = document.createElement('div');
    controls.className = className;
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', label);
    const buttons = panels.map((panel, index) => {
      panel.id = className + '-' + index;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = labels[index];
      button.setAttribute('aria-controls', panel.id);
      button.addEventListener('click', () => select(index));
      controls.append(button);
      return button;
    });
    function select(active) {
      panels.forEach((panel, index) => {
        panel.hidden = index !== active;
        buttons[index].setAttribute('aria-pressed', String(index === active));
      });
    }
    grid.classList.add('is-interactive');
    grid.before(controls);
    select(0);
  }
  addSwitcher('.expertise-grid', 'skill-switch', 'Explore skills', ['Social strategy', 'Creator partnerships', 'Content and campaigns']);
  addSwitcher('.playbook-grid', 'campaign-switch', 'Explore campaign phases', ['Before launch', 'Launch week', 'After launch']);
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionObserver.unobserve(entry.target);
      entry.target.classList.add('section-entered');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('main > section:not(.hero)').forEach(section => sectionObserver.observe(section));
})();
