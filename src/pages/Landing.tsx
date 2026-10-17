import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Database, Layers, Radar } from 'lucide-react'
import { ROLES, ROLE_LIST } from '../roles'
import type { RoleId } from '../roles'
import { nextStep, useAuth } from '../auth'
import { Background, ROLE_ICON, Sources } from '../ui'
import Select from '../Select'
import { useReport } from '../Report'
import { HEADLINES, SOURCES } from '../data'

const OPTIONS = ROLE_LIST.map((r) => ({ value: r.id, label: r.label, hint: r.tagline }))

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function Landing() {
  const nav = useNavigate()
  const { session, guest, signOut } = useAuth()
  const report = useReport()
  const [roleId, setRoleId] = useState<RoleId>(session?.profile.role ?? 'company')
  const role = ROLES[roleId]

  const choose = (r: RoleId) => {
    setRoleId(r)
    go('top')
  }

  return (
    <div className="app" data-role={roleId}>
      <Background variant={roleId} />
      <div className="content">
        <header className="topnav">
          <div className="logo"><b><Radar size={18} /></b>GCC Portal</div>
          <nav className="links">
            <button className="nl" onClick={() => go('about')}>About</button>
            <button className="nl" onClick={() => go('how')}>How it works</button>
            <button className="nl" onClick={() => report.open({ link: window.location.href })}>Report a data issue</button>
          </nav>
        </header>

        <section id="top" className="hero-screen">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(30px, 4.6vw, 48px)', textAlign: 'center', lineHeight: 1.1, maxWidth: 640 }}>
              India's GCC ecosystem, <span style={{ color: 'var(--accent)' }}>one trusted view</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="muted" style={{ marginTop: 12, textAlign: 'center', maxWidth: 520 }}>
              Verified organisations. Sourced data. A portal shaped around what you came to do.
            </motion.p>

            <motion.div className="card login" style={{ marginTop: 28 }} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15, duration: 0.5 }}>
              <h2 style={{ fontSize: 24 }}>{session ? 'Welcome back' : 'Sign in to continue'}</h2>
              {session ? (
                <motion.div className="roleinfo" style={{ marginTop: 14 }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <b>{ROLES[session.profile.role].label}</b>
                  <p>You are signed in as {session.profile.name}. Continue where you left off, or sign out to choose a different role.</p>
                </motion.div>
              ) : (
                <>
                  <div style={{ marginTop: 14 }}>
                    <Select label="I am a" placeholder="Choose your role" value={[roleId]} onChange={(v) => v[0] && setRoleId(v[0] as RoleId)} options={OPTIONS} />
                  </div>
                  <motion.div key={roleId} className="roleinfo" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <b>{role.label}</b>
                    <p>{role.goal}</p>
                  </motion.div>
                </>
              )}
              {session ? (
                <>
                  <button className="btn" style={{ width: '100%', marginTop: 18 }} onClick={() => nav(nextStep(session))}>Continue <ArrowRight size={16} style={{ verticalAlign: -3 }} /></button>
                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <button className="linkbtn" onClick={() => signOut()}>Sign out to choose another role</button>
                  </div>
                </>
              ) : (
                <button className="btn" style={{ width: '100%', marginTop: 18 }} onClick={() => nav(`/auth?role=${roleId}`)}>Continue <ArrowRight size={16} style={{ verticalAlign: -3 }} /></button>
              )}
              {!session && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <button className="linkbtn" onClick={() => { guest(roleId); nav('/app') }}>Preview this portal without signing in</button>
                </div>
              )}
            </motion.div>
            <button className="linkbtn" style={{ marginTop: 22 }} onClick={() => go('about')}>What is GCC Portal? ↓</button>
          </div>
        </section>

        <section id="about" className="section">
          <p className="eyebrow">About</p>
          <h2>What GCC Portal gives you</h2>
          <p className="lead">India has 2,000+ Global Capability Centres, and the facts about them are scattered across filings, press releases, reports and people's memories. We bring them together, show where they come from, and give each player the slice they need.</p>
          <div className="pillars">
            <div className="pillar"><div className="ic"><Database size={20} /></div><h3>Sourced data</h3><p>Every number shows its source and date. Where reports disagree, we show both and say why.</p></div>
            <div className="pillar"><div className="ic"><BadgeCheck size={20} /></div><h3>Verified organisations</h3><p>Everyone proves their organisation and their authority with documents that fit their type.</p></div>
            <div className="pillar"><div className="ic"><Layers size={20} /></div><h3>Built for your role</h3><p>A company, an advisor, a landlord and a government each get a dashboard for their own job.</p></div>
          </div>
        </section>

        <div className="divider" />

        <section id="who" className="section" style={{ paddingTop: 90, paddingBottom: 130 }}>
          <p className="eyebrow">Who it is for</p>
          <h2>Built for four kinds of players</h2>
          <div className="whoframe">
            {ROLE_LIST.map((r) => {
              const Icon = ROLE_ICON[r.id]
              return (
                <button key={r.id} className="who" data-role={r.id} onClick={() => choose(r.id)}>
                  <div className="ic"><Icon size={22} /></div>
                  <h4>{r.label}</h4>
                  <p>{r.goal}</p>
                </button>
              )
            })}
          </div>
        </section>

        <div className="band">
        <section id="how" className="section" style={{ paddingTop: 100, paddingBottom: 110 }}>
          <p className="eyebrow">How it works</p>
          <h2>Four steps from sign-up to your dashboard</h2>
          <div className="steps4">
            <div><b>1</b><h4>Choose who you are</h4><p>Pick your type, such as a law firm or a state department.</p></div>
            <div><b>2</b><h4>Prove it</h4><p>Show your organisation and your authority with the right documents.</p></div>
            <div><b>3</b><h4>Tell us your focus</h4><p>A few dropdowns, so the portal opens on what matters to you.</p></div>
            <div><b>4</b><h4>Use your dashboard</h4><p>Compare cities, read policies, see clusters, and plan your set-up.</p></div>
          </div>
          <div className="datalist">
            <span className="chip on">Which GCCs exist and are coming</span>
            <span className="chip on">Cities, states and incentives</span>
            <span className="chip on">Office space and clusters</span>
            <span className="chip on">Providers and what they delivered</span>
            <span className="chip on">Talent and cost</span>
          </div>
          <p className="muted" style={{ textAlign: 'center', fontSize: 13, marginTop: 14 }}>The portal covers these over time. Today it focuses on markets, incentives, clusters and the set-up plan.</p>
        </section>
        </div>

        <footer className="footer">
          <div className="stats-line" style={{ marginTop: 0, marginBottom: 14 }}>
            <span><b>~{HEADLINES.totalVestian.toLocaleString()}</b>GCCs in India</span>
            <span><b>{HEADLINES.stateGccs}</b>new GCCs targeted by 2031</span>
            <span><b>₹{HEADLINES.avgRent}</b>avg rent / sq ft / month</span>
          </div>
          <Sources items={[SOURCES.vestian, SOURCES.cbreStates, SOURCES.anarock]} />
          <p style={{ marginTop: 14 }}>
            Found something wrong? <button className="linkbtn" onClick={() => report.open({ link: window.location.href })}>Report a data issue</button>
          </p>
          <p style={{ marginTop: 6 }}>A prototype. Document checks are simulated, and companies, providers and enquiries are sample data.</p>
        </footer>
      </div>
    </div>
  )
}
