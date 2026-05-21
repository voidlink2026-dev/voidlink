const { contextBridge, ipcRenderer } = require('electron')

// Expose a minimal, safe API surface to the renderer
contextBridge.exposeInMainWorld('uplinkDesktop', {
  platform: process.platform,
  isDesktop: true,
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', cb),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', cb),
  installUpdate: () => ipcRenderer.send('install-update'),
})
