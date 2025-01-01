import React, { useState } from "react";
import "../../styles/Draw.scss";
import CardImage from "./CardImage";

const Draw = ({ deck, cache }) => {
    const [drawnCards, setDrawnCards] = useState([]);
    const [remainingDeck, setRemainingDeck] = useState([]);

    React.useEffect(() => {
        // Expand deck based on card counts
        const expandedDeck = (deck?.cards || []).reduce((acc, card) => {
            const cardCopies = Array(card.count).fill(card);
            return [...acc, ...cardCopies];
        }, []);
        
        setRemainingDeck(expandedDeck);
        shuffleDeck(expandedDeck);
        setDrawnCards([]);
    }, [deck]);

    const shuffleDeck = (deckToShuffle = remainingDeck) => {
        const shuffled = [...deckToShuffle];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setRemainingDeck(shuffled);
    };

    const drawCards = (count) => {
        if (remainingDeck.length < count || (deck.type === 'Premier' && deck?.cards?.length < 50) || (deck.type === 'Twin Suns' && deck?.cards?.length < 50)) {
            alert("Not enough cards in the deck!");
            return;
        }
        const drawn = remainingDeck.slice(0, count);
        setDrawnCards([...drawnCards, ...drawn]);
        setRemainingDeck(remainingDeck.slice(count));
    };

    const clearDrawn = () => {
        setRemainingDeck([...remainingDeck, ...drawnCards]);
        setDrawnCards([]);
    };

    return (
        <div className="draw-container">
            <div className="button-group">
                <button className="secondary" onClick={() => drawCards(6)}>Draw 6</button>
                <button className="secondary" onClick={() => drawCards(2)}>Draw 2</button>
                <button className="secondary" onClick={() => drawCards(1)}>Draw 1</button>
                <button className="secondary" onClick={clearDrawn}>Clear</button>
            </div>
            <div className="stats">
                <div className="cards-drawn">Cards Drawn: {drawnCards.length}</div>
                <div className="cards-left">Cards Remaining: {remainingDeck.length}</div>
            </div>
            <div className="drawn-cards">
                {drawnCards.map((card, index) => (
                    <CardImage
                        key={index}
                        frontImage={cache[card.image.front]}
                        backImage={cache[card.image.back]}
                        allowZoom
                    />
                ))}
            </div>
        </div>
    );
};

export default Draw;