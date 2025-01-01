import React, { useState, useEffect } from "react";
import CardAspectFilter from "../Shared/CardAspectFilter"
import CardList from "../Shared/CardList"
import CardTypeFilter from "../Shared/CardTypeFilter"
import CardSetFilter from "../Shared/CardSetFilter";

const CardsOptions = ({cards,cache,setDeck,deck}) => {
  const [cardTypeFilter, setCardTypeFilter] = useState(['Events', 'Ground', 'Space', 'Upgrades']);
  const [cardAspectFilter, setCardAspectFilter] = useState([]);
  const [cardSort, setCardSort] = useState('Cost');
  const [cardSearch, setCardSearch] = useState('');
  const [cardSets, setCardSets] = useState([]);
  const [cardSetFilter, setCardSetFilter] = useState([]);

  const handleCardSearch = (e) => {
    if (e.target.value.length > 2) {
      setCardSearch(e.target.value)
    } else {
      setCardSearch('')
    }
  }

  useEffect(() => {
    const allCards = [...cards.events, ...cards.units, ...cards.upgrades];
    const uniqueExpansionCodes = [...new Set(allCards.flatMap(card => card.expansion.map(exp => exp.code)))].sort();
    setCardSets(uniqueExpansionCodes);
    setCardSetFilter(uniqueExpansionCodes);
  }, [cards])

  return (
    <div>
      <h1>Add Cards to Deck</h1>
      <CardSetFilter cardSets={cardSets} setCardSetFilter={setCardSetFilter} cardSetFilter={cardSetFilter} />
      <fieldset style={{display: 'flex', gap: '1rem'}}>
        <input 
          name="search" 
          type="search" 
          placeholder="Search" 
          onChange={handleCardSearch}
          style={{flexGrow: 1}} 
        />
        <select 
          onChange={(e) => setCardSort(e.target.value)}
          style={{width: 'auto', cursor: 'pointer'}}
        >
          <option value="Cost">Cost</option>
          <option value="Name">Name</option>
        </select>
      </fieldset>
      <CardTypeFilter cardTypeFilter={cardTypeFilter} setCardTypeFilter={setCardTypeFilter} />
      <CardAspectFilter cardAspectFilter={cardAspectFilter} setCardAspectFilter={setCardAspectFilter} deck={deck} />
      <CardList cards={cards} cache={cache} setDeck={setDeck} deck={deck} cardTypeFilter={cardTypeFilter} cardAspectFilter={cardAspectFilter} sortOrder={cardSort} cardSearch={cardSearch} cardSetFilter={cardSetFilter} />

    </div>
  )
}

export default CardsOptions
