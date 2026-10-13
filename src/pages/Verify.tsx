import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Building2, CheckCircle2, FileUp, Loader2, UserCheck } from 'lucide-react'
import { nextStep, useAuth } from '../auth'
import { ID_PATTERN, ROLES } from '../roles'
import type { Proof } from '../roles'
import { Background } from '../ui'

const REVIEW = ['Reading your documents', 'Matching the ID to the organisation', 'Confirming your authority to act']

// 0 = choose who you are, 1 = prove the organisation, 2 = prove your authority, 3 = review
export default function Verify() {
  const nav = useNavigate()
  const { session, update, signOut } = useAuth()
  const [step, setStep] = useState<0 | 1 | 2 | 3>(session?.profile.kind ? 1 : 0)
  const [kindId, setKindId] = useState<string | null>(session?.profile.kind ?? null)
  const [orgId, setOrgId] = useState('')
  const [personId, setPersonId] = useState('')
  const [orgFile, setOrgFile] = useState<string | null>(null)
  const [personFile, setPersonFile] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reviewing, setReviewing] = useState(-1)

  if (!session) return <Navigate to="/auth" replace />
  const role = ROLES[session.profile.role]
  if (nextStep(session) !== '/verify' && step !== 3) return <Navigate to={nextStep(session)} replace />
  const kind = role.kinds.find((k) => k.id === kindId) ?? null

  const finish = async () => {
    setError(null)
    setStep(3)
    for (let i = 0; i < REVIEW.length; i++) {
      setReviewing(i)
      await new Promise((r) => setTimeout(r, 900))
    }
    setReviewing(REVIEW.length)
    await new Promise((r) => setTimeout(r, 700))
    await update({ kind: kindId ?? undefined, docVerified: true, orgProof: orgId.trim(), personProof: personId.trim() })
    nav('/onboarding')
  }

  const proofForm = (proof: Proof, id: string, setId: (v: string) => void, file: string | null, setFile: (v: string | null) => void, onNext: () => void, nextLabel: string, back: 0 | 1) => (
    <>
      <label className="lbl">{proof.field}</label>
      <input className="input" autoFocus value={id} onChange={(e) => { setId(e.target.value); setError(null) }} placeholder={proof.placeholder} />
      <label className="lbl">{proof.upload}</label>
      <label className={`drop ${file ? 'has' : ''}`}>
        <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
        {file ? <><CheckCircle2 size={16} style={{ verticalAlign: -3, color: 'var(--ok)' }} /> {file}</> : <><FileUp size={16} style={{ verticalAlign: -3 }} /> Click to choose a file</>}
      </label>
      {!file && <button type="button" className="chip" style={{ marginTop: 8 }} onClick={() => setFile('sample-document.pdf')}>No file handy? Use a sample document</button>}
      {error && <div className="err">{error}</div>}
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 22 }}>
        <button className="btn ghost small" onClick={() => { setError(null); setStep(back) }}>Back</button>
        <button className="btn" onClick={() => {
          if (!ID_PATTERN.test(id.trim())) return setError('Enter an ID of at least 6 letters or digits.')
          if (!file) return setError('Add the document to continue.')
          onNext()
        }}>{nextLabel}</button>
      </div>
    </>
  )

  return (
    <div className="app" data-role={role.id}>
      <Background variant={role.id} />
      <div className="content center">
        <motion.div className="card panel" style={{ maxWidth: 540 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="steps">{[0, 1, 2, 3].map((n) => <i key={n} className={step >= n ? 'on' : ''} />)}</div>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <span className="chip"><BadgeCheck size={13} /> Verification · Who are you?</span>
                <h2 style={{ marginTop: 14 }}>{role.kindTitle}</h2>
                <p className="muted" style={{ marginTop: 8 }}>Everyone on the portal is verified, so the data and the people stay trustworthy. Your answer decides which documents we ask for.</p>
                <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
                  {role.kinds.map((k) => (
                    <button key={k.id} className={`kind ${kindId === k.id ? 'on' : ''}`} onClick={() => setKindId(k.id)}>
                      <b>{k.label}</b>
                      <span className="muted" style={{ fontSize: 13 }}>{k.desc}</span>
                    </button>
                  ))}
                </div>
                <button className="btn" style={{ width: '100%', marginTop: 20 }} disabled={!kind} onClick={() => setStep(1)}>Continue</button>
              </motion.div>
            )}
            {step === 1 && kind && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <span className="chip"><Building2 size={13} /> Proof 1 of 2 · Your organisation</span>
                <h2 style={{ marginTop: 14 }}>Prove your organisation</h2>
                <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>{session.profile.org} · {kind.label}</p>
                {proofForm(kind.org, orgId, setOrgId, orgFile, setOrgFile, () => { setError(null); setStep(2) }, 'Next', 0)}
              </motion.div>
            )}
            {step === 2 && kind && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <span className="chip"><UserCheck size={13} /> Proof 2 of 2 · Your authority</span>
                <h2 style={{ marginTop: 14 }}>Prove you can act for it</h2>
                <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>{session.profile.name} · {session.profile.org}</p>
                {proofForm(kind.person, personId, setPersonId, personFile, setPersonFile, finish, 'Submit for review', 1)}
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2>{reviewing >= REVIEW.length ? 'You are verified' : 'Reviewing your documents'}</h2>
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
          {step < 3 && <div className="note">Demo: nothing is uploaded or checked against a real register.</div>}
          <button className="chip" style={{ marginTop: 14 }} onClick={() => signOut().then(() => nav('/'))}>Sign out</button>
        </motion.div>
      </div>
    </div>
  )
}
