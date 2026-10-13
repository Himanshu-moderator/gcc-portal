import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { nextStep, useAuth } from '../auth'
import { ROLES } from '../roles'
import { Background } from '../ui'
import Select from '../Select'

export default function Onboarding() {
  const nav = useNavigate()
  const { session, update } = useAuth()
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})

  if (!session) return <Navigate to="/auth" replace />
  if (nextStep(session) === '/verify') return <Navigate to="/verify" replace />
  if (nextStep(session) === '/app') return <Navigate to="/app" replace />

  const role = ROLES[session.profile.role]
  const step = role.steps[i]
  const last = i === role.steps.length - 1
  const complete = step.fields.every((f) => (answers[f.key] ?? []).length > 0)

  const go = async () => {
    if (!last) return setI(i + 1)
    await update({ onboarding: answers })
    nav('/app')
  }

  return (
    <div className="app" data-role={role.id}>
      <Background variant={role.id} />
      <div className="content center">
        <div className="card panel" style={{ maxWidth: 520 }}>
          <div className="steps">{role.steps.map((_, n) => <i key={n} className={n <= i ? 'on' : ''} />)}</div>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              <span className="muted" style={{ fontSize: 13 }}>Step {i + 1} of {role.steps.length}</span>
              <h2 style={{ marginTop: 8 }}>{step.title}</h2>
              <p className="muted" style={{ marginTop: 6 }}>{step.hint}</p>
              <div style={{ marginTop: 10, minHeight: 190 }}>
                {step.fields.map((f) => (
                  <div key={f.key} style={{ marginTop: 6 }}>
                    <Select label={f.label} placeholder={f.placeholder} options={f.options} multi={f.multi} value={answers[f.key] ?? []} onChange={(v) => setAnswers({ ...answers, [f.key]: v })} />
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 18 }}>
            <button className="btn ghost small" disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>
            <button className="btn" disabled={!complete} onClick={go}>{last ? `Open my ${role.dashName}` : 'Next'} <ArrowRight size={15} style={{ verticalAlign: -3 }} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
