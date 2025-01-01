import React from "react";
import _ from 'lodash';
import '../../styles/CardTypeFilter.scss';

const CardTypeButton = ({cardType, setCardTypeFilter, cardTypeFilter}) => {
  if (_.includes(cardTypeFilter, cardType)) {
    return <button className="secondary" onClick={() => setCardTypeFilter(cardTypeFilter.filter(type => type !== cardType))}>{cardType}</button>
  }
  return (
    <button className="secondary outline" onClick={() => setCardTypeFilter([...cardTypeFilter, cardType])}>{cardType}</button> 
  )
}

const CardTypeFilter = ({cardTypeFilter, setCardTypeFilter}) => {
  return (
    <div role="group" className="card-type-filter">
      <CardTypeButton cardType="Events" setCardTypeFilter={setCardTypeFilter} cardTypeFilter={cardTypeFilter} />
      <CardTypeButton cardType="Ground" setCardTypeFilter={setCardTypeFilter} cardTypeFilter={cardTypeFilter} />
      <CardTypeButton cardType="Space" setCardTypeFilter={setCardTypeFilter} cardTypeFilter={cardTypeFilter} />
      <CardTypeButton cardType="Upgrades" setCardTypeFilter={setCardTypeFilter} cardTypeFilter={cardTypeFilter} />
    </div>
  )
}

export default CardTypeFilter