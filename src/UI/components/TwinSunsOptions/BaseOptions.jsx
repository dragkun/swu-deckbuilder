import React,{ useEffect } from "react";
import CardImage from "../Shared/CardImage";

const BaseOptions = ({cards, cache, setDeck, deck}) => {
  const handleBase = (base) => {
    setDeck({...deck, base: base})
  }

  return (
    <div>
      <h2>Choose Base</h2>
      <div className="grid">
        <div>
          {cards?.bases?.map((card) => (
            <CardImage 
              key={card.id}
              frontImage={cache[card.image.front]} 
              backImage={cache[card.image.back]} 
              onClick={() => handleBase(card)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BaseOptions

