import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';

const DeckImageGenerator = ({ deck, onImageGenerated, cache }) => {
  const canvasRef = useRef(null);

  const loadImage = (dataUrl) => {
    return new Promise((resolve, reject) => {
      if (!dataUrl || typeof dataUrl !== 'string') {
        console.error('Invalid dataUrl:', dataUrl);
        reject(new Error('Invalid dataUrl'));
        return;
      }

      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => {
        console.error('Image load error:', {
          dataUrl: dataUrl.substring(0, 100) + '...',
          error: e
        });
        reject(e);
      };
      
      // Remove crossOrigin for data URLs as it's not needed
      if (!dataUrl.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      img.src = dataUrl;
    });
  };

  const getAspectColor = (aspect) => {
    if (aspect === 'Heroism') return '#c6c1a0'
    if (aspect === 'Aggression') return '#d2232a'
    if (aspect === 'Cunning') return '#fdb933'
    if (aspect === 'Command') return '#41ad49'
    if (aspect === 'Vigilance') return '#6694ce'
    if (aspect === 'Villainy') return '#040004'
  }

  const getColorStops = (deck) => {
    const leaderAspects = [...new Set(
      [
        ...deck?.secondLeader?.aspects || [],
        ...deck?.leader?.aspects || [],
        ...deck?.base?.aspects || [],
      ]
    )]

    return _.map(leaderAspects, aspect => getAspectColor(aspect))
  }

  const generateDeckImage = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 1920;
    canvas.height = 1080;
    
    // Background gradient (dark red to dark green)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.angle = 45;

    const colorStops = getColorStops(deck)
    colorStops.forEach((color, index) => {
      gradient.addColorStop(index / (colorStops.length - 1), color);
    })

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw deck name
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(deck.name, 50, 80);
    
    // Load and draw cards
    try {
      // Draw leader and base first
      const mainCards = [
        { ...deck.leader, count: 1 },
        { ...deck.base, count: 1 }
      ];

      // Draw leader and base larger and to the left
      const leaderWidth = 300;
      const leaderHeight = 215;
      let currentY = 180;
      let currentX = 50;

      for (const card of mainCards) {
        if (!card.image?.front) continue;
        try {
          const cachedImage = cache[card.image.front];
          const img = await loadImage(cachedImage);
          // ctx.drawImage(img, 50, currentY, leaderWidth, leaderHeight);
          ctx.drawImage(img, currentX , 180, leaderWidth, leaderHeight);
          currentX += leaderWidth + 40;
        } catch (error) {
          console.error('Error loading main card image:', error);
        }
      }

      // Calculate grid layout for other cards
      const cardWidth = 160;
      const cardHeight = 225;
      const padding = 20;
      const startX = 750; // Start after leader/base cards
      const startY = 50;
      const cardsPerRow = Math.floor((canvas.width - startX - 50) / (cardWidth + padding));

      // Draw rest of the deck
      currentX = startX;
      currentY = startY;
      let rowHeight = 0;

      const deckCards = [...deck.cards];
      if (deck.secondLeader) {
        deckCards.unshift({ ...deck.secondLeader, count: 1 });
      }

      for (const card of deckCards) {
        if (!card.image?.front) continue;

        try {
          const img = await loadImage(cache[card.image.front]);
          ctx.drawImage(img, currentX, currentY, cardWidth, cardHeight);

          const circleRadius = 20;
          const circleX = currentX + (cardWidth / 2);
          const circleY = currentY + cardHeight - (circleRadius / 2);

          // Draw hexagon
          const startAngle = -Math.PI / 2; // Start from top (negative 90 degrees)
          
          // Draw white background hexagon
          ctx.beginPath();
          const borderSize = 3;
          ctx.moveTo(circleX + (circleRadius + borderSize) * Math.cos(startAngle), 
                    circleY + (circleRadius + borderSize) * Math.sin(startAngle));
          for (let i = 1; i <= 6; i++) {
            const angle = startAngle + (i * Math.PI / 3);
            ctx.lineTo(circleX + (circleRadius + borderSize) * Math.cos(angle), 
                      circleY + (circleRadius + borderSize) * Math.sin(angle));
          }
          ctx.closePath();
          ctx.fillStyle = 'white';
          ctx.fill();

          // Draw black hexagon
          ctx.beginPath();
          ctx.moveTo(circleX + circleRadius * Math.cos(startAngle), circleY + circleRadius * Math.sin(startAngle));
          for (let i = 1; i <= 6; i++) {
            const angle = startAngle + (i * Math.PI / 3);
            ctx.lineTo(circleX + circleRadius * Math.cos(angle), circleY + circleRadius * Math.sin(angle));
          }
          ctx.closePath();
          ctx.fillStyle = 'black';
          ctx.fill();

          // Draw count
          ctx.fillStyle = 'white';
          ctx.font = 'bold 36px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(card.count, circleX, circleY + 2);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'alphabetic';

          currentX += cardWidth + padding;
          rowHeight = Math.max(rowHeight, cardHeight);

          if (currentX + cardWidth > canvas.width - 50) {
            currentX = startX;
            currentY += rowHeight + padding;
            rowHeight = 0;
          }
        } catch (error) {
          console.error('Error loading card image:', error);
        }
      }

      // Draw sideboard section if exists
      if (deck.sideboard && deck.sideboard.length > 0) {
        const sideboardAreaWidth = 700;

        // Add some space before sideboard
        currentY = 180 + leaderHeight + 200;
        // Draw SIDEBOARD text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SIDEBOARD', 50 + (sideboardAreaWidth / 2), currentY);
        ctx.textAlign = 'left';
        currentY += 40;

        // Reset X position for sideboard cards
        currentX = 50;

        const sideboardWidth = 110;
        const sideboardHeight = 150;

        for (const card of deck.sideboard) {
          if (!card.image?.front) continue;

          try {
            const img = await loadImage(cache[card.image.front]);
            ctx.drawImage(img, currentX, currentY, sideboardWidth, sideboardHeight);

            const circleRadius = 15;
            const circleX = currentX + (sideboardWidth / 2);
            const circleY = currentY + sideboardHeight - (circleRadius / 2);

            // Draw white border circle
            const borderSize = 3;
            ctx.beginPath();
            ctx.arc(circleX, circleY, circleRadius + borderSize, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();

            // Draw gray circle
            ctx.beginPath();
            ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'gray';
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(card.count, circleX, circleY + 2);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';

            currentX += sideboardWidth + padding;
            if (currentX + sideboardWidth > sideboardAreaWidth) {
              currentX = 50;
              currentY += sideboardHeight + padding;
            }
          } catch (error) {
            console.error('Error loading sideboard card image:', error);
          }
        }
      }

      // Add swudb.com watermark
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('CRD-88', canvas.width - 50, canvas.height - 30);

      // Convert canvas to image
      const imageUrl = canvas.toDataURL('image/png');
      onImageGenerated(imageUrl);
    } catch (error) {
      console.error('Error generating deck image:', error);
    }
  };

  useEffect(() => {
    if (deck && canvasRef.current) {
      generateDeckImage();
    }
  }, [deck]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ display: 'none' }}
    />
  );
};

export default DeckImageGenerator;
