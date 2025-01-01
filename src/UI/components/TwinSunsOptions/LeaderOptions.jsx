import React,{ useEffect, useState } from "react";
import CardImage from "../Shared/CardImage";
import _ from 'lodash'

const LeaderOptions = ({cards, cache, setDeck, deck, isFirstLeader, isSecondLeader}) => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    if (isFirstLeader) {
      setLeaders(cards.leaders)
    } else if (isSecondLeader) {
      if (_.includes(deck.leader.aspects, 'Heroism')) {
        setLeaders(cards.leaders.filter(leader => leader.aspects.includes('Heroism')))
      } else if (_.includes(deck.leader.aspects, 'Villainy')) {
        setLeaders(cards.leaders.filter(leader => leader.aspects.includes('Villainy')))
      }
    }
  }, [isFirstLeader, isSecondLeader])


  const handleLeader = (leader) => {
    if (isFirstLeader) {
      setDeck({...deck, leader: leader})
    } else if (isSecondLeader) {
      setDeck({...deck, secondLeader: leader})
    }
  }

  return (
    <div>
      <h2>Choose {isFirstLeader ? 'First' : 'Second'} Leader</h2>
      <div className="grid">
        <div>
          {leaders?.map((card) => (
            <CardImage 
              key={card.id}
              frontImage={cache[card.image.front]} 
              backImage={cache[card.image.back]} 
              onClick={() => handleLeader(card)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeaderOptions