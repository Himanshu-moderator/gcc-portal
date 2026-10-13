import { motion } from 'framer-motion'
import { Eye, Landmark, Scale, Target } from 'lucide-react'
import type { View } from '../Dashboard'
import type { Profile } from '../../auth'
import { Bar, Card, Kpi, Sources, Title } from '../../ui'
import PolicyCard from '../../PolicyCard'
import { CITIES, HEADLINES, LEVER_KEYS, POLICIES, SAMPLE_SCOUTS, SOURCES } from '../../data'

function Desk({ p }: { p: Profile }) {
  const mine = p.onboarding?.state?.[0] ?? 'Karnataka'
  const policy = POLICIES.find((x) => x.state === mine)
  const cities = CITIES.filter((c) => c.state.includes(mine))
  const others = POLICIES.filter((x) => x.state !== mine)
  const missing = policy ? LEVER_KEYS.filter((k) => !policy.levers.includes(k) && others.some((o) => o.levers.includes(k))) : []
  return (
    <div className="stack">
      <div className="grid3">
        <Kpi value={mine} label="your state" />
        <Kpi value={String(cities.reduce((a, c) => a + c.gccs, 0) || 'n/a')} label="GCCs in your tracked cities" note="Vestian, Jul 2025" />
        <Kpi value={HEADLINES.stateGccs} label="new GCCs all states target by 2031" note="CBRE" />
      </div>
      <div className="grid2" style={{ alignItems: 'start' }}>
        {policy ? (
          <PolicyCard p={policy} defaultOpen />
        ) : (
          <Card>
            <Title>Your policy today</Title>
            <p className="muted" style={{ marginTop: 8 }}>No GCC policy details for this state were found in the sources reviewed.</p>
          </Card>
        )}
        <Card>
          <Title>Levers other states use that you do not</Title>
          {missing.length === 0 ? <p className="muted" style={{ marginTop: 8 }}>No gaps found in the sources reviewed.</p> : (
            <div className="row" style={{ flexWrap: 'wrap', marginTop: 12 }}>{missing.map((m) => <span key={m} className="chip on">{m}</span>)}</div>
          )}
          <p className="src">A gap is not a recommendation. It is a prompt to check whether the lever matters to the companies you want.</p>
        </Card>
      </div>
    </div>
  )
}

function Benchmark() {
  return (
    <div className="stack">
    <Card>
      <Title>Incentive levers by state</Title>
      <table className="table matrix">
        <thead><tr><th>State</th>{LEVER_KEYS.map((k) => <th key={k}>{k}</th>)}</tr></thead>
        <tbody>
          {POLICIES.map((p) => (
            <tr key={p.state}>
              <td><b>{p.state}</b><div className="muted" style={{ fontSize: 12 }}>{p.policy}</div></td>
              {LEVER_KEYS.map((k) => <td key={k}>{p.levers.includes(k) ? <span className="yes">✓</span> : <span className="dash">–</span>}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="src">A dash means the lever was not found in the sources reviewed, not that it does not exist. Gujarat and Andhra Pradesh have dedicated policies whose terms were not found.</p>
      <Sources items={[SOURCES.aim, SOURCES.cbreStates]} />
    </Card>
    <h3 style={{ fontSize: 17, marginTop: 8 }}>Each state, in detail</h3>
    {POLICIES.map((p) => <PolicyCard key={p.state} p={p} />)}
    </div>
  )
}

function Targets() {
  const rows = POLICIES.filter((p) => /\d/.test(p.target))
  const num = (s: string) => Number((s.match(/([\d,]+)\+?\s*(new GCCs|GCCs)/)?.[1] ?? '0').replace(/,/g, ''))
  const max = Math.max(...rows.map((r) => num(r.target)))
  return (
    <Card>
      <Title>New GCCs each state is targeting</Title>
      {rows.map((r) => <Bar key={r.state} value={num(r.target)} max={max} label={`${r.state} · ${r.policy}`} right={r.target} />)}
      <Sources items={[SOURCES.aim, SOURCES.cbreStates]} />
    </Card>
  )
}

function Scouting() {
  return (
    <Card>
      <Title sample>Companies scouting for a state</Title>
      <table className="table">
        <thead><tr><th>Company</th><th>From</th><th>States on shortlist</th><th>Interest</th></tr></thead>
        <tbody>
          {SAMPLE_SCOUTS.map((s, i) => (
            <motion.tr key={s.company} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <td><b>{s.company}</b></td><td className="muted">{s.from}</td>
              <td>{s.shortlist.map((x) => <span key={x} className="chip" style={{ marginRight: 6 }}>{x}</span>)}</td><td>{s.interest}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <p className="src">Companies are invented for this demo. In the product, a company decides what a state can see.</p>
    </Card>
  )
}

export const governmentViews: View[] = [
  { id: 'desk', label: 'Policy desk', icon: Landmark, title: 'Your state at a glance', subtitle: 'Your policy, and the levers other states use that you do not.', render: (p) => <Desk p={p} /> },
  { id: 'bench', label: 'Benchmark', icon: Scale, title: 'How states compare', subtitle: 'Incentive levers side by side.', render: () => <Benchmark /> },
  { id: 'targets', label: 'Targets', icon: Target, title: 'Who is aiming for what', subtitle: 'Published GCC targets by state.', render: () => <Targets /> },
  { id: 'scout', label: 'Scouting', icon: Eye, title: 'Who is looking at you', subtitle: 'Companies that have shortlisted your state.', render: () => <Scouting /> },
]
