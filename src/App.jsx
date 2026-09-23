import { Component, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import SlidingIntro from './components/SlidingIntro'
import AnimatedBg from './components/AnimatedBg'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Stats from './components/Stats'
import WhyUs from './components/WhyUs'
import Projects from './components/Projects'
import Quote from './components/Quote'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AIAssistant from './components/AIAssistant'
import LMEWidget from './components/LMEWidget'
import FlixoPage from './pages/FlixoPage'
import PvcPage from './pages/PvcPage'
import CarbonPage from './pages/CarbonPage'
import OneriPage from './pages/OneriPage'
import FabrikasyonPage from './pages/FabrikasyonPage'
import BilgiPage from './pages/BilgiPage'
import CamPage from './pages/CamPage'
import RuzgarPage from './pages/RuzgarPage'
import PricingPage from './pages/PricingPage'
import MusteriPortalPage from './pages/MusteriPortalPage'
import BildirimPage from './pages/BildirimPage'
import HakkimizdaPage from './pages/HakkimizdaPage'
import SssPage from './pages/SssPage'
import GizlilikPolitikasiPage from './pages/GizlilikPolitikasiPage'
import KullanimKosullariPage from './pages/KullanimKosullariPage'
import KvkkPage from './pages/KvkkPage'

const isNative = typeof window !== 'undefined' && !!window?.Capacitor?.isNativePlatform?.()

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-10 text-center">
          <div>
            <div className="text-red-400 text-xl font-bold mb-3">Sayfa Yüklenirken Hata</div>
            <pre className="text-white/60 text-xs bg-white/5 p-4 rounded-lg max-w-xl overflow-auto text-left">
              {this.state.error.message}
              {'\n'}
              {this.state.error.stack?.slice(0, 600)}
            </pre>
            <button onClick={() => this.setState({ error: null })}
              className="mt-4 px-4 py-2 bg-gold-500 text-black text-sm font-bold rounded">
              Yeniden Dene
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function HomePage() {
  return (
    <div className="bg-alusight-900 text-white overflow-x-hidden">
      <AnimatedBg />
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />
        <Hero />
        <Services />
        <Stats />
        <WhyUs />
        <Projects />
        <Quote />
        <Contact />
        <Footer />
      </div>
      <AIAssistant />
      {!isNative && <LMEWidget />}
      <a
        href="https://wa.me/905358610404"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geç"
        style={{ zIndex: 50 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] hover:bg-[#1fba58] shadow-[0_4px_20px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  )
}

function CalcLayout({ children }) {
  return (
    <div className="bg-alusight-900 text-white min-h-screen overflow-x-hidden">
      <AnimatedBg />
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar calcMode />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Footer />
      </div>
      <AIAssistant />
    </div>
  )
}

// Sayfa her yenilendiğinde sıfırlanır, SPA navigasyonunda korunur
let _introShownThisLoad = false

export default function App() {
  const [introOk, setIntroOk] = useState(() => _introShownThisLoad)

  function handleIntroDone() {
    _introShownThisLoad = true
    setIntroOk(true)
  }

  return (
    <ErrorBoundary>
      {!introOk && <SlidingIntro onDone={handleIntroDone} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flixo"       element={<CalcLayout><FlixoPage /></CalcLayout>} />
        <Route path="/pvc"         element={<CalcLayout><PvcPage /></CalcLayout>} />
        <Route path="/carbon"      element={<CalcLayout><CarbonPage /></CalcLayout>} />
        <Route path="/oneri"       element={<CalcLayout><OneriPage /></CalcLayout>} />
        <Route path="/fabrikasyon" element={<CalcLayout><FabrikasyonPage /></CalcLayout>} />
        <Route path="/cam"         element={<CalcLayout><CamPage /></CalcLayout>} />
        <Route path="/ruzgar"      element={<CalcLayout><RuzgarPage /></CalcLayout>} />
        <Route path="/fiyatlar"    element={<CalcLayout><PricingPage /></CalcLayout>} />
        <Route path="/musteri"     element={<MusteriPortalPage />} />
        <Route path="/bildirim"    element={<CalcLayout><BildirimPage /></CalcLayout>} />
        <Route path="/hakkimizda"  element={<CalcLayout><HakkimizdaPage /></CalcLayout>} />
        <Route path="/sss"         element={<CalcLayout><SssPage /></CalcLayout>} />
        <Route path="/gizlilik"    element={<CalcLayout><GizlilikPolitikasiPage /></CalcLayout>} />
        <Route path="/kullanim-kosullari" element={<CalcLayout><KullanimKosullariPage /></CalcLayout>} />
        <Route path="/kvkk"        element={<CalcLayout><KvkkPage /></CalcLayout>} />
      </Routes>
    </ErrorBoundary>
  )
}
