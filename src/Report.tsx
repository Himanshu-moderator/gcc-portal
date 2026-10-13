// "Report a data issue": a short form to flag a wrong or outdated number, with the link, a note and a screenshot.
// With Supabase set up (supabase/data_reports.sql) reports go to a review queue; otherwise they are kept on this device.

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Flag, ImagePlus, X } from 'lucide-react'
import Select from './Select'
import { supabase } from './auth'

const CATEGORIES = ['A number looks wrong', 'Out of date', 'Source link is broken or wrong', 'No source shown', 'Something else']

interface Prefill {
  link?: string
  note?: string
}

interface Ctx {
  open: (p?: Prefill) => void
}

const ReportContext = createContext<Ctx>({ open: () => undefined })
export const useReport = () => useContext(ReportContext)

type Outcome = 'queue' | 'device' | null

export function ReportProvider({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false)
  const [prefill, setPrefill] = useState<Prefill>({})
  const open = useCallback((p: Prefill = {}) => {
    setPrefill(p)
    setShown(true)
  }, [])
  const value = useMemo(() => ({ open }), [open])
  return (
    <ReportContext.Provider value={value}>
      {children}
      <AnimatePresence>{shown && <ReportModal prefill={prefill} onClose={() => setShown(false)} />}</AnimatePresence>
    </ReportContext.Provider>
  )
}

function ReportModal({ prefill, onClose }: { prefill: Prefill; onClose: () => void }) {
  const [link, setLink] = useState(prefill.link ?? window.location.href)
  const [category, setCategory] = useState<string[]>([])
  const [comment, setComment] = useState(prefill.note ?? '')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [outcome, setOutcome] = useState<Outcome>(null)

  const pickFile = (f: File | null) => {
    setError(null)
    if (!f) return setFile(null), setPreview(null)
    if (!f.type.startsWith('image/')) return setError('Please choose an image.')
    if (f.size > 4 * 1024 * 1024) return setError('Keep the screenshot under 4 MB.')
    setFile(f)
    const reader = new FileReader()
    reader.onload = () => setPreview(String(reader.result))
    reader.readAsDataURL(f)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!category[0]) return setError('Say what is wrong.')
    if (comment.trim().length < 10) return setError('Add a short note (at least 10 characters).')
    setBusy(true)
    setError(null)
    const report = { link: link.trim(), category: category[0], comment: comment.trim(), email: email.trim() || null }
    let remote = false
    if (supabase) {
      let path: string | null = null
      if (file) {
        const p = `${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
        const up = await supabase.storage.from('report-screenshots').upload(p, file)
        if (!up.error) path = p
      }
      const { error: err } = await supabase.from('data_reports').insert({ ...report, screenshot_path: path })
      remote = !err
    }
    if (!remote) {
      try {
        const list = JSON.parse(localStorage.getItem('gcc.reports') ?? '[]') as unknown[]
        localStorage.setItem('gcc.reports', JSON.stringify([...list, { ...report, at: new Date().toISOString(), screenshot: preview && preview.length < 1_500_000 ? preview : null }]))
      } catch {
        /* storage can be blocked */
      }
    }
    setBusy(false)
    setOutcome(remote ? 'queue' : 'device')
  }

  return (
    <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="card modal" role="dialog" aria-modal="true" aria-label="Report a data issue" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        {outcome ? (
          <div style={{ textAlign: 'center', padding: '18px 0 6px' }}>
            <CheckCircle2 size={44} style={{ color: 'var(--ok)' }} />
            <h2 style={{ fontSize: 24, marginTop: 14 }}>Thanks, we have your report</h2>
            <p className="muted" style={{ marginTop: 10, lineHeight: 1.55, fontSize: 14 }}>
              {outcome === 'queue' ? 'It is in the review queue. We check the source and correct the data if it is wrong.' : 'It is saved on this device. The shared review queue switches on once the reports table is set up in the database.'}
            </p>
            <button className="btn" style={{ marginTop: 22 }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="row" style={{ gap: 10 }}><Flag size={20} style={{ color: 'var(--accent)' }} /><h2 style={{ fontSize: 22 }}>Report a data issue</h2></div>
            <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>Spotted something wrong? Tell us where and what, and we will check the source.</p>
            <label className="lbl">Link or page</label>
            <input className="input" value={link} onChange={(e) => setLink(e.target.value)} required />
            <div style={{ marginTop: 4 }}>
              <Select label="What is wrong?" placeholder="Choose one" value={category} onChange={setCategory} options={CATEGORIES} />
            </div>
            <label className="lbl">What should it say, and where did you see that?</label>
            <textarea className="input" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="For example: Pune shows 178 GCCs but the report I read says 190." style={{ resize: 'vertical' }} />
            <label className="lbl">Screenshot (optional)</label>
            <label className={`drop ${file ? 'has' : ''}`}>
              <input type="file" accept="image/*" hidden onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
              {preview ? <img src={preview} alt="Screenshot preview" style={{ maxHeight: 110, maxWidth: '100%', borderRadius: 8 }} /> : <><ImagePlus size={16} style={{ verticalAlign: -3 }} /> Add a screenshot</>}
            </label>
            <label className="lbl">Your email (optional, if you want a reply)</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <div className="err">{error}</div>}
            <button className="btn" style={{ width: '100%', marginTop: 20 }} disabled={busy}>{busy ? 'Sending…' : 'Send report'}</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}
