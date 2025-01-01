import React, { useEffect, useState } from "react"
import AddToMain from "./AddToMain";
import AddToSideboard from "./AddToSideboard";
import Aspect from "./Aspect";
import CardAmount from "./CardAmount"
import CardTitle from "./CardTitle"
import _ from 'lodash'

import '../../styles/CardLine.scss'

const CardLine = ({ card, cache, setDeck, deck, cardTypeFilter, cardAspectFilter, sortOrder, isInDeck, isInSideboard }) => {
  const [aspectPenalty, setAspectPenalty] = useState(0)
  useEffect(() => {
    if (isInDeck || isInSideboard) {
      const deckAspects = [
        ...deck?.base?.aspects,
        ...deck?.leader?.aspects,
        ...deck?.secondLeader?.aspects || [],
      ].sort()

      const cardAspects = [...card.aspects, ...(card.aspectDuplicates || [])]
  
      if (!_.isEmpty(card.aspectDuplicates)) {
        const deckAspectDuplicates = _.countBy(deckAspects)
        const cardAspectDuplicatesCount = _.countBy(cardAspects)
        
        Object.keys(cardAspectDuplicatesCount).forEach(key => {
          if (cardAspectDuplicatesCount[key] > deckAspectDuplicates[key]) {
            setAspectPenalty(cardAspectDuplicatesCount[key] - deckAspectDuplicates[key])
          }
          if (!deckAspectDuplicates[key]) {
            setAspectPenalty(cardAspectDuplicatesCount[key])
          }
        })
      } else {
        const nonMatchingDeckAspects = cardAspects.filter(cardAspect => !deckAspects.includes(cardAspect))
        if (nonMatchingDeckAspects.length > 0) {
          setAspectPenalty(nonMatchingDeckAspects.length)
        }
      }
    }
    
  }, [deck])

  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center', width: '100%', height: '2.5rem'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, height: '100%'}}><CardAmount card={card} deck={deck} setDeck={setDeck} isInSideboard={isInSideboard} isInDeck={isInDeck} /></div>
      <div style={{display: 'flex', alignItems: 'center', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', overflow: 'visible', height: '2.5rem'}}>
        <CardTitle card={card} cache={cache} />
      </div>
      <div className='card-aspects' style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, width: '3rem'}}>
        {card.aspects
          .sort((a, b) => {
            if ((a === 'Villainy' || a === 'Heroism') && (b !== 'Villainy' && b !== 'Heroism')) return 1;
            if ((b === 'Villainy' || b === 'Heroism') && (a !== 'Villainy' && a !== 'Heroism')) return -1;
            return 0;
          })
          .map(a => <Aspect key={a} aspect={a} />)}
        {(card.aspectDuplicates || []).map((a, index) => <Aspect key={index} aspect={a} />)}
      </div>
      <div className='card-cost' style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: '5rem', padding: '0 0.5rem', flexShrink: 0}}>{card.cost}<span data-tooltip={`Aspect Penalty Cost`}>{aspectPenalty > 0 && `(${(aspectPenalty * 2) + card.cost})`}</span></div>
      {isInDeck && (<AddToSideboard card={card} deck={deck} setDeck={setDeck} />)}
      {isInSideboard && (<AddToMain card={card} deck={deck} setDeck={setDeck} />)}
    </div>
  )
}

export default CardLine