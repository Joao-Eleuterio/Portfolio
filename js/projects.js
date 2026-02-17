(() => {
  "use strict";

  const grid = document.getElementById("projectsGrid");
  const chipsContainer = document.getElementById("chipsContainer");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const resultsCountEl = document.getElementById("resultsCount");
  const modal = document.getElementById("projectModal");

  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".project-card"));

  // ===== Helpers =====
  function isEmpty(v) {
    return v === null || v === undefined || String(v).trim() === "";
  }

  function parseTags(raw) {
    if (isEmpty(raw)) return [];
    return String(raw)
      .replace(/\|/g, ",")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getCardTags(card) {
    return parseTags(card.getAttribute("data-tags"));
  }

  // ===== Filtering =====
  const state = {
    selected: new Set(),
    allTags: [],
  };

  function computeAllTags() {
    const set = new Set();
    for (const card of cards) {
      for (const t of getCardTags(card)) {
        set.add(t);
      }
    }
    state.allTags = Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  function renderChips() {
    if (!chipsContainer) return;

    if (!state.allTags.length) {
      chipsContainer.innerHTML = "";
      if (resultsCountEl) resultsCountEl.textContent = String(cards.length);
      return;
    }

    chipsContainer.innerHTML = state.allTags
      .map((tag) => {
        const active = state.selected.has(tag) ? " active" : "";
        return `<button class="chip${active}" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`;
      })
      .join("");
  }

  function cardMatchesSelected(card) {
    if (state.selected.size === 0) return true;
    const tags = new Set(getCardTags(card));
    for (const t of state.selected) {
      if (!tags.has(t)) return false;
    }
    return true;
  }

  function applyFilters() {
    let visible = 0;

    for (const card of cards) {
      const ok = cardMatchesSelected(card);
      card.style.display = ok ? "" : "none";
      if (ok) visible += 1;
    }

    if (resultsCountEl) resultsCountEl.textContent = String(visible);

    if (chipsContainer) {
      chipsContainer.querySelectorAll(".chip").forEach((btn) => {
        const tag = btn.getAttribute("data-tag");
        if (!tag) return;
        btn.classList.toggle("active", state.selected.has(tag));
      });
    }
  }

  if (chipsContainer) {
    computeAllTags();
    renderChips();
    applyFilters();

    chipsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;

      const tag = btn.getAttribute("data-tag");
      if (!tag) return;

      if (state.selected.has(tag)) state.selected.delete(tag);
      else state.selected.add(tag);

      applyFilters();
    });
  } else {
    if (resultsCountEl) resultsCountEl.textContent = String(cards.length);
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      state.selected.clear();
      applyFilters();
    });
  }

  // ===== Modal Logic =====
  if (!modal) return;

  const modalMedia = document.getElementById("modalMedia");
  const modalCover = document.getElementById("modalCover");
  const modalTitle = document.getElementById("modalTitle");
  const modalExcerpt = document.getElementById("modalExcerpt");
  const modalDescription = document.getElementById("modalDescription");
  const modalTags = document.getElementById("modalTags");
  const modalRepo = document.getElementById("modalRepo");

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  let lastFocused = null;

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function getCardData(card) {
    return {
      title: card.getAttribute("data-title") || "",
      excerpt: card.getAttribute("data-excerpt") || "",
      description: card.getAttribute("data-description") || "",
      tagsRaw: card.getAttribute("data-tags") || "",
      cover: card.getAttribute("data-cover") || "",
      github: card.getAttribute("data-github") || "",
    };
  }

  function openModalFromCard(card) {
    const data = getCardData(card);

    if (modalTitle) modalTitle.textContent = data.title || "Project";

    if (modalExcerpt) {
      if (!isEmpty(data.excerpt)) {
        modalExcerpt.textContent = data.excerpt;
        modalExcerpt.hidden = false;
      } else {
        modalExcerpt.textContent = "";
        modalExcerpt.hidden = true;
      }
    }

    if (modalDescription) modalDescription.textContent = data.description || data.excerpt || "";

    if (modalCover && modalMedia) {
      if (!isEmpty(data.cover)) {
        modalCover.src = data.cover;
        modalCover.alt = data.title ? `${data.title} cover` : "Project cover";
        modalCover.style.display = "";
        modalMedia.classList.add("fill");
      } else {
        modalCover.removeAttribute("src");
        modalCover.alt = "";
        modalCover.style.display = "none";
        modalMedia.classList.remove("fill");
      }
    }

    if (modalTags) {
      const tags = parseTags(data.tagsRaw);
      if (tags.length) {
        modalTags.innerHTML = tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
        modalTags.hidden = false;
      } else {
        modalTags.innerHTML = "";
        modalTags.hidden = true;
      }
    }

    if (modalRepo) {
      if (!isEmpty(data.github)) {
        modalRepo.href = data.github;
        modalRepo.hidden = false;
      } else {
        modalRepo.href = "#";
        modalRepo.hidden = true;
      }
      modalRepo.onclick = (e) => e.stopPropagation();
    }

    lastFocused = document.activeElement;

    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const dialog = modal.querySelector(".modal-dialog");
    const focusables = dialog ? Array.from(dialog.querySelectorAll(focusableSelector)) : [];
    if (focusables.length) focusables[0].focus();

    document.addEventListener("keydown", onModalKeyDown);
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onModalKeyDown);

    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function onModalKeyDown(e) {
    if (modal.getAttribute("aria-hidden") === "true") return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key === "Tab") {
      const dialog = modal.querySelector(".modal-dialog");
      if (!dialog) return;

      const focusables = Array.from(dialog.querySelectorAll(focusableSelector)).filter(
        (el) => !el.hasAttribute("disabled") && el.getAttribute("tabindex") !== "-1" && isVisible(el)
      );

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  // Open modal on click card (works even with filters)
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (!card || card.style.display === "none") return;
    openModalFromCard(card);
  });

  // Keyboard open modal
  grid.addEventListener("keydown", (e) => {
    const card = e.target.closest(".project-card");
    if (!card || card.style.display === "none") return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModalFromCard(card);
    }
  });

  // Close modal
  modal.addEventListener("click", (e) => {
    const shouldClose = e.target?.getAttribute?.("data-close") === "true";
    if (shouldClose) closeModal();
  });

  // Prevent clicks inside dialog from closing
  const dialog = modal.querySelector(".modal-dialog");
  if (dialog) dialog.addEventListener("click", (e) => e.stopPropagation());
})();
