import { useState, useEffect } from 'react';

const useHandleClick = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Safe to access browser-specific APIs here
    }
  }, []);

  const handleClick = async (actionType, setCurrentAction, setShowEmailPopup) => {
    setLoading(true);
    
    let id = localStorage.getItem(`${actionType}Id`);

    if (id) {
      const url = actionType === 'doc' ? `https://docs.google.com/document/d/${id}/edit` : `https://docs.google.com/spreadsheets/d/${id}/edit`;
      window.open(url);
    } else {
      setCurrentAction(actionType);
      setShowEmailPopup(true);
    }
    setLoading(false);
  };

  return { loading, handleClick };
};

export default useHandleClick;
