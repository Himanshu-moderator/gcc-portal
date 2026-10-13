import { useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, CheckCircle2, FileUp, Loader2, Mail } from 'lucide-react'
import { nextStep, useAuth } from '../auth'
import { ROLES } from '../roles'
import { Background } from '../ui'

const REVIEW = ['Checking the ID format', 'Matching the organisation name', 'Reviewing the document']

export default function Verify() {
  const nav = useNavigate()
  const { session, update, signOut } = useAuth()
  const [step, setStep] = useState<1 | 2 | 3>(session?.profile.emailVerified ? 2 : 1)
  const demoCode = useMemo(() => String(Math.floor(100000 + Math.random() * 900000)), [])
  const [code, setCode] = useState('')
  const input = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [docId, setDocId] = useState('')
  const [file, setFile] = useState<string | null>(null)
  const [reviewing, setReviewing] = useState(-1)

  if (!session) return <Navigate to="/auth" replace />
  const role = ROLES[session.profile.role]
  if (nextStep(session) !== '/verify' && step !== 3) return <Navigate to={nextStep(session)} replace />

  const onCode = (v: string) => {
    setCode(v.replace(/D/g, '').slice(0, 6))
    setError(null)
  }

  const checkCode = async () => {
    if (code !== demoCode) return setError('That code does not match. Use the demo code shown above.')
    await update({ emailVerified: true })
    setStep(2)
    setError(null)
  }

  const submitDoc = async () => {
    if (!role.doc.pattern.test(docId.trim())) return setError('Enter an ID of at least 8 letters or digits.')
    if (!file) return setError('Add the document to continue.')
    setError(null)
    setStep(3)
    for (let i = 0; i < REVIEW.length; i++) {
      setReviewing(i)
      await new Promise((r) => setTimeout(r, 900))
    }
    setReviewing(REVIEW.length)
    await new Promise((r) => setTimeout(r, 700))
    await update({ docVerified: true, docId: docId.trim() })
    nav('/onboarding')
  }

  return (
    <div className="app" data-role={role.id}>
      <Background variant={role.id} />
      <div className="content center">
        <motion.div className="card panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="steps">{[1, 2, 3].map((n) => <i key={n} className={step >= n ? 'on' : ''} />)}</div>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <span className="chip"><Mail size={13} /> Step 1 of 2 · Verify your email</span>
                <h2 style={{ marginTop: 14 }}>Enter the 6-digit code</h2>
                <p className="muted" style={{ marginTop: 8 }}>We would send it to <b style={{ color: 'var(--text)' }}>{session.email}</b>. {role.verifyEmailHint}</p>
                <div className="note" style={{ marginTop: 14 }}>Demo: no email is sent. Your code is <b style={{ color: 'var(--accent)', letterSpacing: 3 }}>{demoCode}</b></div>
                <div className="otp" onClick={() => input.current?.focus()} style={{ position: 'relative' }}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="input" style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, padding: '14px 0', borderColor: code.length === i ? 'var(--accent)' : undefined }}>{code[i] ?? ''}</div>
                  ))}
                  <input ref={input} autoFocus value={code} onChange={(e) => onCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" aria-label="6-digit code" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'text' }} />
                </div>
                {error && <div className="err">{error}</div>}
                <button className="btn" style={{ width: '100%', marginTop: 12 }} disabled={code.length < 6} onClick={checkCode}>Verify email</button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <span className="chip"><BadgeCheck size={13} /> Step 2 of 2 · {role.doc.title}</span>
                <h2 style={{ marginTop: 14 }}>Prove who you are</h2>
                <label className="lbl">{role.doc.field}</label>
                <input className="input" value={docId} onChange={(e) => { setDocId(e.target.value); setError(null) }} placeholder={role.doc.placeholder} />
                <div className="src">{role.doc.example}</div>
                <label className="lbl">{role.doc.upload}</label>
                <label className={`drop ${file ? 'has' : ''}`}>
                  <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
                  {file ? <><CheckCircle2 size={16} style={{ verticalAlign: -3, color: 'var(--ok)' }} /> {file}</> : <><FileUp size={16} style={{ verticalAlign: -3 }} /> Click to choose a file</>}
                </label>
                {!file && <button type="button" className="chip" style={{ marginTop: 8 }} onClick={() => setFile('sample-document.pdf')}>No file handy? Use a sample document</button>}
                {error && <div className="err">{error}</div>}
                <button className="btn" style={{ width: '100%', marginTop: 20 }} onClick={submitDoc}>Submit for review</button>
                <div className="note">Demo: nothing is uploaded or checked against a real register.</div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2>{reviewing >= REVIEW.length ? 'You are verified' : 'Reviewing your details'}</h2>
                <ul className="checks">
                  {REVIEW.map((r, i) => (
                    <motion.li key={r} initial={{ opacity: 0.4 }} animate={{ opacity: reviewing >= i ? 1 : 0.4, color: reviewing > i ? '#4ade80' : undefined }}>
                      {reviewing > i ? <CheckCircle2 size={18} /> : reviewing === i ? <Loader2 size={18} className="spin" /> : <span style={{ width: 18 }} />}
                      {r}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          <button className="chip" style={{ marginTop: 18 }} onClick={() => signOut().then(() => nav('/'))}>Sign out</button>
        </motion.div>
      </div>
    </div>
  )
}
