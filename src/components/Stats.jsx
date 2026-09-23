import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 8, suffix: '+', label: 'Yıl Deneyim', desc: 'Sektörde güvenilir geçmiş' },
  { value: 100, suffix: '+', label: 'Tamamlanan Proje', desc: 'Türkiye genelinde' },
  { value: 100, suffix: '+', label: 'Mutlu Müşteri', desc: 'Kurumsal & bireysel' },
  { value: 20000, suffix: '+', label: 'm² Uygulama', desc: 'Toplam yüzey alanı' },
]

function useCounter(target, duration = 2000, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration])
  return count
}

function StatCard({ stat, started, index }) {
  const count = useCounter(stat.value, 1800 + index * 200, started)
  const display = count >= 1000 ? (count / 1000).toFixed(count % 1000 === 0 ? 0 : 0) + 'K' : count
  return (
    <div className="text-center group px-8 py-10 relative">
      <div className="font-display text-5xl md:text-6xl font-800 text-gradient-gold mb-2">
        {display}{stat.suffix}
      </div>
      <div className="font-display text-lg font-600 text-white mb-1">{stat.label}</div>
      <div className="text-white/40 text-sm">{stat.desc}</div>
      {/* Vertical separator (not on last) */}
    </div>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-alusight-800 via-alusight-700 to-alusight-800" />
      <div className="absolute inset-0 hero-grid-bg opacity-30" />

      {/* Top/Bottom gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[200px] rounded-full bg-gold-500/5 blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-alusight-500/30">
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} started={started} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
