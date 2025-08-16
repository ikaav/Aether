const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { createCollector } = require('./collector');

const APP_NAME = 'Aether Desktop Helper';
const DATA_DIR = app ? app.getPath('userData') : path.join(__dirname, '..', '..', 'data');
const TELEMETRY_FILE = path.join(DATA_DIR, 'telemetry.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJSON(file, fallback) {
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (_) {}
  return fallback;
}

function saveJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

function hashTitle(title) {
  // Hash + salt per-device, no raw titles stored.
  const settings = loadJSON(SETTINGS_FILE, {});
  const salt = settings.salt || crypto.randomBytes(16).toString('hex');
  if (!settings.salt) {
    settings.salt = salt;
    ensureDataDir();
    saveJSON(SETTINGS_FILE, settings);
  }
  const h = crypto.createHash('sha256');
  h.update(salt + '::' + (title || ''));
  return h.digest('hex');
}

function scheduleCleanup() {
  // Daily cleanup: remove telemetry older than 30 days
  const DAY = 24 * 60 * 60 * 1000;
  setInterval(() => {
    const telemetry = loadJSON(TELEMETRY_FILE, []);
    const cutoff = Date.now() - 30 * DAY;
    const filtered = telemetry.filter(t => (t.ts || 0) >= cutoff);
    if (filtered.length !== telemetry.length) {
      ensureDataDir();
      saveJSON(TELEMETRY_FILE, filtered);
    }
  }, DAY);
}

let consentGranted = false; // default local-only, no upload
let uploadEnabled = false; // explicit opt-in only
let collector = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: `${APP_NAME} — Local Only` ,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, '../renderer/index.html'));
  return win;
}

function saveTelemetry(entries) {
  // Append entries locally only; uploading requires explicit consent via IPC 'enable-upload'
  const telemetry = loadJSON(TELEMETRY_FILE, []);
  const updated = telemetry.concat(entries);
  ensureDataDir();
  saveJSON(TELEMETRY_FILE, updated);
}

async function maybeAskConsent(win) {
  const settings = loadJSON(SETTINGS_FILE, {});
  if (settings.consentAsked) {
    consentGranted = !!settings.consentGranted;
    uploadEnabled = !!settings.uploadEnabled;
    win.setTitle(`${APP_NAME} — ${uploadEnabled ? 'Upload Enabled' : 'Local Only'}`);
    return;
  }

  const res = await dialog.showMessageBox(win, {
    type: 'question',
    buttons: ['Local Only', 'Allow Upload (Opt-In)'],
    defaultId: 0,
    cancelId: 0,
    title: 'Telemetry Consent',
    message: 'Aether Desktop Helper collects only hashed window titles for focus tracking. By default, data stays local. Do you want to enable encrypted upload to help improve Aether? You can change this later in Settings.',
    detail: 'We never store raw titles. Hashing uses a per-device salt. You can purge data anytime. No data leaves your device unless you choose to upload.'
  });
  const allowUpload = res.response === 1;
  consentGranted = true; // consent to collect locally
  uploadEnabled = allowUpload; // explicit upload consent
  const newSettings = { ...settings, consentAsked: true, consentGranted, uploadEnabled };
  ensureDataDir();
  saveJSON(SETTINGS_FILE, newSettings);
  win.setTitle(`${APP_NAME} — ${uploadEnabled ? 'Upload Enabled' : 'Local Only'}`);
}

function setupIPC(win) {
  ipcMain.handle('hash-title', (_evt, title) => {
    return hashTitle(title);
  });

  ipcMain.on('store-telemetry', (_evt, { titles }) => {
    const now = Date.now();
    const entries = (titles || []).map(t => ({ h: hashTitle(t), ts: now }));
    saveTelemetry(entries);
  });

  ipcMain.on('request-upload', async (_evt) => {
    if (!consentGranted) return; // no upload without collection consent
    if (!uploadEnabled) return; // explicit opt-in required
    const payload = loadJSON(TELEMETRY_FILE, []);
    // In this skeleton, we simulate upload by writing to a local file to avoid network I/O.
    const UPLOAD_OUT = path.join(DATA_DIR, 'last_upload.json');
    ensureDataDir();
    saveJSON(UPLOAD_OUT, { uploadedAt: new Date().toISOString(), count: payload.length });
  });

  ipcMain.on('toggle-upload', (_evt, enabled) => {
    uploadEnabled = !!enabled;
    const settings = loadJSON(SETTINGS_FILE, {});
    const newSettings = { ...settings, uploadEnabled, consentGranted: true, consentAsked: true };
    ensureDataDir();
    saveJSON(SETTINGS_FILE, newSettings);
    win.setTitle(`${APP_NAME} — ${uploadEnabled ? 'Upload Enabled' : 'Local Only'}`);
  });

  ipcMain.on('purge-local', () => {
    ensureDataDir();
    saveJSON(TELEMETRY_FILE, []);
  });
}

function startCollector() {
  if (collector) return;
  collector = createCollector({
    hashTitle,
    saveHashedEntry: (entry) => saveTelemetry([entry]),
    intervalMs: 15000,
  });
  collector.start();
}

app.whenReady().then(async () => {
  ensureDataDir();
  const win = createWindow();
  setupIPC(win);
  await maybeAskConsent(win);
  scheduleCleanup();
  startCollector();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
