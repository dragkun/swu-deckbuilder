import React, { useState } from 'react';

const Confirm = ({ message, onConfirm, onCancel, title = 'Confirm Action', children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel();
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>
        {children}
      </span>

      {isOpen && (
        <dialog open>
          <article>
            <header>
              <h3>{title}</h3>
            </header>
            <p>{message}</p>
            <footer>
              <div className="grid">
                <button className="secondary outline" onClick={handleCancel}>
                  Cancel
                </button>
                <button onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </footer>
          </article>
        </dialog>
      )}
    </>
  );
};

export default Confirm;