import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crosshair, Gavel, Radar, TrendingUp } from 'lucide-react'
import type { View } from '../Dashboard'
import type { Profile } from '../../auth'
import { Bar, Card, Kpi, Sources, Title } from '../../ui'
import PolicyCard from '../../PolicyCard'
import { ConnectButton } from '../../Connect'
import { CITIES, HEADLINES, POLICIES, SAMPLE_ENTRANTS, SAMPLE_PROVIDERS, SOURCES } from '../../data'

function Pipeline({ p }: { p: Profile }) {
  const mine = p.onboarding?.cities ?? []
  const [city, setCity] = useState<string>('All')
  const rows = SAMPLE_ENTRANTS.filter((e) => city === 'All' || e.city === city)
  const options = ['All', ...CITIES.map((c) => c.name)]
  return (
    <div className="stack">
      <div className="grid3">
        <Kpi value={`${SAMPLE_ENTRANTS.length}`} label="companies scouting India right now" note="Sample data" />
        <Kpi value={`${SAMPLE_ENTRANTS.filter((e) => e.advisors === 0).length}`} label="with no advisor yet" note="Sample data" />
        <Kpi value={HEADLINES.fy28} label="GCCs expected by FY28" note="Vestian report" />
      </div>
      <Card>
        <Title sample>Companies coming next</Title>
        <div className="row" style={{ flexWrap: 'wrap', margin: '10px 0' }}>
          {options.map((o) => <button key={o} className={`chip ${city === o ? 'on' : ''}`} onClick={() => setCity(o)}>{o}{mine.includes(o) ? ' ★' : ''}</button>)}
        </div>
        <table className="table">
          <thead><tr><th>Company</th><th>From</th><th>City</th><th>Stage</th><th>Seats</th><th>Advisors</th><th>Fit</th><th></th></tr></thead>
          <tbody>
            {rows.map((e) => (
              <motion.tr key={e.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td><b>{e.name}</b></td><td className="muted">{e.from}</td><td>{e.city}</td><td>{e.stage}</td><td>{e.size}</td>
                <td>{e.advisors === 0 ? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Open</span> : e.advisors}</td>
                <td style={{ minWidth: 110 }}><div className="bar"><i style={{ width: `${e.fit}%` }} /></div></td>
                <td><ConnectButton party={{ name: e.name, detail: `${e.from}, looking at ${e.city}` }} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <p className="src">Companies are invented for this demo. "Fit" ranks how well a lead matches your practice and markets.</p>
      </Card>
    </div>
  )
}

function Market() {
  const [src, setSrc] = useState<'vestian' | 'zinnov'>('vestian')
  const bars = CITIES.map((c) => ({ name: c.name, v: src === 'zinnov' && c.zinnov ? parseInt(c.zinnov, 10) : c.gccs, z: src === 'zinnov' && !c.zinnov }))
  const max = Math.max(...bars.map((b) => b.v))
  return (
    <div className="grid2" style={{ alignItems: 'start' }}>
      <Card>
        <Title>GCCs by city</Title>
        <div className="row" style={{ margin: '10px 0' }}>
          <button className={`chip ${src === 'vestian' ? 'on' : ''}`} onClick={() => setSrc('vestian')}>Vestian count</button>
          <button className={`chip ${src === 'zinnov' ? 'on' : ''}`} onClick={() => setSrc('zinnov')}>Zinnov count</button>
        </div>
        {bars.map((b) => <Bar key={b.name} value={b.v} max={max} label={b.name} right={b.z ? 'not reported' : src === 'zinnov' ? `${b.v}+` : String(b.v)} />)}
        <Sources items={[SOURCES.vestian, SOURCES.zinnov]} />
      </Card>
      <Card>
        <Title>Why the numbers disagree</Title>
        <ul className="muted" style={{ lineHeight: 1.7, paddingLeft: 18 }}>
          <li>Bengaluru: Vestian counts 487, Zinnov reports 880+. Same city, nearly double.</li>
          <li>Nationally: Vestian ~1,700 GCCs, NASSCOM 2,900+ units. Units are not the same as parent-company centres.</li>
          <li>Reports also use different city sets and different years.</li>
        </ul>
        <p style={{ marginTop: 12, fontSize: 14 }}>Clients ask you for the "real" number. A good answer shows <b>both</b> and explains the method.</p>
        <Sources items={[SOURCES.cbre]} />
      </Card>
    </div>
  )
}

function League() {
  return (
    <Card>
      <Title sample>Who else advises on GCCs</Title>
      <table className="table">
        <thead><tr><th>Firm</th><th>Practice</th><th>Set-ups delivered</th><th>Rating</th><th>Cities</th></tr></thead>
        <tbody>
          {SAMPLE_PROVIDERS.map((p) => (
            <tr key={p.name}><td><b>{p.name}</b></td><td>{p.kind}</td><td>{p.delivered}</td><td>{p.rating}</td><td className="muted">{p.cities.join(', ')}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="src">Firms and figures are invented for this demo. In the real product, delivered counts come from client-confirmed projects.</p>
    </Card>
  )
}

function Watch() {
  return (
    <div className="stack">
      {POLICIES.map((p) => <PolicyCard key={p.state} p={p} />)}
      <p className="src">Tap a state for what changed and where to read more.</p>
    </div>
  )
}

export const consultantViews: View[] = [
  { id: 'radar', label: 'Radar', icon: Radar, title: 'Your lead radar', subtitle: 'Companies about to set up in India, filtered to your markets.', render: (p) => <Pipeline p={p} /> },
  { id: 'market', label: 'Market', icon: TrendingUp, title: 'The market, with its caveats', subtitle: 'City counts from two sources, and why they differ.', render: () => <Market /> },
  { id: 'league', label: 'Competition', icon: Crosshair, title: 'Who you compete with', subtitle: 'Other advisors and what they have delivered.', render: () => <League /> },
  { id: 'watch', label: 'Policy watch', icon: Gavel, title: 'State policy watch', subtitle: 'What changed in state GCC policy, so you can brief clients.', render: () => <Watch /> },
]

