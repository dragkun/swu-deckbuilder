import React, { useState } from 'react'
import NavBar from './NavBar'
import { ThemeProvider } from "./contexts/ThemeContext";
import Main from './Main';
import Disclaimer from './components/Disclaimer';

import '@picocss/pico/css/pico.min.css';
import './styles/Application.scss';

const App = () => {
  const [currentView, setCurrentView] = useState('loading');
  return (
    <ThemeProvider>
      <div className="app-container">
        <div className="app-content">
          <NavBar setCurrentView={setCurrentView} currentView={currentView} /> 
          <Main currentView={currentView} setCurrentView={setCurrentView} />
        </div>
        <Disclaimer />
      </div>
    </ThemeProvider>
  )
}

export default App