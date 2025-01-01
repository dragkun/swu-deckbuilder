import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import isDev from 'electron-is-dev'
import EncryptedFileAdapter from './db/encryptedFIleAdapter'
import { app } from 'electron'

let db

const initialize = async () => {
  let dbFilePath
  
  if (isDev) {
    dbFilePath = path.join(process.cwd(), 'data.store')
  } else {
    dbFilePath = path.join(app.getPath('userData'), 'data.store')
  }
  
  let adapter

  if (isDev) {
    adapter = new JSONFile(dbFilePath)
  } else {
    adapter = new EncryptedFileAdapter(dbFilePath)
  }

  const db = new Low(adapter, { decks: [], collection: [] })
  await db.read()
  return db
}

export default async () => {
  if (!db) {
    db = await initialize()
  }
  return db
}
