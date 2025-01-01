import React, { useState, useEffect } from 'react'
import './styles/NavBar.scss'
import ColorSchemeSwitcher from './components/ColorSchemeSwitcher';
import UpdateNotification from './components/UpdateNotification';
import VersionDisplay from './components/VersionDisplay';

const NavBar = ({setCurrentView, currentView}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (currentView === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [currentView])


  const handleViewChange = (view) => {
    setCurrentView(view);
  }

  return (
    <>
      {!loading && (
        <header className="navbar">
          <nav className="nav-links">
            <ul><li><span className="brand">CRD-88</span></li></ul>
            <ul>
              <li><a href="#" onClick={() => handleViewChange('myDecks')}>My Decks</a></li>
              
            </ul>
            <ul>
              <UpdateNotification />
            </ul>
            <ul>
              <li>
                <VersionDisplay />
              </li>
              <ColorSchemeSwitcher />
            </ul>
          </nav>
        </header>
      )} 
    </>
  )
}

export default NavBar