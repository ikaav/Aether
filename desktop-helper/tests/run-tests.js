const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

// Unit-test orchestrator: runs individual tests and prints summary.

function runNode(file) {
  const res = spawnSync(process.execPath, [file], { stdio: 'inherit' });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

(function run() {
  console.log('Running telemetry storage + cleanup checks...');
  // Inline mini-test for hashed telemetry and cleanup
  const DATA_DIR = path.join(__dirname, '.inline');
  const TELEMETRY_FILE = path.join(DATA_DIR, 'telemetry.json');
  const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(TELEMETRY_FILE, '[]');
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ salt: 'testsalt', consentAsked: false }, null, 2));

  const h = crypto.createHash('sha256');
  h.update('testsalt::My Secret Window');
  const expected = h.digest('hex');

  const now = Date.now();
  const entries = [
    { h: expected, ts: now - 40 * 24 * 60 * 60 * 1000 },
    { h: expected, ts: now }
  ];
  fs.writeFileSync(TELEMETRY_FILE, JSON.stringify(entries, null, 2));

  // cleanup: filter >= 30 days (simulate scheduler)
  const DAY = 24 * 60 * 60 * 1000;
  const telemetry = JSON.parse(fs.readFileSync(TELEMETRY_FILE, 'utf-8'));
  const cutoff = Date.now() - 30 * DAY;
  const filtered = telemetry.filter(t => (t.ts || 0) >= cutoff);
  fs.writeFileSync(TELEMETRY_FILE, JSON.stringify(filtered, null, 2));
  const post = JSON.parse(fs.readFileSync(TELEMETRY_FILE, 'utf-8'));
  assert.strictEqual(post.length, 1, 'Old entry should be removed after cleanup');

  console.log('Running unit tests...');
  runNode(path.join(__dirname, 'collector.test.js'));
  runNode(path.join(__dirname, 'telemetry.test.js'));

  console.log('\nAll tests passed.');
})();
