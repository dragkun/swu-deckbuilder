import React, { useState } from 'react'
import DeckList from './Deck/DeckList'
import DeckActions from './Deck/DeckActions'
import '../styles/MyDecks.scss'

const DeckMain = ({decks, setCurrentView, setCurrentDeck, cache, cards, setDecks}) => {
  return (
    <>
      <div className="layout header">
        <section className="main">
          <h1>Deck List</h1>
        </section>
        <section className="right"></section>
      </div>
      <div className="layout">
        <section className="main">
          <DeckList decks={decks} setCurrentDeck={setCurrentDeck} cache={cache} setCurrentView={setCurrentView} setDecks={setDecks}/>
        </section>
        <section className="right">
          <DeckActions setCurrentView={setCurrentView} setCurrentDeck={setCurrentDeck} cards={cards} setDecks={setDecks} decks={decks} />
        </section>
      </div>
    </>     
  )
}

export default DeckMain