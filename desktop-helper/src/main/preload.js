const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  hashTitle: (title) => ipcRenderer.invoke('hash-title', title),
  storeTelemetry: (titles) => ipcRenderer.send('store-telemetry', { titles }),
  requestUpload: () => ipcRenderer.send('request-upload'),
  toggleUpload: (enabled) => ipcRenderer.send('toggle-upload', enabled),
  purgeLocal: () => ipcRenderer.send('purge-local')
});
