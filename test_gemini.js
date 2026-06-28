const KEY = process.argv[2]
if (!KEY) { process.exit(1) }

// Test gemini-2.5-flash with thinkingBudget:0 and text
async function testThinking() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`
  const body = {
    contents: [{ parts: [{ text: 'Say OK' }] }],
    generationConfig: { maxOutputTokens: 20, thinkingConfig: { thinkingBudget: 0 } }
  }
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const d = await r.json()
  if (!r.ok) return `FAIL: ${JSON.stringify(d.error)}`
  return `OK: ${d?.candidates?.[0]?.content?.parts?.[0]?.text}`
}

testThinking().then(console.log).catch(e => console.log('ERR:', e.message))
