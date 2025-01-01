import React, { useState, useEffect } from 'react'
import '../styles/Loading.scss'

const Loading = () => {
  const loadingStates = [
    'Loading Card Data...',
    'Loading Images...',
    'Loading Decks...',
    'Loading Collection...',
    'Getting Everything Ready...'
  ]

  const [currentState, setCurrentState] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((current) => 
        current < loadingStates.length - 1 ? current + 1 : current
      )
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">{loadingStates[currentState]}</p>
    </div>
  )
}

export default Loading
