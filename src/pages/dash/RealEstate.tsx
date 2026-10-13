import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Calculator, Inbox, MapPinned } from 'lucide-react'
import type { View } from '../Dashboard'
import type { Profile } from '../../auth'
import { Bar, Card, Kpi, Sources, Title } from '../../ui'
import RentPulse from '../../RentPulse'
import { CITY_POS, INDIA_PATH, INDIA_VIEWBOX } from '../../indiaMap'
import { CITIES, HEADLINES, SAMPLE_ENQUIRIES, SOURCES } from '../../data'

// Nudge two bubbles that would otherwise sit on top of each other (Mumbai and Pune are about 120 km apart).
const NUDGE: Record<string, [number, number]> = { Pune: [3, 2.5], Mumbai: [-2, -1], Chennai: [3.5, 0] }

function ClusterMap({ p }: { p: Profile }) {
  const mine = p.onboarding?.cities ?? []
  const [sel, setSel] = useState(CITIES[0].name)
  const city = CITIES.find((c) => c.name === sel) ?? CITIES[0]
  const maxG = Math.max(...CITIES.map((c) => c.gccs))
  return (
    <div className="grid2" style={{ gridTemplateColumns: '1.1fr 1fr', alignItems: 'start' }}>
      <Card>
        <Title>Where GCCs cluster</Title>
        <p className="muted" style={{ fontSize: 13, marginBottom: 10 }}>Tap a circle. Size shows the number of GCCs (Vestian).</p>
        <div className="indiamap" style={{ aspectRatio: `${INDIA_VIEWBOX.w} / ${INDIA_VIEWBOX.h}` }}>
          <svg viewBox={`0 0 ${INDIA_VIEWBOX.w} ${INDIA_VIEWBOX.h}`} role="img" aria-label="Outline of India">
            <motion.path className="land" d={INDIA_PATH} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.6, ease: 'easeInOut' }} />
          </svg>
          {CITIES.map((c, i) => {
            const [x0, y0] = CITY_POS[c.name]
            const [dx, dy] = NUDGE[c.name] ?? [0, 0]
            const x = x0 + dx
            const y = y0 + dy
            const s = 28 + (c.gccs / maxG) * 26
            return (
              <div key={c.name}>
                <motion.button
                  className={`cpin ${sel === c.name ? 'on' : ''}`}
                  style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, x: '-50%', y: '-50%' }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 13, delay: 0.9 + i * 0.13 }}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => setSel(c.name)}
                  aria-label={`${c.name}: ${c.gccs} GCCs`}
                >
                  {c.gccs}
                </motion.button>
                <span className="clabel" style={{ left: `${x}%`, top: `calc(${y}% + ${s / 2 + 3}px)` }}>{c.name}{mine.includes(c.name) ? ' ★' : ''}</span>
              </div>
            )
          })}
        </div>
        <Sources items={[SOURCES.vestian]} />
        <p className="src">Outline: Natural Earth (public domain), India point-of-view boundary. Not a survey map.</p>
      </Card>
      <motion.div key={city.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Card>
          <h3 style={{ fontSize: 22 }}>{city.name}</h3>
          <div className="muted" style={{ fontSize: 13 }}>{city.state}</div>
          <div className="grid2" style={{ marginTop: 16 }}>
            <div className="kpi"><div className="v">{city.gccs}</div><div className="l">GCCs (Vestian)</div></div>
            <div className="kpi"><div className="v">{city.leasingH1 ?? 'n/a'}</div><div className="l">{city.leasingH1 ? 'mn sq ft leased by GCCs, H1 2025' : 'H1 2025 leasing not found'}</div></div>
          </div>
          {city.zinnov && <p className="src">Zinnov reports {city.zinnov} GCCs here, so treat the count as a range.</p>}
          <Sources items={[SOURCES.anarock]} />
        </Card>
      </motion.div>
    </div>
  )
}

function Demand() {
  return (
    <Card>
      <Title sample>Companies looking for space</Title>
      <table className="table">
        <thead><tr><th>Company</th><th>City</th><th>Seats</th><th>Timeline</th><th>Looking for</th></tr></thead>
        <tbody>
          {SAMPLE_ENQUIRIES.map((e, i) => (
            <motion.tr key={e.company} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <td><b>{e.company}</b></td><td>{e.city}</td><td>{e.seats}</td><td>{e.timeline}</td><td>{e.type}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <p className="src">Enquiries are invented for this demo. In the product, a company's interest is shared only after it agrees.</p>
    </Card>
  )
}

function Leasing() {
  const rows = CITIES.filter((c) => c.leasingH1 !== null)
  const max = Math.max(...rows.map((c) => c.leasingH1 ?? 0))
  return (
    <div className="stack">
      <RentPulse />
      <div className="grid3">
        <Kpi value={`₹${HEADLINES.avgRent}`} label="national average rent, per sq ft per month" note="ANAROCK H1 2025" />
        <Kpi value={HEADLINES.gccLeasingShare} label="GCC share of gross leasing, 2023-24" note="Top 7 cities, ANAROCK" />
        <Kpi value="+188%" label="Pune office absorption growth, H1 2025" note="ANAROCK via press" />
      </div>
      <Card>
        <Title>Space leased by GCCs, H1 2025 (mn sq ft)</Title>
        {rows.map((c) => <Bar key={c.name} value={c.leasingH1 ?? 0} max={max} label={c.name} right={`${c.leasingH1}`} />)}
        <p className="src">Mumbai is missing because no H1 2025 figure was found. Sources use different city sets and definitions.</p>
        <Sources items={[SOURCES.anarock, SOURCES.realtynmore]} />
      </Card>
    </div>
  )
}

export const realestateViews: View[] = [
  { id: 'map', label: 'Cluster map', icon: MapPinned, title: 'Where demand is forming', subtitle: 'See which cities hold the most GCCs, and how much space they take.', render: (p) => <ClusterMap p={p} /> },
  { id: 'demand', label: 'Demand', icon: Inbox, title: 'Who is looking for space', subtitle: 'Companies that are scouting, before they sign a lease.', render: () => <Demand /> },
  { id: 'lease', label: 'Leasing', icon: BarChart3, title: 'Leasing and rent benchmarks', subtitle: 'GCC leasing by city, with the national rent.', render: () => <Leasing /> },
  { id: 'calc', label: 'Deal sizer', icon: Calculator, title: 'Size a deal', subtitle: 'A quick monthly rent number for any seat count.', render: () => <Sizer /> },
]

function Sizer() {
  const [seats, setSeats] = useState(300)
  const sqft = seats * 100
  return (
    <>
    <RentPulse />
    <div className="grid2" style={{ alignItems: 'start' }}>
      <Card>
        <Title>Seats</Title>
        <label className="lbl">{seats} seats at 100 sq ft each</label>
        <input className="slider" type="range" min={20} max={1000} step={10} value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
      </Card>
      <Card className="kpi">
        <div className="l">Monthly rent at the national average</div>
        <div className="v" style={{ fontSize: 38, marginTop: 6 }}>₹{((sqft * HEADLINES.avgRent) / 1e5).toFixed(1)} lakh</div>
        <div className="muted" style={{ marginTop: 6 }}>{sqft.toLocaleString()} sq ft · actual rents vary by city and building</div>
        <Sources items={[SOURCES.anarock]} />
      </Card>
    </div>
    </>
  )
}
