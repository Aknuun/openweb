/*
 * openweb-ui.js - optional UI helpers for openweb (OpenCode Web).
 *
 * Adapted from CodeHub (https://github.com/Aknuun/codehub), MIT licensed.
 * The feature flags below are injected by openweb at install time.
 */
(() => {
  "use strict";

  const FEATURES = Object.assign(
    {
      usage: true,
      reasoning: true,
      theme: true,
      history: true,
      rtl: true,
      enter: true,
      settings: true,
      refresh: true,
      progress: true,
      sync: true,
    },
    window.__OPENWEB_FEATURES__ || {}
  );

  const FEATURE_KEYS = ["usage", "reasoning", "theme", "history", "rtl", "enter", "settings", "refresh", "progress", "sync"];
  if (!FEATURE_KEYS.some((key) => FEATURES[key])) return;

  const THEME_KEY = "opencode-color-scheme";
  const REASONING_KEY = "openweb.reasoning.visible.v1";
  const SETTINGS_KEY = "settings.v3";
  const SETTINGS_LABELS = ["Settings", "تنظیمات"];

  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="m3 3 18 18"/><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4"/><path d="M9.9 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3 4.2"/><path d="M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.2 3.6-.7"/>',
    gear: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    history: '<path d="M3 12a9 9 0 1 0 2.64-6.36"/><path d="M3 3v6h6"/><path d="M12 7v5l3 2"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>',
  };

  function svg(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[name] + "</svg>";
  }

  const style = document.createElement("style");
  style.id = "openweb-ui-style";
  style.textContent = `
    .openweb-toolbar {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-inline-start: 4px;
    }
    .openweb-tb-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      opacity: 0.72;
      cursor: pointer;
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
      transition: background-color 120ms ease, opacity 120ms ease, color 120ms ease;
    }
    .openweb-tb-btn:hover {
      background: rgba(127, 127, 127, 0.16);
      opacity: 1;
    }
    .openweb-tb-btn:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 1px;
      opacity: 1;
    }
    .openweb-tb-btn svg {
      display: block;
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .openweb-toolbar-float {
      position: fixed;
      top: 8px;
      right: 8px;
      z-index: 2147483000;
      padding: 2px;
      border-radius: 8px;
      background: Canvas;
      color: CanvasText;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.28);
    }
    .openweb-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      z-index: 2147483646;
      pointer-events: none;
      overflow: hidden;
      opacity: 0;
      transition: opacity 150ms ease;
    }
    .openweb-progress.on {
      opacity: 1;
    }
    .openweb-progress::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, #6ea8fe, transparent);
      transform: translateX(-100%);
    }
    .openweb-progress.on::before {
      animation: openweb-progress 1.1s ease-in-out infinite;
    }
    @keyframes openweb-progress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .openweb-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.35);
      color: #fff;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
      font-size: 14px;
      backdrop-filter: blur(1.5px);
      cursor: progress;
    }
    .openweb-overlay[hidden] {
      display: none;
    }
    .openweb-overlay-box {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      border-radius: 12px;
      background: rgba(20, 22, 28, 0.92);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
    }
    .openweb-spinner {
      width: 18px;
      height: 18px;
      flex: none;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.25);
      border-top-color: #6ea8fe;
      animation: openweb-spin 0.8s linear infinite;
    }
    @keyframes openweb-spin {
      to { transform: rotate(360deg); }
    }
    .openweb-history-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2147483645;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 40px 12px;
      background: rgba(0, 0, 0, 0.45);
    }
    .openweb-history {
      width: min(720px, 100%);
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: Canvas;
      color: CanvasText;
      border: 1px solid rgba(127, 127, 127, 0.35);
      border-radius: 14px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    .openweb-history-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(127, 127, 127, 0.25);
    }
    .openweb-history-head h3 {
      flex: 1;
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }
    .openweb-history-head button {
      padding: 6px 10px;
      border: 0;
      border-radius: 8px;
      background: rgba(127, 127, 127, 0.16);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .openweb-history-head button:hover {
      background: rgba(127, 127, 127, 0.26);
    }
    .openweb-history-list {
      overflow: auto;
      padding: 6px;
    }
    .openweb-history-item {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      padding: 3px;
      border-radius: 10px;
    }
    .openweb-history-item:hover {
      background: rgba(127, 127, 127, 0.14);
    }
    .openweb-history-open {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 7px 9px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }
    .openweb-history-item .t {
      font-size: 13px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .openweb-history-item .m {
      font-size: 11px;
      opacity: 0.66;
      direction: ltr;
      text-align: start;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .openweb-history-del {
      flex: none;
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      opacity: 0.55;
      cursor: pointer;
    }
    .openweb-history-del:hover {
      color: #f87171;
      background: rgba(248, 113, 113, 0.14);
      opacity: 1;
    }
    .openweb-history-del svg {
      width: 15px;
      height: 15px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .openweb-history-empty {
      padding: 24px;
      text-align: center;
      opacity: 0.7;
    }
    html.openweb-hide-reasoning [data-component="reasoning-part"],
    html.openweb-hide-reasoning [data-component="session-turn"] [data-slot="session-turn-thinking"] {
      display: none !important;
    }
    html.openweb-reasoning-boundary [data-component="reasoning-part"] {
      margin-block: 4px;
      padding-inline-start: 9px;
      border-inline-start: 3px solid rgba(127, 127, 127, 0.28);
      opacity: 0.9;
    }
    .openweb-composer-meta {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 0 0 8px;
      direction: rtl;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    .openweb-usage-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 0 4px;
      font-size: 11px;
      line-height: 1.6;
      opacity: 0.85;
      white-space: nowrap;
    }
    .openweb-usage-values {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .openweb-usage-row .label {
      opacity: 0.8;
    }
    .openweb-usage-row .cost {
      direction: ltr;
      unicode-bidi: embed;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);

  let showOverlay = () => {};
  let hideOverlay = () => {};

  if (FEATURES.progress) {
    const progressBar = document.createElement("div");
    progressBar.className = "openweb-progress";
    document.body.appendChild(progressBar);

    const overlay = document.createElement("div");
    overlay.className = "openweb-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="openweb-overlay-box"><span class="openweb-spinner"></span><span data-openweb-overlay-text></span></div>';
    document.body.appendChild(overlay);
    const overlayText = overlay.querySelector("[data-openweb-overlay-text]");
    let overlayTimer = null;
    let overlayHintTimer = null;

    showOverlay = (text) => {
      if (!overlayText) return;
      overlayText.textContent = text;
      overlay.hidden = false;
      clearTimeout(overlayTimer);
      clearTimeout(overlayHintTimer);
      overlayHintTimer = setTimeout(() => {
        if (!overlay.hidden && overlayText) {
          overlayText.textContent = "هنوز در حال بارگذاری است… کمی صبر کنید";
        }
      }, 8000);
      overlayTimer = setTimeout(hideOverlay, 45000);
    };

    hideOverlay = () => {
      overlay.hidden = true;
      clearTimeout(overlayTimer);
      clearTimeout(overlayHintTimer);
    };

    overlay.addEventListener("click", hideOverlay);

    let pending = 0;
    let progressShowTimer = null;
    let progressHideTimer = null;

    const beginRequest = () => {
      pending += 1;
      if (pending === 1) {
        clearTimeout(progressShowTimer);
        clearTimeout(progressHideTimer);
        progressShowTimer = setTimeout(() => {
          if (pending > 0) progressBar.classList.add("on");
        }, 180);
      }
    };

    const endRequest = () => {
      pending = Math.max(0, pending - 1);
      if (pending === 0) {
        clearTimeout(progressShowTimer);
        clearTimeout(progressHideTimer);
        progressHideTimer = setTimeout(() => progressBar.classList.remove("on"), 200);
      }
    };

    if (typeof window.fetch === "function" && !window.fetch.__openwebWrapped) {
      const originalFetch = window.fetch;
      const wrappedFetch = function (...args) {
        beginRequest();
        let result;
        try {
          result = originalFetch.apply(this, args);
        } catch (error) {
          endRequest();
          throw error;
        }
        if (result && typeof result.then === "function") {
          result.then(endRequest, endRequest);
        } else {
          endRequest();
        }
        return result;
      };
      wrappedFetch.__openwebWrapped = true;
      window.fetch = wrappedFetch;
    }

    const NEW_SESSION_RE = /(new\s*session|new\s*chat|سشن\s*جدید|گفتگوی?\s*جدید|چت\s*جدید)/i;
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const element = target.closest("button, a, [role='button']");
        if (!element) return;
        const label = [
          element.getAttribute("aria-label"),
          element.getAttribute("title"),
          element.getAttribute("data-testid"),
          element.textContent,
        ]
          .filter(Boolean)
          .join(" ");
        if (!NEW_SESSION_RE.test(label)) return;

        showOverlay("در حال باز کردن سشن جدید…");
        const start = location.pathname + location.search;
        const watcher = setInterval(() => {
          if (location.pathname + location.search !== start) {
            clearInterval(watcher);
            setTimeout(hideOverlay, 400);
          }
        }, 120);
        setTimeout(() => clearInterval(watcher), 45000);
      },
      true
    );
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

  function sessionUpdated(session) {
    const time = session && session.time;
    return (time && (time.updated || time.created)) || session.updated || session.created || 0;
  }

  function formatTime(ms) {
    if (!ms) return "";
    try {
      return new Date(ms).toLocaleString();
    } catch {
      return "";
    }
  }

  function formatTokens(value) {
    const num = Number(value) || 0;
    try {
      return num.toLocaleString();
    } catch {
      return String(num);
    }
  }

  function formatCost(value) {
    return "$" + (Number(value) || 0).toFixed(4);
  }

  function sessionRoute(session) {
    const id = encodeURIComponent(session.id);
    let dir = session.path;
    if (!dir && session.directory) dir = String(session.directory).replace(/^\/+/, "");
    dir = String(dir || "").replace(/^\/+|\/+$/g, "");
    if (!dir) return { route: "/session/" + id, hasDir: false };
    return {
      route: "/" + dir.split("/").filter(Boolean).map(encodeURIComponent).join("/") + "/session/" + id,
      hasDir: true,
    };
  }

  function openSession(session) {
    const { route, hasDir } = sessionRoute(session);
    closeHistory();
    hideOverlay();
    if (hasDir) {
      location.href = route;
      return;
    }
    try {
      history.pushState({}, "", route);
      window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
    } catch {
      location.href = route;
    }
  }

  function sessionWithDescendants(session, sessions) {
    const all = Array.isArray(sessions) && sessions.length ? sessions : [session];
    const byParent = new Map();
    for (const item of all) {
      const parent = item && (item.parentID || item.parentId);
      if (!parent) continue;
      if (!byParent.has(parent)) byParent.set(parent, []);
      byParent.get(parent).push(item);
    }
    const out = [];
    const seen = new Set();
    const queue = [session];
    while (queue.length) {
      const item = queue.shift();
      if (!item || seen.has(item.id)) continue;
      seen.add(item.id);
      out.push(item);
      const children = byParent.get(item.id) || [];
      queue.push(...children);
    }
    return out;
  }

  function deleteSessionRequest(session) {
    let url = "/session/" + encodeURIComponent(session.id);
    const directory = session.directory || "";
    if (directory) url += "?directory=" + encodeURIComponent(directory);
    return fetch(url, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    }).then((response) => {
      if (response.ok || response.status === 404) return true;
      return response
        .text()
        .catch(() => "")
        .then((text) => {
          throw new Error("HTTP " + response.status + (text ? ": " + text.slice(0, 120) : ""));
        });
    });
  }

  function deleteSession(session, sessions, after) {
    if (!session || !session.id) return;
    const targets = sessionWithDescendants(session, sessions);
    const name = session.title || session.id;
    const extra = targets.length > 1 ? ` و ${targets.length - 1} زیرسشن` : "";
    if (!window.confirm(`سشن «${name}»${extra} برای همیشه حذف شود؟`)) return;

    showOverlay("در حال حذف سشن…");
    Promise.all(
      targets.map((item) =>
        deleteSessionRequest(item)
          .then(() => true)
          .catch((error) => {
            console.error("delete session failed:", item.id, error);
            return false;
          })
      )
    ).then((results) => {
      hideOverlay();
      const failed = results.filter((ok) => !ok).length;
      const currentId = currentSessionId();
      const deletedCurrent = targets.some((item, index) => item.id === currentId && results[index]);
      if (deletedCurrent) {
        location.href = "/";
        return;
      }
      if (failed) {
        window.alert(failed === targets.length ? "حذف سشن ناموفق بود" : "بعضی سشن‌ها حذف نشدند");
      }
      if (after) after();
    });
  }

  function installEnterHandler() {
    if (window.__openwebEnterHandler) return;
    window.__openwebEnterHandler = true;

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Enter" || event.isComposing) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const editor = target.closest('[data-component="prompt-input"]');
        if (!editor) return;
        if (document.querySelector("[data-suggestion-id]")) return;

        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          event.stopPropagation();
          if (isBusy()) return;
          const send = document.querySelector('button[data-action="prompt-submit"]');
          if (send && !send.disabled) send.click();
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        let inserted = false;
        try {
          inserted = document.execCommand("insertLineBreak");
        } catch {
          inserted = false;
        }
        if (inserted) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const br = document.createElement("br");
        range.insertNode(br);
        range.setStartAfter(br);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        editor.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertLineBreak" }));
      },
      true
    );
  }

  function ensureBidi() {
    document.querySelectorAll('[data-component="prompt-input"]').forEach((el) => {
      if (el.getAttribute("dir") !== "auto") el.setAttribute("dir", "auto");
    });
  }

  function isBusy() {
    const send = document.querySelector('button[data-action="prompt-submit"]');
    if (send && /stop|توقف/i.test(send.getAttribute("aria-label") || "")) return true;
    return !!document.querySelector('button[data-action="prompt-stop"], button[aria-label="Stop"]');
  }

  let metaEl = null;
  let usageValues = null;
  let usageSession = null;
  let usageSessionId = "";
  let usageAt = 0;

  function ensureComposerMeta() {
    const form = document.querySelector('[data-component="prompt-input-v2"]');
    const box = form && form.closest("div.flex.flex-col.gap-3");
    const id = currentSessionId();
    if (!id || !form || !box || !box.parentElement) {
      if (metaEl) {
        metaEl.remove();
        metaEl = null;
        usageValues = null;
      }
      return null;
    }
    if (!metaEl) {
      metaEl = document.createElement("div");
      metaEl.className = "openweb-composer-meta";
      metaEl.dataset.openwebMeta = "";
      const usageRow = document.createElement("div");
      usageRow.className = "openweb-usage-row";
      usageValues = document.createElement("span");
      usageValues.className = "openweb-usage-values";
      usageRow.append(usageValues);
      metaEl.append(usageRow);
    }
    if (metaEl.parentElement !== box.parentElement || metaEl.nextSibling !== box) {
      box.parentElement.insertBefore(metaEl, box);
    }
    return metaEl;
  }

  function renderUsage() {
    if (!usageValues) return;
    usageValues.textContent = "";
    if (!usageSession) return;
    const tokens = usageSession.tokens || {};
    const cache = tokens.cache || {};
    const input = Number(tokens.input) || 0;
    const output = Number(tokens.output) || 0;
    const reasoning = Number(tokens.reasoning) || 0;
    const cacheRead = Number(cache.read) || 0;
    const cacheWrite = Number(cache.write) || 0;
    const used = input + output + reasoning;
    const cost = Number(usageSession.cost) || 0;

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = "توکن مصرفی:";
    const count = document.createElement("span");
    count.textContent = formatTokens(used);
    const unit = document.createElement("span");
    unit.textContent = " · هزینه:";
    const price = document.createElement("span");
    price.className = "cost";
    price.textContent = formatCost(cost);
    usageValues.append(label, count, unit, price);
    usageValues.title =
      "ورودی " + formatTokens(input) +
      " · خروجی " + formatTokens(output) +
      " · استدلال " + formatTokens(reasoning) +
      " · کش " + formatTokens(cacheRead + cacheWrite);
  }

  function ensureUsage() {
    const id = currentSessionId();
    if (!id) {
      if (metaEl) metaEl.remove();
      metaEl = null;
      usageValues = null;
      return;
    }
    if (!ensureComposerMeta()) return;
    renderUsage();
  }

  function updateUsage(session) {
    usageSession = session;
    usageSessionId = currentSessionId();
    renderUsage();
  }

  function refreshUsage() {
    const id = currentSessionId();
    if (!id) return;
    const now = Date.now();
    if (id === usageSessionId && now - usageAt < 4000) return;
    usageAt = now;
    fetch("/session/" + encodeURIComponent(id), {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((session) => {
        if (session && currentSessionId() === id) updateUsage(session);
      })
      .catch(() => {});
  }

  function reasoningVisible() {
    try {
      return localStorage.getItem(REASONING_KEY) === "1";
    } catch {
      return false;
    }
  }

  function reasoningSettingEnabled() {
    try {
      const data = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      return !!(data && data.general && data.general.showReasoningSummaries);
    } catch {
      return false;
    }
  }

  function enableReasoningSetting() {
    try {
      const data = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      if (!data || typeof data !== "object") return false;
      if (!data.general || typeof data.general !== "object") data.general = {};
      if (data.general.showReasoningSummaries === true) return false;
      data.general.showReasoningSummaries = true;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  function applyReasoning() {
    const visible = reasoningVisible();
    document.documentElement.classList.toggle("openweb-hide-reasoning", !visible);
    document.documentElement.classList.add("openweb-reasoning-boundary");
    const button = document.querySelector('[data-openweb-action="reasoning"]');
    if (!button) return;
    button.innerHTML = svg(visible ? "eye" : "eyeOff");
    button.title = visible ? "پنهان کردن خلاصهٔ استدلال‌ها" : "نمایش خلاصهٔ استدلال‌ها";
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-pressed", visible ? "true" : "false");
  }

  function toggleReasoning() {
    const next = !reasoningVisible();
    try {
      localStorage.setItem(REASONING_KEY, next ? "1" : "0");
    } catch {
      return;
    }
    if (next) {
      const changed = enableReasoningSetting();
      applyReasoning();
      const hasReasoning = document.querySelector('[data-component="reasoning-part"]');
      if (changed && !hasReasoning) {
        location.reload();
        return;
      }
      return;
    }
    applyReasoning();
  }

  function bootstrapReasoning() {
    if (!reasoningVisible()) {
      applyReasoning();
      return;
    }
    if (reasoningSettingEnabled()) {
      applyReasoning();
      return;
    }
    try {
      if (sessionStorage.getItem("openweb.reasoning.boot") === "1") {
        applyReasoning();
        return;
      }
      sessionStorage.setItem("openweb.reasoning.boot", "1");
    } catch {
      applyReasoning();
      return;
    }
    if (enableReasoningSetting()) {
      location.reload();
      return;
    }
    applyReasoning();
  }

  function currentScheme() {
    const value = document.documentElement.dataset.colorScheme;
    if (value === "dark" || value === "light") return value;
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  }

  function applyScheme(next) {
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      return;
    }
    document.documentElement.dataset.colorScheme = next;
    document.documentElement.style.backgroundColor = next === "dark" ? "#080808" : "#fafafa";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#080808" : "#fafafa");
    try {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: THEME_KEY,
          newValue: next,
          storageArea: localStorage,
        })
      );
    } catch {
      return;
    }
  }

  function syncTheme() {
    const button = document.querySelector('[data-openweb-action="theme"]');
    if (!button) return;
    const dark = currentScheme() === "dark";
    button.innerHTML = svg(dark ? "sun" : "moon");
    button.title = dark ? "حالت روشن" : "حالت تاریک";
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  function toggleScheme() {
    applyScheme(currentScheme() === "dark" ? "light" : "dark");
    syncTheme();
  }

  function findButton(labels) {
    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
      if (labels.includes((button.textContent || "").trim())) return button;
    }
    return null;
  }

  function openSettings() {
    const button = findButton(SETTINGS_LABELS);
    if (button) {
      button.click();
      return;
    }
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: ",",
        code: "Comma",
        ctrlKey: !isMac,
        metaKey: isMac,
        bubbles: true,
      })
    );
  }

  function closeHistory() {
    document.querySelectorAll("[data-openweb-history]").forEach((node) => node.remove());
    document.removeEventListener("keydown", onHistoryKey);
  }

  function onHistoryKey(event) {
    if (event.key === "Escape") closeHistory();
  }

  function renderHistory(list) {
    closeHistory();
    const backdrop = document.createElement("div");
    backdrop.className = "openweb-history-backdrop";
    backdrop.dataset.openwebHistory = "";
    backdrop.dir = "rtl";

    const panel = document.createElement("div");
    panel.className = "openweb-history";

    const head = document.createElement("div");
    head.className = "openweb-history-head";
    const title = document.createElement("h3");
    title.textContent = "سشن‌های OpenCode (شامل تاریخچهٔ CLI)";
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
    body.className = "openweb-history-list";
    if (!Array.isArray(list) || list.length === 0) {
      const empty = document.createElement("div");
      empty.className = "openweb-history-empty";
      empty.textContent = "سشنی پیدا نشد.";
      body.appendChild(empty);
    } else {
      list
        .slice()
        .sort((a, b) => sessionUpdated(b) - sessionUpdated(a))
        .forEach((session) => {
          const item = document.createElement("div");
          item.className = "openweb-history-item";
          const open = document.createElement("button");
          open.type = "button";
          open.className = "openweb-history-open";
          const name = document.createElement("span");
          name.className = "t";
          name.textContent = session.title || session.id || "بدون عنوان";
          const meta = document.createElement("span");
          meta.className = "m";
          meta.textContent = [session.directory || "", formatTime(sessionUpdated(session))]
            .filter(Boolean)
            .join(" · ");
          open.append(name, meta);
          open.addEventListener("click", () => openSession(session));
          const del = document.createElement("button");
          del.type = "button";
          del.className = "openweb-history-del";
          del.title = "حذف سشن";
          del.setAttribute("aria-label", "حذف سشن");
          del.innerHTML = svg("trash");
          del.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteSession(session, list, () => openHistory());
          });
          item.append(open, del);
          body.appendChild(item);
        });
    }

    panel.append(head, body);
    backdrop.appendChild(panel);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeHistory();
    });
    document.body.appendChild(backdrop);
    document.addEventListener("keydown", onHistoryKey);
  }

  function openHistory() {
    showOverlay("در حال خواندن سشن‌ها…");
    fetch("/session", {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then((list) => {
        hideOverlay();
        renderHistory(list);
      })
      .catch(() => {
        hideOverlay();
        window.alert("خطا در خواندن سشن‌ها");
      });
  }

  function actionButton({ action, title, icon, onClick }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "openweb-tb-btn";
    button.dataset.openwebAction = action;
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
    const buttons = [];
    if (FEATURES.reasoning) {
      buttons.push(
        actionButton({
          action: "reasoning",
          title: "نمایش خلاصهٔ استدلال‌ها",
          icon: "eyeOff",
          onClick: toggleReasoning,
        })
      );
    }
    if (FEATURES.theme) {
      buttons.push(actionButton({ action: "theme", title: "تغییر تم", icon: "moon", onClick: toggleScheme }));
    }
    if (FEATURES.history) {
      buttons.push(
        actionButton({ action: "history", title: "تاریخچهٔ سشن‌ها (شامل CLI)", icon: "history", onClick: openHistory })
      );
    }
    if (FEATURES.settings) {
      buttons.push(actionButton({ action: "settings", title: "تنظیمات", icon: "gear", onClick: openSettings }));
    }
    if (FEATURES.refresh) {
      buttons.push(actionButton({ action: "reload", title: "بارگذاری مجدد صفحه", icon: "refresh", onClick: () => location.reload() }));
    }
    if (!buttons.length) return null;

    const bar = document.createElement("div");
    bar.className = "openweb-toolbar";
    bar.dataset.openwebToolbar = "";
    bar.dir = "ltr";
    bar.append(...buttons);
    return bar;
  }

  function ensureToolbar() {
    let bar = document.querySelector("[data-openweb-toolbar]");
    const right = document.getElementById("opencode-titlebar-right");

    if (bar) {
      if (right && bar.parentElement !== right) {
        right.appendChild(bar);
        bar.classList.remove("openweb-toolbar-float");
      }
    } else {
      bar = buildToolbar();
      if (bar && right) {
        right.appendChild(bar);
      } else if (bar) {
        bar.classList.add("openweb-toolbar-float");
        document.body.appendChild(bar);
      }
    }

    if (FEATURES.theme) syncTheme();
    if (FEATURES.reasoning) bootstrapReasoning();
    if (FEATURES.usage) {
      ensureUsage();
      refreshUsage();
    }
    if (FEATURES.rtl) ensureBidi();
  }

  if (FEATURES.theme) {
    new MutationObserver(syncTheme).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-color-scheme"],
    });
    window.addEventListener("storage", (event) => {
      if (event.key === THEME_KEY) syncTheme();
    });
  }

  if (FEATURES.sync) {
    let awayStartedAt = 0;

    const refreshAfterAway = () => {
      if (document.hidden || !awayStartedAt) return;
      const away = Date.now() - awayStartedAt;
      awayStartedAt = 0;
      if (away < 30000) return;
      location.reload();
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        awayStartedAt = Date.now();
        return;
      }
      refreshAfterAway();
    });

    window.addEventListener("focus", refreshAfterAway);
    window.addEventListener("pagehide", () => {
      if (!awayStartedAt) return;
      try {
        sessionStorage.setItem("openweb.hiddenAt", String(awayStartedAt));
      } catch {
        // sessionStorage can be unavailable in private modes
      }
    });
    window.addEventListener("pageshow", (event) => {
      if (!event.persisted) return;
      if (!awayStartedAt) {
        try {
          awayStartedAt = Number(sessionStorage.getItem("openweb.hiddenAt")) || 0;
        } catch {
          awayStartedAt = 0;
        }
      }
      refreshAfterAway();
    });
  }

  if (FEATURES.enter) installEnterHandler();

  ensureToolbar();
  setInterval(ensureToolbar, 800);
})();
