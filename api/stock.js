export default async function handler(req, res) {
  const { path } = req.query;
  
  if (!path) {
    return res.status(400).json({ error: 'Path parameter is required' });
  }

  const url = `https://hq.sinajs.cn/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        Referer: 'https://finance.sina.com.cn/'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Upstream error');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Copy essential headers
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    res.send(buffer);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
