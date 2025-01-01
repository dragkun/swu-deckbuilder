import React, { useState } from 'react';
import { FiInfo } from "@react-icons/all-files/fi/FiInfo";
import '../styles/Disclaimer.scss';

const Disclaimer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="disclaimer">
      <div className="disclaimer__content">
        <div className="disclaimer__content-text">
          <FiInfo />
          <span>
            Unofficial Fan App | Not affiliated with Fantasy Flight Games or Lucasfilm Ltd.
            <button
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Hide Details' : 'View Details'}
            </button>
          </span>
        </div>
      </div>
      
      {isOpen && (
        <div className="disclaimer__details">
          <p>
            CRD-88 is an unofficial Fan Application. It is not affiliated with, sponsored, or endorsed by 
            Fantasy Flight Games, Lucasfilm Ltd., Disney, or any of their subsidiaries, employees, or associates.
          </p>
          <p>
            Star Wars Unlimited™ is a trademark of Fantasy Flight Games. Star Wars is a trademark of Lucasfilm Ltd.
            All card images, art, and text are copyright their respective owners.
          </p>
        </div>
      )}
    </div>
  );
};

export default Disclaimer;
