// A state's GCC policy as an expandable card: key points first, sources one tap away.

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ExternalLink } from 'lucide-react'
import type { Policy } from './data'

export default function PolicyCard({ p, defaultOpen = false }: { p: Policy; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`card policy ${open ? 'open' : ''}`}>
      <button className="policy-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div style={{ textAlign: 'left', minWidth: 0 }}>
          <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 19 }}>{p.state}</h3>
            <span className="chip">{p.policy}</span>
          </div>
          <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>{p.target}</div>
        </div>
        <ChevronDown size={20} className="chev" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden', padding: '0 20px' }}>
            <div style={{ padding: '16px 0 18px' }}>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <span className="chip on">{p.dated}</span>
                {p.official && <span className="badge">Official page linked</span>}
              </div>
              <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginTop: 12 }}>{p.note}</p>
              <ul className="points">
                {p.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <div className="links">
                {p.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} <ExternalLink size={13} /></a>
                ))}
              </div>
              <p className="src">Summaries are drawn from the sources above. Confirm amounts and eligibility on the official notification before relying on them.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
