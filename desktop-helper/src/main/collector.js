// Privacy-first window title collector.
// Attempts to read the current active window title via optional dependency 'active-win'.
// Hashing and storage are handled via callbacks passed from main.

function getDefaultActiveTitleSync() {
  try {
    const activeWin = require('active-win');
    if (!activeWin) return null;
    // Prefer sync if available to keep loop simple.
    if (typeof activeWin.sync === 'function') {
      const info = activeWin.sync();
      return info && info.title ? info.title : null;
    }
    // If only async API is available, skip collection in this skeleton to avoid timers with promises here.
    return null;
  } catch (_) {
    return null;
  }
}

function createCollector({ hashTitle, saveHashedEntry, intervalMs = 10000, getActiveTitleSync = getDefaultActiveTitleSync }) {
  let timer = null;
  let lastHash = null;

  function tick() {
    const title = getActiveTitleSync();
    if (!title && title !== '') return;
    const h = hashTitle(title || '');
    if (h && h !== lastHash) {
      lastHash = h;
      saveHashedEntry({ h, ts: Date.now() });
    }
  }

  function start() {
    if (timer) return;
    timer = setInterval(tick, intervalMs);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  return { start, stop, tick };
}

module.exports = { createCollector };
