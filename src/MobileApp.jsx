import { useState } from 'react'
import OneriPage from './pages/OneriPage'
import FabrikasyonPage from './pages/FabrikasyonPage'

export default function MobileApp() {
  const [tab, setTab] = useState('fabrikasyon')

  return (
    <div className="min-h-screen bg-[#070d1f] text-white flex flex-col">
      {/* Sayfa */}
      <div className="flex-1 overflow-y-auto pb-20">
        {tab === 'oneri'      && <OneriPage />}
        {tab === 'fabrikasyon' && <FabrikasyonPage />}
      </div>

      {/* Alt Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1630] border-t border-white/10 flex">
        <button
          onClick={() => setTab('fabrikasyon')}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
            tab === 'fabrikasyon' ? 'text-amber-400' : 'text-white/30'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px] font-semibold">Fabrikasyon</span>
        </button>

        <button
          onClick={() => setTab('oneri')}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
            tab === 'oneri' ? 'text-amber-400' : 'text-white/30'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-[10px] font-semibold">Öneri & Analiz</span>
        </button>
      </nav>
    </div>
  )
}
