import React, { useEffect, useState } from 'react';

const VersionDisplay = () => {
  const [version, setVersion] = React.useState('');

  useEffect(() => {
    window.electron.app.getVersion().then((info) => {
      if (info) {
        setVersion(info);
      }
    });
  }, []);

  return (
    <div className="text-sm opacity-50">
      v{version}
    </div>
  );
};

export default VersionDisplay;
