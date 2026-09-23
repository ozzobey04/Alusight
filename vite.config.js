import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      // Westmetall — LME Aluminium Cash-Settlement tablosu (CORS göndermiyor)
      '/api/westmetall': {
        target: 'https://www.westmetall.com',
        changeOrigin: true,
        rewrite: () => '/en/markdaten.php?action=table&field=LME_Al_cash',
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
          Accept: 'text/html',
        },
      },
      // TCMB — günlük döviz kurları bülteni (CORS göndermiyor)
      '/api/tcmb': {
        target: 'https://www.tcmb.gov.tr',
        changeOrigin: true,
        rewrite: () => '/kurlar/today.xml',
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
          Accept: 'application/xml',
        },
      },
      '/api/lme': {
        target: 'https://query2.finance.yahoo.com',
        changeOrigin: true,
        rewrite: () => '/v8/finance/chart/ALI=F?interval=1d&range=1mo',
        secure: true,
      },
    },
  },
})
