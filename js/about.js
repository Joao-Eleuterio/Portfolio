(function () {
  const btn = document.getElementById('copyEmail');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = btn.dataset.email;
    const old = btn.textContent;

    function showSuccess() {
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = old), 1500);
    }

    // Try modern clipboard API first (requires HTTPS or localhost)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        showSuccess();
        return;
      } catch (_) {}
    }

    // Fallback: create a temporary textarea and execCommand
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showSuccess();
    } catch (_) {
      // Last resort: prompt the user to copy manually
      window.prompt('Copy this email address:', email);
    }
    document.body.removeChild(ta);
  });
})();
