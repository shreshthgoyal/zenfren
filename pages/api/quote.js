export default async function handler(req, res) {
    try {
      const response = await fetch('https://api.quotable.io/random?tags=life|happiness&maxLength=50');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      res.status(500).json({ error: 'Failed to fetch quote' });
    }
  }
  