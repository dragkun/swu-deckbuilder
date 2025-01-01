import { useState } from "react"

const CardTitle = ({card, cache}) => {
  const [showImage, setShowImage] = useState(false)
  return (
    <div 
      onMouseEnter={() => setShowImage(true)} 
      onMouseLeave={() => setShowImage(false)}
      style={{position: 'relative', overflow: 'visible'}}
      className='card-title'
    >
      {card.unique && (<span>♦ </span>)}{`${card.title}${card.unique ? `, ${card.subtitle}` : ''}`}
      {showImage && (
        <div style={{position: 'absolute', top: '-100px', left: '200px', zIndex: 100}}>
          <img src={cache[card.image.front]} style={{maxWidth: '300px'}} />
        </div>
      )}
    </div>
  )
}

export default CardTitle