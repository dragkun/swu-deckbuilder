import React, { useRef } from 'react'
import _ from 'lodash'

const DeckActions = ({setCurrentView, setCurrentDeck, cards, setDecks, decks}) => {
  const fileInputRef = useRef(null);

  const handleNewDeck = (type) => {
    setCurrentDeck({})
    setCurrentView(type)
  }

  const handleImportDeck = () => {
    fileInputRef.current.click();
  }

  const findLeader = (cardId) => {
    const expansion = cardId.split('_')[0]
    const cardNumber = cardId.split('_')[1]

    return cards.leaders.find(c => _.padStart(c.cardNumber, 3, '0') === cardNumber && _.some(c.expansion, e => e.code === expansion))
  }

  const findBase = (cardId) => {
    const expansion = cardId.split('_')[0]
    const cardNumber = cardId.split('_')[1]

    return cards.bases.find(c => _.padStart(c.cardNumber, 3, '0') === cardNumber && _.some(c.expansion, e => e.code === expansion))
  }

  const findCard = (cardId) => {
    const expansion = cardId.split('_')[0]
    const cardNumber = cardId.split('_')[1]

    const event = cards.events.find(c => _.padStart(c.cardNumber, 3, '0') === cardNumber && _.some(c.expansion, e => e.code === expansion))
    if (event) return event

    const upgrade = cards.upgrades.find(c => _.padStart(c.cardNumber, 3, '0') === cardNumber && _.some(c.expansion, e => e.code === expansion))
    if (upgrade) return upgrade

    const unit = cards.units.find(c => _.padStart(c.cardNumber, 3, '0') === cardNumber && _.some(c.expansion, e => e.code === expansion))
    if (unit) return unit
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const deckData = JSON.parse(e.target.result);
          const deckType = deckData.secondLeader ? 'twinsuns' : 'premier';
          const deck = {
            name: deckData.metadata.name,
            type: deckType,
            leader: findLeader(deckData.leader.id), //deckData.leader,
            secondLeader: deckData.secondLeader ? findLeader(deckData.secondLeader.id) : null,
            base: findBase(deckData.base.id), //deckData.base,
            cards: _.map(deckData.deck, card => ({...findCard(card.id), count: card.count})), //deckData.deck,
            sideboard: _.map(deckData.sideboard, card => ({...findCard(card.id), count: card.count})), //deckData.sideboard
          }

          setDecks([...decks, deck])
          window.db.saveDeck(deck)
        } catch (error) {
          console.error('Error parsing deck file:', error);
          alert('Failed to import deck. Make sure the file contains valid deck json data.');
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <div>
      <aside>
        <nav>
          <ul>
            <li><button className='contrast' onClick={() => handleNewDeck('premier')}>New Premier Deck</button></li>
            <li><button className='contrast' onClick={() => handleNewDeck('twinsuns')}>New Twin Suns Deck</button></li>
            <li>
              <button className='contrast' onClick={handleImportDeck}>Import Deck</button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileSelect}
                accept=".json"
              />
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  )
}

export default DeckActions