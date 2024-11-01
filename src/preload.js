const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    readAllFiles: () => ipcRenderer.invoke('read-all-files'),
    deleteActivity: (name) => ipcRenderer.invoke('delete-activity', name)
});
