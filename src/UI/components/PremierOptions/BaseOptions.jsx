import React,{ useEffect, useState } from "react";
import CardImage from "../Shared/CardImage";
import _ from 'lodash'

const BaseOptions = ({cards, cache, setDeck, deck}) => {
  const [bases, setBases] = useState([]);
  const handleBase = (base) => {
    setDeck({...deck, base: base})
  }

  useEffect(() => {
    if (cards) {
      const sortedBases = _.orderBy(
        cards.bases,
        [
          'expansion[0].id',
          'cardNumber'
        ],
        ['desc', 'asc']
      );

      setBases(sortedBases);
    }
  }, [cards]);

  return (
    <div>
      <h2>Choose Base</h2>
      <div className="grid">
        <div>
          {bases?.map((card) => (
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

