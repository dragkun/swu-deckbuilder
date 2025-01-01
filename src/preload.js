const { contextBridge, ipcRenderer } = require('electron');

const database = {
  loadDecks: async () => {
    return ipcRenderer.invoke('db:LoadDecks')
  },
  saveDeck: (deck) => {
    return ipcRenderer.invoke('db:SaveDeck', deck)
  },
  copyDeck: (deck) => {
    return ipcRenderer.invoke('db:CopyDeck', deck)
  },
  deleteDeck: (deck) => {
    return ipcRenderer.invoke('db:DeleteDeck', deck)
  },
  getDeckHistory: (deck) => {
    return ipcRenderer.invoke('db:LoadDeckHistory', deck)
  }
}

const resources = {
  loadCards: async () => {
    return ipcRenderer.invoke('resource:LoadCards')
  },
  loadImage: (image) => {
    return ipcRenderer.invoke('resource:LoadImage', image)
  },
  loadResources: async () => {
    return ipcRenderer.invoke('resource:LoadResources')
  }
}

process.once('loaded', () => {
  contextBridge.exposeInMainWorld('db', database)
  contextBridge.exposeInMainWorld('resources', resources)

  contextBridge.exposeInMainWorld('electron', {
    versionCheck: {
      checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
      onUpdateAvailable: (callback) => 
        ipcRenderer.on('update-available', (_, updateInfo) => callback(updateInfo))
    },
    app: {
      getVersion: () => ipcRenderer.invoke('app:getVersion'),
    },
    shell: {
      openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url)
    }
  })
})