import { useState, useEffect } from 'react';
import { openDocumentOrSheet } from '@/services/documentService';

const useHandleClick = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Prevent execution during SSR
  }, []);

  const handleClick = async (actionType, setCurrentAction, setShowEmailPopup) => {
    if (typeof window === 'undefined') return; // Prevent running in SSR

    setLoading(true);

    let id = localStorage.getItem(`${actionType}Id`);
    if (id) {
      openDocumentOrSheet(actionType, id);
    } else {
      setCurrentAction(actionType);
      setShowEmailPopup(true);
    }
    setLoading(false);
  };

  return { loading, handleClick };
};

export default useHandleClick;
