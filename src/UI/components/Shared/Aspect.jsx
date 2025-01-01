import React, { useState, useEffect } from 'react'

import '../../styles/Aspect.scss'

import Aggression from '../../images/SWH_Aspects_Aggression.png'
import Command from '../../images/SWH_Aspects_Command.png'
import Cunning from '../../images/SWH_Aspects_Cunning.png'
import Heroism from '../../images/SWH_Aspects_Heroism.png'
import Vigilance from '../../images/SWH_Aspects_Vigilance.png'
import Villainy from '../../images/SWH_Aspects_Villainy.png'

const Aspect = ({aspect}) => {
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (aspect === 'Aggression') {
      setImage(Aggression)
    } else if (aspect === 'Command') {
      setImage(Command)
    } else if (aspect === 'Cunning') {
      setImage(Cunning)
    } else if (aspect === 'Heroism') {
      setImage(Heroism)
    } else if (aspect === 'Vigilance') {
      setImage(Vigilance)
    } else if (aspect === 'Villainy') {
      setImage(Villainy)
    }
  }, [aspect])

  return (
    <div>
      <img src={image} className="aspect" style={{opacity: 0}} onLoad={(e) => {e.target.style.opacity = 1}} />
    </div>
  )
}

export default Aspect