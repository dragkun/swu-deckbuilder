import { ipcMain } from 'electron'
import dbService from '../utils/db'
import { getCards, loadImage, loadResources } from '../utils/resources'
import { nanoid } from 'nanoid'
import _ from 'lodash'

let db

const compareDecks = (currentDeck, previousDeck) => {
  const changes = []

  // Compare leaders
  if (currentDeck.leader?.cardUid !== previousDeck.leader?.cardUid) {
    changes.push({
      type: 'leader',
      removed: previousDeck.leader?.title,
      added: currentDeck.leader?.title
    })
  }

  // Compare bases
  if (currentDeck.base?.cardUid !== previousDeck.base?.cardUid) {
    changes.push({
      type: 'base',
      removed: previousDeck.base?.title,
      added: currentDeck.base?.title
    })
  }

  // Compare cards
  const currentCards = currentDeck.cards || []
  const previousCards = previousDeck.cards || []
  
  const cardChanges = {}
  
  // Track removed cards
  previousCards.forEach(card => {
    const currentCount = currentCards.find(c => c.uid === card.uid)?.count || 0
    if (currentCount < card.count) {
      cardChanges[card.uid] = {
        title: card.title,
        removed: card.count - currentCount,
        added: 0
      }
    }
  })

  // Track added cards
  currentCards.forEach(card => {
    const previousCount = previousCards.find(c => c.uid === card.uid)?.count || 0
    if (previousCount < card.count) {
      if (!cardChanges[card.uid]) {
        cardChanges[card.uid] = {
          title: card.title,
          removed: 0,
          added: 0
        }
      }
      cardChanges[card.uid].added = card.count - previousCount
    }
  })

  // Add card changes to changes array
  Object.entries(cardChanges).forEach(([uid, change]) => {
    if (change.added > 0 || change.removed > 0) {
      changes.push({
        type: 'card',
        uid,
        title: change.title,
        added: change.added,
        removed: change.removed
      })
    }
  })

  return changes
}

export default async () => {
  db = await dbService()
  
  ipcMain.handle('db:DeleteDeck', async (event, deck) => {
    db.data.decks = db.data.decks.filter(d => d.id !== deck.id)
    db.write()
  })
  
  ipcMain.handle('db:CopyDeck', async (event, deck) => {
    let existingDeck = db.data.decks.find(d => d.id === deck.id)
    if (existingDeck) {
      const newDeck = {...existingDeck, id: nanoid()}
      db.data.decks.push(newDeck)
      db.write()
      return newDeck
    }
  })

  ipcMain.handle('db:LoadDecks', async () => {
    return db.data.decks.map(({versions, ...deck}) => deck)
  })  

  ipcMain.handle('db:SaveDeck', async (event, deck) => {
    let existingDeck = db.data.decks.find(d => d.id === deck.id)
    if (existingDeck) {
      if (!existingDeck.versions) {
        existingDeck.versions = []
      }

      // is there a change?
      if (existingDeck.leader === deck.leader && existingDeck.base === deck.base && existingDeck.cards === deck.cards && existingDeck.sideboard === deck.sideboard) {
        return deck // no change
      }

      const {versions: oldVersions, id, ...deckWithoutVersions} = existingDeck
      existingDeck.versions.push({...deckWithoutVersions, version: existingDeck.versions.length, modified: Date.now()})
      const deckIndex = db.data.decks.findIndex(d => d.id === deck.id)
      db.data.decks[deckIndex] = {...deck, version: existingDeck.versions.length, versions: existingDeck.versions}
    } else {
      if(!_.isEmpty(deck)) {
        db.data.decks.push({...deck, version: 0, modified: Date.now(), versions: []})
      }
    }
    db.write()
    return deck
  })

  ipcMain.handle('db:LoadDeckHistory', async (event, deck) => {
    let existingDeck = db.data.decks.find(d => d.id === deck.id)
    if (existingDeck) {
      // Create history entries for each version
      const history = []
      
      // Compare current version with the last version
      if (existingDeck.versions.length > 0) {
        const lastVersion = existingDeck.versions[existingDeck.versions.length - 1]
        history.push({
          version: existingDeck.version,
          modified: existingDeck.modified,
          changes: compareDecks(deck, lastVersion)
        })
      }

      // Compare each version with its previous version
      for (let i = existingDeck.versions.length - 1; i > 0; i--) {
        const currentVersion = existingDeck.versions[i]
        const previousVersion = existingDeck.versions[i - 1]
        history.push({
          version: currentVersion.version,
          modified: currentVersion.modified,
          changes: compareDecks(currentVersion, previousVersion)
        })
      }

      // Add first version if it exists
      if (existingDeck.versions.length > 0) {
        const firstVersion = existingDeck.versions[0]
        history.push({
          version: firstVersion.version,
          modified: firstVersion.modified,
          changes: compareDecks(firstVersion, { cards: [], leader: null, base: null })
        })
      }

      return history
    }
    return []
  })

  ipcMain.handle('resource:LoadCards', async () => {
    return getCards()
  })
  ipcMain.handle('resource:LoadImage', (event, image) => loadImage(image))
  ipcMain.handle('resource:LoadResources', async () => {
    return loadResources()
  })
}