import React, { useState, useEffect } from "react"
import TwinSunsDeck from "./TwinSunsDeck"
import TwinSunsOptions from "./TwinSunsOptions"
import _ from 'lodash'
import { nanoid } from 'nanoid'
import generateDeckName from '../utils/generate_deck_name'

const TwinSuns = ({cards, cache, currentDeck, setCurrentDeck, setDecks, setCurrentView}) => {
  const [optionsView, setOptionsView] = useState('leader')
  
  useEffect(() => {
    if (_.isEmpty(currentDeck)) {
      const name = generateDeckName()
      setCurrentDeck({name, id: nanoid(), type: 'twinsuns'})
    }
  }, [])

  useEffect(() => {
    if (!currentDeck.leader) {
      setOptionsView('leader')
    } else if (!currentDeck.secondLeader) {
      setOptionsView('secondLeader')
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
          <TwinSunsDeck deck={currentDeck} setDeck={setCurrentDeck} cache={cache} setOptionsView={setOptionsView} setDecks={setDecks} setCurrentView={setCurrentView} />
        </section>
        <section className="right">
          <TwinSunsOptions cache={cache} deck={currentDeck} cards={cards} setDeck={setCurrentDeck} optionsView={optionsView} setOptionsView={setOptionsView} setCurrentView={setCurrentView} />
        </section>
      </div>
    </>
  )
}

export default TwinSuns