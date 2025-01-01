import React, { useState, useEffect } from "react"
import _ from 'lodash'
import PremierDeck from './PremierDeck'

import '../styles/Premier.scss'
import PremierOptions from "./PremierOptions"

import generateDeckName from '../utils/generate_deck_name'

import { nanoid } from 'nanoid'

const Premier = ({cache, currentDeck, setCurrentDeck, cards, setDecks, setCurrentView}) => {
  const [optionsView, setOptionsView] = useState('leader')
  
  useEffect(() => {
    if (_.isEmpty(currentDeck)) {
      const name = generateDeckName()
      setCurrentDeck({name, id: nanoid(), type: 'premier'})
    }
  }, [])

  useEffect(() => {
    if (!currentDeck.leader) {
      setOptionsView('leader')
    } else if (!currentDeck.base) {
      setOptionsView('base')
    } else {
      setOptionsView('cards')
    }
  }, [currentDeck])

  return (
    <>
      <div className="layout-deck">
        <section className="left">
          <PremierDeck deck={currentDeck} setDeck={setCurrentDeck} cache={cache} setOptionsView={setOptionsView} setDecks={setDecks} setCurrentView={setCurrentView} />
        </section>
        <section className="right">
          <PremierOptions cache={cache} deck={currentDeck} cards={cards} setDeck={setCurrentDeck} optionsView={optionsView} setOptionsView={setOptionsView} setCurrentView={setCurrentView} />
        </section>
      </div>
    </>     
  )
}

export default Premier