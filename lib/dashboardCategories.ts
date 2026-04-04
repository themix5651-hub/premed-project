export type CategoryStatus = 'Strong' | 'Competitive' | 'Developing' | 'Needs Work' | 'Critical';

export type CategoryBar = {
  label: string;
  percent: number;
  status: CategoryStatus;
  baselinePercent?: number;
};

export type SearchParamsInput = {
  gpa?: string;
  scienceGpa?: string;
  clinicalHours?: string;
  shadowingHours?: string;
  volunteeringHours?: string;
  researchHours?: string;
  leadershipExperiences?: string;
  mcatStatus?: string;
  mcatScore?: string;
};

type IntakeField =
  | 'clinicalHours'
  | 'shadowingHours'
  | 'volunteeringHours'
  | 'researchHours'
  | 'leadershipExperiences'
  | null;

export type CategoryDefinition = {
  slug: string;
  label: string;
  activityCategory: string;
  intakeField: IntakeField;
};

export const categoryDefinitions: CategoryDefinition[] = [
  { slug: 'gpa', label: 'GPA', activityCategory: 'gpa', intakeField: null },
  { slug: 'mcat', label: 'MCAT', activityCategory: 'mcat', intakeField: null },
  { slug: 'clinical-experience', label: 'Clinical experience', activityCategory: 'clinical-experience', intakeField: 'clinicalHours' },
  { slug: 'physician-shadowing', label: 'Physician shadowing', activityCategory: 'physician-shadowing', intakeField: 'shadowingHours' },
  { slug: 'community-service', label: 'Community service', activityCategory: 'community-service', intakeField: 'volunteeringHours' },
  { slug: 'research', label: 'Research', activityCategory: 'research', intakeField: 'researchHours' },
  { slug: 'leadership', label: 'Leadership', activityCategory: 'leadership', intakeField: 'leadershipExperiences' },
  { slug: 'extracurriculars', label: 'Extracurriculars', activityCategory: 'extracurriculars', intakeField: null },
  { slug: 'letters-of-recommendation', label: 'Letters of Recommendation', activityCategory: 'letters-of-recommendation', intakeField: null },
];

export const categoryNextSteps: Record<string, Record<CategoryStatus, string[]>> = {
  'Clinical experience': {
    Critical: [
      'You need patient-facing hours immediately — this is the single most important gap to close',
      'Start with a clinical scribing, ER tech, or hospital volunteering role within the week',
      'Adcoms screen out profiles without meaningful clinical exposure — 50+ hours is the bare minimum',
    ],
    'Needs Work': [
      'Find one recurring weekly clinical shift through scribing, EMT, or hospital volunteering',
      'Aim for at least 100 hours before your first application to move into competitive range',
      'Log every patient-facing hour including observation shifts and triage roles',
    ],
    Developing: [
      'Push toward 200+ hours to reach competitive range — consistency matters more than intensity',
      'Diversify settings — try inpatient, outpatient, and community clinic experiences',
      'Start noting specific patient interactions you can reference in essays',
    ],
    Competitive: [
      'Push toward 500+ hours to reach Strong range and open the top tier of programs',
      'Identify one defining clinical experience that will anchor your personal statement',
      'Consider a clinical leadership role like charge scribe or team lead',
    ],
    Strong: [
      'Your clinical hours are elite-level — shift focus to quality and narrative over adding more hours',
      'Identify the single most meaningful patient interaction and build your personal statement around it',
      'Consider a clinical teaching or mentorship role to deepen the experience further',
    ],
  },
  'Physician shadowing': {
    Critical: [
      'No shadowing is a major application red flag — reach out to physicians immediately',
      'Cold email 5 physicians in different specialties this week — most say yes to a polite request',
      'Aim for at least 30 hours across 2 specialties before submitting any application',
    ],
    'Needs Work': [
      'Cold email 5 physicians this week — most say yes to a polite ask',
      'Shadow across at least 2 different specialties to show informed exposure',
      'Aim for a minimum of 30 hours before applying',
    ],
    Developing: [
      'Add one more specialty to show breadth of exposure',
      'Ask your shadowing physician for a brief informational conversation about their career path',
      'Document specific observations you can reference in secondaries',
    ],
    Competitive: [
      'Push toward 100+ hours to reach Strong range — especially important for specialty-specific programs',
      'Reflect on how each specialty experience shaped your interest in medicine',
      'Use shadowing connections as potential letter of recommendation sources',
    ],
    Strong: [
      'Your shadowing depth is excellent — focus on specialty exploration and building relationships',
      'Ask one shadowing physician to serve as a letter of recommendation source',
      'Use what you have observed to articulate your specific reasons for medicine in interviews and essays',
    ],
  },
  Research: {
    Critical: [
      'No research significantly narrows your school list — especially research-heavy programs',
      'Email one professor or lab this week and ask to get involved at any level',
      'Even a single semester of research involvement before applying adds real credibility',
    ],
    'Needs Work': [
      'Email one professor or lab this week and ask to discuss their work',
      "Look into your school's undergraduate research programs and SURF/UROP opportunities",
      'Even 1 semester of lab involvement adds meaningful depth to the profile',
    ],
    Developing: [
      'Push toward 200+ hours and a named contribution — poster, abstract, or publication',
      'Ask your PI about presenting at a departmental meeting',
      'Connect your research topic to your interest in medicine in the personal statement',
    ],
    Competitive: [
      'Push toward 400+ hours or a publication/poster to reach Strong range',
      'Present at an external conference if your timeline allows',
      'Articulate clearly in essays how research shaped your clinical thinking',
    ],
    Strong: [
      'Your research experience is exceptional — pursue a first-author opportunity or thesis if timeline allows',
      'Present at an external conference or submit an abstract to a national meeting',
      'Be prepared to speak fluently about your research methods and findings in interviews',
    ],
  },
  'Community service': {
    Critical: [
      'Community service is absent — adcoms expect genuine evidence of service orientation',
      'Commit to one recurring, non-clinical service role starting this month',
      'Free clinics, tutoring, food banks, and mentorship programs all count — pick one and stay consistent',
    ],
    'Needs Work': [
      'Commit to one recurring service role rather than one-off events',
      'Free clinics, food banks, and tutoring programs all count — pick one and stick with it',
      'Aim for at least 50 hours before applying',
    ],
    Developing: [
      'Build toward 100+ hours with one anchor organization',
      'Take on a small leadership role within your service commitment',
      'Connect your service work to your reasons for medicine in your essays',
    ],
    Competitive: [
      'Push toward 250+ hours to reach Strong range — sustained commitment signals character',
      'Identify a specific community need your work addresses',
      'Use service experiences to demonstrate empathy and cultural competency in secondaries',
    ],
    Strong: [
      'Your service record is excellent — deepen impact within existing commitments over adding new ones',
      'Consider a leadership role in your primary service organization',
      'Use your service experiences to anchor your community-oriented narrative in interviews',
    ],
  },
  Leadership: {
    Critical: [
      'No leadership on your record is a meaningful gap — formal or informal roles both count',
      'Take on a president, coordinator, or team lead role this semester',
      'Leadership in clinical, research, or service settings carries the most weight on applications',
    ],
    'Needs Work': [
      'Take on one formal leadership role this semester — president, coordinator, or team lead',
      'Informal mentorship or peer tutoring also counts if done consistently',
      'Quality matters more than quantity — one real role beats five titles',
    ],
    Developing: [
      'Pursue a role where outcomes are visible and measurable',
      'Document specific decisions you made and results they produced',
      'Leadership in a clinical or research setting carries extra weight',
    ],
    Competitive: [
      'Build toward 3+ roles to reach Strong range — variety across settings adds breadth',
      'Reflect on a challenge you navigated as a leader for interview and essay material',
      'Consider if any leadership role connects directly to your specialty interest',
    ],
    Strong: [
      'Your leadership record is strong — focus on narrative rather than adding more titles',
      'Mentor a younger student or premed to add a teaching and service dimension',
      'Prepare a specific leadership story for interviews that shows how you handled a genuine challenge',
    ],
  },
  GPA: {
    Critical: [
      'Your GPA is below the minimum competitive threshold — this needs to be addressed directly',
      'Meet with an academic advisor immediately to build a recovery plan with a realistic timeline',
      'Consider a post-bacc program or grade replacement if GPA stays below 3.2 through senior year',
    ],
    'Needs Work': [
      'Meet with your academic advisor to map a GPA recovery plan',
      'Focus on an upward trend — adcoms notice improvement across semesters',
      'Consider a post-bacc if GPA stays below 3.5 through senior year',
    ],
    Developing: [
      'Protect your GPA in science courses — sGPA matters as much as cumulative',
      'Use office hours and study groups to shore up weak subjects',
      'A strong MCAT can partially offset a lower GPA but cannot replace it',
    ],
    Competitive: [
      'Push toward 3.85+ to reach Strong range — late upward trends are noticed positively',
      'Make sure sGPA and cGPA are both strong, not just one of them',
      'Challenge yourself with upper-division science courses to reinforce the academic signal',
    ],
    Strong: [
      'Your GPA is elite and well above median matriculant range — protect it through graduation',
      'Make sure both cGPA and sGPA remain strong — a drop in either is noticed on applications',
      'Challenge yourself with advanced science courses to signal sustained academic rigor',
    ],
  },
  MCAT: {
    Critical: [
      'No MCAT or a score below 500 is a major application barrier — this must be addressed first',
      'Register for a test date immediately and build a structured 3–4 month study plan',
      'Use AAMC official materials as your primary prep resource — third-party tools are supplemental',
    ],
    'Needs Work': [
      'Set a test date and register now — having a deadline drives preparation',
      'Use AAMC official materials as your primary study resource',
      'Aim for at least 3 months of structured daily prep before your test date',
    ],
    Developing: [
      'Identify your weakest section and dedicate extra time to it',
      'Take one full-length practice test per week in the final month',
      'A 511+ opens most MD programs — use that as your floor target',
    ],
    Competitive: [
      'Push toward 517+ to reach Strong range and open top 10 programs',
      'Review any missed questions for patterns even if your current score is strong',
      'Consider whether a retake could meaningfully strengthen your school list',
    ],
    Strong: [
      'Your MCAT is exceptional — verify your score is still valid before your application cycle',
      'Review weak sections to ensure you can sustain this score on a retake if ever needed',
      'Use your MCAT prep as a story about focus and intellectual discipline in the personal statement',
    ],
  },
  Extracurriculars: {
    Critical: [
      'No extracurriculars leaves your personal identity undefined for adcoms',
      'Document at least two sustained personal interests — sports, music, art, language, creative work all count',
      'Authenticity matters more than prestige — choose things you have genuinely invested time in',
    ],
    'Needs Work': [
      'Document at least one sustained personal interest — adcoms want to see who you are outside of medicine',
      'Extracurriculars do not need to be impressive — they need to be genuine and consistent',
      'Think beyond premed activities — sports, music, art, language, and creative hobbies all count',
    ],
    Developing: [
      'Aim to document 3 or more distinct personal interests to show well-rounded depth',
      'Sustained involvement matters more than variety — one activity for 4 years beats four for 3 months each',
      'Your most meaningful extracurricular can anchor an essay — start reflecting on what it means to you',
    ],
    Competitive: [
      'Push toward 4+ activities to reach Strong range — breadth signals a full life outside medicine',
      'Consider whether any extracurricular demonstrates a skill that transfers to medicine',
      'Interviewers often open with extracurriculars — be ready to tell a compelling story',
    ],
    Strong: [
      'Your extracurricular depth is excellent — focus on articulating meaning rather than adding volume',
      'Make sure your most meaningful activity connects to a story you can tell in interviews',
      'Prepare to speak about how your interests outside medicine shape your perspective as a future physician',
    ],
  },
  'Letters of Recommendation': {
    Critical: [
      'Fewer than 2 letters is a serious application gap — most programs require a minimum of 3',
      'Identify and reach out to science professors and a physician immediately',
      'Give recommenders 3+ months to write a strong letter — earlier is always better',
    ],
    'Needs Work': [
      'Identify at least 3 people you plan to ask — start with physicians you have shadowed and science professors',
      'Most MD programs require 2 science faculty letters and 1 physician letter at minimum',
      'Ask early — recommenders need at least 2–3 months to write a strong letter',
    ],
    Developing: [
      'Follow up professionally with anyone you have asked but not yet confirmed',
      'Make sure you have at least one physician letter and one science faculty letter in progress',
      'Send your recommenders a brief update on your activities and goals to help them write a stronger letter',
    ],
    Competitive: [
      'Work toward 5 letters from diverse sources — clinical mentor, research PI, science faculty, and others',
      'Confirm submission deadlines with each recommender well in advance of your application date',
      'Make sure your letters cover different aspects of your character — avoid all letters from the same context',
    ],
    Strong: [
      'Your letter count is strong — focus on ensuring diversity of perspective across all recommenders',
      'Send a brief update to each recommender about your recent accomplishments to help them write specifically',
      'Confirm submission timelines well in advance so nothing delays your application',
    ],
  },
};

function toNumber(value: string | undefined) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function buildCategory(label: string, percent: number, status: CategoryStatus): CategoryBar {
  return { label, percent, status };
}

export function getStatusClasses(status: CategoryStatus) {
  if (status === 'Strong') return { fill: 'bg-green-700', text: 'text-green-700' };
  if (status === 'Competitive') return { fill: 'bg-green-500', text: 'text-green-600' };
  if (status === 'Developing') return { fill: 'bg-amber-400', text: 'text-amber-600' };
  if (status === 'Needs Work') return { fill: 'bg-red-500', text: 'text-red-500' };
  return { fill: 'bg-red-900', text: 'text-red-900' }; // Critical
}

export function buildCategories(params: SearchParamsInput): CategoryBar[] {
  const cgpa = toNumber(params.gpa);
  const sgpa = toNumber(params.scienceGpa);
  const effectiveGpa = sgpa > 0 ? Math.min(cgpa, sgpa) : cgpa;
  const clinical = toNumber(params.clinicalHours);
  const shadowing = toNumber(params.shadowingHours);
  const volunteering = toNumber(params.volunteeringHours);
  const research = toNumber(params.researchHours);
  const leadership = toNumber(params.leadershipExperiences);
  const mcatStatus = params.mcatStatus ?? 'Planning';
  const mcatScore = toNumber(params.mcatScore);

  return [
    effectiveGpa >= 3.85
      ? buildCategory('GPA', 100, 'Strong')
      : effectiveGpa >= 3.7
        ? buildCategory('GPA', 82, 'Competitive')
        : effectiveGpa >= 3.5
          ? buildCategory('GPA', 62, 'Developing')
          : effectiveGpa >= 3.2
            ? buildCategory('GPA', 38, 'Needs Work')
            : buildCategory('GPA', 15, 'Critical'),
    mcatStatus !== 'Taken'
      ? buildCategory('MCAT', 15, 'Critical')
      : mcatScore >= 517
        ? buildCategory('MCAT', 100, 'Strong')
        : mcatScore >= 511
          ? buildCategory('MCAT', 82, 'Competitive')
          : mcatScore >= 505
            ? buildCategory('MCAT', 62, 'Developing')
            : mcatScore >= 500
              ? buildCategory('MCAT', 38, 'Needs Work')
              : buildCategory('MCAT', 15, 'Critical'),
    clinical >= 500
      ? buildCategory('Clinical experience', 100, 'Strong')
      : clinical >= 200
        ? buildCategory('Clinical experience', 80, 'Competitive')
        : clinical >= 100
          ? buildCategory('Clinical experience', 60, 'Developing')
          : clinical >= 50
            ? buildCategory('Clinical experience', 35, 'Needs Work')
            : buildCategory('Clinical experience', 15, 'Critical'),
    shadowing >= 100
      ? buildCategory('Physician shadowing', 100, 'Strong')
      : shadowing >= 60
        ? buildCategory('Physician shadowing', 80, 'Competitive')
        : shadowing >= 30
          ? buildCategory('Physician shadowing', 60, 'Developing')
          : shadowing >= 15
            ? buildCategory('Physician shadowing', 35, 'Needs Work')
            : buildCategory('Physician shadowing', 15, 'Critical'),
    volunteering >= 250
      ? buildCategory('Community service', 100, 'Strong')
      : volunteering >= 100
        ? buildCategory('Community service', 80, 'Competitive')
        : volunteering >= 50
          ? buildCategory('Community service', 60, 'Developing')
          : volunteering >= 20
            ? buildCategory('Community service', 35, 'Needs Work')
            : buildCategory('Community service', 15, 'Critical'),
    research >= 400
      ? buildCategory('Research', 100, 'Strong')
      : research >= 200
        ? buildCategory('Research', 80, 'Competitive')
        : research >= 100
          ? buildCategory('Research', 60, 'Developing')
          : research >= 50
            ? buildCategory('Research', 35, 'Needs Work')
            : buildCategory('Research', 15, 'Critical'),
    leadership >= 3
      ? buildCategory('Leadership', 100, 'Strong')
      : leadership >= 2
        ? buildCategory('Leadership', 80, 'Competitive')
        : leadership >= 1
          ? buildCategory('Leadership', 55, 'Developing')
          : buildCategory('Leadership', 15, 'Critical'),
    buildCategory('Extracurriculars', 15, 'Critical'),
    buildCategory('Letters of Recommendation', 15, 'Critical'),
  ];
}

export function getCategoryDefinitionByLabel(label: string) {
  return categoryDefinitions.find((category) => category.label === label);
}

export function getCategoryDefinitionBySlug(slug: string) {
  return categoryDefinitions.find((category) => category.slug === slug);
}
