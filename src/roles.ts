// The four stakeholders: who they are, what they come here for, and how they prove it.
// Verification is two proofs: one for the organisation, one for the person's authority to act for it.

export type RoleId = 'company' | 'consultant' | 'realestate' | 'government'

export interface Field {
  key: string
  label: string
  placeholder: string
  multi?: boolean
  options: string[]
}

/** One onboarding screen. Fields are dropdowns; nothing here repeats what verification already asked. */
export interface Step {
  title: string
  hint: string
  fields: Field[]
}

export interface Proof {
  field: string
  placeholder: string
  upload: string
}

/** A kind of organisation within a role. Each kind has its own documents to prove. */
export interface Kind {
  id: string
  label: string
  desc: string
  org: Proof
  person: Proof
}

export interface RoleDef {
  id: RoleId
  label: string
  tagline: string
  goal: string
  dashName: string
  kindTitle: string
  kinds: Kind[]
  steps: Step[]
}

const CITIES = ['Bengaluru', 'Hyderabad', 'Delhi-NCR', 'Mumbai', 'Pune', 'Chennai']

export const ROLES: Record<RoleId, RoleDef> = {
  company: {
    id: 'company',
    label: 'Company entering India',
    tagline: 'Set up your centre with confidence',
    goal: 'Know where to go, who to trust and what it will cost, without relying on referrals.',
    dashName: 'Launchpad',
    kindTitle: 'What kind of company are you?',
    kinds: [
      {
        id: 'first',
        label: 'Foreign company setting up its first GCC',
        desc: 'No Indian entity yet.',
        org: { field: 'Company registration ID (home country)', placeholder: 'e.g. Companies House or state registration number', upload: 'Certificate of incorporation' },
        person: { field: 'Your authorised-signatory ID', placeholder: 'Passport or national ID number', upload: 'Board resolution or authorisation letter' },
      },
      {
        id: 'expand',
        label: 'Company expanding an existing India centre',
        desc: 'You already have an Indian entity.',
        org: { field: 'Indian entity CIN', placeholder: '21-character MCA CIN', upload: 'Certificate of incorporation (MCA)' },
        person: { field: 'Your employee ID', placeholder: 'Employee or director ID', upload: 'Employment proof or authorisation letter' },
      },
    ],
    steps: [
      { title: 'Tell us about your centre', hint: 'Two quick choices.', fields: [
        { key: 'hq', label: 'Where is your head office?', placeholder: 'Choose a country', options: ['United States', 'United Kingdom', 'Germany', 'France', 'Netherlands', 'Switzerland', 'Singapore', 'Japan', 'UAE', 'Australia', 'Canada', 'Other'] },
        { key: 'function', label: 'What will the India centre do?', placeholder: 'Choose one or more', multi: true, options: ['Engineering / Tech', 'Finance & Accounting', 'Data & AI', 'Operations', 'HR & Shared Services', 'R&D'] },
      ] },
      { title: 'Plan the set-up', hint: 'We will rank your cities for you.', fields: [
        { key: 'size', label: 'Team size in year one', placeholder: 'Choose a range', options: ['Under 50', '50 to 200', '200 to 500', '500+'] },
        { key: 'cities', label: 'Cities you are considering', placeholder: 'Choose one or more', multi: true, options: CITIES },
      ] },
    ],
  },
  consultant: {
    id: 'consultant',
    label: 'Consultant / Advisor',
    tagline: 'See the next GCC before your competitors do',
    goal: 'Track which companies are coming next and who else is advising them.',
    dashName: 'Radar',
    kindTitle: 'What kind of advisor are you?',
    kinds: [
      {
        id: 'strategy',
        label: 'Strategy / advisory firm',
        desc: 'Entry strategy and market advice.',
        org: { field: 'GSTIN or firm registration number', placeholder: 'e.g. 15-character GSTIN', upload: 'Firm registration certificate' },
        person: { field: 'Your partner / employee ID', placeholder: 'ID number', upload: 'Appointment letter or ID proof' },
      },
      {
        id: 'law',
        label: 'Law firm',
        desc: 'Entity set-up and compliance.',
        org: { field: 'Firm enrolment number', placeholder: 'Bar Council or firm registration number', upload: 'Firm registration proof' },
        person: { field: 'Advocate enrolment number', placeholder: 'e.g. D/1234/2015', upload: 'Bar Council certificate' },
      },
      {
        id: 'audit',
        label: 'Audit and tax firm',
        desc: 'Tax, audit and accounting.',
        org: { field: 'ICAI firm registration number (FRN)', placeholder: 'e.g. 001234N', upload: 'FRN certificate' },
        person: { field: 'Your ICAI membership number', placeholder: '6-digit membership number', upload: 'ICAI membership certificate' },
      },
      {
        id: 'talent',
        label: 'Recruitment / payroll / EOR provider',
        desc: 'Hiring and employment services.',
        org: { field: 'CIN or GSTIN', placeholder: 'Company ID', upload: 'Incorporation or GST certificate' },
        person: { field: 'Authorised representative ID', placeholder: 'ID number', upload: 'Authorisation letter' },
      },
    ],
    steps: [
      { title: 'Where do you work?', hint: 'Your radar starts here.', fields: [
        { key: 'cities', label: 'Indian cities you cover', placeholder: 'Choose one or more', multi: true, options: CITIES },
        { key: 'clients', label: 'Regions your clients come from', placeholder: 'Choose one or more', multi: true, options: ['US & Canada', 'United Kingdom', 'Europe', 'Middle East', 'Asia-Pacific'] },
      ] },
      { title: 'What do you want to track?', hint: 'We put these first.', fields: [
        { key: 'track', label: 'Track', placeholder: 'Choose one or more', multi: true, options: ['New GCC entrants', 'State policy changes', 'Competing advisors', 'Market size and trends'] },
      ] },
    ],
  },
  realestate: {
    id: 'realestate',
    label: 'Real estate firm',
    tagline: 'Find demand before it signs a lease',
    goal: 'See where GCC clusters are forming and which companies are looking for space.',
    dashName: 'Cluster Map',
    kindTitle: 'What kind of real estate firm are you?',
    kinds: [
      {
        id: 'developer',
        label: 'Developer / landlord',
        desc: 'You own or build office space.',
        org: { field: 'RERA project registration number', placeholder: 'e.g. PRM/KA/RERA/1251/...', upload: 'RERA registration certificate' },
        person: { field: 'Authorised signatory ID', placeholder: 'ID number', upload: 'Board resolution or authorisation letter' },
      },
      {
        id: 'broker',
        label: 'Brokerage / advisory',
        desc: 'You represent occupiers or landlords.',
        org: { field: 'RERA agent registration number', placeholder: 'e.g. A51800012345', upload: 'RERA agent certificate' },
        person: { field: 'Your ID', placeholder: 'Aadhaar, PAN or passport number', upload: 'Photo ID' },
      },
      {
        id: 'flex',
        label: 'Managed / flex space operator',
        desc: 'You run ready-to-use workspaces.',
        org: { field: 'GSTIN', placeholder: '15-character GSTIN', upload: 'GST registration certificate' },
        person: { field: 'Authorised representative ID', placeholder: 'ID number', upload: 'Authorisation letter' },
      },
    ],
    steps: [
      { title: 'Where do you operate?', hint: 'Your map opens here.', fields: [
        { key: 'cities', label: 'Cities', placeholder: 'Choose one or more', multi: true, options: CITIES },
        { key: 'ticket', label: 'Typical space per deal', placeholder: 'Choose a range', options: ['Under 20k sq ft', '20k to 100k sq ft', '100k to 300k sq ft', '300k+ sq ft'] },
      ] },
      { title: 'What do you want to see?', hint: 'We put these first.', fields: [
        { key: 'track', label: 'Show me', placeholder: 'Choose one or more', multi: true, options: ['Companies looking for space', 'Cluster growth', 'Leasing benchmarks', 'Rent levels'] },
      ] },
    ],
  },
  government: {
    id: 'government',
    label: 'Government',
    tagline: 'Compete for investment with better evidence',
    goal: 'Compare your incentives with other states and see which companies are scouting.',
    dashName: 'Policy Desk',
    kindTitle: 'Which body do you work for?',
    kinds: [
      {
        id: 'itdept',
        label: 'State IT / electronics department',
        desc: 'Owns the state GCC policy.',
        org: { field: 'Department notification reference', placeholder: 'e.g. Government Order number', upload: 'Government order or notification' },
        person: { field: 'Your official service ID', placeholder: 'Employee or service ID', upload: 'Authorisation letter on letterhead' },
      },
      {
        id: 'ipa',
        label: 'Investment promotion agency',
        desc: 'Courts companies on behalf of the state.',
        org: { field: 'Agency registration or GO reference', placeholder: 'Registration number', upload: 'Agency registration or Government Order' },
        person: { field: 'Your official ID', placeholder: 'Employee ID', upload: 'Authorisation letter on letterhead' },
      },
      {
        id: 'industries',
        label: 'Industries and commerce department',
        desc: 'Land, approvals and incentives.',
        org: { field: 'Department notification reference', placeholder: 'e.g. Government Order number', upload: 'Government order or notification' },
        person: { field: 'Your official service ID', placeholder: 'Employee or service ID', upload: 'Authorisation letter on letterhead' },
      },
    ],
    steps: [
      { title: 'Which state do you represent?', hint: 'Your desk opens on it.', fields: [
        { key: 'state', label: 'State', placeholder: 'Choose a state', options: ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Andhra Pradesh', 'Kerala', 'Uttar Pradesh', 'Haryana', 'Rajasthan', 'Odisha', 'West Bengal', 'Madhya Pradesh', 'Other'] },
        { key: 'focus', label: 'What do you want to attract?', placeholder: 'Choose one or more', multi: true, options: ['New GCCs', 'GCC expansion', 'Tier-2 city growth', 'R&D centres'] },
      ] },
      { title: 'Who do you compare with?', hint: 'We benchmark you against them.', fields: [
        { key: 'peers', label: 'Peer states', placeholder: 'Choose one or more', multi: true, options: ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Andhra Pradesh', 'Kerala', 'Uttar Pradesh', 'Haryana', 'Rajasthan', 'Odisha', 'West Bengal', 'Madhya Pradesh', 'Other'] },
      ] },
    ],
  },
}

export const ROLE_LIST: RoleDef[] = [ROLES.company, ROLES.consultant, ROLES.realestate, ROLES.government]

export const isRole = (v: unknown): v is RoleId => typeof v === 'string' && v in ROLES

/** The pattern every ID in this demo must meet: at least 6 letters or digits. */
export const ID_PATTERN = /^[A-Za-z0-9\-/ ]{6,}$/

/** Every specific type of organisation, with its role. The login dropdown lists these. */
export const ALL_KINDS: { role: RoleId; roleLabel: string; kind: Kind }[] = ROLE_LIST.flatMap((r) => r.kinds.map((kind) => ({ role: r.id, roleLabel: r.label, kind })))

export const findKind = (role: RoleId, kindId?: string): Kind => ROLES[role].kinds.find((k) => k.id === kindId) ?? ROLES[role].kinds[0]
