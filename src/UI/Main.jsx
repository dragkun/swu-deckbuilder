import React, { useEffect, useState } from 'react'
import Collection from './components/Collection'  
import DeckMain from './components/DeckMain'
import Premier from './components/Premier'
import TwinSuns from './components/TwinSuns'
import Loading from './components/Loading'
import _ from 'lodash'
import './styles/Main.scss';

const Main = ({currentView, setCurrentView}) => {
  const [cache, setCache] = useState({})
  const [decks, setDecks] = useState([])
  const [collection, setCollection] = useState([])
  const [currentDeck, setCurrentDeck] = useState(null)
  const [cards, setCards] = useState([])

  useEffect(() => {
    if (currentView === 'loading') {
      window.resources.loadResources().then((cache) => {
        setCache(cache)
        setTimeout(() => {
          setCurrentView('main')
        }, 2500)
      })
      window.db.loadDecks().then((decks) => {
        setDecks(decks)
      })
      window.resources.loadCards().then((cards) => {
        setCards(cards)
      })
    }
  }, [currentView])

  useEffect(() => {
    if (currentDeck) {
      if (!decks.some(deck => deck.id === currentDeck.id) && !_.isEmpty(currentDeck)) {
        setDecks([...decks, currentDeck])
      } else {
        setDecks(prevDecks => 
          prevDecks.map(deck => 
            deck.id === currentDeck.id ? currentDeck : deck
          )
        )
  
      }
      window.db.saveDeck(currentDeck)
    }
  }, [currentDeck])

  const renderView = () => {
    switch (currentView) {
      case 'myDecks':
        return <DeckMain cards={cards} decks={decks} setCurrentView={setCurrentView} setCurrentDeck={setCurrentDeck} cache={cache} setDecks={setDecks}  />;
      case 'collection':
        return <Collection />;
      case 'premier':
        return <Premier cards={cards} cache={cache} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} setDecks={setDecks} setCurrentView={setCurrentView} />;
      case 'twinsuns':
        return <TwinSuns cards={cards} cache={cache} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} setDecks={setDecks} setCurrentView={setCurrentView} />;
      case 'loading': 
        return <Loading />;
      default:
        return <DeckMain cards={cards} decks={decks} setCurrentView={setCurrentView} setCurrentDeck={setCurrentDeck} cache={cache} setDecks={setDecks} />;
    }
  }

  return (
    <main className='container-fluid'>
      {renderView()}  
    </main>
  )
}

export default Main