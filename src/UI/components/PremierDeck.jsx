import React, { useState } from "react"
import _ from "lodash"
import '../styles/PremierDeck.scss'
import Aspect from "./Shared/Aspect"
import DeckCardList from "./PremierDeck/DeckCardList"
import DeckImageGenerator from './Shared/DeckImageGenerator';
import { generateDeckForm } from './Shared/DeckFormGenerator';

import { FiSave } from "@react-icons/all-files/fi/FiSave"
import { FiCopy } from "@react-icons/all-files/fi/FiCopy"
import { FaFileImage } from "@react-icons/all-files/fa/FaFileImage"
import { FaFilePdf } from "@react-icons/all-files/fa/FaFilePdf"
import CardImage from "./Shared/CardImage"
import Description from "./PremierDeck/Description"
import Math from "./Shared/Math"
import Draw from "./Shared/Draw"
import History from "./Shared/History"

const deckToText = (deck) => {
  const formatCard = (card) => {
    return `${card.count} ${card.title}${card.subtitle ? (card.subtitle !== '' ? `, ${card.subtitle}` : '') : ''}`
  }

  let text = `// ${deck.name}
// .dec exported on ${new Date().toLocaleString()}
// 
// Leader and Base
1 ${deck.leader.title}, ${deck.leader.subtitle}
1 ${deck.base.title}${deck.base.subtitle ? (deck.base.subtitle !== '' ? `, ${deck.base.subtitle}` : '') : ''}`

  if (deck.cards.filter(card => card.type === 'Unit' && card.arenas.includes('Ground'))?.length > 0) {
    text += '\n\n// Ground Units\n'
    text += _.map(deck.cards.filter(card => card.type === 'Unit' && card.arenas.includes('Ground')), formatCard).join('\n')
  }
  if (deck.cards.filter(card => card.type === 'Unit' && card.arenas.includes('Space'))?.length > 0) {
    text += '\n\n// Space Units\n'
    text += _.map(deck.cards.filter(card => card.type === 'Unit' && card.arenas.includes('Space')), formatCard).join('\n')
  }
  if (deck.cards.filter(card => card.type === 'Event')?.length > 0) {
    text += '\n\n// Events\n'
    text += _.map(deck.cards.filter(card => card.type === 'Event'), formatCard).join('\n')
  }
  if (deck.cards.filter(card => card.type === 'Upgrade')?.length > 0) {
    text += '\n\n// Upgrades\n'
    text += _.map(deck.cards.filter(card => card.type === 'Upgrade'), formatCard).join('\n')
  }
  if (deck.sideboard?.length > 0) {
    text += '\n\n// Sideboard\n'
    text += _.map(deck.sideboard, formatCard).join('\n')
  }
  return text
}

const DeckCards = ({deck, setDeck, cache, setOptionsView, setDecks, setCurrentView}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [activeTab, setActiveTab] = useState('cards')
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false)
    }
  }

  const onEditTitle = (e) => {
    setDeck({...deck, name: e.target.value})
  }

  const onEditLeader = () => {
    setOptionsView('leader')
  }

  const onEditBase = () => {
    setOptionsView('base')
  }

  const saveDeckAsText = () => {
    const a = document.createElement('a');
    const file = new Blob([deckToText(deck)], {type: 'text/plain'});
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = `${deck.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const saveDeckAsJson = () => {
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

    const a = document.createElement('a');
    const file = new Blob([deckText], {type: 'application/json'});
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = `${deck.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const copyDeckToClipboard = () => {
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

  const handleGenerateDeckForm = () => {
    generateDeckForm(deck);
  }

  const handleGenerateImage = () => {
    setShowImageGenerator(true);
  };

  const handleImageGenerated = (imageUrl) => {
    setGeneratedImage(imageUrl);
    setShowImageGenerator(false);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${deck.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_deck.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {isEditingTitle ? (
        <input type="text" value={deck?.name} onChange={(e) => onEditTitle(e)} onKeyDown={handleKeyPress} />
      ) : (
        <h1 onClick={() => setIsEditingTitle(true)}>{deck?.name}</h1>
      )}

      <div className="grid deck-cards">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <CardImage frontImage={cache[deck?.leader?.image.front]} backImage={cache[deck?.leader?.image.back]} onClick={() => {}} allowZoom />
          <div className="title">{deck?.leader?.title}</div>
          <div className="subtitle">{deck?.leader?.subtitle}</div>
          <div><button onClick={onEditLeader}>Change Leader</button></div>
        </div>
        <div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <CardImage frontImage={cache[deck?.base?.image.front]} backImage={cache[deck?.base?.image.back]} onClick={() => {}} allowZoom />
            <div className="title">{deck?.base?.title}</div>
            <div><button onClick={onEditBase}>Change Base</button></div>
          </div>
        </div>
      </div>
      <div className="grid deck-stats">
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          {deck?.base?.aspects.map((aspect, index) => (
            <Aspect aspect={aspect} key={index} />
          ))}
          {deck?.leader?.aspects.map((aspect, index) => (
            <Aspect aspect={aspect} key={index} />
          ))}
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <div><span className="title">Total:</span> {deck?.cards?.reduce((sum, card) => sum + (card.count || 0), 0) || 0} Cards</div>
        </div>
      </div>
      <div style={{width: '100%', flex: 1}}>
        <nav style={{width: '100%'}}>
          <ul style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: 0, margin: 0, listStyle: 'none'}}>
            <li>
              <a href="#" onClick={() => setActiveTab('cards')} className={activeTab === 'cards' ? 'active' : ''}>Cards</a>
            </li>
            <li>
              <a href="#" onClick={() => setActiveTab('math')} className={activeTab === 'math' ? 'active' : ''}>Math</a>
            </li>
            <li>
              <a href="#" onClick={() => setActiveTab('draw')} className={activeTab === 'draw' ? 'active' : ''}>Draw</a>
            </li>
            <li>
              <a href="#" onClick={() => setActiveTab('description')} className={activeTab === 'description' ? 'active' : ''}>Description</a>
            </li>
            <li>
              <a href="#" onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>History</a>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        {activeTab === 'cards' && (
          <DeckCardList deck={deck} setDeck={setDeck} cache={cache} setDecks={setDecks} setCurrentView={setCurrentView} />
        )}
        {activeTab === 'math' && <Math deck={deck} />}
        {activeTab === 'draw' && <Draw deck={deck} cache={cache} />}
        {activeTab === 'description' && <Description deck={deck} setDeck={setDeck} />}
        {activeTab === 'history' && <History deck={deck} />}
        <div className="deck-export-buttons">
          <button className="secondary" onClick={saveDeckAsText}><FiSave /> .txt</button>
          <button className="secondary" onClick={saveDeckAsJson}><FiSave /> .json</button>
          <button className="secondary" onClick={copyDeckToClipboard}><FiCopy /> .json</button>
          <button className="secondary" onClick={handleGenerateImage}>Deck Image <FaFileImage /></button>
          <button className="secondary" onClick={handleGenerateDeckForm}>Deck Form <FaFilePdf /></button>
        </div>
      </div>
      {showImageGenerator && (
        <div className="flex gap-4 mb-4">
          <DeckImageGenerator deck={deck} onImageGenerated={handleImageGenerated} cache={cache} />
        </div>
      )}
    </div>
    
  )
}

export default DeckCards