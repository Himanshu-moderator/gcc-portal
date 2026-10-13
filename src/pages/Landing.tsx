import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Radar } from 'lucide-react'
import { ROLE_LIST } from '../roles'
import { useAuth, nextStep } from '../auth'
import { Background, ROLE_ICON, Reveal, Sources } from '../ui'
import { HEADLINES, SOURCES } from '../data'

export default function Landing() {
  const nav = useNavigate()
  const { session, guest } = useAuth()

  const stats = [
    { v: `~${HEADLINES.totalVestian.toLocaleString()}`, l: 'GCCs in India (Vestian)', n: 'NASSCOM units: ' + HEADLINES.nasscomUnits },
    { v: HEADLINES.fy28, l: 'GCCs expected by FY28' },
    { v: HEADLINES.stateGccs, l: 'new GCCs states are targeting by 2031' },
    { v: '₹' + HEADLINES.avgRent, l: 'avg office rent / sq ft / month' },
  ]

  return (
    <div className="app" data-role="landing">
      <Background variant="landing" />
      <div className="content wrap">
        <nav className="nav">
          <div className="logo"><b><Radar size={20} /></b>GCC Portal</div>
          <div className="row">
            {session ? (
              <button className="btn small" onClick={() => nav(nextStep(session))}>Continue <ArrowRight size={14} style={{ verticalAlign: -2 }} /></button>
            ) : (
              <>
                <button className="btn ghost small" onClick={() => nav('/auth')}>Sign in</button>
                <button className="btn small" onClick={() => nav('/auth?mode=signup')}>Create account</button>
              </>
            )}
          </div>
        </nav>

        <section className="hero">
          <Reveal><span className="chip">One source of truth for India's GCC ecosystem</span></Reveal>
          <Reveal i={1}><h1 style={{ marginTop: 18 }}>Stop guessing.<br /><span>Know the GCC market.</span></h1></Reveal>
          <Reveal i={2}><p>Companies, advisors, landlords and governments all need the same market, but each needs a different slice. Tell us who you are and your portal shapes itself around you.</p></Reveal>
        </section>

        <div className="roles">
          {ROLE_LIST.map((r, i) => {
            const Icon = ROLE_ICON[r.id]
            return (
              <motion.div key={r.id} data-role={r.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.09, duration: 0.5 }}>
                <button className="role-card" style={{ width: '100%', color: 'inherit' }} onClick={() => nav(`/auth?mode=signup&role=${r.id}`)}>
                  <div className="ico"><Icon size={22} /></div>
                  <h3>{r.label}</h3>
                  <p>{r.tagline}. {r.goal}</p>
                  <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>Join as {r.label.split(' ')[0].toLowerCase()} <ArrowRight size={14} style={{ verticalAlign: -2 }} /></span>
                  </div>
                </button>
                <button className="chip" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }} onClick={() => { guest(r.id); nav('/app') }}>
                  Just look around as this role
                </button>
              </motion.div>
            )
          })}
        </div>

        <div className="stats">
          {stats.map((s) => (
            <div key={s.l} className="card">
              <div style={{ fontFamily: 'var(--display)', fontSize: 28, fontWeight: 700 }}>{s.v}</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{s.l}</div>
              {s.n && <div className="src">{s.n}</div>}
            </div>
          ))}
        </div>
        <Sources items={[SOURCES.vestian, SOURCES.vestianFy28, SOURCES.cbreStates, SOURCES.anarock]} />
        <p className="src" style={{ marginBottom: 40 }}>Different reports quote different counts: Vestian ~1,700 centres, NASSCOM 2,900+ units. Part of what this portal is for is showing where numbers disagree, and why.</p>
      </div>
    </div>
  )
}
