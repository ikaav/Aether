const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// simulate main hashing logic
function hashTitle(title, settingsPath) {
  const settings = fs.existsSync(settingsPath)
    ? JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
    : {};
  const salt = settings.salt || 'salt4test';
  if (!settings.salt) {
    settings.salt = salt;
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  }
  const h = crypto.createHash('sha256');
  h.update(salt + '::' + (title || ''));
  return h.digest('hex');
}

(function run() {
  const DATA_DIR = path.join(__dirname, '..', '.testdata2');
  const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
  fs.rmSync(DATA_DIR, { recursive: true, force: true });

  const h1 = hashTitle('Window X', SETTINGS_FILE);
  const h2 = hashTitle('Window X', SETTINGS_FILE);
  assert.strictEqual(h1, h2, 'Hash must be stable for same input and salt');

  const h3 = hashTitle('Other', SETTINGS_FILE);
  assert.notStrictEqual(h1, h3, 'Different titles produce different hashes');

  console.log('telemetry.test passed');
})();
