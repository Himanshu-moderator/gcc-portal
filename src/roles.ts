// The four stakeholders: who they are, what they come here for, and how they verify.

export type RoleId = 'company' | 'consultant' | 'realestate' | 'government'

export interface Question {
  key: string
  title: string
  hint: string
  multi?: boolean
  options: string[]
}

export interface RoleDef {
  id: RoleId
  label: string
  tagline: string
  goal: string
  dashName: string
  verifyEmailHint: string
  doc: { title: string; field: string; placeholder: string; example: string; pattern: RegExp; upload: string }
  questions: Question[]
}

const CITIES = ['Bengaluru', 'Hyderabad', 'Delhi-NCR', 'Mumbai', 'Pune', 'Chennai']

export const ROLES: Record<RoleId, RoleDef> = {
  company: {
    id: 'company',
    label: 'Company entering India',
    tagline: 'Set up your centre with confidence',
    goal: 'Know where to go, who to trust and what it will cost, without relying on referrals.',
    dashName: 'Launchpad',
    verifyEmailHint: 'Use your company email, not a personal one.',
    doc: {
      title: 'Confirm your company',
      field: 'Company registration / tax ID',
      placeholder: 'e.g. 21-character CIN, or your home-country registration ID',
      example: 'Any ID of 8+ letters or digits works in this demo',
      pattern: /^[A-Za-z0-9\-/ ]{8,}$/,
      upload: 'Certificate of incorporation (PDF)',
    },
    questions: [
      { key: 'hq', title: 'Where is your headquarters?', hint: 'We tailor incentives and compliance notes to it.', options: ['United States', 'United Kingdom', 'Europe', 'Middle East', 'Asia-Pacific', 'Other'] },
      { key: 'function', title: 'What will the India centre do?', hint: 'Pick everything that applies.', multi: true, options: ['Engineering / Tech', 'Finance & Accounting', 'Data & AI', 'Operations', 'HR & Shared Services', 'R&D'] },
      { key: 'size', title: 'How big will it be in year one?', hint: 'Headcount you plan to hire.', options: ['Under 50', '50 to 200', '200 to 500', '500+'] },
      { key: 'cities', title: 'Which cities are you considering?', hint: 'Pick your shortlist. We will rank them for you.', multi: true, options: CITIES },
    ],
  },
  consultant: {
    id: 'consultant',
    label: 'Consultant / Advisor',
    tagline: 'See the next GCC before your competitors do',
    goal: 'Track which companies are coming next and who else is advising them.',
    dashName: 'Radar',
    verifyEmailHint: 'Use your firm email address.',
    doc: {
      title: 'Confirm your firm',
      field: 'GSTIN or firm registration number',
      placeholder: 'e.g. 15-character GSTIN',
      example: 'Any ID of 8+ letters or digits works in this demo',
      pattern: /^[A-Za-z0-9\-/ ]{8,}$/,
      upload: 'Firm profile or registration proof (PDF)',
    },
    questions: [
      { key: 'practice', title: 'What does your firm advise on?', hint: 'Pick everything that applies.', multi: true, options: ['Entry strategy', 'Legal & entity setup', 'Tax & audit', 'Talent & hiring', 'Real estate advisory', 'Payroll / EOR'] },
      { key: 'cities', title: 'Which markets do you cover?', hint: 'Your radar starts with these.', multi: true, options: CITIES },
      { key: 'clients', title: 'Who are your typical clients?', hint: 'We use this to rank leads.', options: ['US & Canada', 'Europe & UK', 'Asia-Pacific', 'Middle East', 'Mixed'] },
    ],
  },
  realestate: {
    id: 'realestate',
    label: 'Real estate firm',
    tagline: 'Find demand before it signs a lease',
    goal: 'See where GCC clusters are forming and which companies are looking for space.',
    dashName: 'Cluster Map',
    verifyEmailHint: 'Use your firm email address.',
    doc: {
      title: 'Confirm your registration',
      field: 'RERA registration number',
      placeholder: 'e.g. PRM/KA/RERA/1251/309/PR/...',
      example: 'Any ID of 8+ letters or digits works in this demo',
      pattern: /^[A-Za-z0-9\-/ ]{8,}$/,
      upload: 'RERA certificate (PDF)',
    },
    questions: [
      { key: 'offer', title: 'What do you offer?', hint: 'Pick everything that applies.', multi: true, options: ['Grade A offices', 'Managed / flex space', 'Build-to-suit', 'Land & parks', 'Brokerage'] },
      { key: 'cities', title: 'Where do you operate?', hint: 'Your cluster map opens on these.', multi: true, options: CITIES },
      { key: 'ticket', title: 'Typical space per deal?', hint: 'Seats or square feet you usually handle.', options: ['Under 20k sq ft', '20k to 100k sq ft', '100k to 300k sq ft', '300k+ sq ft'] },
    ],
  },
  government: {
    id: 'government',
    label: 'Government',
    tagline: 'Compete for investment with better evidence',
    goal: 'Compare your incentives with other states and see which companies are scouting.',
    dashName: 'Policy Desk',
    verifyEmailHint: 'Use your official .gov.in or .nic.in address.',
    doc: {
      title: 'Confirm your department',
      field: 'Department / official ID',
      placeholder: 'e.g. DEPT-KA-IT-0421',
      example: 'Any ID of 8+ letters or digits works in this demo',
      pattern: /^[A-Za-z0-9\-/ ]{8,}$/,
      upload: 'Authorisation letter on department letterhead (PDF)',
    },
    questions: [
      { key: 'state', title: 'Which state do you represent?', hint: 'Your policy desk opens on it.', options: ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Andhra Pradesh', 'Other'] },
      { key: 'dept', title: 'Which department?', hint: 'So we show the right levers.', options: ['IT / Electronics', 'Industries & Commerce', 'Investment promotion agency', 'Urban development'] },
      { key: 'focus', title: 'What do you want to attract?', hint: 'Pick everything that applies.', multi: true, options: ['New GCCs', 'GCC expansion', 'Tier-2 city growth', 'R&D centres'] },
    ],
  },
}

export const ROLE_LIST: RoleDef[] = [ROLES.company, ROLES.consultant, ROLES.realestate, ROLES.government]

export const isRole = (v: unknown): v is RoleId => typeof v === 'string' && v in ROLES
