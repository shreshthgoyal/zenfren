import { useState, useEffect } from 'react';

const useHandleClick = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // This hook only needs to execute in the browser.
    if (typeof window === 'undefined') return;
  }, []);

  const handleClick = async (actionType, setCurrentAction, setShowEmailPopup) => {
    if (typeof window === 'undefined') return;

    setLoading(true);
    let id = localStorage.getItem(`${actionType}Id`);

    if (id) {
      const url =
        actionType === 'doc'
          ? `https://docs.google.com/document/d/${id}/edit`
          : `https://docs.google.com/spreadsheets/d/${id}/edit`;
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
