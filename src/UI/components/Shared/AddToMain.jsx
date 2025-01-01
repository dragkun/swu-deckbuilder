import { FiChevronsUp } from '@react-icons/all-files/fi/FiChevronsUp'

import '../../styles/AddToSideboard.scss'

const AddToMain = ({ card, deck, setDeck }) => {
  const onClick = (amount) => {
    const newDeck = {...deck}

    if (amount) { 
      const sideboardCard = newDeck.sideboard.find(c => c.uid === card.uid)
      const mainCard = newDeck.cards.find(c => c.uid === card.uid)

      if (mainCard) {
        mainCard.count += amount
      } else {
        newDeck.cards.push({...card, count: amount})
      }
      sideboardCard.count -= amount
      if (sideboardCard.count === 0) {
        newDeck.sideboard = newDeck.sideboard.filter(c => c.uid !== card.uid)
      }
    } else {
      newDeck.sideboard = newDeck.sideboard.filter(c => c.uid !== card.uid)

      const mainCard = newDeck.cards.find(c => c.uid === card.uid)
      if (mainCard) {
        mainCard.count += card.count
      } else {
        newDeck.cards.push({...card})
      }
    }
    setDeck(newDeck)
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, height: '100%'}}>
      <div data-tooltip="Move all to main deck" className='sideboard-button secondary' onClick={() => { onClick() }}>MD<FiChevronsUp /></div>
      <div data-tooltip="Move one to main deck" className='sideboard-button secondary' onClick={() => { onClick(1) }}>1<FiChevronsUp /></div>
    </div>
  )
}

export default AddToMain