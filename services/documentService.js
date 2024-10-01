export const openDocumentOrSheet = (actionType, id) => {
    if (typeof window !== 'undefined') {
      const url =
        actionType === 'doc'
          ? `https://docs.google.com/document/d/${id}/edit`
          : `https://docs.google.com/spreadsheets/d/${id}/edit`;
      window.open(url);
    }
  };
  
  export const saveDocumentIdToLocalStorage = (actionType, id) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${actionType}Id`, id);
    }
  };
  