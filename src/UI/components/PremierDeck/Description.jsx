import React, { useState, useEffect } from 'react'
import { BiHelpCircle } from "@react-icons/all-files/bi/BiHelpCircle"
import { BiSave } from "@react-icons/all-files/bi/BiSave"
import { BiEdit } from "@react-icons/all-files/bi/BiEdit"
import { BiX } from "@react-icons/all-files/bi/BiX"
import ReactMarkdown from 'react-markdown'
import '../../styles/Description.scss'

const Description = ({ deck, setDeck }) => {
  const [showHelp, setShowHelp] = useState(false)
  const [description, setDescription] = useState(deck.description || '')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setDescription(deck.description || '')
  }, [deck.description])

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const saveDescription = () => {
    setDeck({
      ...deck,
      description: description
    })
    window.db.saveDeck(deck).then(() => {
      setIsEditing(false)
    })
  }

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setDescription(deck.description || '')
    setIsEditing(false)
  }

  return (
    <div className="deck-description">
      <div className="description-header">
        <h3>Description</h3>
        <div className="header-actions">
          <button 
            className="help-button"
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
          >
            <BiHelpCircle />
          </button>
          {isEditing ? (
            <>
              <button 
                className="cancel-button"
                onClick={cancelEditing}
              >
                <BiX /> Cancel
              </button>
              <button 
                className="save-button"
                onClick={saveDescription}
                disabled={description === deck.description}
              >
                <BiSave /> Save
              </button>
            </>
          ) : (
            <button 
              className="edit-button"
              onClick={startEditing}
            >
              <BiEdit /> Edit
            </button>
          )}
        </div>
      </div>
      
      {showHelp && (
        <div className="markdown-help">
          <h4>Markdown Formatting Guide</h4>
          <ul>
            <li><code># Heading 1</code></li>
            <li><code>## Heading 2</code></li>
            <li><code>**bold**</code></li>
            <li><code>*italic*</code></li>
            <li><code>- bullet point</code></li>
            <li><code>1. numbered list</code></li>
            <li><code>[link text](url)</code></li>
            <li><code>```code block```</code></li>
          </ul>
        </div>
      )}

      {isEditing ? (
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Add a description for your deck using markdown formatting..."
          rows={15}
        />
      ) : (
        <div className="markdown-content">
          {description ? (
            <ReactMarkdown>{description}</ReactMarkdown>
          ) : (
            <p className="no-description">No description yet. Click Edit to add one.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Description