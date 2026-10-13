import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Radar } from 'lucide-react'
import { ROLE_LIST } from '../roles'
import type { RoleId } from '../roles'
import { nextStep, useAuth } from '../auth'
import { Background, Sources } from '../ui'
import Select from '../Select'
import { HEADLINES, SOURCES } from '../data'

export default function Landing() {
  const nav = useNavigate()
  const { session, guest } = useAuth()
  const [role, setRole] = useState<RoleId>('company')
  const def = ROLE_LIST.find((r) => r.id === role) ?? ROLE_LIST[0]

  return (
    <div className="app" data-role={role}>
      <Background variant={role} />
      <div className="content center" style={{ alignContent: 'center' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="logo" style={{ marginBottom: 22 }}>
            <b><Radar size={20} /></b>GCC Portal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ fontSize: 'clamp(30px, 4.6vw, 48px)', textAlign: 'center', lineHeight: 1.1, maxWidth: 640 }}>
            India's GCC ecosystem, <span style={{ color: 'var(--accent)' }}>one trusted view</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="muted" style={{ marginTop: 12, textAlign: 'center', maxWidth: 520 }}>
            Verified organisations. Sourced data. A portal shaped around what you came to do.
          </motion.p>

          <motion.div className="card login" style={{ marginTop: 30 }} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <h2 style={{ fontSize: 24 }}>Sign in to continue</h2>
            <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>{def.tagline}.</p>
            <div style={{ marginTop: 18 }}>
              <Select
                label="I am a"
                placeholder="Choose your role"
                value={[role]}
                onChange={(v) => v[0] && setRole(v[0] as RoleId)}
                options={ROLE_LIST.map((r) => ({ value: r.id, label: r.label, hint: r.goal }))}
              />
            </div>
            {session ? (
              <button className="btn" style={{ width: '100%', marginTop: 20 }} onClick={() => nav(nextStep(session))}>
                Continue <ArrowRight size={16} style={{ verticalAlign: -3 }} />
              </button>
            ) : (
              <button className="btn" style={{ width: '100%', marginTop: 20 }} onClick={() => nav(`/auth?role=${role}`)}>
                Continue <ArrowRight size={16} style={{ verticalAlign: -3 }} />
              </button>
            )}
            {!session && (
              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <button className="linkbtn" onClick={() => { guest(role); nav('/app') }}>Preview this portal without signing in</button>
              </div>
            )}
          </motion.div>

          <div className="stats-line">
            <span><b>~{HEADLINES.totalVestian.toLocaleString()}</b>GCCs in India</span>
            <span><b>{HEADLINES.stateGccs}</b>new GCCs targeted by 2031</span>
            <span><b>₹{HEADLINES.avgRent}</b>avg rent / sq ft / month</span>
          </div>
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <Sources items={[SOURCES.vestian, SOURCES.cbreStates, SOURCES.anarock]} />
          </div>
        </div>
      </div>
    </div>
  )
}
