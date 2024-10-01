import { useState } from 'react';

const useCreateDocOrSheet = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateDocOrSheet = async (email, action, onSuccess) => {
    if (!email) return;

    setLoading(true);

    try {
      const endpoint = action === 'doc' ? '/api/createDoc' : '/api/createSheet';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      const { docId, sheetId } = data;

      if (action === 'doc') {
        localStorage.setItem('docId', docId);
        window.open(`https://docs.google.com/document/d/${docId}/edit`);
      } else {
        localStorage.setItem('sheetId', sheetId);
        window.open(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`);
      }

      onSuccess(); // Call the onSuccess callback to handle post-creation actions.
    } catch (error) {
      console.error('Error creating document or sheet:', error);
    }

    setLoading(false);
  };

  return { loading, handleCreateDocOrSheet };
};

export default useCreateDocOrSheet;
