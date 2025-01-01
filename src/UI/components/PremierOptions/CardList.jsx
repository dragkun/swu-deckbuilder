import React, { useState, useEffect } from 'react'
import _ from 'lodash'

import '../../styles/CardList.scss'

import CardLine from '../Shared/CardLine'

const CardList = ({ cards, cache, setDeck, deck, cardTypeFilter, cardAspectFilter, sortOrder, cardSearch, cardSetFilter }) => {
  const [displayCards, setDisplayCards] = useState([])

  useEffect(() => {
    let cardList = []
    if (_.includes(cardTypeFilter, 'Events')) {
      cardList.push(...cards.events)
    }
    if (_.includes(cardTypeFilter, 'Ground')) {
      const units = cards.units.filter(card => card.arenas.includes('Ground'))
      cardList.push(...units)
    }
    if (_.includes(cardTypeFilter, 'Space')) {
      const units = cards.units.filter(card => card.arenas.includes('Space'))
      cardList.push(...units)
    }
    if (_.includes(cardTypeFilter, 'Upgrades')) {
      cardList.push(...cards.upgrades)
    }

    const deckIncludesHeroism = deck.leader.aspects.includes('Heroism')
    const deckIncludesVillainy = deck.leader.aspects.includes('Villainy')
    const deckAspects = [...new Set([...deck.leader.aspects, ...deck.base.aspects])].filter(aspect => aspect !== 'Heroism' && aspect !== 'Villainy')

    cardList = _.filter(cardList, card => {
      if (cardAspectFilter.length === 1) {
        // There is only one aspect in the filter and it is Heroism or Villainy display card with Heroism or Villainy aspect and a deck aspect
        // unless there is no additonal card aspect other than Heroism or Villainy
        if (cardAspectFilter[0] === 'Heroism') {
          return card.aspects.includes('Heroism') && (card.aspects.length === 1 || _.some(card.aspects, aspect => _.includes(deckAspects, aspect)))
        }
        if (cardAspectFilter[0] === 'Villainy') {
          return card.aspects.includes('Villainy') && (card.aspects.length === 1 || _.some(card.aspects, aspect => _.includes(deckAspects, aspect)))
        }
      
        // if our filter is a single aspect that is not Heroism or Villainy, display card with that aspect and the deck Heroism or Villainy aspect
        if (deckIncludesHeroism && deckIncludesVillainy) {
          return card.aspects.includes(cardAspectFilter[0]);
        }

        if (deckIncludesHeroism) {
          return card.aspects.includes(cardAspectFilter[0]) && !card.aspects.includes('Villainy');
        }
        if (deckIncludesVillainy) {
          return card.aspects.includes(cardAspectFilter[0]) && !card.aspects.includes('Heroism');
        }

        return card.aspects.includes(cardAspectFilter[0]);
      }
      
      if (deckIncludesHeroism && deckIncludesVillainy) {
        if (_.includes(cardAspectFilter, 'Villainy') && _.includes(cardAspectFilter, 'Heroism')) { 
        return _.every(card.aspects, aspect => _.includes(cardAspectFilter, aspect) || aspect === 'Villainy' || aspect === 'Heroism');
        } 
        if (_.includes(cardAspectFilter, 'Villainy')) {
          return _.every(card.aspects, aspect => _.includes(cardAspectFilter, aspect) || aspect === 'Villainy');
        }
        if (_.includes(cardAspectFilter, 'Heroism')) {
          return _.every(card.aspects, aspect => _.includes(cardAspectFilter, aspect) || aspect === 'Heroism');
        }
        if (!_.includes(cardAspectFilter, 'Villainy') && !_.includes(cardAspectFilter, 'Heroism')) {
          return _.every(card.aspects, aspect => _.includes(cardAspectFilter, aspect));
        }
      }

      // Don't show Heroism cards if Villainy is in deck aspects
      if (cardAspectFilter.includes('Villainy') && card.aspects.includes('Heroism')) {
        return false;
      }
      // Don't show Villainy cards if Heroism is in deck aspects  
      if (cardAspectFilter.includes('Heroism') && card.aspects.includes('Villainy')) {
        return false;
      }
      // For non-Heroism/Villainy aspects, card must include at least one of them
      const otherAspects = cardAspectFilter.filter(a => a !== 'Heroism' && a !== 'Villainy');
      if (otherAspects.length > 0) {
        // If card only has Heroism/Villainy, allow it through
        if (card.aspects.every(a => a === 'Heroism' || a === 'Villainy')) {
          return true;
        }
        // Otherwise check if it matches any of the other filtered aspects
        return _.some(card.aspects, aspect => _.includes(otherAspects, aspect));
      }
      return true;
    })

    cardList = _.filter(cardList, card => {
      const searchable = Object.values(_.pick(card, ['title', 'subtitle', 'text', 'traits', 'keywords'])).join(' ').toLowerCase()
      return searchable.includes(cardSearch.toLowerCase())
    })

    cardList = _.filter(cardList, card => {
      return card.expansion.some(exp => cardSetFilter.includes(exp.code));
    })

    if (sortOrder === 'Cost') { 
      cardList = _.orderBy(cardList, ['cost', 'title'])
    } else {  
      cardList = _.orderBy(cardList, ['title', 'cost'])
    }
    
    setDisplayCards(cardList)
  }, [cardTypeFilter, cardAspectFilter, sortOrder, cardSearch, cardSetFilter])

  return (
    <div style={{overflow: 'visible'}}>
      {displayCards.map(card => <CardLine key={card.uid} card={card} cache={cache} setDeck={setDeck} deck={deck} cardTypeFilter={cardTypeFilter} cardAspectFilter={cardAspectFilter} sortOrder={sortOrder} cardSetFilter={cardSetFilter} />)}
    </div>
  )
}

export default CardList