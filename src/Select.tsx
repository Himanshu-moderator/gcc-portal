// A dropdown that follows the active role theme. Single or multiple choice.

import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

export interface Option {
  value: string
  label: string
  hint?: string
  group?: string
}

interface Props {
  label?: string
  placeholder: string
  options: (string | Option)[]
  value: string[]
  onChange: (next: string[]) => void
  multi?: boolean
}

const norm = (o: string | Option): Option => (typeof o === 'string' ? { value: o, label: o } : o)

export default function Select({ label, placeholder, options, value, onChange, multi = false }: Props) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement | null>(null)
  const id = useId()
  const opts = options.map(norm)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const pick = (v: string) => {
    if (!multi) {
      onChange([v])
      setOpen(false)
      return
    }
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  }

  const chosen = opts.filter((o) => value.includes(o.value))
  const summary = chosen.length === 0 ? null : multi ? (chosen.length <= 2 ? chosen.map((c) => c.label).join(', ') : `${chosen.length} selected`) : chosen[0].label

  return (
    <div className="sel" ref={root}>
      {label && <label className="lbl" htmlFor={id}>{label}</label>}
      <button id={id} type="button" className={`sel-btn ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
        <span className={summary ? '' : 'muted'}>{summary ?? placeholder}</span>
        <ChevronDown size={18} className="chev" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul className="sel-list" role="listbox" aria-multiselectable={multi} initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
            {opts.map((o, idx) => {
              const on = value.includes(o.value)
              const header = o.group && o.group !== opts[idx - 1]?.group
              return (
                <Fragment key={o.value}>
                {header && <li role="presentation" className="sel-group">{o.group}</li>}
                <li role="option" aria-selected={on} className={on ? 'on' : ''} onClick={() => pick(o.value)}>
                  <span>
                    {o.label}
                    {o.hint && <small>{o.hint}</small>}
                  </span>
                  {on && <Check size={16} />}
                </li>
                </Fragment>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
      {multi && chosen.length > 0 && (
        <div className="row" style={{ flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {chosen.map((c) => (
            <button key={c.value} type="button" className="chip on" onClick={() => pick(c.value)} title="Remove">{c.label} ×</button>
          ))}
        </div>
      )}
    </div>
  )
}
