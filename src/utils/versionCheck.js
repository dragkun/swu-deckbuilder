import { app } from 'electron';
import fetch from 'node-fetch';
import logger from './logger'

async function checkForUpdates() {
  try {
    const response = await fetch('https://swu.panic-attack.org/api/version.json');

    logger.debug('Update Server Response:', response);
    const data = await response.json();
    
    const currentVersion = app.getVersion();
    const serverVersion = data.version;
    
    // Compare versions (assuming semantic versioning)
    const currentParts = currentVersion.split('.').map(Number);
    const serverParts = serverVersion.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (serverParts[i] > currentParts[i]) {
        return {
          updateAvailable: true,
          serverVersion,
          timestamp: data.timestamp
        };
      } else if (serverParts[i] < currentParts[i]) {
        return {
          updateAvailable: false
        };
      }
    }
    
    return {
      updateAvailable: false
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return {
      updateAvailable: false,
      error: error.message
    };
  }
}

export { checkForUpdates }; 