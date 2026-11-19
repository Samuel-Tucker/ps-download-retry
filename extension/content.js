// PS Download Retry: clicks "Try Again" on library.playstation.com when a download fails.
(() => {
  const COOLDOWN_MS = 20_000; // don't click the same button more than once per 20 s
  const POLL_MS = 5_000;      // backup check in case a mutation is missed
  let lastClick = 0;
  let clicks = 0;

  function badge(text) {
    let el = document.getElementById("ps-retry-badge");
    if (!el) {
      el = document.createElement("div");
      el.id = "ps-retry-badge";
      el.style.cssText =
        "position:fixed;left:12px;bottom:12px;z-index:2147483647;padding:6px 10px;" +
        "border-radius:8px;background:#0b1f3a;color:#fff;font:12px system-ui;opacity:.85;pointer-events:none";
      document.body.appendChild(el);
    }
    el.textContent = text;
  }

  function findTryAgain() {
    const candidates = document.querySelectorAll('button, a, [role="button"]');
    for (const el of candidates) {
      const label = (el.innerText || el.textContent || el.getAttribute("aria-label") || "").trim().toLowerCase();
      if (label === "try again" && !el.disabled && el.offsetParent !== null) return el;
    }
    return null;
  }

  function check() {
    const btn = findTryAgain();
    if (!btn) return;
    const now = Date.now();
    if (now - lastClick < COOLDOWN_MS) return;
    lastClick = now;
    clicks += 1;
    btn.click();
    const time = new Date().toLocaleTimeString("en-GB");
    console.log(`[PS Retry] clicked Try Again (#${clicks}) at ${time}`);
    badge(`PS Retry: ${clicks} retr${clicks === 1 ? "y" : "ies"}, last ${time}`);
  }

  new MutationObserver(check).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(check, POLL_MS);
  badge("PS Retry: watching");
  check();
})();
