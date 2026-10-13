// Small shared building blocks: backgrounds, icons, cards, bars and source notes.

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Building, Landmark, Rocket } from 'lucide-react'
import type { RoleId } from './roles'

export const ROLE_ICON: Record<RoleId, typeof Rocket> = {
  company: Rocket,
  consultant: Briefcase,
  realestate: Building,
  government: Landmark,
}

export function Background({ variant }: { variant: RoleId | 'landing' }) {
  return (
    <div className={`bg ${variant}`} aria-hidden>
      <div className="orb a" />
      <div className="orb b" />
      {variant === 'consultant' && (
        <>
          <div className="layer rings" />
          <div className="layer sweep" />
        </>
      )}
      {variant === 'realestate' && <div className="layer grid" />}
      {variant === 'government' && (
        <>
          <div className="layer topo" />
          <div className="layer chakra" />
        </>
      )}
      {(variant === 'company' || variant === 'landing') && <div className="layer dots" />}
    </div>
  )
}

export const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } }),
}

export function Reveal({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <motion.div className={className} variants={fade} initial="hidden" animate="show" custom={i}>
      {children}
    </motion.div>
  )
}

export function Card({ children, hover = false, className = '', onClick }: { children: ReactNode; hover?: boolean; className?: string; onClick?: () => void }) {
  return (
    <div className={`card ${hover ? 'hover' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export function Kpi({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <Card className="kpi">
      <div className="v">{value}</div>
      <div className="l">{label}</div>
      {note && <div className="src">{note}</div>}
    </Card>
  )
}

export function Bar({ value, max, label, right }: { value: number; max: number; label: string; right?: string }) {
  return (
    <div style={{ margin: '12px 0' }}>
      <div className="row" style={{ justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
        <span>{label}</span>
        <span className="muted">{right ?? value}</span>
      </div>
      <div className="bar">
        <motion.i initial={{ width: 0 }} animate={{ width: `${Math.max(2, (value / max) * 100)}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  )
}

export function Sources({ items }: { items: { label: string; url: string }[] }) {
  return (
    <div className="src">
      Sources:{' '}
      {items.map((s, i) => (
        <span key={s.url}>
          {i > 0 && ' · '}
          <a href={s.url} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        </span>
      ))}
    </div>
  )
}

export const Sample = () => <span className="sample">Sample data</span>

export function Title({ children, sample }: { children: ReactNode; sample?: boolean }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
      <h3 style={{ fontSize: 17 }}>{children}</h3>
      {sample && <Sample />}
    </div>
  )
}
