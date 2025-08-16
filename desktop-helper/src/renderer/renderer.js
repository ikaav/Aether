const titleInput = document.getElementById('titleInput');
const hashBtn = document.getElementById('hashBtn');
const hashOut = document.getElementById('hashOut');
const storeBtn = document.getElementById('storeBtn');
const purgeBtn = document.getElementById('purgeBtn');
const uploadBtn = document.getElementById('uploadBtn');
const uploadToggle = document.getElementById('uploadToggle');

hashBtn.addEventListener('click', async () => {
  const h = await window.electronAPI.hashTitle(titleInput.value || '');
  hashOut.textContent = h.slice(0, 12) + '…';
});

storeBtn.addEventListener('click', async () => {
  const t = titleInput.value || '';
  window.electronAPI.storeTelemetry([t]);
});

purgeBtn.addEventListener('click', async () => {
  window.electronAPI.purgeLocal();
  hashOut.textContent = '';
});

uploadToggle.addEventListener('change', (e) => {
  window.electronAPI.toggleUpload(!!e.target.checked);
});

uploadBtn.addEventListener('click', () => {
  window.electronAPI.requestUpload();
});
