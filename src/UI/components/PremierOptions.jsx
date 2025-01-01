import React from "react";
import BaseOptions from "./PremierOptions/BaseOptions";
import CardsOptions from "./PremierOptions/CardsOptions";
import LeaderOptions from "./PremierOptions/LeaderOptions";

const PremierOptions = ({deck, cards, cache, setDeck, optionsView, setOptionsView}) => {

  const renderOptions = () => {
    switch (optionsView) {
      case 'leader':
        return <LeaderOptions cards={cards} cache={cache} setDeck={setDeck} deck={deck} />;
      case 'base':
        return <BaseOptions cards={cards} cache={cache} setDeck={setDeck} deck={deck} />;
      case 'cards':
        return <CardsOptions cards={cards} cache={cache} setDeck={setDeck} deck={deck} />;
    }
  }

  return (
    <div>
      {renderOptions()}
    </div>
  )
}

export default PremierOptions