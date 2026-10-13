// A dropdown that follows the active role theme. Single or multiple choice.
// The list is drawn in a portal on the page itself, so no card, panel or dialog can ever hide or clip it.

import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
const MAX_H = 280

interface Place {
  left: number
  width: number
  top?: number
  bottom?: number
  maxHeight: number
}

export default function Select({ label, placeholder, options, value, onChange, multi = false }: Props) {
  const [open, setOpen] = useState(false)
  const [place, setPlace] = useState<Place | null>(null)
  const root = useRef<HTMLDivElement | null>(null)
  const btn = useRef<HTMLButtonElement | null>(null)
  const list = useRef<HTMLUListElement | null>(null)
  const id = useId()
  const opts = options.map(norm)
  const theme = btn.current?.closest('[data-role]')?.getAttribute('data-role') ?? undefined

  // Put the list under the button, or above it when there is no room below.
  const measure = useCallback(() => {
    const r = btn.current?.getBoundingClientRect()
    if (!r) return
    const below = window.innerHeight - r.bottom - 12
    const above = r.top - 12
    const flip = below < 200 && above > below
    setPlace({
      left: r.left,
      width: r.width,
      ...(flip ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }),
      maxHeight: Math.max(140, Math.min(MAX_H, flip ? above : below)),
    })
  }, [])

  useLayoutEffect(() => {
    if (open) measure()
  }, [open, measure])

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      const t = e.target as Node
      if (root.current?.contains(t) || list.current?.contains(t)) return
      setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const move = (e: Event) => {
      if (list.current?.contains(e.target as Node)) return // scrolling inside the list is fine
      measure()
    }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', move, true)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', move, true)
    }
  }, [open, measure])

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
      <button ref={btn} id={id} type="button" className={`sel-btn ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
        <span className={summary ? '' : 'muted'}>{summary ?? placeholder}</span>
        <ChevronDown size={18} className="chev" />
      </button>
      {createPortal(
        <div data-role={theme} className="sel-layer">
          <AnimatePresence>
            {open && place && (
              <motion.ul
                ref={list}
                className="sel-list"
                role="listbox"
                aria-multiselectable={multi}
                style={{ left: place.left, width: place.width, top: place.top, bottom: place.bottom, maxHeight: place.maxHeight }}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
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
        </div>,
        document.body,
      )}
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
