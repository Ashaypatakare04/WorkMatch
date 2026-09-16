import { NormalizedJob } from '../../models/NormalizedJob.js';

export const SAMPLE_JOBS_DATA: Omit<NormalizedJob, 'id' | 'hash' | 'collected_at'>[] = [
  // 1. High match, Easy, Fixed, Data Entry
  {
    platform: 'upwork',
    platform_job_id: 'upwork_101',
    url: 'https://www.upwork.com/jobs/~01a1b2c3d4e5f6',
    title: 'Clean Up & Verify Contact Spreadsheet (Excel / Google Sheets)',
    description: 'We have a raw list of 250 business contacts. We need someone with high attention to detail to verify email addresses, remove duplicate rows, and standardize phone number formatting into a clean Google Sheet. No cold calling involved at all.',
    category: 'Data Entry',
    skills: ['Data Entry', 'Excel', 'Google Sheets', 'Attention to Detail'],
    budget: { type: 'fixed', min: 50, max: 75, currency: 'USD' },
    experience_level: 'Entry',
    estimated_duration: 'Less than 1 week',
    deadline: '3 days',
    posted_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    client: {
      name: 'BrightSpark Ventures',
      country: 'United States',
      rating: 4.95,
      reviews: 42,
      jobs_posted: 65,
      jobs_hired: 58,
      hire_rate: 89
    },
    competition: { proposal_count: 7 },
    communication_requirements: ['Written chat only', 'No calls required'],
    requirements: ['Excel', 'Data Entry', 'Spreadsheets'],
    external_links: [],
    source_data: { connects_required: 4, client_spend: '$24,500' }
  },

  // 2. High match, Easy/Moderate, Web Research
  {
    platform: 'upwork',
    platform_job_id: 'upwork_102',
    url: 'https://www.upwork.com/jobs/~02b2c3d4e5f6a1',
    title: 'Web Research: Compile List of Local Solar Energy Providers',
    description: 'Need assistance researching 100 solar installation companies in California. For each company, extract company name, website, primary contact email from the website, and city. We provide a formatted template.',
    category: 'Web Research',
    skills: ['Web Research', 'Data Entry', 'Google Sheets'],
    budget: { type: 'fixed', min: 60, max: 100, currency: 'USD' },
    experience_level: 'Entry',
    estimated_duration: '1 to 3 days',
    deadline: '5 days',
    posted_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    client: {
      name: 'EcoEnergy Logistics',
      country: 'United Kingdom',
      rating: 4.88,
      reviews: 18,
      jobs_posted: 24,
      jobs_hired: 20,
      hire_rate: 83
    },
    competition: { proposal_count: 12 },
    communication_requirements: ['Written chat via platform'],
    requirements: ['Web Research', 'Internet Research', 'Data Extraction'],
    external_links: [],
    source_data: { connects_required: 6 }
  },

  // 3. High match, Virtual Assistant, Easy
  {
    platform: 'fiverr',
    platform_job_id: 'fiverr_201',
    url: 'https://www.fiverr.com/buyer-request/fiv_001',
    title: 'Virtual Assistant for Data Formatting and File Renaming',
    description: 'Looking for a reliable virtual assistant to download 80 PDF invoices from our secure portal, extract invoice numbers into our summary sheet, and rename the files according to our convention (YYYY-MM-DD_InvoiceNo). Simple and straightforward.',
    category: 'Virtual Assistance',
    skills: ['Virtual Assistance', 'Data Entry', 'File Management'],
    budget: { type: 'fixed', min: 40, max: 60, currency: 'USD' },
    experience_level: 'Entry',
    estimated_duration: '1 day',
    deadline: '2 days',
    posted_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    client: {
      name: 'Nordic Growth Studio',
      country: 'Sweden',
      rating: 5.0,
      reviews: 9,
      jobs_posted: 12,
      jobs_hired: 11,
      hire_rate: 91
    },
    competition: { proposal_count: 5 },
    communication_requirements: ['Low communication', 'Daily check-in message'],
    requirements: ['Virtual Assistant', 'Data Entry'],
    external_links: [],
    source_data: {}
  },

  // 4. Testing, Easy/Moderate
  {
    platform: 'freelancer',
    platform_job_id: 'fl_301',
    url: 'https://www.freelancer.com/projects/testing/manual-qa-form-checks',
    title: 'Manual Website Testing & Feedback on Sign-up Flow',
    description: 'We launched a new web app and need 3 testers to complete our sign-up questionnaire on Chrome and Mobile Safari, document any bugs or visual glitches, and provide screenshots of broken elements.',
    category: 'Testing',
    skills: ['Testing', 'QA Testing', 'Bug Reporting', 'Documentation'],
    budget: { type: 'fixed', min: 45, max: 80, currency: 'USD' },
    experience_level: 'Entry',
    estimated_duration: '2 hours',
    deadline: '24 hours',
    posted_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    client: {
      name: 'AppScale Interactive',
      country: 'Canada',
      rating: 4.9,
      reviews: 31,
      jobs_posted: 40,
      jobs_hired: 36,
      hire_rate: 90
    },
    competition: { proposal_count: 8 },
    communication_requirements: ['Written feedback form'],
    requirements: ['Testing', 'Manual QA', 'Bug Reporting'],
    external_links: [],
    source_data: {}
  },

  // 5. Suspicious / Red Flag Job (Telegram redirect)
  {
    platform: 'upwork',
    platform_job_id: 'upwork_bad_01',
    url: 'https://www.upwork.com/jobs/~suspicious_01',
    title: 'URGENT: Copy Paste Text from PDF to Word - $1,500 Payment',
    description: 'Quick work for all freelancers! We have 20 pages of documents to retype. Pay is $1,500 immediately upon completion. Do not apply here directly, message our project manager immediately on Telegram @global_work_hr to receive contract and equipment fee details.',
    category: 'Data Entry',
    skills: ['Data Entry', 'Copy Paste'],
    budget: { type: 'fixed', min: 1200, max: 1500, currency: 'USD' },
    experience_level: 'Entry',
    estimated_duration: '1 day',
    deadline: 'Today',
    posted_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    client: {
      name: 'Unknown Individual',
      country: 'United States',
      rating: null,
      reviews: 0,
      jobs_posted: 1,
      jobs_hired: 0,
      hire_rate: 0
    },
    competition: { proposal_count: 45 },
    communication_requirements: ['Off platform Telegram'],
    requirements: ['Copy Paste'],
    external_links: ['https://t.me/global_work_hr'],
    source_data: {}
  },

  // 6. Excluded Keyword Match (Cold Calling / Sales)
  {
    platform: 'upwork',
    platform_job_id: 'upwork_excl_01',
    url: 'https://www.upwork.com/jobs/~sales_call_01',
    title: 'Outbound Cold Calling & Telemarketing for Real Estate Leads',
    description: 'Looking for an aggressive telemarketer to make 80 cold calls a day to property owners. Must handle objections and close appointments. High commission bonus on deals closed.',
    category: 'Customer Support',
    skills: ['Cold Calling', 'Sales', 'Telemarketing', 'Phone Support'],
    budget: { type: 'hourly', min: 15, max: 25, currency: 'USD' },
    experience_level: 'Intermediate',
    estimated_duration: '1 to 3 months',
    deadline: 'Immediate',
    posted_at: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    client: {
      name: 'Summit Real Estate',
      country: 'United States',
      rating: 4.6,
      reviews: 14,
      jobs_posted: 22,
      jobs_hired: 16,
      hire_rate: 72
    },
    competition: { proposal_count: 15 },
    communication_requirements: ['Continuous phone calls required'],
    requirements: ['Cold calling', 'Sales', 'Outbound Calling'],
    external_links: [],
    source_data: {}
  },

  // 7. Difficult / High Technical Complexity (Advanced Programming)
  {
    platform: 'upwork',
    platform_job_id: 'upwork_diff_01',
    url: 'https://www.upwork.com/jobs/~complex_arch_01',
    title: 'Senior Distributed Systems Engineer (Rust / Kubernetes / Raft)',
    description: 'Seeking a principal infrastructure engineer to debug latency jitter in our multi-region consensus protocol built in Rust and Raft consensus. Deep kernel tracing with eBPF required.',
    category: 'Programming',
    skills: ['Rust', 'Distributed Systems', 'Kubernetes', 'eBPF', 'Linux Kernel'],
    budget: { type: 'hourly', min: 90, max: 140, currency: 'USD' },
    experience_level: 'Expert',
    estimated_duration: '3 to 6 months',
    deadline: 'Long term',
    posted_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    client: {
      name: 'Distributed Core Labs',
      country: 'Switzerland',
      rating: 5.0,
      reviews: 35,
      jobs_posted: 50,
      jobs_hired: 48,
      hire_rate: 96
    },
    competition: { proposal_count: 4 },
    communication_requirements: ['Weekly architecture meetings', 'Video calls'],
    requirements: ['Rust', 'Kernel Tracing', 'Raft Consensus'],
    external_links: [],
    source_data: {}
  },

  // 8. Basic Web Development, Moderate Match
  {
    platform: 'freelancer',
    platform_job_id: 'fl_302',
    url: 'https://www.freelancer.com/projects/html/fix-landing-page-css',
    title: 'Fix Mobile Alignment & Responsive Layout on HTML/CSS Landing Page',
    description: 'Our static landing page has a navigation bar that overlaps the header on mobile screens. Need an experienced frontend developer to adjust the CSS flexbox styles and verify on Chrome and Safari.',
    category: 'Basic Web Development',
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    budget: { type: 'fixed', min: 35, max: 60, currency: 'USD' },
    experience_level: 'Intermediate',
    estimated_duration: '1 day',
    deadline: '2 days',
    posted_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    client: {
      name: 'PixelCraft Agency',
      country: 'Australia',
      rating: 4.9,
      reviews: 28,
      jobs_posted: 34,
      jobs_hired: 30,
      hire_rate: 88
    },
    competition: { proposal_count: 14 },
    communication_requirements: ['Low communication', 'Platform chat'],
    requirements: ['HTML', 'CSS', 'Responsive Layout'],
    external_links: [],
    source_data: {}
  },

  // 9. AI/Data Tasks, High Match
  {
    platform: 'upwork',
    platform_job_id: 'upwork_103',
    url: 'https://www.upwork.com/jobs/~ai_dataset_eval',
    title: 'Evaluate & Categorize 300 AI Model Prompts and Responses',
    description: 'We are evaluating prompt accuracy for a customer service chatbot. You will be given a spreadsheet of 300 prompt-response pairs. Grade each on helpfulness (1-5 scale) and flag hallucinated information based on our rubric.',
    category: 'AI/Data Tasks',
    skills: ['AI Data Tasks', 'Data Entry', 'Evaluation', 'Spreadsheets'],
    budget: { type: 'fixed', min: 70, max: 110, currency: 'USD' },
    experience_level: 'Entry',
    estimated_duration: '2 to 3 days',
    deadline: '4 days',
    posted_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    client: {
      name: 'NeuralEdge Tech',
      country: 'United States',
      rating: 5.0,
      reviews: 22,
      jobs_posted: 29,
      jobs_hired: 27,
      hire_rate: 93
    },
    competition: { proposal_count: 9 },
    communication_requirements: ['Written questions only'],
    requirements: ['Attention to Detail', 'AI Data Evaluation', 'Google Sheets'],
    external_links: [],
    source_data: { connects_required: 4 }
  },

  // 10. Content / Web Research, High Match
  {
    platform: 'fiverr',
    platform_job_id: 'fiverr_202',
    url: 'https://www.fiverr.com/buyer-request/fiv_002',
    title: 'Collect Industry Benchmark Data for 50 SaaS Products',
    description: 'Visit pricing pages of 50 specified SaaS productivity tools. Extract starter price, tier 2 price, free trial duration, and feature checkboxes into a provided Excel matrix.',
    category: 'Web Research',
    skills: ['Web Research', 'Excel', 'Data Entry'],
    budget: { type: 'fixed', min: 55, max: 90, currency: 'USD' },
    experience_level: 'Entry',
    estimated_duration: '3 days',
    deadline: '5 days',
    posted_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    client: {
      name: 'ProductPulse Media',
      country: 'Germany',
      rating: 4.92,
      reviews: 16,
      jobs_posted: 19,
      jobs_hired: 17,
      hire_rate: 89
    },
    competition: { proposal_count: 11 },
    communication_requirements: ['Platform messaging only'],
    requirements: ['Web Research', 'Excel', 'Data Collection'],
    external_links: [],
    source_data: {}
  },

  // 11. Customer Support, Moderate Match (Low calls)
  {
    platform: 'upwork',
    platform_job_id: 'upwork_104',
    url: 'https://www.upwork.com/jobs/~email_ticket_support',
    title: 'Email & Zendesk Ticket Support Assistant (Weekend Shift)',
    description: 'Seeking an organized assistant to respond to customer inquiries via email tickets using canned macros. Zero phone calls or voice interaction. 15-20 tickets per day on Saturdays and Sundays.',
    category: 'Customer Support',
    skills: ['Customer Support', 'Email Support', 'Zendesk', 'Written Communication'],
    budget: { type: 'hourly', min: 16, max: 22, currency: 'USD' },
    experience_level: 'Intermediate',
    estimated_duration: '1 to 3 months',
    deadline: 'Ongoing',
    posted_at: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    client: {
      name: 'GearPeak Outdoors',
      country: 'United States',
      rating: 4.85,
      reviews: 40,
      jobs_posted: 55,
      jobs_hired: 45,
      hire_rate: 81
    },
    competition: { proposal_count: 19 },
    communication_requirements: ['Async Slack channel updates'],
    requirements: ['Customer Support', 'Email Communication'],
    external_links: [],
    source_data: { connects_required: 6 }
  },

  // 12. Python script automation, Moderate
  {
    platform: 'upwork',
    platform_job_id: 'upwork_105',
    url: 'https://www.upwork.com/jobs/~python_script_automation',
    title: 'Simple Python Script to Merge and Deduplicate CSV Files',
    description: 'Need a short, clean Python script that reads 12 CSV files from a directory, drops duplicate records by email address, formats dates consistently, and exports a unified master.csv file.',
    category: 'Programming',
    skills: ['Python', 'Pandas', 'Data Processing', 'Automation'],
    budget: { type: 'fixed', min: 50, max: 80, currency: 'USD' },
    experience_level: 'Intermediate',
    estimated_duration: '1 to 2 days',
    deadline: '3 days',
    posted_at: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    client: {
      name: 'DataVenture Capital',
      country: 'United States',
      rating: 5.0,
      reviews: 14,
      jobs_posted: 18,
      jobs_hired: 18,
      hire_rate: 100
    },
    competition: { proposal_count: 16 },
    communication_requirements: ['Low communication', 'GitHub / code delivery'],
    requirements: ['Python', 'CSV Processing'],
    external_links: [],
    source_data: { connects_required: 4 }
  }
];
