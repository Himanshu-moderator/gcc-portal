// The company's five-step journey. Each step asks for one decision; finishing all five gives a plan.

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Pencil } from 'lucide-react'
import { useAuth } from '../../auth'
import type { Profile } from '../../auth'
import { Card, Sample, Title } from '../../ui'
import Select from '../../Select'
import { CITIES, HEADLINES, POLICIES, SAMPLE_PROVIDERS } from '../../data'

type Plan = Record<string, string[]>

const STEPS = [
  { id: 'city', short: 'Choose city', keys: ['city'] },
  { id: 'advisors', short: 'Pick advisors', keys: ['advisors'] },
  { id: 'entity', short: 'Set up entity', keys: ['entity'] },
  { id: 'office', short: 'Find office', keys: ['officeType', 'seats'] },
  { id: 'hire', short: 'Hire first team', keys: ['hire'] },
] as const

const ENTITY = [
  { value: 'Private limited company (wholly owned subsidiary)', label: 'Private limited company (wholly owned subsidiary)', hint: 'The most common route for GCCs: a separate Indian company.' },
  { value: 'Limited liability partnership (LLP)', label: 'Limited liability partnership (LLP)', hint: 'Foreign investment routes are restricted; check eligibility first.' },
  { value: 'Branch office', label: 'Branch office', hint: 'An extension of the parent. Needs RBI permission.' },
  { value: 'Liaison office', label: 'Liaison office', hint: 'Needs RBI permission. Cannot earn income in India.' },
  { value: 'Employer of Record first, entity later', label: 'Employer of Record first, entity later', hint: 'Start hiring while your entity is being set up.' },
]

const OFFICE = [
  { value: 'Managed / flex space', label: 'Managed / flex space', hint: 'Ready to use, short commitment.' },
  { value: 'Grade A lease', label: 'Grade A lease', hint: 'Your own floors in a business park.' },
  { value: 'Build-to-suit', label: 'Build-to-suit', hint: 'A campus built for you. Longest lead time.' },
]

const HIRE = [
  { value: 'Our own recruiters', label: 'Our own recruiters', hint: 'Slower to start, lowest long-term cost.' },
  { value: 'A recruitment partner', label: 'A recruitment partner', hint: 'Faster for the first 50 to 100 hires.' },
  { value: 'Employer of Record', label: 'Employer of Record', hint: 'They employ people legally until your entity is ready.' },
]

export default function LaunchpadPlan({ p }: { p: Profile }) {
  const { update } = useAuth()
  const [plan, setPlan] = useState<Plan>(p.plan ?? {})
  const done = (i: number) => STEPS[i].keys.every((k) => (plan[k] ?? []).length > 0)
  const firstOpen = STEPS.findIndex((_, i) => !done(i))
  const allDone = firstOpen === -1
  const [active, setActive] = useState(allDone ? 4 : firstOpen)
  const [editing, setEditing] = useState(false)
  const finalised = (plan.final ?? []).length > 0 && !editing

  const save = (next: Plan) => {
    setPlan(next)
    void update({ plan: next })
  }
  const set = (key: string, v: string[]) => save({ ...plan, [key]: v })
  const shortlist = p.onboarding?.cities?.length ? p.onboarding.cities : CITIES.map((c) => c.name)
  const city = CITIES.find((c) => c.name === plan.city?.[0])
  const policy = POLICIES.find((x) => city?.state.includes(x.state))
  const seats = Number(plan.seats?.[0] ?? 0)
  const rent = seats * 100 * HEADLINES.avgRent

  const next = () => {
    if (active < STEPS.length - 1) setActive(active + 1)
  }
  const finish = () => {
    save({ ...plan, final: ['yes'] })
    setEditing(false)
  }

  const body = [
    <div key="city">
      <Select label="Which city will you set up in?" placeholder="Choose a city" value={plan.city ?? []} onChange={(v) => set('city', v)} options={shortlist} />
      {city && (
        <div className="muted" style={{ fontSize: 14, marginTop: 14, lineHeight: 1.55 }}>
          <b style={{ color: 'var(--text)' }}>{city.name}</b> has {city.gccs} GCCs (Vestian), in {city.state}.
          {policy ? ` ${policy.state}'s scheme: ${policy.policy}.` : ''}
        </div>
      )}
    </div>,
    <div key="advisors">
      <Select label="Which advisors will you talk to?" placeholder="Choose one or more" multi value={plan.advisors ?? []} onChange={(v) => set('advisors', v)} options={SAMPLE_PROVIDERS.map((x) => ({ value: x.name, label: x.name, hint: `${x.kind} · ${x.cities.join(', ')}` }))} />
      <div style={{ marginTop: 10 }}><Sample /></div>
    </div>,
    <div key="entity">
      <Select label="How will you be set up legally?" placeholder="Choose a structure" value={plan.entity ?? []} onChange={(v) => set('entity', v)} options={ENTITY} />
      <p className="src">A general guide, not legal advice. Confirm the structure with a law firm.</p>
    </div>,
    <div key="office">
      <Select label="What kind of office?" placeholder="Choose a type" value={plan.officeType ?? []} onChange={(v) => set('officeType', v)} options={OFFICE} />
      <div style={{ marginTop: 6 }}>
        <Select label="How many seats?" placeholder="Choose a size" value={plan.seats ?? []} onChange={(v) => set('seats', v)} options={['25', '50', '100', '200', '400', '800']} />
      </div>
      {seats > 0 && <p className="muted" style={{ fontSize: 14, marginTop: 12 }}>Rough rent at the national average: <b style={{ color: 'var(--text)' }}>₹{(rent / 1e5).toFixed(1)} lakh a month</b> (100 sq ft per seat).</p>}
    </div>,
    <div key="hire">
      <Select label="How will you hire your first team?" placeholder="Choose a route" value={plan.hire ?? []} onChange={(v) => set('hire', v)} options={HIRE} />
    </div>,
  ]

  const summary: [string, string | undefined][] = [
    ['City', plan.city?.[0]],
    ['Advisors', plan.advisors?.join(', ')],
    ['Structure', plan.entity?.[0]],
    ['Office', plan.officeType?.[0] && `${plan.officeType[0]}, ${plan.seats?.[0]} seats`],
    ['Hiring', plan.hire?.[0]],
  ]

  return (
    <div className="stack">
      <Card>
        <Title>{finalised ? 'Your plan is ready' : 'Your journey'}</Title>
        <div className="journey" style={{ margin: '22px 0 12px' }}>
          {STEPS.map((s, i) => (
            <button key={s.id} className={`node ${done(i) ? 'done' : ''} ${i === active && !finalised ? 'now' : ''}`} onClick={() => { setActive(i); setEditing(true) }} style={{ background: 'none', border: 0, color: 'inherit' }}>
              <div className="dot">{done(i) ? <CheckCircle2 size={18} /> : i + 1}</div>{s.short}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {finalised ? (
            <motion.div key="sum" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <table className="table">
                <tbody>
                  {summary.map(([k, v]) => (
                    <tr key={k}><td className="muted" style={{ width: 130 }}>{k}</td><td><b>{v ?? '-'}</b></td></tr>
                  ))}
                </tbody>
              </table>
              <div className="row" style={{ marginTop: 16 }}>
                <button className="btn ghost small" onClick={() => setEditing(true)}><Pencil size={14} style={{ verticalAlign: -2 }} /> Change something</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={active} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
              <div style={{ maxWidth: 520 }}>{body[active]}</div>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 22, maxWidth: 520 }}>
                <button className="btn ghost small" disabled={active === 0} onClick={() => setActive(active - 1)}>Back</button>
                {active < STEPS.length - 1 ? (
                  <button className="btn" disabled={!done(active)} onClick={next}>Next <ArrowRight size={15} style={{ verticalAlign: -3 }} /></button>
                ) : (
                  <button className="btn" disabled={!allDone} onClick={finish}>Finalise my plan</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
