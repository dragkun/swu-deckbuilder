import React,{ useEffect, useState } from "react";
import CardImage from "../Shared/CardImage";
import _ from 'lodash'

const LeaderOptions = ({cards, cache, setDeck, deck}) => {
  const [leaders, setLeaders] = useState([]);

  const handleLeader = (leader) => {
    setDeck({...deck, leader: leader})
  }

  useEffect(() => {
    if (cards) {
      const sortedLeaders = _.orderBy(
        cards.leaders,
        [
          'expansion[0].id',
          'cardNumber'
        ],
        ['desc', 'asc']
      );

      setLeaders(sortedLeaders);
    }
  }, [cards]);

  return (
    <div>
      <h2>Choose Leader</h2>
      <div className="grid">
        <div>
          {leaders?.map((card) => (
            <CardImage 
              key={card.id}
              frontImage={cache[card.image.front]} 
              backImage={cache[card.image.back]} 
              onClick={() => handleLeader(card)}
              selected={deck?.leader?.id === card.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeaderOptions