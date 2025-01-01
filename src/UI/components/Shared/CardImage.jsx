import React, { useState, useEffect } from 'react'

import '../../styles/CardImage.scss'

const CardImage = ({ frontImage, backImage, onClick, allowZoom }) => {
  const [displayImage, setDisplayImage] = useState(frontImage)

  useEffect(() => {
     setDisplayImage(frontImage)    
  }, [frontImage])
   
  const imageFlip = () => {
    if (displayImage === backImage) {
      setDisplayImage(frontImage)
    } else {
      setDisplayImage(backImage)
    }
  }

  return (
    <div style={{display: 'inline-block', position: 'relative'}} className={allowZoom ? 'zoom' : ''}>
      <img 
        src={displayImage} 
        style={{minWidth: '230px', maxWidth: '280px', height: 'auto'}}
        onClick={onClick}
      />
      {backImage && (
        <div className="flip-card" data-tooltip="Flip Card" onClick={() => imageFlip()}>↻</div>
      )}
    </div>
  )
}

export default CardImage