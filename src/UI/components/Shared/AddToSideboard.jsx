import { FiChevronsDown } from '@react-icons/all-files/fi/FiChevronsDown'
import '../../styles/AddToSideboard.scss'

const AddToSideboard = ({card, deck, setDeck}) => {
  const onClick = (amount) => {
    const newDeck = {...deck}

    if (!newDeck.sideboard) {
      newDeck.sideboard = []
    }

    if (amount) { 
      const sideboardCard = newDeck.sideboard.find(c => c.uid === card.uid)
      const mainCard = newDeck.cards.find(c => c.uid === card.uid)

      if (sideboardCard) {
        sideboardCard.count += amount
      } else {
        newDeck.sideboard.push({...card, count: amount})
      }
      mainCard.count -= amount
      if (mainCard.count === 0) {
        newDeck.cards = newDeck.cards.filter(c => c.uid !== card.uid)
      }
    } else {
      newDeck.cards = newDeck.cards.filter(c => c.uid !== card.uid)

      const sideboardCard = newDeck.sideboard.find(c => c.uid === card.uid)
      if (sideboardCard) {
        sideboardCard.count += card.count
      } else {
        newDeck.sideboard.push({...card})
      }
    }
    setDeck(newDeck)
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, height: '100%'}}>
      <div data-tooltip="Move all to sideboard" className='sideboard-button secondary' onClick={() => { onClick() }}>SB<FiChevronsDown /></div>
      <div data-tooltip="Move one to sideboard" className='sideboard-button secondary' onClick={() => { onClick(1) }}>1<FiChevronsDown /></div>
    </div>
  )
}

export default AddToSideboard
