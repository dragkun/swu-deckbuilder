import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import started from 'electron-squirrel-startup'
import setupIPC from './core/ipc'
import { ensureResourcesExist } from './utils/resources'
import { checkForUpdates } from './utils/versionCheck'
import logger from './utils/logger'

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

if (started) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    ...(MAIN_WINDOW_VITE_DEV_SERVER_URL ? {} : {
      autoHideMenuBar: true,
      menuBarVisible: false
    })
  });

  logger.debug('Loading...');
  console.log('Loading CRD-88...');
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    const htmlPath = path.join(__dirname, '../renderer/main_window/index.html');
    mainWindow.loadFile(htmlPath);
  }

  // Log any window load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    logger.error('Window failed to load:', errorCode, errorDescription);
  });

  // Check for updates when the app starts
  checkForUpdates().then(updateInfo => {
    if (updateInfo.updateAvailable) {
      // Send update info to the renderer process
      mainWindow.webContents.send('update-available', updateInfo);
    }
  });

  return mainWindow;
};

// IPC handler for manual update checks
ipcMain.handle('check-for-updates', async () => {
  return await checkForUpdates();
});

ipcMain.handle('app:getVersion', () => app.getVersion());

ipcMain.handle('shell:openExternal', (_, url) => {
  return shell.openExternal(url);
});

app.whenReady().then(async () => {
  try {
    logger.debug('App is ready, initializing resources...');
    console.log('App is ready, initializing resources...');
    await ensureResourcesExist();
    await setupIPC();
    const mainWindow = createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
