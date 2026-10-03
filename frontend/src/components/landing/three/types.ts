export type StoryStage = 'discover' | 'understand' | 'match' | 'explain' | 'apply' | 'learn';

export interface OpportunityNodeData {
  id: string;
  title: string;
  role: string;
  platform: 'Upwork' | 'Fiverr' | 'Freelancer' | 'Direct Inbound';
  budget: string;
  rateRange: string;
  difficulty: 'Easy' | 'Medium' | 'Architectural';
  matchScore: number;
  skills: string[];
  timeEstimate: string;
  clientRep: string;
  clientSpent: string;
  risk: 'Low' | 'Medium' | 'High';
  breakdown: {
    skills: number;
    time: number;
    budget: number;
    experience: number;
  };
  whyItFits: string[];
  concern: string;
  summary: string;
  basePosition: [number, number, number];
}

export const OPPORTUNITY_NODES: OpportunityNodeData[] = [
  {
    id: 'frontend-dashboard',
    title: 'Frontend Dashboard',
    role: 'Senior React Engineer',
    platform: 'Upwork',
    budget: '$120 · Easy',
    rateRange: '$60/hr',
    difficulty: 'Easy',
    matchScore: 94,
    skills: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'],
    timeEstimate: '18 hrs/week · 4 weeks',
    clientRep: '★ 4.98 Rating',
    clientSpent: '$140k+ spent',
    risk: 'Low',
    breakdown: {
      skills: 96,
      time: 94,
      budget: 88,
      experience: 95
    },
    whyItFits: [
      'Matches your frontend skills (React 18, TypeScript, Tailwind)',
      'Fits your available time (open 20 hrs/week calendar)',
      'Within preferred difficulty and modular scope',
      'Budget matches your target hourly floor'
    ],
    concern: 'Client requires initial kickoff sync within 48 hours of acceptance.',
    summary: 'Build high-performance modular dashboard views with clean reactive filters and responsive layouts.',
    basePosition: [2.3, 1.2, 0.4]
  },
  {
    id: 'python-automation',
    title: 'Python Automation',
    role: 'Backend Automation Specialist',
    platform: 'Upwork',
    budget: '$95 · Medium',
    rateRange: '$55/hr',
    difficulty: 'Medium',
    matchScore: 91,
    skills: ['Python 3.12', 'FastAPI', 'Playwright', 'PostgreSQL'],
    timeEstimate: '15 hrs/week · 3 weeks',
    clientRep: '★ 5.0 Rating',
    clientSpent: '$80k+ spent',
    risk: 'Low',
    breakdown: {
      skills: 94,
      time: 90,
      budget: 92,
      experience: 90
    },
    whyItFits: [
      'Direct match for async automation and API endpoints',
      'Zero synchronous daily meetings requested',
      'Escrow fully funded with verified payment verification',
      'Clean requirements specification document'
    ],
    concern: 'Third-party API rate limits require robust exponential backoff handling.',
    summary: 'Automate weekly ingestion of external CSV catalogs with webhook notifications.',
    basePosition: [-2.4, 1.4, -0.6]
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    role: 'Analytics Engineer',
    platform: 'Upwork',
    budget: '$110 · Medium',
    rateRange: '$58/hr',
    difficulty: 'Medium',
    matchScore: 89,
    skills: ['SQL', 'DuckDB', 'Python', 'Chart.js'],
    timeEstimate: '12 hrs/week · 2 months',
    clientRep: '★ 4.94 Rating',
    clientSpent: '$210k+ spent',
    risk: 'Low',
    breakdown: {
      skills: 90,
      time: 92,
      budget: 91,
      experience: 88
    },
    whyItFits: [
      'Strong overlap with data pipeline reporting',
      'Flexible weekly milestone cadence',
      'Budget matches declared compensation parameters'
    ],
    concern: 'Underlying data schema is undergoing minor migrations.',
    summary: 'Synthesize monthly customer cohort metrics and render visual executive trend summaries.',
    basePosition: [2.0, -1.3, -0.8]
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    role: 'UI Developer',
    platform: 'Freelancer',
    budget: '$85 · Easy',
    rateRange: '$48/hr',
    difficulty: 'Easy',
    matchScore: 88,
    skills: ['React', 'Tailwind CSS', 'Figma', 'SEO'],
    timeEstimate: '10 hrs total · 5 days',
    clientRep: '★ 4.88 Rating',
    clientSpent: '$35k+ spent',
    risk: 'Low',
    breakdown: {
      skills: 92,
      time: 88,
      budget: 85,
      experience: 90
    },
    whyItFits: [
      'Clear Figma designs with exportable tokens',
      'Fits neatly into open weekend bandwidth',
      'Instant escrow deposit confirmed'
    ],
    concern: 'Fixed delivery timeline with hard launch deadline.',
    summary: 'Implement a modern, accessible marketing landing page from completed Figma frames.',
    basePosition: [-1.8, -1.5, 0.7]
  },
  {
    id: 'ui-design',
    title: 'UI Design',
    role: 'Product Designer',
    platform: 'Direct Inbound',
    budget: '$90 · Medium',
    rateRange: '$52/hr',
    difficulty: 'Medium',
    matchScore: 85,
    skills: ['Design Systems', 'Figma', 'Component Tokens'],
    timeEstimate: '14 hrs/week · 3 weeks',
    clientRep: '★ 5.0 Enterprise',
    clientSpent: '$90k+ spent',
    risk: 'Low',
    breakdown: {
      skills: 88,
      time: 86,
      budget: 90,
      experience: 84
    },
    whyItFits: [
      'High design system component reusability',
      'Clear stakeholder communication guidelines'
    ],
    concern: 'Requires 2 rounds of stakeholder review before final component token lock.',
    summary: 'Design a clean dark-mode design system token set for an enterprise billing portal.',
    basePosition: [0.3, 2.4, 0.5]
  },
  {
    id: 'shopify-data-entry',
    title: 'Data Entry',
    role: 'Catalog Assistant',
    platform: 'Upwork',
    budget: '$70 · Easy',
    rateRange: '$35/hr',
    difficulty: 'Easy',
    matchScore: 82,
    skills: ['Shopify', 'Excel', 'Data Cleanup'],
    timeEstimate: '5 hrs total · 2 days',
    clientRep: '★ 4.90 Rating',
    clientSpent: '$25k+ spent',
    risk: 'Low',
    breakdown: {
      skills: 80,
      time: 96,
      budget: 78,
      experience: 75
    },
    whyItFits: [
      'Very simple execution during low-focus hours',
      'Verified payment method on file'
    ],
    concern: 'Budget sits below your preferred senior engineering target rate.',
    summary: 'Import and normalize 400 product catalog entries and variant tags in Shopify admin.',
    basePosition: [2.5, 0.2, -1.6]
  },
  {
    id: 'wordpress-fix',
    title: 'WordPress Fix',
    role: 'Web Specialist',
    platform: 'Fiverr',
    budget: '$45 · Easy',
    rateRange: '$30/hr',
    difficulty: 'Easy',
    matchScore: 72,
    skills: ['WordPress', 'PHP', 'CSS'],
    timeEstimate: '3 hrs · Urgent 24h',
    clientRep: '★ 4.60 Rating',
    clientSpent: '$5k+ spent',
    risk: 'Medium',
    breakdown: {
      skills: 75,
      time: 70,
      budget: 68,
      experience: 72
    },
    whyItFits: [
      'Straightforward CSS styling conflict fix'
    ],
    concern: 'Tight 24-hour turnaround and compensation is significantly below your target floor.',
    summary: 'Fix broken navigation drawer and z-index overlap on mobile view in existing theme.',
    basePosition: [-2.6, -0.4, -1.8]
  }
];
