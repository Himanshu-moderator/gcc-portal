// Sign-in. With Supabase keys set, accounts and sessions are real (Supabase Auth) and the
// profile lives in the user's metadata. Without keys, the app falls back to a local demo mode.
// Guest sessions ("Explore as ...") are always local and pre-verified so reviewers can look around.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ROLES, isRole } from './roles'
import type { RoleId } from './roles'

export interface Profile {
  role: RoleId
  name: string
  org: string
  kind?: string
  docVerified: boolean
  orgProof?: string
  personProof?: string
  onboarding?: Record<string, string[]>
  plan?: Record<string, string[]>
}

export interface Session {
  email: string
  profile: Profile
  source: 'supabase' | 'local' | 'guest'
}

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const supabase: SupabaseClient | null = URL && KEY ? createClient(URL, KEY) : null
export const REAL_AUTH = supabase !== null

const LOCAL_USERS = 'gcc.users'
const LOCAL_SESSION = 'gcc.session'

interface Ctx {
  session: Session | null
  loading: boolean
  signUp: (a: { email: string; password: string; name: string; org: string; role: RoleId; kind?: string }) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  update: (patch: Partial<Profile>) => Promise<void>
  guest: (role: RoleId, kind?: string) => void
}

const AuthContext = createContext<Ctx | null>(null)

const read = <T,>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* storage can be blocked; the session just won't persist */
  }
}

type LocalUser = { email: string; password: string; profile: Profile }

function toProfile(meta: Record<string, unknown> | undefined): Profile | null {
  if (!meta || !isRole(meta.role)) return null
  return {
    role: meta.role,
    name: String(meta.name ?? ''),
    org: String(meta.org ?? ''),
    kind: typeof meta.kind === 'string' ? meta.kind : undefined,
    docVerified: meta.docVerified === true,
    orgProof: typeof meta.orgProof === 'string' ? meta.orgProof : undefined,
    personProof: typeof meta.personProof === 'string' ? meta.personProof : undefined,
    onboarding: (meta.onboarding as Record<string, string[]> | undefined) ?? undefined,
    plan: (meta.plan as Record<string, string[]> | undefined) ?? undefined,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const local = read<Session | null>(LOCAL_SESSION, null)
    if (local) {
      setSession(local)
      setLoading(false)
      return
    }
    if (!supabase) {
      setLoading(false)
      return
    }
    const apply = (u: { email?: string; user_metadata?: Record<string, unknown> } | null | undefined) => {
      const profile = toProfile(u?.user_metadata)
      if (active) setSession(u && profile ? { email: u.email ?? '', profile, source: 'supabase' } : null)
    }
    supabase.auth.getSession().then(({ data }) => {
      apply(data.session?.user)
      if (active) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => apply(s?.user))
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signUp: Ctx['signUp'] = useCallback(async ({ email, password, name, org, role, kind }) => {
    const profile: Profile = { role, name, org, kind, docVerified: false }
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: profile } })
      if (error) return error.message
      if (!data.session) return 'Account created. Confirm the email we sent, then sign in.'
      return null
    }
    const users = read<LocalUser[]>(LOCAL_USERS, [])
    if (users.some((u) => u.email === email)) return 'That email already has an account. Sign in instead.'
    write(LOCAL_USERS, [...users, { email, password, profile }])
    const s: Session = { email, profile, source: 'local' }
    write(LOCAL_SESSION, s)
    setSession(s)
    return null
  }, [])

  const signIn: Ctx['signIn'] = useCallback(async (email, password) => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return error ? error.message : null
    }
    const u = read<LocalUser[]>(LOCAL_USERS, []).find((x) => x.email === email && x.password === password)
    if (!u) return 'Wrong email or password.'
    const s: Session = { email, profile: u.profile, source: 'local' }
    write(LOCAL_SESSION, s)
    setSession(s)
    return null
  }, [])

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem(LOCAL_SESSION)
    } catch {
      /* ignore */
    }
    if (supabase) await supabase.auth.signOut()
    setSession(null)
  }, [])

  const update: Ctx['update'] = useCallback(
    async (patch) => {
      if (!session) return
      const profile = { ...session.profile, ...patch }
      const next: Session = { ...session, profile }
      setSession(next)
      if (session.source === 'supabase' && supabase) {
        await supabase.auth.updateUser({ data: profile })
      } else {
        write(LOCAL_SESSION, next)
        if (session.source === 'local') {
          write(
            LOCAL_USERS,
            read<LocalUser[]>(LOCAL_USERS, []).map((u) => (u.email === session.email ? { ...u, profile } : u)),
          )
        }
      }
    },
    [session],
  )

  const guest: Ctx['guest'] = useCallback((role, kind) => {
    const s: Session = {
      email: 'guest@gccportal.demo',
      source: 'guest',
      profile: { role, name: 'Guest', org: 'Demo organisation', kind: kind ?? ROLES[role].kinds[0].id, docVerified: true, onboarding: {} },
    }
    write(LOCAL_SESSION, s)
    setSession(s)
  }, [])

  const value = useMemo(() => ({ session, loading, signUp, signIn, signOut, update, guest }), [session, loading, signUp, signIn, signOut, update, guest])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): Ctx {
  const c = useContext(AuthContext)
  if (!c) throw new Error('useAuth outside AuthProvider')
  return c
}

/** Where a signed-in person should be, based on how far they got. */
export function nextStep(s: Session): '/verify' | '/onboarding' | '/app' {
  if (!s.profile.docVerified) return '/verify'
  if (!s.profile.onboarding) return '/onboarding'
  return '/app'
}
