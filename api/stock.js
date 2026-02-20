export default async function handler(req, res) {
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

    const pathStr = Array.isArray(path) ? path.join('') : path;

    const codes = pathStr.split('_').map(code => {
      if (code.startsWith('sh')) return 'SHSZ' + code.replace('sh', '');
      if (code.startsWith('sz')) return 'SHSZ' + code.replace('sz', '');
      return code;
    });

    const token = 'e38d2c3eaade4254960fd140f6853fc7a43c35a3851b41dfb8621178693bb951';
    const targetUrl = `https://api.itick.org/stock/quotes?token=${token}&region=CN&code=${codes.join(',')}`;

    console.log(`Fetching from iTick: ${targetUrl}`);

    const response = await fetch(targetUrl);
    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
}
