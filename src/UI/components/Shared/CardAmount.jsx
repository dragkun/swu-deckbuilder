import CardButton from "./CardButton"
import CardSwitch from "./CardSwitch"
import _ from 'lodash'

const CardAmount = ({card, deck, setDeck, isInSideboard, isInDeck}) =>{
  const cardNumber = _.padStart(card.cardNumber, 3, '0')

  let count
  if (isInSideboard) {
    count = _.find(deck.sideboard, c => c.uid === `${card.expansion[0].code}_${cardNumber}`)?.count || 0
  } else if (isInDeck) {
    count = _.find(deck.cards, c => c.uid === `${card.expansion[0].code}_${cardNumber}`)?.count || 0
  } else {
    const sideboardCount = _.find(deck.sideboard, c => c.uid === `${card.expansion[0].code}_${cardNumber}`)?.count || 0
    const deckCount = _.find(deck.cards, c => c.uid === `${card.expansion[0].code}_${cardNumber}`)?.count || 0
    count = sideboardCount + deckCount
  }

  const handleClick = (count) => {
    const newDeck = _.cloneDeep(deck)

    if (!newDeck.cards) {
      newDeck.cards = []
    }

    const existingSideboardCard = _.find(newDeck.sideboard, c => c.uid === `${card.expansion[0].code}_${cardNumber}`)
    const existingDeckCard = _.find(newDeck.cards, c => c.uid === `${card.expansion[0].code}_${cardNumber}`)
    const existingCount = _.get(existingSideboardCard, 'count', 0) + _.get(existingDeckCard, 'count', 0)
    if (count === existingCount && !isInSideboard && !isInDeck) {
      return
    }
    
    if(isInSideboard) {
      if (existingDeckCard) {
        const newCount = 3 - count
        if (newCount < existingDeckCard.count) {
          existingDeckCard.count = 3 - count
        }
      }
      if (existingSideboardCard) {
        existingSideboardCard.count = count
      }
    } else if (isInDeck) {
      if (existingSideboardCard) {
        const newCount = 3 - count
        if (newCount < existingSideboardCard.count) {
          existingSideboardCard.count = 3 - count
        }
        if (existingDeckCard) {
          existingDeckCard.count = count
        }
      } else {
        existingDeckCard.count = count
      }
    } else {
      if (existingDeckCard && existingSideboardCard) {
        if (count > existingCount) {
          existingDeckCard.count = count - existingSideboardCard.count
        } else {
          existingSideboardCard.count = count - existingDeckCard.count
          if (existingSideboardCard.count < 0) {
            existingDeckCard.count -= existingSideboardCard.count
            existingSideboardCard.count = 0
          }
        }
      } else if (existingSideboardCard) {
        existingSideboardCard.count = count
      } else if (existingDeckCard) {
        existingDeckCard.count = count
      } else {
        newDeck.cards.push({
          uid: `${card.expansion[0].code}_${cardNumber}`, 
          count,
          ...card
        })
      }
    }

    if (existingSideboardCard?.count === 0) {
      newDeck.sideboard = _.filter(newDeck.sideboard, c => c.uid !== `${card.expansion[0].code}_${cardNumber}`)
    }

    if (existingDeckCard?.count === 0) {
      newDeck.cards = _.filter(newDeck.cards, c => c.uid !== `${card.expansion[0].code}_${cardNumber}`)
    }
    setDeck(newDeck)
  }

  return <div role="group" className="card-count-component">
    {deck.type === 'twinsuns' && <CardSwitch count={1} onClick={() => handleClick(1 - count)} isSelected={count === 1} />}
    {deck.type !== 'twinsuns' && (
      <>
        <CardButton count={0} onClick={() => handleClick(0)} isSelected={count === 0} />
        <CardButton count={1} onClick={() => handleClick(1)} isSelected={count === 1} />
        <CardButton count={2} onClick={() => handleClick(2)} isSelected={count === 2} />
        <CardButton count={3} onClick={() => handleClick(3)} isSelected={count === 3} />
      </>
    )}
  </div>
}

export default CardAmount