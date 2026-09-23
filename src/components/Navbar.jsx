import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { usePlan } from '../hooks/usePaywall'

const isNative = typeof window !== 'undefined' && !!window?.Capacitor?.isNativePlatform?.()

const navLinks = [
  { label: 'Anasayfa',  href: '#hero',      section: true },
  { label: 'Hizmetler', href: '#hizmetler', section: true },
  { label: 'Neden Biz', href: '#neden-biz', section: true },
  {
    label: 'Hesaplamalar',
    dropdown: [
      { label: 'Isı Geçirgenlik Hesabı',  path: '/flixo',   icon: '🌡' },
      { label: 'PVC',                      path: '/pvc',     icon: '📐' },
      { label: 'Karbon Ayak İzi',          path: '/carbon',  icon: '🌿' },
      { label: 'Cam Hesaplayıcı',          path: '/cam',     icon: '🪟' },
      { label: 'Rüzgar Yükü',             path: '/ruzgar',  icon: '💨' },
    ],
  },
  {
    label: 'Araçlar',
    dropdown: [
      { label: 'Öneri & Analiz',       path: '/oneri',        icon: '🔍' },
      { label: 'Fabrikasyon Kontrol',  path: '/fabrikasyon',  icon: '🔧' },
      { label: 'Bildirim Merkezi',     path: '/bildirim',     icon: '🔔' },
    ],
  },

  { label: 'Projeler',  href: '#projeler',  section: true },
  { label: 'Fiyatlar', path: '/fiyatlar' },
  { label: 'Teklif Al', href: '#teklif',    section: true, cta: true },
  { label: 'İletişim',  href: '#iletisim',  section: true },
]

const CALC_PATHS = ['/flixo', '/pvc', '/carbon', '/cam', '/ruzgar']
const TOOL_PATHS = ['/oneri', '/fabrikasyon']

export default function Navbar({ calcMode = false }) {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [activeLink,   setActiveLink]   = useState('#hero')
  const [openDropIdx,  setOpenDropIdx]  = useState(null)
  const [mobileOpenIdx, setMobileOpenIdx] = useState(null)

  const dropRefs = useRef([])
  const navigate  = useNavigate()
  const location  = useLocation()
  const { plan, remainingFree } = usePlan()

  const isCalcPage = location.pathname !== '/'

  useEffect(() => {
    if (isCalcPage) return
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const sectionHrefs = navLinks.filter(l => l.section).map(l => l.href)
      for (let i = sectionHrefs.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionHrefs[i].slice(1))
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveLink(sectionHrefs[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isCalcPage])

  useEffect(() => {
    const handler = (e) => {
      const clickedInside = dropRefs.current.some(r => r && r.contains(e.target))
      if (!clickedInside) setOpenDropIdx(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSectionNav = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    setOpenDropIdx(null)
    if (isCalcPage) {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(href.slice(1))
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(href.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCalcNav = (path) => {
    setMenuOpen(false)
    setOpenDropIdx(null)
    setMobileOpenIdx(null)
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleDrop = (idx) => setOpenDropIdx(prev => prev === idx ? null : idx)
  const toggleMobileDrop = (idx) => setMobileOpenIdx(prev => prev === idx ? null : idx)

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || isCalcPage
        ? 'bg-alusight-900/95 backdrop-blur-md shadow-[0_1px_0_rgba(201,168,76,0.15)]'
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-24">

        {/* Logo — sadece web'de */}
        {!isNative && (
        <div className="flex-shrink-0 flex flex-col items-start">
          <button onClick={() => { navigate('/'); window.scrollTo({ top: 0 }) }}>
            <Logo className="w-40" />
          </button>
        </div>
        )}

        {/* Plan badge — sadece hesap sayfalarında görünür */}
        {isCalcPage && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: plan === 'pro' ? 'rgba(201,168,76,0.12)' : plan === 'calc' ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${plan !== 'free' ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 20, padding: '4px 12px',
            fontSize: 11, fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
            color: plan !== 'free' ? '#c9a84c' : 'rgba(255,255,255,0.75)',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: plan !== 'free' ? '#c9a84c' : 'rgba(255,255,255,0.25)', flexShrink: 0 }}/>
            {plan === 'pro' ? 'PRO' : plan === 'calc' ? 'HESAPLAMALAR' : `ÜCRETSİZ · ${remainingFree} kalan`}
          </div>
        )}

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, idx) => (
            <li key={idx} className="relative">
              {link.cta ? (
                <a
                  href={link.href}
                  onClick={(e) => handleSectionNav(e, link.href)}
                  className="ml-4 btn-primary text-xs"
                >
                  {link.label}
                </a>
              ) : link.dropdown ? (
                <div ref={el => dropRefs.current[idx] = el}>
                  {(() => {
                    const isActive = link.dropdown.some(s => location.pathname === s.path)
                    const isOpen = openDropIdx === idx
                    return (
                      <>
                        <button
                          onClick={() => toggleDrop(idx)}
                          className={`relative font-display font-500 text-sm tracking-wide px-4 py-2 transition-colors duration-200 flex items-center gap-1.5 group ${
                            isActive || isOpen ? 'text-gold-400' : 'text-white/90 hover:text-white'
                          }`}
                        >
                          {link.label}
                          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                          <span className={`absolute bottom-0 left-4 right-4 h-px bg-gold-500 transition-transform duration-300 origin-left ${
                            isActive || isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`} />
                        </button>

                        {isOpen && (
                          <div className="absolute top-full left-0 mt-1 w-64 bg-[#0a1128] border border-gold-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
                            style={{ borderRadius: 2 }}>
                            {link.dropdown.map((sub) => (
                              <button
                                key={sub.path}
                                onClick={() => handleCalcNav(sub.path)}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all duration-200 border-b border-white/5 last:border-0 hover:bg-gold-500/10 text-left ${
                                  location.pathname === sub.path ? 'text-gold-400 bg-gold-500/10' : 'text-white/90 hover:text-white'
                                }`}
                              >
                                <span className="text-base">{sub.icon}</span>
                                <span className="font-display tracking-wide">{sub.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              ) : link.path ? (
                <button
                  onClick={() => handleCalcNav(link.path)}
                  className={`relative font-display font-500 text-sm tracking-wide px-4 py-2 transition-colors duration-200 group ${
                    location.pathname === link.path ? 'text-gold-400' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-4 right-4 h-px bg-gold-500 transition-transform duration-300 origin-left ${
                    location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              ) : (
                <a
                  href={link.href}
                  onClick={(e) => handleSectionNav(e, link.href)}
                  className={`relative font-display font-500 text-sm tracking-wide px-4 py-2 transition-colors duration-200 group ${
                    !isCalcPage && activeLink === link.href ? 'text-gold-400' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-4 right-4 h-px bg-gold-500 transition-transform duration-300 origin-left ${
                    !isCalcPage && activeLink === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Calc page back */}
        {isCalcPage && (
          <button onClick={() => navigate('/')}
            className="hidden lg:flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfa
          </button>
        )}

        {/* Mobile Toggle */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 bg-alusight-800/98 backdrop-blur-md border-t border-alusight-500/30 ${
        menuOpen ? 'max-h-[40rem] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <ul className="px-6 py-4 flex flex-col gap-1">
          {isCalcPage && (
            <li>
              <button onClick={() => { navigate('/'); setMenuOpen(false) }}
                className="flex items-center gap-2 py-3 text-gold-400 text-sm font-display border-b border-alusight-500/20 w-full">
                ← Ana Sayfa
              </button>
            </li>
          )}
          {navLinks.map((link, idx) => (
            <li key={idx}>
              {link.dropdown ? (
                <div>
                  <button
                    onClick={() => toggleMobileDrop(idx)}
                    className={`w-full text-left flex items-center justify-between font-display font-500 text-sm tracking-wide py-3 border-b border-alusight-500/20 transition-colors ${
                      link.dropdown.some(s => location.pathname === s.path) || mobileOpenIdx === idx
                        ? 'text-gold-400' : 'text-white/90'
                    }`}
                  >
                    {link.label}
                    <svg className={`w-3.5 h-3.5 transition-transform ${mobileOpenIdx === idx ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileOpenIdx === idx && (
                    <div className="pl-4 pb-1">
                      {link.dropdown.map(sub => (
                        <button key={sub.path} onClick={() => handleCalcNav(sub.path)}
                          className={`flex items-center gap-2 py-2.5 text-sm border-b border-white/5 w-full transition-colors ${
                            location.pathname === sub.path ? 'text-gold-400' : 'text-white/85 hover:text-white'
                          }`}>
                          <span>{sub.icon}</span><span>{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.path ? (
                <button onClick={() => handleCalcNav(link.path)}
                  className={`block w-full text-left font-display font-500 text-sm tracking-wide py-3 border-b border-alusight-500/20 transition-colors ${
                    location.pathname === link.path ? 'text-gold-400' : 'text-white/90 hover:text-white'
                  }`}>
                  {link.label}
                </button>
              ) : (
                <a href={link.href} onClick={(e) => handleSectionNav(e, link.href)}
                  className={`block font-display font-500 text-sm tracking-wide py-3 border-b border-alusight-500/20 transition-colors ${
                    link.cta ? 'text-gold-400 font-600' :
                    !isCalcPage && activeLink === link.href ? 'text-gold-400' : 'text-white/90 hover:text-white'
                  }`}>
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
