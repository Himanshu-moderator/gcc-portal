import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { nextStep, useAuth } from '../auth'
import { ROLES } from '../roles'
import { Background } from '../ui'

export default function Onboarding() {
  const nav = useNavigate()
  const { session, update } = useAuth()
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})

  if (!session) return <Navigate to="/auth" replace />
  if (nextStep(session) === '/verify') return <Navigate to="/verify" replace />
  if (nextStep(session) === '/app') return <Navigate to="/app" replace />

  const role = ROLES[session.profile.role]
  const q = role.questions[i]
  const picked = answers[q.key] ?? []
  const last = i === role.questions.length - 1

  const toggle = (o: string) => {
    const next = q.multi ? (picked.includes(o) ? picked.filter((x) => x !== o) : [...picked, o]) : [o]
    setAnswers({ ...answers, [q.key]: next })
  }

  const go = async () => {
    if (!last) return setI(i + 1)
    await update({ onboarding: answers })
    nav('/app')
  }

  return (
    <div className="app" data-role={role.id}>
      <Background variant={role.id} />
      <div className="content center">
        <div className="card panel" style={{ maxWidth: 560 }}>
          <div className="steps">{role.questions.map((_, n) => <i key={n} className={n <= i ? 'on' : ''} />)}</div>
          <AnimatePresence mode="wait">
            <motion.div key={q.key} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              <span className="muted" style={{ fontSize: 13 }}>Question {i + 1} of {role.questions.length}</span>
              <h2 style={{ marginTop: 8 }}>{q.title}</h2>
              <p className="muted" style={{ marginTop: 6 }}>{q.hint}</p>
              <div className="row" style={{ flexWrap: 'wrap', marginTop: 20 }}>
                {q.options.map((o) => (
                  <button key={o} className={`chip ${picked.includes(o) ? 'on' : ''}`} style={{ padding: '10px 16px', fontSize: 14 }} onClick={() => toggle(o)}>{o}</button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 28 }}>
            <button className="btn ghost small" disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>
            <button className="btn" disabled={picked.length === 0} onClick={go}>{last ? `Open my ${role.dashName}` : 'Next'} <ArrowRight size={15} style={{ verticalAlign: -3 }} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
