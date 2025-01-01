import React from 'react'
import LeaderOptions from './TwinSunsOptions/LeaderOptions'
import BaseOptions from './TwinSunsOptions/BaseOptions'
import CardsOptions from './TwinSunsOptions/CardsOptions'

const TwinSunsOptions = ({cache, deck, cards, setDeck, optionsView, setOptionsView, setCurrentView}) => {
    return (
        <div className="layout-deck-options"> 
            {optionsView === 'leader' && <LeaderOptions cache={cache} deck={deck} setDeck={setDeck} cards={cards} setOptionsView={setOptionsView} setCurrentView={setCurrentView} isFirstLeader />}            
            {optionsView === 'secondLeader' && <LeaderOptions cache={cache} deck={deck} setDeck={setDeck} cards={cards} setOptionsView={setOptionsView} setCurrentView={setCurrentView} isSecondLeader />} 
            {optionsView === 'base' && <BaseOptions cache={cache} deck={deck} setDeck={setDeck} cards={cards} setOptionsView={setOptionsView} setCurrentView={setCurrentView} />} 
            {optionsView === 'cards' && <CardsOptions cache={cache} deck={deck} setDeck={setDeck} cards={cards} setOptionsView={setOptionsView} setCurrentView={setCurrentView} />} 
        </div>
    )
}

export default TwinSunsOptions