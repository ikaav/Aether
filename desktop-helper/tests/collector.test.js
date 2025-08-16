const assert = require('assert');
const { createCollector } = require('../src/main/collector');

(function run() {
  let saved = [];
  const titles = ['Alpha', 'Alpha', 'Beta', 'Beta', 'Gamma'];
  let idx = 0;
  const getActiveTitleSync = () => titles[idx++] ?? titles[titles.length - 1];
  const fakeHash = (t) => `h:${t}`;
  const collector = createCollector({
    hashTitle: fakeHash,
    saveHashedEntry: (e) => saved.push(e),
    intervalMs: 1,
    getActiveTitleSync,
  });
  // Call tick manually to avoid timers
  collector.tick(); // Alpha -> save
  collector.tick(); // Alpha -> skip duplicate
  collector.tick(); // Beta -> save
  collector.tick(); // Beta -> skip duplicate
  collector.tick(); // Gamma -> save
  assert.strictEqual(saved.length, 3, 'Collector should save only on hash change');
  assert.deepStrictEqual(saved.map(e => e.h), ['h:Alpha', 'h:Beta', 'h:Gamma']);
  console.log('collector.test passed');
})();
