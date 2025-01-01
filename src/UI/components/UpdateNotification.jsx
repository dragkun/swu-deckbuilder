import React, { useEffect, useState } from 'react';
import { FiSave } from "@react-icons/all-files/fi/FiSave"

import '../styles/UpdateNotification.scss'

const UpdateNotification = () => {
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    // Listen for update notifications
    window.electron.versionCheck.onUpdateAvailable((info) => {
      setUpdateInfo(info);
    });

    // Optional: Check for updates manually
    window.electron.versionCheck.checkForUpdates().then(info => {
      if (info.updateAvailable) {
        setUpdateInfo(info);
      }
    });
  }, []);

  const handleOpenDownloadPage = (e) => {
    e.preventDefault();
    window.electron.shell.openExternal('https://swu.panic-attack.org/');
  };

  if (!updateInfo) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white">
      <span>
        <button 
          onClick={handleOpenDownloadPage}
          className="update-button"
        >
          New version {updateInfo.serverVersion} available! 
        </button>
      </span>
    </div>
  );
};

export default UpdateNotification;
