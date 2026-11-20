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
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); onScroll(); });
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
