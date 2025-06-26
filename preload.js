const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectPDF: () => ipcRenderer.invoke('select-pdf'),
  getMetadata: (input) => ipcRenderer.invoke('get-metadata', input),
  modifyMetadata: (input, output, metadata) => ipcRenderer.invoke('modify-metadata', input, output, metadata),
  splitPDF: (input, size) => ipcRenderer.invoke('split-pdf', input, size),
});