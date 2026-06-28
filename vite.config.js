import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/lme': {
        target: 'https://query2.finance.yahoo.com',
        changeOrigin: true,
        rewrite: () => '/v8/finance/chart/ALI=F?interval=1d&range=1mo',
        secure: true,
      },
    },
  },
})
