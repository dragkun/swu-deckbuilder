import React, { useEffect, useState } from "react"
import CardLine from "../Shared/CardLine"
import _ from 'lodash'

import '../../styles/DeckCardList.scss'

const DeckCardList = ({deck, setDeck, cache, setDecks, setCurrentView}) => {
  const [groundUnits, setGroundUnits] = useState([])
  const [spaceUnits, setSpaceUnits] = useState([])
  const [events, setEvents] = useState([])
  const [upgrades, setUpgrades] = useState([])
  const [sideboard, setSideboard] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  

  useEffect(() => {
    if (deck.cards) {
      const ground = deck.cards.filter(card => card.type === 'Unit' && card.arenas.includes('Ground'))
      const space = deck.cards.filter(card => card.type === 'Unit' && card.arenas.includes('Space'))
      const events = deck.cards.filter(card => card.type === 'Event')
      const upgrades = deck.cards.filter(card => card.type === 'Upgrade')
      const sideboards = deck.sideboard

      setGroundUnits(ground)
      setSpaceUnits(space)
      setEvents(events)
      setUpgrades(upgrades)
      setSideboard(sideboards)
    }
    
  }, [deck])

  const handleSave = () => {
    setIsSaving(true)
    window.db.saveDeck(deck).then(() => {
      setIsSaving(false)
      
      setTimeout(() => {
        setIsSaved(false)
      }, 2000)
      
      setDecks(decks => decks.map(d => d.id === deck.id ? deck : d))
    })
  }

  const handleCancel = () => {
    setDeck(null)
    setCurrentView('myDecks')
  }

  return (
    <div>
      {groundUnits?.length > 0 && (
        <div>
          <h6 className="type-header">Ground Units ({groundUnits.reduce((acc, card) => acc + card.count, 0)})</h6>
          <div style={{overflow: 'visible'}}>
            {_.orderBy(groundUnits, ['cost'], ['asc']).map(card => <CardLine key={card.uid} card={card} cache={cache} setDeck={setDeck} deck={deck} isInDeck={true} />)}
          </div>
        </div>
      )}
        
      {spaceUnits?.length > 0 && (
        <div>
          <h6 className="type-header">Space Units ({spaceUnits.reduce((acc, card) => acc + card.count, 0)})</h6>
          <div style={{overflow: 'visible'}}>
            {_.orderBy(spaceUnits, ['cost'], ['asc']).map(card => <CardLine key={card.uid} card={card} cache={cache} setDeck={setDeck} deck={deck} isInDeck={true} />)}
          </div>
        </div>
      )}
      {events?.length > 0 && (
        <div>
          <h6 className="type-header">Events ({events.reduce((acc, card) => acc + card.count, 0)})</h6>
          <div style={{overflow: 'visible'}}>
            {_.orderBy(events, ['cost'], ['asc']).map(card => <CardLine key={card.uid} card={card} cache={cache} setDeck={setDeck} deck={deck} isInDeck={true} />)}
          </div>
        </div>
      )}
      {upgrades?.length > 0 && (
        <div>
          <h6 className="type-header">Upgrades ({upgrades.reduce((acc, card) => acc + card.count, 0)})</h6>
          <div style={{overflow: 'visible'}}>
            {_.orderBy(upgrades, ['cost'], ['asc']).map(card => <CardLine key={card.uid} card={card} cache={cache} setDeck={setDeck} deck={deck} isInDeck={true} />)}
          </div>
        </div>
      )} 
      {sideboard?.length > 0 && (
        <div>
          <h6 className="type-header sideboard">Sideboard ({sideboard.reduce((acc, card) => acc + card.count, 0)})</h6>
          <div style={{overflow: 'visible'}}>
            {_.orderBy(sideboard, ['cost'], ['asc']).map(card => <CardLine key={card.uid} card={card} cache={cache} setDeck={setDeck} deck={deck} isInSideboard={true} />)}
          </div>
        </div>
      )}
      {deck?.leader && (
        <div className="deck-card-list-footer">
          {isSaving && <div>Saving...</div>}
          {isSaved && <div>Saved!</div>}
          <button className="secondary" onClick={handleCancel}>Cancel</button>
          <button onClick={handleSave}>Save Changes</button>
        </div>
      )}
      
    </div>
  )
}

export default DeckCardList 