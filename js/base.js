(function () {
  // — Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // — Theme preference (localStorage + prefers-color-scheme)
  const html = document.documentElement;
  const switchEl = document.getElementById('themeSwitch');

  const applyTheme = (mode) => {
    if (mode === 'light') {
      html.classList.add('light');
      html.setAttribute('data-theme', 'light');
      switchEl.checked = false;
    } else if (mode === 'dark') {
      html.classList.remove('light');
      html.setAttribute('data-theme', 'dark');
      switchEl.checked = true;
    } else {
      // auto (follow OS)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('light', !prefersDark);
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      switchEl.checked = prefersDark;
    }
  };

  const saved = localStorage.getItem('theme:mode'); // 'light' | 'dark' | 'auto'
  applyTheme(saved ?? 'auto');

  // Update when OS theme changes while in auto
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const mode = localStorage.getItem('theme:mode') ?? 'auto';
    if (mode === 'auto') applyTheme('auto');
  });

  // Manual toggle
  switchEl.addEventListener('change', () => {
    // If the user flips the switch, pick between dark/light (no "auto")
    const newMode = switchEl.checked ? 'dark' : 'light';
    localStorage.setItem('theme:mode', newMode);
    applyTheme(newMode);
  });

  // Subtle shadow on scroll (polish)
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    const scrolled = window.scrollY > 4;
    navbar.style.boxShadow = scrolled ? 'var(--shadow)' : 'none';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
