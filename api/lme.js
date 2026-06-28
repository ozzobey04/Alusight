export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')

  try {
    const r = await fetch(
      'https://query2.finance.yahoo.com/v8/finance/chart/ALI=F?interval=1d&range=1mo',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
    const data = await r.json()
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
