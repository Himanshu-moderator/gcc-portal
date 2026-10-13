// A rolling bar of the latest published rent benchmarks. Not a live feed: there is no
// government live price for office rent, so each item says when it was published and opens its source.

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { RENT_PULSE } from './data'

export default function RentPulse() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((x) => (x + 1) % RENT_PULSE.length), 4500)
    return () => clearInterval(t)
  }, [paused])
  const item = RENT_PULSE[i]
  return (
    <a className="pulse" href={item.url} target="_blank" rel="noreferrer" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <span className="pulse-dot" />
      <div className="pulse-body">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <div className="muted" style={{ fontSize: 12 }}>{item.label}</div>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
              <b style={{ fontFamily: 'var(--display)', fontSize: 18 }}>{item.value}</b>
              <span className="muted" style={{ fontSize: 13 }}>{item.note}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="muted" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>Latest published, not live · Open source <ExternalLink size={12} style={{ verticalAlign: -1 }} /></span>
    </a>
  )
}
