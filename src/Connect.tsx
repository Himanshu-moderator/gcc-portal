// The mediator step: let one verified party reach another. An introduction request, an email, or their page.
// Every attempt is logged in "Connections". Organisations in this prototype are samples, so nothing is delivered.

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ExternalLink, Mail, MessageSquare, Send, X } from 'lucide-react'
import { ROLES } from './roles'
import { useAuth } from './auth'

export interface Party {
  name: string
  detail?: string // e.g. "Law firm, Bengaluru"
  email?: string
  pageUrl?: string
}

export interface Connection {
  id: string
  to: string
  detail?: string
  channel: 'Introduction request' | 'Email' | 'Their page'
  message: string
  at: string
}

const KEY = 'gcc.connections'

export const readConnections = (): Connection[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Connection[]
  } catch {
    return []
  }
}
const addConnection = (c: Connection) => {
  try {
    localStorage.setItem(KEY, JSON.stringify([c, ...readConnections()]))
  } catch {
    /* storage can be blocked; the request just is not listed */
  }
}

/** A stable, obviously fake address for a sample organisation (the .example domain is reserved). */
export const sampleEmail = (name: string) => `hello@${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.example`

interface Ctx {
  open: (p: Party) => void
}
const ConnectContext = createContext<Ctx>({ open: () => undefined })
export const useConnect = () => useContext(ConnectContext)

export function ConnectProvider({ children }: { children: ReactNode }) {
  const [party, setParty] = useState<Party | null>(null)
  const open = useCallback((p: Party) => setParty(p), [])
  const value = useMemo(() => ({ open }), [open])
  return (
    <ConnectContext.Provider value={value}>
      {children}
      <AnimatePresence>{party && <ConnectModal party={party} onClose={() => setParty(null)} />}</AnimatePresence>
    </ConnectContext.Provider>
  )
}

export function ConnectButton({ party }: { party: Party }) {
  const { open } = useConnect()
  return (
    <button className="btn ghost small" onClick={() => open(party)} style={{ whiteSpace: 'nowrap' }}>
      <MessageSquare size={14} style={{ verticalAlign: -2 }} /> Connect
    </button>
  )
}

function ConnectModal({ party, onClose }: { party: Party; onClose: () => void }) {
  const { session } = useAuth()
  const role = session ? ROLES[session.profile.role] : null
  const me = session ? `${session.profile.name || 'A member'} from ${session.profile.org || 'our organisation'}` : 'A member'
  const [message, setMessage] = useState(`Hello, ${me} here. I found you on GCC Portal and would like to talk. `)
  const [sent, setSent] = useState<Connection['channel'] | null>(null)
  const email = party.email ?? sampleEmail(party.name)

  const log = (channel: Connection['channel']) => {
    addConnection({ id: `${Date.now()}`, to: party.name, detail: party.detail, channel, message: message.trim(), at: new Date().toISOString() })
    setSent(channel)
  }
  const mailto = `mailto:${email}?subject=${encodeURIComponent('Introduction via GCC Portal')}&body=${encodeURIComponent(message)}`

  return (
    <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="card modal" role="dialog" aria-modal="true" aria-label={`Reach ${party.name}`} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0 6px' }}>
            <CheckCircle2 size={44} style={{ color: 'var(--ok)' }} />
            <h2 style={{ fontSize: 24, marginTop: 14 }}>{sent === 'Introduction request' ? 'Introduction requested' : 'Saved to your connections'}</h2>
            <p className="muted" style={{ marginTop: 10, lineHeight: 1.55, fontSize: 14 }}>
              {sent === 'Introduction request' ? `${party.name} will see your name, organisation and verified badge. When they accept, you can share contact details.` : 'We keep a record so you can follow up.'}
            </p>
            <p className="src">{party.name} is a sample organisation, so nothing was actually delivered in this prototype.</p>
            <button className="btn" style={{ marginTop: 20 }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="row" style={{ gap: 10 }}><MessageSquare size={20} style={{ color: 'var(--accent)' }} /><h2 style={{ fontSize: 22 }}>Reach {party.name}</h2></div>
            {party.detail && <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>{party.detail}</p>}
            <p className="muted" style={{ marginTop: 10, fontSize: 14, lineHeight: 1.5 }}>
              We introduce verified parties to each other. {role ? `You are verified: ${role.label}.` : ''}
            </p>
            <label className="lbl">Your message</label>
            <textarea className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} style={{ resize: 'vertical' }} />
            <button className="btn" style={{ width: '100%', marginTop: 16 }} disabled={message.trim().length < 15} onClick={() => log('Introduction request')}>
              <Send size={15} style={{ verticalAlign: -2 }} /> Send introduction request
            </button>
            <p className="muted" style={{ fontSize: 12, textAlign: 'center', margin: '14px 0 8px' }}>Or reach them directly</p>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a className="btn ghost small" href={mailto} onClick={() => log('Email')}><Mail size={14} style={{ verticalAlign: -2 }} /> Email {email}</a>
              {party.pageUrl && <a className="btn ghost small" href={party.pageUrl} target="_blank" rel="noreferrer" onClick={() => log('Their page')}><ExternalLink size={14} style={{ verticalAlign: -2 }} /> Open their page</a>}
            </div>
            <p className="src" style={{ textAlign: 'center' }}>Sample organisation. The address above is a placeholder.</p>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
