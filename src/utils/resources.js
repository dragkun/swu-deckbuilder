import fs from 'fs'
import path from 'path'
import isDev from 'electron-is-dev'
import crypto from 'crypto'
import logger from './logger'
import _ from 'lodash'
import { app } from 'electron'

const cache = {}

const plainTextKey = '<replace this with a key>'
const plainTextIV = '<replace this with an iv>'

const key = crypto.createHash('sha256').update(plainTextKey).digest('base64').slice(0, 32) // AES-256
const iv = plainTextIV.slice(0, 16)

// Resource file names
const RESOURCES_DB = 'resources.db'
const RESOURCES_FILE = 'resources-2.res'
const RESOURCES_FILE_1 = 'resources-1.res'

const calculateFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};

const copyFile = async (sourcePath, targetPath) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(sourcePath, targetPath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const ensureResourcesExist = async () => {
  logger.debug('ensuring resources exist...')
  const userDataPath = app.getPath('userData')

  if (isDev) {
    return
  }

  const resourceFiles = [
    { name: RESOURCES_DB, required: true },
    { name: RESOURCES_FILE, required: true },
    { name: RESOURCES_FILE_1, required: true }
  ];

  for (const file of resourceFiles) {
    const sourceFile = path.join(process.resourcesPath, 'assets', file.name);
    const targetFile = path.join(userDataPath, file.name);

    try {
      if (!fs.existsSync(sourceFile)) {
        if (file.required) {
          throw new Error(`Required resource file not found: ${sourceFile}`);
        }
        logger.warn(`Optional resource file not found: ${sourceFile}`);
        continue;
      }

      // If target doesn't exist, copy it
      if (!fs.existsSync(targetFile)) {
        logger.info(`Copying new resource file: ${sourceFile}`);
        await copyFile(sourceFile, targetFile);
        continue;
      }

      // Compare file hashes
      const sourceHash = await calculateFileHash(sourceFile);
      const targetHash = await calculateFileHash(targetFile);

      if (sourceHash !== targetHash) {
        logger.info(`Resource file ${file.name} has changed, updating...`);
        await copyFile(sourceFile, targetFile);
      } else {
        logger.debug(`Resource file ${file.name} is up to date`);
      }
    } catch (error) {
      logger.error(`Error processing resource file ${file.name}:`, error);
      throw error;
    }
  }
}

const getResourcePath = () => {
  // In development, use the assets directory in project root
  if (isDev) {
    return path.join(process.cwd(), 'assets', RESOURCES_FILE)
  }
  
  // In production, use the path in user data directory
  return path.join(app.getPath('userData'), RESOURCES_FILE)
}

const getResourcePath1 = () => {
  // In development, use the assets directory in project root
  if (isDev) {
    return path.join(process.cwd(), 'assets', RESOURCES_FILE_1)
  }
  
  // In production, use the path in user data directory
  return path.join(app.getPath('userData'), RESOURCES_FILE_1)
}

const getMetaPath = () => {
  if (isDev) {
    return path.join(process.cwd(), 'assets', RESOURCES_DB)
  }
  
  // In production, use the path in user data directory
  return path.join(app.getPath('userData'), RESOURCES_DB)
}

const decryptFile = (encryptedBuffer) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decryptedData = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);
  return decryptedData;
};

const bufferToDataUrl = (buffer, mimeType = 'application/octet-stream') => {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

const getCards = () => {
  if (cache.cards) {
    return cache.cards
  }

  const metadataBuffer = decryptFile(fs.readFileSync(getResourcePath1()))
  const cards = JSON.parse(metadataBuffer.toString('utf-8'))
  cache.cards = cards

  return cards
}

const loadResources = () => {
  const metadataBuffer = decryptFile(fs.readFileSync(getMetaPath()))
  const metadata = JSON.parse(metadataBuffer.toString('utf-8'))

  const resourceDataBuffer = decryptFile(fs.readFileSync(getResourcePath()))

  _.each(metadata, (resource) => {
    logger.debug(`loading ${resource.fileName}`)
    const resourceData = resourceDataBuffer.subarray(resource.offset, resource.offset + resource.length)
    cache[resource.fileName] = bufferToDataUrl(resourceData, 'image/png')  
  })

  return cache
}

const extractFile = (fileName) => {   
  if (cache[fileName]) {
    return cache[fileName];
  }

  const metadataBuffer = decryptFile(fs.readFileSync(getMetaPath()))
  const metadata = JSON.parse(metadataBuffer.toString('utf-8'))
  const fileMeta = metadata.find((m) => m.fileName === fileName);

  if (!fileMeta) {
    throw new Error(`File: ${fileName} not found in resource file.`);
  }

  const resourceDataBuffer = decryptFile(fs.readFileSync(getResourcePath()))
  const resourceData = resourceDataBuffer.subarray(fileMeta.offset, fileMeta.offset + fileMeta.length)
  cache[fileName] = bufferToDataUrl(resourceData, 'image/png')

  return cache[fileName];
};

const loadImage = (fileName) => {
  return cache[fileName];
}

export {
  loadImage,
  getCards,
  loadResources,
  ensureResourcesExist
}
