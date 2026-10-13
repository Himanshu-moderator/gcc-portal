import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Building2, Calculator, Compass, Map, ShieldCheck, Star } from 'lucide-react'
import type { View } from '../Dashboard'
import type { Profile } from '../../auth'
import { Bar, Card, Kpi, Sources, Title } from '../../ui'
import { CITIES, HEADLINES, INDICATIVE, POLICIES, SAMPLE_PROVIDERS, SOURCES } from '../../data'

const STAGES = ['Choose city', 'Pick advisors', 'Set up entity', 'Find office', 'Hire first team']

function Launchpad({ p }: { p: Profile }) {
  const short = p.onboarding?.cities?.length ? p.onboarding.cities : ['Bengaluru', 'Hyderabad', 'Pune']
  const size = p.onboarding?.size?.[0] ?? '50 to 200'
  const now = 0
  return (
    <div className="stack">
      <Card>
        <Title>Your journey</Title>
        <div className="journey" style={{ margin: '22px 0 8px' }}>
          {STAGES.map((s, i) => (
            <div key={s} className={`node ${i < now ? 'done' : ''} ${i === now ? 'now' : ''}`}>
              <div className="dot">{i + 1}</div>{s}
            </div>
          ))}
        </div>
        <p className="muted" style={{ fontSize: 14 }}>Next: compare your shortlisted cities in <b style={{ color: 'var(--text)' }}>City Finder</b>.</p>
      </Card>
      <div className="grid3">
        <Kpi value={`${CITIES.length}`} label="cities tracked" />
        <Kpi value={size} label="planned first-year headcount" />
        <Kpi value={`~${HEADLINES.totalVestian.toLocaleString()}`} label="GCCs already in India" note={`Vestian, Jul 2025. NASSCOM counts ${HEADLINES.nasscomUnits} units.`} />
      </div>
      <Card>
        <Title>Your shortlist</Title>
        <div className="grid3" style={{ marginTop: 10 }}>
          {short.map((c) => {
            const city = CITIES.find((x) => x.name === c)
            return (
              <Card key={c} hover>
                <b>{c}</b>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{city ? `${city.gccs} GCCs · ${city.state}` : ''}</div>
              </Card>
            )
          })}
        </div>
        <Sources items={[SOURCES.vestian]} />
      </Card>
    </div>
  )
}

function CityFinder({ p }: { p: Profile }) {
  const [w, setW] = useState({ talent: 50, cost: 50, eco: 50, support: 50 })
  const max = Math.max(...CITIES.map((c) => c.gccs))
  const ranked = useMemo(() => {
    const total = w.talent + w.cost + w.eco + w.support || 1
    return CITIES.map((c) => {
      const i = INDICATIVE[c.name]
      const score = (i.talent * w.talent + i.cost * w.cost + (c.gccs / max) * 100 * w.eco + i.support * w.support) / total
      return { c, score }
    }).sort((a, b) => b.score - a.score)
  }, [w, max])
  const shortlist = p.onboarding?.cities ?? []
  const sliders: [keyof typeof w, string][] = [['talent', 'Talent depth'], ['cost', 'Cost advantage'], ['eco', 'GCC ecosystem'], ['support', 'Government support']]
  return (
    <div className="grid2" style={{ gridTemplateColumns: '1fr 1.3fr', alignItems: 'start' }}>
      <Card>
        <Title>What matters to you?</Title>
        {sliders.map(([k, l]) => (
          <div key={k} style={{ marginTop: 16 }}>
            <div className="row" style={{ justifyContent: 'space-between', fontSize: 14 }}><span>{l}</span><span className="muted">{w[k]}</span></div>
            <input className="slider" type="range" min={0} max={100} value={w[k]} onChange={(e) => setW({ ...w, [k]: Number(e.target.value) })} />
          </div>
        ))}
        <p className="src">The GCC ecosystem score comes from sourced counts. Talent, cost and support are indicative editorial scores for this demo, not measured data.</p>
      </Card>
      <Card>
        <Title>Best fit for you</Title>
        {ranked.map(({ c, score }, i) => (
          <motion.div key={c.name} layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <Bar value={score} max={100} label={`${i + 1}. ${c.name}${shortlist.includes(c.name) ? '  ★ shortlisted' : ''}`} right={`${Math.round(score)} / 100`} />
          </motion.div>
        ))}
        <Sources items={[SOURCES.vestian]} />
      </Card>
    </div>
  )
}

function Incentives() {
  return (
    <div className="stack">
      {POLICIES.map((p, i) => (
        <motion.div key={p.state} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card hover>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 18 }}>{p.state}</h3>
              <span className="chip">{p.policy}</span>
            </div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>{p.target}</div>
            <p className="muted" style={{ marginTop: 6, fontSize: 14, lineHeight: 1.55 }}>{p.note}</p>
          </Card>
        </motion.div>
      ))}
      <Sources items={[SOURCES.aim, SOURCES.cbreStates]} />
      <p className="src">Check each state's official notification before relying on amounts or eligibility.</p>
    </div>
  )
}

function Providers() {
  return (
    <Card>
      <Title sample>Providers you can compare</Title>
      <p className="muted" style={{ fontSize: 14, marginBottom: 10 }}>Every provider here is verified through the same two-step check. "Delivered" counts completed GCC set-ups reported by the provider and confirmed by the client.</p>
      <table className="table">
        <thead><tr><th>Provider</th><th>Service</th><th>Delivered</th><th>Rating</th><th>Cities</th></tr></thead>
        <tbody>
          {SAMPLE_PROVIDERS.map((p) => (
            <tr key={p.name}>
              <td><b>{p.name}</b> <BadgeCheck size={14} style={{ verticalAlign: -2, color: 'var(--ok)' }} /></td>
              <td>{p.kind}</td><td>{p.delivered}</td>
              <td><Star size={13} style={{ verticalAlign: -2, color: 'var(--warn)' }} /> {p.rating}</td>
              <td className="muted">{p.cities.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="src">Provider names and figures are invented for this demo.</p>
    </Card>
  )
}

function Cost() {
  const [seats, setSeats] = useState(200)
  const [sqft, setSqft] = useState(100)
  const monthly = seats * sqft * HEADLINES.avgRent
  return (
    <div className="grid2" style={{ alignItems: 'start' }}>
      <Card>
        <Title>Office rent estimate</Title>
        <label className="lbl">Seats: {seats}</label>
        <input className="slider" type="range" min={20} max={1000} step={10} value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
        <label className="lbl">Space per seat (sq ft): {sqft}</label>
        <input className="slider" type="range" min={60} max={160} value={sqft} onChange={(e) => setSqft(Number(e.target.value))} />
        <p className="src">Uses the national average office rent of ₹{HEADLINES.avgRent} per sq ft per month. Real rents vary a lot by city and building.</p>
      </Card>
      <Card className="kpi">
        <div className="l">Estimated monthly rent</div>
        <div className="v" style={{ fontSize: 40, marginTop: 6 }}>₹{(monthly / 1e5).toFixed(1)} lakh</div>
        <div className="muted" style={{ marginTop: 8 }}>≈ ₹{(monthly * 12 / 1e7).toFixed(2)} crore a year · {(seats * sqft).toLocaleString()} sq ft</div>
        <Sources items={[SOURCES.anarock]} />
      </Card>
    </div>
  )
}

export const companyViews: View[] = [
  { id: 'launch', label: 'Launchpad', icon: Compass, title: 'Your India launchpad', subtitle: 'Where you are in the journey, and what to do next.', render: (p) => <Launchpad p={p} /> },
  { id: 'city', label: 'City Finder', icon: Map, title: 'Which city fits you?', subtitle: 'Weigh what matters and watch the ranking change.', render: (p) => <CityFinder p={p} /> },
  { id: 'inc', label: 'Incentives', icon: Building2, title: 'What each state offers', subtitle: 'State GCC policies in one place, with sources.', render: () => <Incentives /> },
  { id: 'prov', label: 'Trusted providers', icon: ShieldCheck, title: 'Providers you can trust', subtitle: 'Verified providers with a real track record, not just good marketing.', render: () => <Providers /> },
  { id: 'cost', label: 'Office cost', icon: Calculator, title: 'What will the office cost?', subtitle: 'A quick estimate to plan your budget.', render: () => <Cost /> },
]

