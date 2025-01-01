import React, { useState, useEffect } from 'react'
import { BiEdit } from "@react-icons/all-files/bi/BiEdit";
import { BiCopy } from "@react-icons/all-files/bi/BiCopy";
import { BiTrash } from "@react-icons/all-files/bi/BiTrash";
import { BiClipboard } from "@react-icons/all-files/bi/BiClipboard";
import _ from 'lodash'

import '../../styles/DeckList.scss'
import CardImage from '../Shared/CardImage';
import Confirm from '../Shared/Confirm';

const DeckList = ({decks, setCurrentDeck, setCurrentView, cache, setDecks}) => {

  const onEditDeck = (deck) => {
    if (deck.type === 'premier') {
      setCurrentDeck(deck);
      setCurrentView('premier');
    } 
    if(deck.type === 'twinsuns') {
      setCurrentDeck(deck);
      setCurrentView('twinsuns');
    }
  }

  const onCopyDeck = (deck) => {
    window.db.copyDeck(deck).then((newDeck) => {  
      setDecks([...decks, newDeck])
    })
  }

  const onDeleteDeck = (deck) => {
    window.db.deleteDeck(deck).then((newDeck) => {  
      setDecks(decks.filter(d => d.id !== deck.id))
    })
  }

  const onCopyToClipboard = (deck) => {
    const data = {
      metadata: {
        name: deck.name,
        author: 'CRD-88',
      },
      leader: {
        id: `${deck.leader.expansion[0].code}_${_.padStart(`${deck.leader.cardNumber}`, 3, '0')}`,
        count: 1
      },
      secondLeader: null,
      base: {
        id: `${deck.base.expansion[0].code}_${_.padStart(`${deck.base.cardNumber}`, 3, '0')}`,
        count: 1
      },
      deck: _.map(deck.cards, card => ({
        id: `${card.expansion[0].code}_${_.padStart(`${card.cardNumber}`, 3, '0')}`,
        count: card.count
      })),
      sideboard: _.map(deck.sideboard, card => ({
        id: `${card.expansion[0].code}_${_.padStart(`${card.cardNumber}`, 3, '0')}`,
        count: card.count
      }))
    }

    const deckText = JSON.stringify(data, null, 2);    
    navigator.clipboard.writeText(deckText)
      .catch(err => console.error('Failed to copy deck to clipboard:', err));
  }

  return (
    <div>
      {decks?.length === 0 && <p>No decks found</p>}
      {decks?.map((deck) => (
        <div key={deck.id} className="deck-list-item">
          <div className={`deck-information ${deck.type === 'twinsuns' ? 'twinsuns' : ''}`}>
            <CardImage frontImage={cache[deck?.leader?.image.front]} onClick={() => {}} />
            {deck.secondLeader && (<CardImage frontImage={cache[deck?.secondLeader?.image.front]} onClick={() => {}} />)}
            <CardImage frontImage={cache[deck?.base?.image.front]} onClick={() => {}} />
          </div>
          <div className="deck-aspects">
            <div className="deck-name">{deck.name}</div>
            {deck.type === 'premier' && <div className="deck-type-premier">Premier</div>}
            {deck.type === 'twinsuns' && <p className="deck-type-twinsuns">Twin Suns</p>}
          </div>
          <div className="deck-actions" style={{marginLeft: 'auto'}}>
            <button onClick={() => {onEditDeck(deck)}}><BiEdit /></button>
            <button onClick={() => {onCopyDeck(deck)}}><BiCopy /></button>
            <Confirm
              message={`Are you sure you want to delete the deck "${deck.name}"?`}
              onConfirm={() => onDeleteDeck(deck)}
              onCancel={() => {}}
            >
              <button><BiTrash /></button>
            </Confirm>
            <button onClick={(e) => {
              const rect = e.target.getBoundingClientRect();
              const copyText = document.createElement('p');
              copyText.style.backgroundColor = 'black';
              copyText.style.color = 'white';
              copyText.style.padding = '0.5rem';
              copyText.style.borderRadius = '0.5rem';
              copyText.style.position = 'absolute';
              copyText.style.top = `${rect.bottom + window.scrollY}px`;
              copyText.style.left = `${rect.left + window.scrollX}px`;
              copyText.classList.add('deck-copied');
              copyText.innerText = 'Copied to clipboard';
              document.body.appendChild(copyText);
              setTimeout(() => {
                copyText.remove();
              }, 1000);
              onCopyToClipboard(deck);
            }}><BiClipboard /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DeckList