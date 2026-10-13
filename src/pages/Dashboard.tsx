import { useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, LogOut, Radar } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { nextStep, useAuth } from '../auth'
import type { Profile } from '../auth'
import { ROLES } from '../roles'
import type { RoleId } from '../roles'
import { Background } from '../ui'
import { companyViews } from './dash/Company'
import { consultantViews } from './dash/Consultant'
import { realestateViews } from './dash/RealEstate'
import { governmentViews } from './dash/Government'

export interface View {
  id: string
  label: string
  icon: LucideIcon
  title: string
  subtitle: string
  render: (p: Profile) => ReactNode
}

const VIEWS: Record<RoleId, View[]> = {
  company: companyViews,
  consultant: consultantViews,
  realestate: realestateViews,
  government: governmentViews,
}

export default function Dashboard() {
  const nav = useNavigate()
  const { session, signOut } = useAuth()
  const [tab, setTab] = useState(0)

  if (!session) return <Navigate to="/auth" replace />
  if (nextStep(session) !== '/app') return <Navigate to={nextStep(session)} replace />

  const role = ROLES[session.profile.role]
  const views = VIEWS[role.id]
  const view = views[tab]

  return (
    <div className="app" data-role={role.id}>
      <Background variant={role.id} />
      <div className="content shell">
        <aside className="side">
          <div className="logo" style={{ marginBottom: 18 }}><b><Radar size={18} /></b>{role.dashName}</div>
          {views.map((v, i) => {
            const Icon = v.icon
            return (
              <button key={v.id} className={`tab ${i === tab ? 'on' : ''}`} onClick={() => setTab(i)}>
                <Icon size={17} />{v.label}
              </button>
            )
          })}
          <div style={{ flex: 1 }} />
          <div className="muted" style={{ fontSize: 12, padding: '0 6px' }}>
            <b style={{ color: 'var(--text)', display: 'block' }}>{session.profile.name || 'Guest'}</b>
            {session.profile.org}
          </div>
          <button className="tab" onClick={() => signOut().then(() => nav('/'))}><LogOut size={17} />Sign out</button>
        </aside>
        <main className="main">
          <div className="top">
            <div>
              <span className="badge"><BadgeCheck size={13} /> Verified · {role.label}</span>
              <h1 style={{ marginTop: 10 }}>{view.title}</h1>
              <p className="muted" style={{ marginTop: 6, maxWidth: 640 }}>{view.subtitle}</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={view.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {view.render(session.profile)}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
