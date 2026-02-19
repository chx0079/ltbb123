const https = require('https');

module.exports = (req, res) => {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Path parameter is required' });
  }

  // Construct the target URL
  const url = `https://hq.sinajs.cn/${path}`;

  const options = {
    headers: {
      'Referer': 'https://finance.sina.com.cn/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  const proxyReq = https.get(url, options, (proxyRes) => {
    // Forward status code
    res.status(proxyRes.statusCode);

    // Forward content-type
    if (proxyRes.headers['content-type']) {
      res.setHeader('Content-Type', proxyRes.headers['content-type']);
    }

    // Pipe the response stream directly to the client response
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    console.error('Proxy error:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  });
};
