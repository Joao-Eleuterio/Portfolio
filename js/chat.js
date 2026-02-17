// static/sitebert/js/chat.js
(function () {
  const root = document.getElementById("chatx");
  if (!root) return;

  const endpoint = root.dataset.endpoint || "/chat/ask/";
  const knowledgeEndpoint = root.dataset.knowledgeEndpoint || "/chat/knowledge/";

  // Elements
  const tabsEl = document.getElementById("chatTabs");
  const addTabBtn = document.getElementById("addTab");
  const downloadBtn = document.getElementById("downloadBtn");
  const chatBody = document.getElementById("chatBody");
  const emptyEl = document.getElementById("cxEmpty");
  const chatForm = document.getElementById("chatForm");
  const chatField = document.getElementById("chatField");
  const sendBtn = document.getElementById("sendBtn");

  // Modal elements
  const readSourceBtn = document.getElementById("cxReadSource");
  const modal = document.getElementById("cxModal");
  const modalBody = document.getElementById("cxModalBody");

  if (!tabsEl || !addTabBtn || !downloadBtn || !chatBody || !chatForm || !chatField || !sendBtn) return;

  // Storage
  const STORE_KEY = "chatx:tabs:v7";
  let tabs = loadTabs();
  if (!Array.isArray(tabs) || !tabs.length) {
    tabs = [makeTab("Chat 1")];
    saveTabs();
  }
  let activeId = tabs[0].id;

  // Init
  renderTabs();
  renderActiveConversation();
  autoGrow();

  // Tabs events
  addTabBtn.addEventListener("click", () => {
    const tab = makeTab(`Chat ${tabs.length + 1}`);
    tabs.push(tab);
    setActive(tab.id);
  });

  tabsEl.addEventListener("click", (e) => {
    const item = e.target.closest("li[data-id]");
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.closest(".cx-tab__close")) {
      closeTab(id);
      return;
    }
    setActive(id);
  });

  tabsEl.addEventListener("dblclick", (e) => {
    const item = e.target.closest("li[data-id]");
    if (!item) return;
    const id = item.dataset.id;
    const tab = tabs.find(t => t.id === id);
    if (!tab) return;

    const name = prompt("Rename chat:", tab.title);
    if (name && name.trim()) {
      tab.title = name.trim().slice(0, 60);
      saveTabs();
      renderTabs();
    }
  });

  // Composer events
  chatField.addEventListener("input", autoGrow);
  chatField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  });
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    onSend();
  });

  function autoGrow() {
    chatField.style.height = "auto";
    chatField.style.height = Math.min(chatField.scrollHeight, 220) + "px";
  }

  async function onSend() {
    const q = (chatField.value || "").trim();
    if (!q) return;

    appendMsg("user", q);
    chatField.value = "";
    autoGrow();

    const typing = appendTyping();
    setSending(true);

    try {
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.set("question", q);
      url.searchParams.set("lang", "en");

      const res = await fetch(url.toString(), { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const ans = (data && typeof data.answer === "string")
        ? data.answer
        : "Sorry, I couldn’t answer that.";

      removeTyping(typing);
      appendMsg("bot", ans);
    } catch {
      removeTyping(typing);
      appendMsg("bot", "A network error occurred or the endpoint is unavailable.");
    } finally {
      setSending(false);
      scrollBottom();
    }
  }

  function setSending(on) {
    sendBtn.disabled = on;
    chatField.disabled = on;
    sendBtn.textContent = on ? "Asking…" : "Ask";
  }

  // Download
  downloadBtn.addEventListener("click", () => {
    const tab = getActive();
    const lines = [];
    lines.push(`# ${tab.title}`);
    lines.push(`Exported: ${new Date().toISOString()}`);
    lines.push("");

    tab.messages.forEach(m => {
      const who = m.role === "user" ? "You" : (m.role === "bot" ? "Assistant" : "System");
      const when = new Date(m.ts || Date.now()).toLocaleString();
      lines.push(`[${when}] ${who}:`);
      lines.push(m.text);
      lines.push("");
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitize(tab.title)}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
  });

  // Render tabs
  function renderTabs() {
    tabsEl.innerHTML = "";
    tabs.forEach(t => {
      const li = document.createElement("li");
      li.className = "cx-tab";
      li.dataset.id = t.id;
      li.setAttribute("role", "tab");
      li.setAttribute("aria-selected", t.id === activeId ? "true" : "false");

      const label = document.createElement("span");
      label.className = "cx-tab__label";
      label.textContent = t.title;

      const close = document.createElement("button");
      close.type = "button";
      close.className = "cx-tab__close";
      close.title = "Close";
      close.setAttribute("aria-label", "Close");
      close.textContent = "×";

      li.appendChild(label);
      li.appendChild(close);
      tabsEl.appendChild(li);
    });
  }

  function setActive(id) {
    if (!id || id === activeId) return;
    activeId = id;
    renderTabs();
    renderActiveConversation();
  }

  function closeTab(id) {
    const idx = tabs.findIndex(t => t.id === id);
    if (idx === -1) return;

    tabs.splice(idx, 1);
    if (!tabs.length) tabs.push(makeTab("Chat 1"));

    activeId = tabs[Math.max(0, idx - 1)].id;
    saveTabs();

    renderTabs();
    renderActiveConversation();
  }

  function renderActiveConversation() {
    chatBody.innerHTML = "";
    const tab = getActive();

    if (!tab.messages.length) {
      if (emptyEl && emptyEl.parentNode !== root) {
        root.insertBefore(emptyEl, chatBody);
      }
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl && emptyEl.parentNode) {
      emptyEl.parentNode.removeChild(emptyEl);
    }

    tab.messages.forEach(m => appendMsg(m.role, m.text, false, m.ts));
    scrollBottom();
  }

  function appendMsg(role, text, persist = true, ts = Date.now()) {
    if (emptyEl && emptyEl.parentNode) {
      emptyEl.parentNode.removeChild(emptyEl);
    }

    const row = document.createElement("div");
    row.className = `cx-msg cx-msg--${role}`;

    const bubble = document.createElement("div");
    bubble.className = "cx-bubble";
    bubble.textContent = text;

    row.appendChild(bubble);
    chatBody.appendChild(row);

    if (persist) {
      const tab = getActive();
      tab.messages.push({ role, text, ts });
      if (tab.messages.length > 300) tab.messages = tab.messages.slice(-300);
      saveTabs();
    }
    return row;
  }

  function appendTyping() {
    if (emptyEl && emptyEl.parentNode) {
      emptyEl.parentNode.removeChild(emptyEl);
    }

    const row = document.createElement("div");
    row.className = "cx-msg cx-msg--bot cx-typing";

    const bubble = document.createElement("div");
    bubble.className = "cx-bubble";
    bubble.innerHTML = '<span class="cx-dot"></span><span class="cx-dot"></span><span class="cx-dot"></span>';

    row.appendChild(bubble);
    chatBody.appendChild(row);
    scrollBottom();
    return row;
  }

  function removeTyping(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  function scrollBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // ===== Source modal =====
  let cachedSource = null;

  function openModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  async function loadSourceText() {
    if (cachedSource !== null) return cachedSource;
    if (!modalBody) return "";

    modalBody.textContent = "Loading…";
    try {
      const url = new URL(knowledgeEndpoint, window.location.origin);
      url.searchParams.set("lang", "en");

      const res = await fetch(url.toString(), { method: "GET" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      cachedSource = (data && typeof data.bert_text === "string") ? data.bert_text : "";
      return cachedSource;
    } catch {
      cachedSource = "";
      return "";
    }
  }

  if (readSourceBtn && modal && modalBody) {
    readSourceBtn.addEventListener("click", async () => {
      openModal();
      const text = await loadSourceText();
      modalBody.textContent = text || "No source text found (bert_text is empty).";
    });

    modal.addEventListener("click", (e) => {
      const shouldClose = e.target?.getAttribute?.("data-close") === "true";
      if (shouldClose) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (modal.getAttribute("aria-hidden") === "false" && e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    });
  }

  // Storage helpers
  function makeTab(title) {
    return { id: "t" + Math.random().toString(36).slice(2, 9), title, messages: [] };
  }
  function getActive() {
    return tabs.find(t => t.id === activeId) || tabs[0];
  }
  function loadTabs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
    catch { return []; }
  }
  function saveTabs() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(tabs)); }
    catch {}
  }
  function sanitize(s) {
    return (s || "chat").replace(/[\\\/:*?"<>|]+/g, "_").slice(0, 80);
  }
})();
