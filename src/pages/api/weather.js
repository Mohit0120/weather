export default async function handler(req, res) {
    const { city } = req.query;
  
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }
  
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(400).json({ error: data.message });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }