// All market facts here come from public reports and are listed in SOURCES.
// Anything marked SAMPLE is invented for the demo and is labelled as such on screen.

export const SOURCES = {
  vestian: { label: 'Vestian, July 2025', url: 'https://www.theweek.in/wire-updates/business/2025/07/21/dcm52-biz-realty-gcc.html' },
  vestianFy28: { label: 'Vestian report (2,100+ GCCs by FY28)', url: 'https://therealtytoday.com/news/expert-opinion/india-leads-global-gcc-expansion-projected-to-cross-2100-centers-by-fy28-amid-tier-2-city-surge-vestian-report' },
  zinnov: { label: 'Zinnov, 2025', url: 'https://zinnov.com/centers-of-excellence/5-shifts-defining-indias-global-capability-centers-gccs-story-in-2025-blog' },
  cbre: { label: 'CBRE, "Decoding the GCC Surge" (cites NASSCOM)', url: 'https://mktgdocs.cbre.com/2299/65e793fa-274e-4b53-9f5a-f9f8016007cc-492351518/Decoding_the_GCC_Surge_Insight.pdf' },
  cbreStates: { label: 'CBRE via Entrepreneur India (state targets)', url: 'https://india.entrepreneur.com/business-news/states-target-1-1-mn-gcc-jobs-by-2031-cbre' },
  aim: { label: 'AIM Research, state-led GCC policies', url: 'https://aimresearch.co/reports/powering-gccs-state-led-initiatives-policies' },
  anarock: { label: 'ANAROCK H1 2025 via press', url: 'https://www.dtnext.in/news/business/indias-office-leasing-surges-40-pc-in-jan-june-driven-by-tech-gcc-expansion-844243' },
  realtynmore: { label: 'ANAROCK GCC leasing via Realty n More', url: 'https://realtynmore.com/gccs-share-37-of-gross-office-leasing-in-last-2-years-bengaluru-tops-with-24-msf/' },
}

export interface City {
  name: string
  state: string
  gccs: number // Vestian, July 2025
  zinnov?: string // Zinnov's higher count where reported
  leasingH1: number | null // million sq ft leased by GCCs, H1 2025
}

export const CITIES: City[] = [
  { name: 'Bengaluru', state: 'Karnataka', gccs: 487, zinnov: '880+', leasingH1: 5.45 },
  { name: 'Hyderabad', state: 'Telangana', gccs: 273, zinnov: '355+', leasingH1: 1.93 },
  { name: 'Delhi-NCR', state: 'Haryana / UP / Delhi', gccs: 272, leasingH1: 2.81 },
  { name: 'Mumbai', state: 'Maharashtra', gccs: 207, leasingH1: null },
  { name: 'Pune', state: 'Maharashtra', gccs: 178, leasingH1: 2.77 },
  { name: 'Chennai', state: 'Tamil Nadu', gccs: 162, leasingH1: 0.95 },
]

export const HEADLINES = {
  totalVestian: 1700,
  nasscomUnits: '2,900+',
  fy28: '2,100+',
  stateJobs: '1.18 M',
  stateGccs: '1,380',
  avgRent: 88, // INR per sq ft per month, national average, ANAROCK H1 2025
  gccLeasingShare: '37%', // of gross office leasing over 2023-24, top 7 cities
}

export interface Policy {
  state: string
  policy: string
  target: string
  levers: string[]
  note: string
}

// "levers" use these keys so the matrix can compare states.
export const LEVER_KEYS = ['Rent / land', 'Capital subsidy', 'Payroll / EPF', 'R&D grant', 'Skilling', 'Single window'] as const

export const POLICIES: Policy[] = [
  {
    state: 'Karnataka',
    policy: 'GCC Policy 2024-29',
    target: '500 new GCCs, 350,000 jobs by 2029',
    levers: ['Rent / land', 'Payroll / EPF', 'R&D grant'],
    note: 'Outside Bengaluru: 50% rent reimbursement (up to ₹2 crore), R&D grant of 40% or up to ₹50 crore, ₹3,000 per employee EPF reimbursement for two years, 25% internet cost reimbursement for three years.',
  },
  {
    state: 'Maharashtra',
    policy: 'GCC Policy 2025',
    target: '400 new GCCs, 400,000 jobs',
    levers: ['Capital subsidy', 'Payroll / EPF', 'R&D grant', 'Single window'],
    note: 'Capital subsidies, payroll assistance, R&D grants and interest subsidies. GCC parks planned across Mumbai, Pune, Nagpur and Nashik, with a GCC facilitation cell.',
  },
  {
    state: 'Tamil Nadu',
    policy: 'No standalone GCC policy',
    target: 'Part of its wider R&D ecosystem',
    levers: ['Rent / land', 'Skilling'],
    note: 'Land cost incentive up to 50% (up to 8 hectares), reimbursement for IP filings and certifications, electricity tax exemption and training stipends.',
  },
  {
    state: 'Telangana',
    policy: 'Policy framework, no dedicated GCC policy',
    target: 'Not stated in sources reviewed',
    levers: ['Skilling'],
    note: 'Skilling through TASK (Telangana Academy for Skill and Knowledge). Specific incentive terms were not found in the sources reviewed.',
  },
  {
    state: 'Gujarat',
    policy: 'Dedicated GCC policy',
    target: '250+ new GCCs, 50,000+ jobs by 2030',
    levers: [],
    note: 'Dedicated policy per CBRE. Incentive terms were not found in the sources reviewed.',
  },
  {
    state: 'Andhra Pradesh',
    policy: 'Dedicated GCC policy',
    target: 'Not stated in sources reviewed',
    levers: [],
    note: 'Dedicated policy per CBRE. Incentive terms were not found in the sources reviewed.',
  },
]

// ---------- SAMPLE DATA (invented for the demo) ----------

export interface Entrant { name: string; from: string; city: string; stage: string; size: number; fit: number; advisors: number }
export const SAMPLE_ENTRANTS: Entrant[] = [
  { name: 'Harbor Retail Group', from: 'United States', city: 'Bengaluru', stage: 'Shortlisting cities', size: 400, fit: 88, advisors: 2 },
  { name: 'Nordlicht Insurance', from: 'Germany', city: 'Pune', stage: 'Choosing an advisor', size: 250, fit: 81, advisors: 1 },
  { name: 'Meridian Health Tech', from: 'United States', city: 'Hyderabad', stage: 'Entity setup', size: 600, fit: 76, advisors: 3 },
  { name: 'Kestrel Logistics', from: 'United Kingdom', city: 'Chennai', stage: 'Shortlisting cities', size: 180, fit: 72, advisors: 0 },
  { name: 'Aurum Capital Markets', from: 'Singapore', city: 'Mumbai', stage: 'Office search', size: 320, fit: 69, advisors: 2 },
  { name: 'Lumen Energy', from: 'Netherlands', city: 'Delhi-NCR', stage: 'Choosing an advisor', size: 150, fit: 64, advisors: 1 },
]

export interface Provider { name: string; kind: string; delivered: number; rating: number; cities: string[] }
export const SAMPLE_PROVIDERS: Provider[] = [
  { name: 'Anvaya Advisory', kind: 'Entry strategy', delivered: 24, rating: 4.7, cities: ['Bengaluru', 'Pune'] },
  { name: 'Lexora Legal', kind: 'Legal & entity setup', delivered: 31, rating: 4.5, cities: ['Delhi-NCR', 'Mumbai'] },
  { name: 'Talentry Search', kind: 'Recruitment', delivered: 18, rating: 4.3, cities: ['Hyderabad', 'Bengaluru'] },
  { name: 'PayBridge EOR', kind: 'Payroll / EOR', delivered: 40, rating: 4.6, cities: ['Bengaluru', 'Chennai', 'Pune'] },
  { name: 'Skyline Workspaces', kind: 'Real estate', delivered: 22, rating: 4.4, cities: ['Bengaluru', 'Hyderabad'] },
]

export interface Enquiry { company: string; city: string; seats: number; timeline: string; type: string }
export const SAMPLE_ENQUIRIES: Enquiry[] = [
  { company: 'Harbor Retail Group', city: 'Bengaluru', seats: 400, timeline: '6 months', type: 'Managed / flex' },
  { company: 'Meridian Health Tech', city: 'Hyderabad', seats: 600, timeline: '9 months', type: 'Grade A lease' },
  { company: 'Nordlicht Insurance', city: 'Pune', seats: 250, timeline: '4 months', type: 'Managed / flex' },
  { company: 'Aurum Capital Markets', city: 'Mumbai', seats: 320, timeline: '12 months', type: 'Build-to-suit' },
]

export interface Scout { company: string; from: string; shortlist: string[]; interest: string }
export const SAMPLE_SCOUTS: Scout[] = [
  { company: 'Harbor Retail Group', from: 'United States', shortlist: ['Karnataka', 'Telangana'], interest: 'Tech + data centre' },
  { company: 'Nordlicht Insurance', from: 'Germany', shortlist: ['Maharashtra', 'Karnataka'], interest: 'Insurance operations' },
  { company: 'Kestrel Logistics', from: 'United Kingdom', shortlist: ['Tamil Nadu', 'Maharashtra'], interest: 'Supply chain analytics' },
]

// Indicative editorial scores (0 to 100) used only by the city-finder demo; ecosystem comes from GCC counts.
export const INDICATIVE: Record<string, { talent: number; cost: number; support: number }> = {
  Bengaluru: { talent: 95, cost: 45, support: 80 },
  Hyderabad: { talent: 82, cost: 62, support: 75 },
  'Delhi-NCR': { talent: 74, cost: 55, support: 55 },
  Mumbai: { talent: 70, cost: 40, support: 70 },
  Pune: { talent: 78, cost: 66, support: 70 },
  Chennai: { talent: 72, cost: 70, support: 65 },
}
