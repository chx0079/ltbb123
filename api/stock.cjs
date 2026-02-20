const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    // Ensure path is treated as a string and handle array case if necessary
    const pathStr = Array.isArray(path) ? path.join('') : path;

    // Construct the target URL
    const targetUrl = `https://hq.sinajs.cn/${pathStr}`;
    
    // Log for debugging (Vercel logs)
    console.log(`Proxying request to: ${targetUrl}`);

    const options = {
      headers: {
        'Referer': 'https://finance.sina.com.cn/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const proxyReq = https.get(targetUrl, options, (proxyRes) => {
      // Forward status code
      res.statusCode = proxyRes.statusCode;

      // Forward content-type
      if (proxyRes.headers['content-type']) {
        res.setHeader('Content-Type', proxyRes.headers['content-type']);
      }

      // Handle GBK encoding by piping directly
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (e) => {
      console.error('Proxy request error:', e);
      if (!res.headersSent) {
        res.status(502).json({ error: 'Bad Gateway', details: e.message });
      }
    });

    // Set timeout
    proxyReq.setTimeout(5000, () => {
      console.error('Proxy request timeout');
      proxyReq.destroy();
      if (!res.headersSent) {
        res.status(504).json({ error: 'Gateway Timeout' });
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
};
