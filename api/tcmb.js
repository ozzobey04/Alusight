/* TCMB — günlük döviz kurları bülteni (today.xml).
 * Kaynak CORS başlığı göndermediği için tarayıcı doğrudan okuyamaz;
 * bu uç nokta XML'i sunucu tarafında çekip aynen iletir.
 */
const TCMB_URL = 'https://www.tcmb.gov.tr/kurlar/today.xml'

export default async function handler(req, res) {
  try {
    const r = await fetch(TCMB_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        Accept: 'application/xml',
      },
    })
    if (!r.ok) {
      res.status(502).json({ error: `tcmb ${r.status}` })
      return
    }
    const xml = await r.text()
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Access-Control-Allow-Origin', '*')
    // Bülten iş günlerinde 15:30 civarı yenilenir — 30 dk önbellek yeterli
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=7200')
    res.status(200).send(xml)
  } catch {
    res.status(502).json({ error: 'tcmb fetch failed' })
  }
}
