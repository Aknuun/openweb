/*
 * openweb-ui-v2.js - quick toolbar for the native OpenCode v2 web UI.
 *
 * Adds reasoning/theme/history/settings/refresh to #opencode-titlebar-right.
 * The OpenCode v2 server stores its connection password in localStorage; the
 * history viewer reuses it for /api/session.
 */
(() => {
  "use strict";

  const THEME_KEY = "opencode-color-scheme";
  const SETTINGS_KEY = "settings.v3";
  const SERVER_KEY = "opencode.global.dat:server";

  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="m3 3 18 18"/><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4"/><path d="M9.9 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3 4.2"/><path d="M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.2 3.6-.7"/>',
    gear: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    history: '<path d="M3 12a9 9 0 1 0 2.64-6.36"/><path d="M3 3v6h6"/><path d="M12 7v5l3 2"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>',
  };

  const style = document.createElement("style");
  style.id = "openweb-v2-toolbar-style";
  style.textContent = `
    .openweb-v2-toolbar {
      display: flex;
      align-items: center;
      gap: 1px;
      margin-inline-start: 4px;
    }
    .openweb-v2-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: 0;
      border-radius: 5px;
      background: transparent;
      color: inherit;
      opacity: 0.72;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: background-color 120ms ease, opacity 120ms ease;
    }
    .openweb-v2-btn:hover {
      background: rgba(127, 127, 127, 0.16);
      opacity: 1;
    }
    .openweb-v2-btn:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 1px;
      opacity: 1;
    }
    .openweb-v2-btn svg {
      display: block;
      width: 15px;
      height: 15px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .openweb-v2-usage {
      display: none;
      align-items: center;
      height: 22px;
      padding: 0 6px;
      margin-inline-start: 4px;
      border: 0;
      border-radius: 6px;
      background: rgba(127, 127, 127, 0.1);
      color: inherit;
      opacity: 0.78;
      font: inherit;
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      cursor: pointer;
    }
    .openweb-v2-usage:hover {
      background: rgba(127, 127, 127, 0.18);
      opacity: 1;
    }
    .openweb-v2-usage:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 1px;
      opacity: 1;
    }
    @media (max-width: 640px) {
      .openweb-v2-usage { display: none !important; }
    }
    .openweb-v2-history-total {
      padding: 7px 12px;
      border-bottom: 1px solid rgba(127, 127, 127, 0.2);
      font-size: 11px;
      opacity: 0.78;
      font-variant-numeric: tabular-nums;
    }
    .openweb-v2-history-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2147483645;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 40px 12px;
      background: rgba(0, 0, 0, 0.45);
    }
    .openweb-v2-history {
      width: min(720px, 100%);
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: Canvas;
      color: CanvasText;
      border: 1px solid rgba(127, 127, 127, 0.35);
      border-radius: 12px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    .openweb-v2-history-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(127, 127, 127, 0.25);
    }
    .openweb-v2-history-head h3 {
      flex: 1;
      margin: 0;
      font-size: 13px;
      font-weight: 600;
    }
    .openweb-v2-history-head button {
      padding: 5px 9px;
      border: 0;
      border-radius: 7px;
      background: rgba(127, 127, 127, 0.16);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .openweb-v2-history-head button:hover {
      background: rgba(127, 127, 127, 0.26);
    }
    .openweb-v2-history-list {
      overflow: auto;
      padding: 5px;
    }
    .openweb-v2-history-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
      padding: 7px 9px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }
    .openweb-v2-history-item:hover {
      background: rgba(127, 127, 127, 0.14);
    }
    .openweb-v2-history-item .t {
      font-size: 13px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .openweb-v2-history-item .m {
      font-size: 11px;
      opacity: 0.66;
      direction: ltr;
      text-align: start;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .openweb-v2-history-empty {
      padding: 22px;
      text-align: center;
      opacity: 0.7;
    }
  `;
  document.head.appendChild(style);

  function svg(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[name] + "</svg>";
  }

  function isMac() {
    return /Mac|iPhone|iPad/.test(navigator.platform);
  }

  function findButton(labels) {
    for (const button of document.querySelectorAll("button")) {
      const text = (button.textContent || "").trim();
      const aria = button.getAttribute("aria-label") || "";
      if (labels.includes(text) || labels.includes(aria)) return button;
    }
    return null;
  }

  function loadJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return false;
    }
    try {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: JSON.stringify(value),
          storageArea: localStorage,
        })
      );
    } catch {
      return true;
    }
    return true;
  }

  // ---------- theme ----------
  function currentScheme() {
    const value = document.documentElement.dataset.colorScheme;
    if (value === "light" || value === "dark") return value;
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      // ignore
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyScheme(next) {
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
    document.documentElement.dataset.colorScheme = next;
    document.documentElement.style.colorScheme = next;
    document.documentElement.style.backgroundColor = next === "dark" ? "#080808" : "#fafafa";
    try {
      window.dispatchEvent(
        new StorageEvent("storage", { key: THEME_KEY, newValue: next, storageArea: localStorage })
      );
    } catch {
      // ignore
    }
    syncTheme();
  }

  function syncTheme() {
    const button = document.querySelector('[data-openweb-v2-action="theme"]');
    if (!button) return;
    const dark = currentScheme() === "dark";
    button.innerHTML = svg(dark ? "sun" : "moon");
    button.title = dark ? "حالت روشن" : "حالت تاریک";
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  function toggleScheme() {
    applyScheme(currentScheme() === "dark" ? "light" : "dark");
  }

  // ---------- reasoning ----------
  function reasoningVisible() {
    const data = loadJSON(SETTINGS_KEY, {});
    const thinking = data.general && data.general.timelineDetail && data.general.timelineDetail.thinking;
    return !!(thinking && thinking.details === "expanded");
  }

  function toggleReasoning() {
    const data = loadJSON(SETTINGS_KEY, {});
    if (!data.general || typeof data.general !== "object") data.general = {};
    if (!data.general.timelineDetail || typeof data.general.timelineDetail !== "object") {
      data.general.timelineDetail = {};
    }
    if (!data.general.timelineDetail.thinking || typeof data.general.timelineDetail.thinking !== "object") {
      data.general.timelineDetail.thinking = { placement: "separate" };
    }
    data.general.timelineDetail.thinking.details = reasoningVisible() ? "collapsed" : "expanded";
    saveJSON(SETTINGS_KEY, data);
    syncReasoning();
    // The v2 store may not react to a same-tab storage event; reload to apply.
    setTimeout(() => location.reload(), 120);
  }

  function syncReasoning() {
    const button = document.querySelector('[data-openweb-v2-action="reasoning"]');
    if (!button) return;
    const visible = reasoningVisible();
    button.innerHTML = svg(visible ? "eye" : "eyeOff");
    button.title = visible ? "پنهان کردن استدلال/تفکر" : "نمایش استدلال/تفکر";
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-pressed", visible ? "true" : "false");
  }

  // ---------- settings ----------
  function openSettings() {
    const mac = isMac();
    const event = new KeyboardEvent("keydown", {
      key: ",",
      code: "Comma",
      ctrlKey: !mac,
      metaKey: mac,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    window.dispatchEvent(event);
    setTimeout(() => {
      if (document.body.innerText.includes("Preferences")) return;
      for (const button of document.querySelectorAll("button")) {
        if (!button.offsetParent) continue;
        const text = (button.textContent || "").trim();
        const aria = button.getAttribute("aria-label") || "";
        if (text === "Settings" || aria === "Settings" || text === "تنظیمات" || aria === "تنظیمات") {
          button.click();
          return;
        }
      }
    }, 120);
  }

  // ---------- history ----------
  function serverInfo() {
    const data = loadJSON(SERVER_KEY, {});
    const first = data.list && data.list[0] && data.list[0].http;
    if (first && first.url && first.password) {
      return { url: String(first.url).replace(/\/+$/, ""), password: first.password };
    }
    return { url: location.origin, password: "" };
  }

  function base64(value) {
    try {
      return btoa(unescape(encodeURIComponent(value)));
    } catch {
      return "";
    }
  }

  function authHeader() {
    return "Basic " + base64("opencode:" + serverInfo().password);
  }

  function serverSegment() {
    const match = /^\/server\/([^/]+)\//.exec(location.pathname);
    if (match) return match[1];
    return base64(serverInfo().url).replace(/=+$/, "");
  }

  function sessionRoute(session) {
    return "/server/" + serverSegment() + "/session/" + encodeURIComponent(session.id);
  }

  function closeHistory() {
    document.querySelectorAll("[data-openweb-v2-history]").forEach((node) => node.remove());
    document.removeEventListener("keydown", onHistoryKey);
  }

  function onHistoryKey(event) {
    if (event.key === "Escape") closeHistory();
  }

  function formatTime(value) {
    if (!value) return "";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return "";
    }
  }

  function formatCost(value) {
    const cost = Number(value) || 0;
    return "$" + cost.toFixed(4);
  }

  function formatCostShort(value) {
    const cost = Number(value) || 0;
    return "$" + cost.toFixed(2);
  }

  function formatTokens(value) {
    const num = Number(value) || 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(num);
  }

  function currentSessionId() {
    const match = /\/session\/([^/?#]+)\/?$/.exec(location.pathname);
    if (!match) return "";
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  function sessionTokens(session) {
    const tokens = (session && session.tokens) || {};
    return (Number(tokens.input) || 0) + (Number(tokens.output) || 0) + (Number(tokens.reasoning) || 0);
  }

  function renderUsagePill(list) {
    const pill = document.querySelector("[data-openweb-v2-usage]");
    if (!pill) return;
    if (!Array.isArray(list) || list.length === 0) {
      pill.style.display = "none";
      return;
    }

    let totalTokens = 0;
    let totalCost = 0;
    for (const session of list) {
      totalTokens += sessionTokens(session);
      totalCost += Number(session.cost) || 0;
    }

    const id = currentSessionId();
    const current = id ? list.find((session) => session.id === id) : null;
    pill.style.display = "inline-flex";
    pill.textContent = "Σ " + formatTokens(totalTokens) + " · " + formatCostShort(totalCost);
    pill.title = current
      ? "این سشن: " + formatTokens(sessionTokens(current)) + " · " + formatCost(current.cost) +
        " / مجموع: " + formatTokens(totalTokens) + " · " + formatCostShort(totalCost)
      : "مجموع همه سشن‌ها: " + formatTokens(totalTokens) + " · " + formatCostShort(totalCost);
  }

  let usageAt = 0;

  function refreshUsage() {
    const server = serverInfo();
    if (!server.password) return;
    const now = Date.now();
    if (now - usageAt < 20000) return;
    usageAt = now;
    fetch(server.url + "/api/session", {
      headers: { Accept: "application/json", Authorization: authHeader() },
      credentials: "same-origin",
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) renderUsagePill(Array.isArray(data) ? data : data.data || []);
      })
      .catch(() => {});
  }

  function renderHistory(list) {
    closeHistory();
    const backdrop = document.createElement("div");
    backdrop.className = "openweb-v2-history-backdrop";
    backdrop.dataset.openwebV2History = "";
    backdrop.dir = "rtl";

    const panel = document.createElement("div");
    panel.className = "openweb-v2-history";

    const head = document.createElement("div");
    head.className = "openweb-v2-history-head";
    const title = document.createElement("h3");
    title.textContent = "سشن‌های OpenCode (شامل CLI)";
    const refresh = document.createElement("button");
    refresh.type = "button";
    refresh.textContent = "به‌روزرسانی";
    refresh.addEventListener("click", () => {
      closeHistory();
      openHistory();
    });
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "بستن";
    close.addEventListener("click", closeHistory);
    head.append(title, refresh, close);

    const body = document.createElement("div");
    body.className = "openweb-v2-history-list";
    if (!Array.isArray(list) || list.length === 0) {
      const empty = document.createElement("div");
      empty.className = "openweb-v2-history-empty";
      empty.textContent = "سشنی پیدا نشد.";
      body.appendChild(empty);
    } else {
      list
        .slice()
        .sort((a, b) => Number(b.time && b.time.updated) - Number(a.time && a.time.updated))
        .forEach((session) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "openweb-v2-history-item";
          const name = document.createElement("span");
          name.className = "t";
          name.dir = "auto";
          name.textContent = session.title || session.id || "بدون عنوان";
          const meta = document.createElement("span");
          meta.className = "m";
          const directory = (session.location && session.location.directory) || session.directory || "";
          const updated = session.time && (session.time.updated || session.time.created);
          meta.textContent = [directory, formatTime(updated), formatCost(session.cost)].filter(Boolean).join(" · ");
          item.append(name, meta);
          item.addEventListener("click", () => {
            location.href = sessionRoute(session);
          });
          body.appendChild(item);
        });
    }

    let totalTokens = 0;
    let totalCost = 0;
    for (const session of Array.isArray(list) ? list : []) {
      totalTokens += sessionTokens(session);
      totalCost += Number(session.cost) || 0;
    }
    const totals = document.createElement("div");
    totals.className = "openweb-v2-history-total";
    totals.textContent = "مجموع: " + formatTokens(totalTokens) + " توکن · " + formatCostShort(totalCost);

    panel.append(head, totals, body);
    backdrop.appendChild(panel);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeHistory();
    });
    document.body.appendChild(backdrop);
    document.addEventListener("keydown", onHistoryKey);
  }

  function openHistory() {
    const server = serverInfo();
    if (!server.password) {
      window.alert("اول به سرور وصل شو.");
      return;
    }
    fetch(server.url + "/api/session", {
      headers: { Accept: "application/json", Authorization: authHeader() },
      credentials: "same-origin",
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        renderUsagePill(list);
        renderHistory(list);
      })
      .catch(() => window.alert("خطا در خواندن سشن‌ها"));
  }

  // ---------- toolbar ----------
  function actionButton({ action, title, icon, onClick }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "openweb-v2-btn";
    button.dataset.openwebV2Action = action;
    button.title = title;
    button.setAttribute("aria-label", title);
    button.innerHTML = svg(icon);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick(event);
    });
    return button;
  }

  function buildToolbar() {
    const bar = document.createElement("div");
    bar.className = "openweb-v2-toolbar";
    bar.dataset.openwebV2Toolbar = "";
    bar.dir = "ltr";
    const usage = document.createElement("button");
    usage.type = "button";
    usage.className = "openweb-v2-usage";
    usage.dataset.openwebV2Usage = "";
    usage.title = "مصرف و هزینهٔ سشن‌ها";
    usage.addEventListener("click", openHistory);
    bar.appendChild(usage);
    bar.append(
      actionButton({
        action: "reasoning",
        title: "نمایش استدلال/تفکر",
        icon: "eyeOff",
        onClick: toggleReasoning,
      }),
      actionButton({ action: "theme", title: "تغییر تم", icon: "moon", onClick: toggleScheme }),
      actionButton({
        action: "history",
        title: "تاریخچهٔ سشن‌ها (شامل CLI)",
        icon: "history",
        onClick: openHistory,
      }),
      actionButton({ action: "settings", title: "تنظیمات", icon: "gear", onClick: openSettings }),
      actionButton({
        action: "reload",
        title: "بارگذاری مجدد صفحه",
        icon: "refresh",
        onClick: () => location.reload(),
      })
    );
    return bar;
  }

  function ensureToolbar() {
    const right = document.getElementById("opencode-titlebar-right");
    if (!right) return;
    if (!serverInfo().password) return;
    let bar = document.querySelector("[data-openweb-v2-toolbar]");
    if (!bar) bar = buildToolbar();
    if (bar.parentElement !== right) right.appendChild(bar);
    syncTheme();
    syncReasoning();
    refreshUsage();
  }

  new MutationObserver(syncTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-color-scheme"],
  });
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_KEY) syncTheme();
    if (event.key === SETTINGS_KEY) syncReasoning();
  });

  setInterval(ensureToolbar, 800);
  ensureToolbar();
})();
