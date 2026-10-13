import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react'
import { REAL_AUTH, nextStep, useAuth } from '../auth'
import { ALL_KINDS, ROLES, isRole } from '../roles'
import type { RoleId } from '../roles'
import { Background } from '../ui'
import Select from '../Select'

export default function Auth() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const { session, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>(params.get('mode') === 'signup' ? 'signup' : 'signin')
  const initial = params.get('role')
  const initialRole: RoleId = isRole(initial) ? initial : 'company'
  const [pick, setPick] = useState(`${initialRole}:${params.get('kind') ?? ROLES[initialRole].kinds[0].id}`)
  const [roleId, kindId] = pick.split(':') as [RoleId, string]
  const role = roleId
  const kindDef = ROLES[roleId].kinds.find((k) => k.id === kindId) ?? ROLES[roleId].kinds[0]
  const [form, setForm] = useState({ name: '', org: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to={nextStep(session)} replace />

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (mode === 'signup' && form.password.length < 8) return setError('Use a password of at least 8 characters.')
    setBusy(true)
    const err = mode === 'signup' ? await signUp({ ...form, role, kind: kindDef.id }) : await signIn(form.email, form.password)
    setBusy(false)
    if (err) setError(err)
  }

  return (
    <div className="app" data-role={role}>
      <Background variant={role} />
      <div className="content center">
        <motion.div className="card panel" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}>
          <button className="chip" onClick={() => nav('/')} style={{ marginBottom: 16 }}><ArrowLeft size={13} /> Back</button>
          <h2>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            <Lock size={13} style={{ verticalAlign: -2 }} /> {REAL_AUTH ? 'Secured with email and password. Your session is encrypted.' : 'Demo mode: accounts are stored in this browser only.'}
          </p>

          <div className="seg">
            <button className={mode === 'signin' ? 'on' : ''} onClick={() => setMode('signin')} type="button">Sign in</button>
            <button className={mode === 'signup' ? 'on' : ''} onClick={() => setMode('signup')} type="button">Sign up</button>
          </div>

          <form onSubmit={submit}>
            <AnimatePresence initial={false}>
              {mode === 'signup' && (
                <motion.div key="extra" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <Select label="I am a" placeholder="Choose who you are" value={[pick]} onChange={(v) => v[0] && setPick(v[0])} options={ALL_KINDS.map((k) => ({ value: `${k.role}:${k.kind.id}`, label: k.kind.label, group: k.roleLabel }))} />
                  <div className="roleinfo"><b>{kindDef.label}</b><p>{kindDef.desc} {ROLES[roleId].goal}</p></div>
                  <label className="lbl">Your name</label>
                  <input className="input" required value={form.name} onChange={set('name')} autoComplete="name" />
                  <label className="lbl">Organisation</label>
                  <input className="input" required value={form.org} onChange={set('org')} autoComplete="organization" />
                </motion.div>
              )}
            </AnimatePresence>
            <label className="lbl">Work email</label>
            <input className="input" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
            <label className="lbl">Password</label>
            <input className="input" type="password" required value={form.password} onChange={set('password')} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
            {error && <div className="err">{error}</div>}
            <button className="btn" style={{ width: '100%', marginTop: 20 }} disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
          </form>
          <div className="note"><ShieldCheck size={13} style={{ verticalAlign: -2 }} /> Next you will say who you are and prove your organisation with the right documents. In this demo the checks are simulated.</div>
        </motion.div>
      </div>
    </div>
  )
}
