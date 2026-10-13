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

export interface Link {
  label: string
  url: string
}

export interface Policy {
  state: string
  policy: string
  target: string
  levers: string[]
  note: string
  dated: string // when the policy was issued or last reported on
  points: string[] // key incentives and features, as reported
  links: Link[] // official page first where we found one, then reputable summaries
  official: boolean // true only if one of the links is the state's own page
}

// "levers" use these keys so the matrix can compare states.
export const LEVER_KEYS = ['Rent / land', 'Capital subsidy', 'Payroll / EPF', 'R&D grant', 'Skilling', 'Single window'] as const

export const POLICIES: Policy[] = [
  {
    state: 'Karnataka',
    policy: 'GCC Policy 2024-29',
    target: '500 new GCCs (1,000 in total), 350,000 jobs by 2029',
    levers: ['Rent / land', 'Payroll / EPF', 'R&D grant'],
    note: 'Final policy released on 19 November 2024 at the Bengaluru Tech Summit, after a September draft.',
    dated: 'Released 19 Nov 2024',
    points: [
      'Targets 500 new GCCs, about 350,000 jobs and US$50 billion of economic output by 2029',
      'Reimburses 50% of internship stipends, for up to 100,000 students',
      'Five-year electricity duty exemption; GCCs outside Bengaluru can move to industrial tariffs',
      'Property tax reimbursement, and customised packages for very large projects',
      'Outside Bengaluru: rent reimbursement, R&D grants and EPF reimbursement are reported',
      'Three global innovation districts planned: Bengaluru, Mysuru and Belagavi',
    ],
    links: [
      { label: 'Khaitan & Co: final policy launched', url: 'https://khaitanco.com/thought-leadership/Karnatakas-Final-GCC-Policy-Launched' },
      { label: 'India Briefing: key features', url: 'https://india-briefing.com/news/karnataka-global-capability-center-policy-2024-2029-key-features-35441.html' },
      { label: 'CBRE: policy analysis', url: 'https://www.cbre.com/insights/articles/karnataka-gcc-policy-2024-29-pioneering-growth-through-innovation-and-regional-development' },
    ],
    official: false,
  },
  {
    state: 'Maharashtra',
    policy: 'GCC Policy 2025',
    target: '400 new GCCs, 4 lakh jobs, ₹50,600 crore investment',
    levers: ['Capital subsidy', 'Payroll / EPF', 'R&D grant', 'Single window'],
    note: 'Approved by the state cabinet on 30 September 2025. In effect until the end of FY 2029-30 or until replaced.',
    dated: 'Cabinet approval 30 Sep 2025',
    points: [
      'Aims for about 400 GCCs and 4 lakh jobs between 2025 and 2030',
      'Capital subsidy linked to fixed capital investment',
      'Payroll reimbursement for high-skilled staff, plus rental and power tariff assistance',
      'R&D and patent-linked support, and interest subsidy for eligible Tier-2 projects',
      'Industry status for GCCs, extra floor space index, zoning relaxations and single-window clearance',
      'Focus on Tier-2 and Tier-3 cities such as Nashik, Nagpur and Chhatrapati Sambhajinagar',
    ],
    links: [
      { label: 'PTI via The Week: cabinet approval', url: 'https://www.theweek.in/wire-updates/national/2025/09/30/bes21-mh-cab-gcc-policy.html' },
      { label: 'Cyril Amarchand Mangaldas: policy summary', url: 'https://corporate.cyrilamarchandblogs.com/2025/10/maharashtra-pushes-toward-claiming-a-bigger-piece-of-the-gcc-pie-mh-gcc-policy-2025/' },
      { label: 'RSM India: highlights and incentives', url: 'https://www.rsm.global/india/node/867' },
    ],
    official: false,
  },
  {
    state: 'Tamil Nadu',
    policy: 'Special Scheme to Promote GCCs',
    target: 'No numeric target found; MoUs point to 10,000+ GCC jobs',
    levers: ['Rent / land', 'Skilling', 'Single window'],
    note: 'Sources disagree on whether this is a full policy. The scheme was introduced on 12 March 2024 under the Industries Department.',
    dated: 'Scheme March 2024, GCC One 2025',
    points: [
      'Land cost incentive of up to 50% (up to 8 hectares)',
      'Reimbursement for IP filings and certifications, electricity tax exemption and training stipends',
      'GCC One: a single-window clearance system and a dedicated desk at Guidance Tamil Nadu (2025)',
      'Four new GCC hubs announced for Coimbatore, Madurai, Tiruchirappalli and Vellore (Aug 2025)',
      'Guidance signed an MoU with ANSR in Nov 2025, expected to create over 10,000 jobs',
    ],
    links: [
      { label: 'Guidance Tamil Nadu: policy support (official)', url: 'https://www.investingintamilnadu.com/innovation-dna/policy-support-ease-of-business' },
      { label: 'Cyril Amarchand Mangaldas: Tamil Nadu 2030', url: 'https://corporate.cyrilamarchandblogs.com/2025/11/tamil-nadu-2030-the-gcc-revolution-powering-the-usd-1-trillion-economy-dream/' },
    ],
    official: true,
  },
  {
    state: 'Telangana',
    policy: 'No confirmed dedicated GCC policy',
    target: 'About 120 new GCCs by 2026 (reported)',
    levers: ['Skilling'],
    note: 'Sources conflict: some list Telangana among states with dedicated GCC policies, others say a policy is still being drafted. Verify before relying on it.',
    dated: 'Status unclear',
    points: [
      'Hyderabad is one of the largest GCC hubs in India',
      'Reported support: land subsidies, electricity benefits and employment-linked support',
      'Skilling through TASK (Telangana Academy for Skill and Knowledge)',
      'Exact incentive terms and the policy name were not confirmed in the sources reviewed',
    ],
    links: [
      { label: 'NASSCOM community: how states compete for GCCs', url: 'https://community.nasscom.in/communities/global-capability-centers/beyond-borders-how-indian-states-are-competing-gccs' },
      { label: 'law.asia: states race to become GCC powerhouses', url: 'https://law.asia/india-gcc-growth/' },
    ],
    official: false,
  },
  {
    state: 'Gujarat',
    policy: 'GCC Policy 2025-30',
    target: '₹10,000 crore investment and about 50,000 jobs over five years',
    levers: ['Capital subsidy', 'Payroll / EPF', 'Single window'],
    note: 'Launched on 11 February 2025 by the Chief Minister at GIFT City. Reported figures vary between summaries, so check the official document.',
    dated: 'Launched 11 Feb 2025',
    points: [
      'Capital support reported at 20% for non-IT infrastructure and 30% for IT infrastructure',
      'One-time employment-linked incentive, reported at up to ₹60,000 per employee (amount differs by source)',
      'EPF support for five years; 7% interest assistance on term loans',
      'Electricity duty exemption for five years (reported)',
      'IT, finance and HR named as priority sectors; GIFT City is a key location',
    ],
    links: [
      { label: 'Government of Gujarat: GCC page (official)', url: 'https://dst.gujarat.gov.in/Home/GujaratGlobalCapabilityCenter' },
      { label: 'Rödl & Partner: Gujarat unveils its GCC policy', url: 'https://www.roedl.com/insights/india-global-capability-centers-gujarat-unveils-gcc-policy' },
      { label: 'India TV: policy launch', url: 'https://www.indiatvnews.com/gujarat/gujarat-cm-bhupendra-patel-launches-new-policy-to-promote-global-capability-centres-2025-02-11-975759' },
    ],
    official: true,
  },
  {
    state: 'Andhra Pradesh',
    policy: 'IT & GCC Policy 4.0 (2024-29)',
    target: 'Not stated in the sources reviewed',
    levers: ['Rent / land', 'Capital subsidy'],
    note: 'Issued on 12 December 2024 and valid for five years or until a new policy replaces it. Operating guidelines followed.',
    dated: 'Issued 12 Dec 2024',
    points: [
      'Three models with separate incentives: co-working space developers, neighbourhood workspace developers, and IT campus developers',
      'Model 3 is aimed at large, Fortune 500-level campus investments',
      'Covers infrastructure development, financial incentives and talent programmes',
      'Amendments apply only going forward and do not affect benefits already granted',
    ],
    links: [
      { label: 'Khaitan & Co: AP IT and GCC policy', url: 'https://khaitanco.com/thought-leadership/Impetus-to-GCCs-in-India-Andhra-Pradesh-Releases-its-IT-and-GCC-Policy' },
      { label: 'Rödl & Partner: AP IT & GCC policy 2024-29', url: 'https://www.roedl.com/insights/india-it-global-capability-centers-policy' },
    ],
    official: false,
  },
]

// Benchmarks that update on a schedule. None is a live feed; each opens its source.
export interface Pulse {
  label: string
  value: string
  note: string
  url: string
}
export const RENT_PULSE: Pulse[] = [
  { label: 'Grade A office rents, all-India', value: '+3.8% year on year', note: 'IIMB-CRE Matrix rent index, Q2 2025 (quarterly)', url: 'https://www.iimb.ac.in/sites/default/files/inline-files/CPRI_2025.pdf' },
  { label: 'Average office rent', value: '₹88 per sq ft per month', note: 'ANAROCK, H1 2025 (national average)', url: 'https://www.dtnext.in/news/business/indias-office-leasing-surges-40-pc-in-jan-june-driven-by-tech-gcc-expansion-844243' },
  { label: 'GCC share of office leasing', value: '37% of gross leasing', note: 'ANAROCK, 2023-24 (top 7 cities)', url: 'https://realtynmore.com/gccs-share-37-of-gross-office-leasing-in-last-2-years-bengaluru-tops-with-24-msf/' },
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
