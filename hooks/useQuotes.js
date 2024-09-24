import { useState, useEffect } from 'react';
import { fetchQuote } from '../services/quotesServices';

export function useQuotes() {
  const [quote, setQuote] = useState(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getQuote = async () => {
      const data = await fetchQuote();
      if (isMounted && data) {
        setQuote(data);
        setIsLoadingQuote(false);
      }
    };

    getQuote();

    return () => {
      isMounted = false;
    };
  }, []);

  return { quote, isLoadingQuote };
}
