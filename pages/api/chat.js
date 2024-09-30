export default async function handler(req, res) {
    try {
      const response = await fetch('https://zenfren.onrender.com/chat', {
        method: 'POST',
        // add headers to the request with cors
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ "text": req.body.text, "session_id": req.body.sessionId}),
      }); 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to connect' });
    }
  }