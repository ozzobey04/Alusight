/* Westmetall — LME Aluminium Cash-Settlement tablosu.
 * Kaynak site CORS başlığı göndermediği için tarayıcı doğrudan okuyamaz;
 * bu uç nokta HTML'i sunucu tarafında çekip aynen iletir.
 * (Vercel/Netlify tarzı Node serverless çalışma zamanı içindir.)
 */
const WM_URL = 'https://www.westmetall.com/en/markdaten.php?action=table&field=LME_Al_cash'

export default async function handler(req, res) {
  try {
    const r = await fetch(WM_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        Accept: 'text/html',
      },
    })
    if (!r.ok) {
      res.status(502).json({ error: `westmetall ${r.status}` })
      return
    }
    const html = await r.text()
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Access-Control-Allow-Origin', '*')
    // Günde bir kez güncellenen veri — 15 dk önbellek yeterli
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600')
    res.status(200).send(html)
  } catch (e) {
    res.status(502).json({ error: 'westmetall fetch failed' })
  }
}
