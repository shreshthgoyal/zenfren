export async function fetchQuote() {
    try {
      const response = await fetch('https://quotes-api-self.vercel.app/quote');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching quote:', error.message);
      return null;
    }
  }
  