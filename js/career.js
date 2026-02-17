// Tabs (Experience/Education) + robust Read more that works after tab switch
(function () {
  const segBtns = document.querySelectorAll(".seg__btn");
  const tabs = {
    experience: document.getElementById("tab-experience"),
    education: document.getElementById("tab-education"),
  };

  function activate(tabKey) {
    Object.entries(tabs).forEach(([key, el]) => {
      const on = key === tabKey;
      el.classList.toggle("is-hidden", !on);
      document.querySelector(`.seg__btn[data-tab="${key}"]`)?.classList.toggle("is-active", on);
    });
    try { localStorage.setItem("career:tab", tabKey); } catch {}
    setupClamps(tabs[tabKey]); // mede apenas a tab visível
  }

  segBtns.forEach(b => b.addEventListener("click", () => activate(b.dataset.tab)));

  const saved = localStorage.getItem("career:tab");
  activate(saved && tabs[saved] ? saved : "experience");

  // Re-medir no resize para a tab ativa
  window.addEventListener("resize", debounce(() => {
    const activeKey = document.querySelector(".seg__btn.is-active")?.dataset.tab || "experience";
    setupClamps(tabs[activeKey]);
  }, 150));

  /* ---------- Read more / less (scoped por tab) ---------- */
  function setupClamps(scope) {
    if (!scope) return;
    scope.querySelectorAll(".card").forEach(card => {
      const p = card.querySelector(".card__desc");
      const btn = card.querySelector(".card__more");
      if (!p || !btn) return;

      // Reset antes de medir
      card.removeAttribute("data-expanded");
      btn.textContent = "Read more";

      // Força reflow para medidas corretas após trocar de tab
      void p.offsetHeight;

      const overflows = p.scrollHeight > p.clientHeight + 1;
      btn.hidden = !overflows;

      btn.onclick = () => {
        const expanded = card.hasAttribute("data-expanded");
        if (expanded) {
          card.removeAttribute("data-expanded");
          btn.textContent = "Read more";
        } else {
          card.setAttribute("data-expanded", "");
          btn.textContent = "Show less";
        }
      };
    });
  }

  function debounce(fn, wait){ let t; return () => { clearTimeout(t); t = setTimeout(fn, wait); }; }
})();
