export type CategoryStatus = 'Competitive' | 'Developing' | 'Needs work';

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
    'Needs work': [
      'Find one recurring weekly clinical shift through scribing, EMT, or hospital volunteering',
      'Aim for at least 50 hours before your first application',
      'Log every patient-facing hour including observation shifts',
    ],
    Developing: [
      'Push toward 100+ hours to move into competitive range',
      'Diversify settings - try inpatient, outpatient, and community clinic',
      'Start noting specific patient interactions you can reference in essays',
    ],
    Competitive: [
      "Maintain consistency and don't let hours drop off senior year",
      'Identify one experience that will anchor your personal statement',
      'Consider a clinical leadership role like charge scribe or team lead',
    ],
  },
  'Physician shadowing': {
    'Needs work': [
      'Cold email 5 physicians this week - most say yes to a polite ask',
      'Shadow across at least 2 different specialties',
      'Aim for a minimum of 20 hours before applying',
    ],
    Developing: [
      'Add one more specialty to show breadth of exposure',
      'Ask your shadowing physician for a brief informational conversation about their path',
      'Document specific observations you can reference in secondaries',
    ],
    Competitive: [
      'Consider shadowing in a research or academic medical center setting',
      'Reflect on how each specialty experience shaped your interest in medicine',
      'Use shadowing connections as potential letter of rec sources',
    ],
  },
  Research: {
    'Needs work': [
      'Email one professor or lab this week and ask to discuss their work',
      "Look into your school's undergraduate research programs",
      'Even 1 semester of lab involvement adds depth to the profile',
    ],
    Developing: [
      'Push toward a named contribution - poster, abstract, or publication',
      'Ask your PI about presenting at a departmental meeting',
      'Connect research topic to your interest in medicine in your personal statement',
    ],
    Competitive: [
      'Pursue a first-author opportunity or thesis if timeline allows',
      'Present at an external conference if possible',
      'Articulate clearly in essays how research shaped your clinical thinking',
    ],
  },
  'Community service': {
    'Needs work': [
      'Commit to one recurring service role rather than one-off events',
      'Free clinics, food banks, and tutoring programs all count - pick one and stick with it',
      'Aim for at least 25 hours before applying',
    ],
    Developing: [
      'Build toward 75+ hours with one anchor organization',
      'Take on a small leadership role within your service commitment',
      'Connect your service work to your reasons for medicine in your essays',
    ],
    Competitive: [
      'Deepen impact within your existing commitment rather than adding new ones',
      'Identify a specific community need your work addresses',
      'Use service experiences to demonstrate empathy and cultural competency in essays',
    ],
  },
  Leadership: {
    'Needs work': [
      'Take on one formal leadership role this semester - president, coordinator, or team lead',
      'Informal mentorship or peer tutoring also counts if done consistently',
      'Quality matters more than quantity - one real role beats five titles',
    ],
    Developing: [
      'Pursue a role where outcomes are visible and measurable',
      'Document specific decisions you made and results they produced',
      'Leadership in a clinical or research setting carries extra weight',
    ],
    Competitive: [
      'Mentor a younger student or premed to deepen your leadership narrative',
      'Reflect on a challenge you navigated as a leader for essay material',
      'Consider if any leadership role connects directly to your specialty interest',
    ],
  },
  GPA: {
    'Needs work': [
      'Meet with your academic advisor to map a GPA recovery plan',
      'Focus on an upward trend - adcoms notice improvement',
      'Consider a post-bacc if GPA stays below 3.2 through senior year',
    ],
    Developing: [
      'Protect your GPA in science courses - sGPA matters as much as cumulative',
      'Use office hours and study groups to shore up weak subjects',
      'A strong MCAT can partially offset a lower GPA but cannot replace it',
    ],
    Competitive: [
      'Maintain consistency through graduation - late GPA drops are noticed',
      'Challenge yourself with upper-division science courses if possible',
      'Make sure sGPA and cGPA are both strong, not just one of them',
    ],
  },
  MCAT: {
    'Needs work': [
      'Set a test date and register now - having a deadline drives preparation',
      'Use AAMC official materials as your primary study resource',
      'Aim for at least 3 months of structured daily prep before your test date',
    ],
    Developing: [
      'Identify your weakest section and dedicate extra time to it',
      'Take one full-length practice test per week in the final month',
      'A 511+ opens most MD programs - use that as your floor target',
    ],
    Competitive: [
      'Review any missed questions for patterns even if the score is strong',
      'Consider whether a retake could meaningfully strengthen your school list',
      'Use your MCAT preparation as evidence of discipline in your personal statement',
    ],
  },
  Extracurriculars: {
    'Needs work': [
      'Document at least one sustained personal interest - adcoms want to see who you are outside of medicine',
      'Extracurriculars do not need to be impressive - they need to be genuine and consistent',
      'Think beyond premed activities - sports, music, art, language, and creative hobbies all count',
    ],
    Developing: [
      'Aim to document 3 or more distinct personal interests to show well-rounded depth',
      'Sustained involvement matters more than variety - one activity for 4 years beats four activities for 3 months each',
      'Your most meaningful extracurricular can anchor an essay - start reflecting on what it means to you',
    ],
    Competitive: [
      'Make sure your most meaningful activity connects to something you can speak to in an interview',
      'Consider whether any extracurricular demonstrates a skill that transfers to medicine - leadership, precision, teamwork, empathy',
      'Interviewers often open with extracurriculars - be ready to tell a compelling story about at least one',
    ],
  },
  'Letters of Recommendation': {
    'Needs work': [
      'Identify at least 3 people you plan to ask for a letter - start with physicians you have shadowed and science professors',
      'Most MD programs require 2 science faculty letters and 1 physician letter at minimum',
      'Ask early - recommenders need at least 2-3 months to write a strong letter',
    ],
    Developing: [
      'Follow up professionally with anyone you have asked but not yet confirmed',
      'Make sure you have at least one physician letter and at least one science faculty letter in progress',
      'Send your recommenders a brief update on your activities and goals to help them write a stronger letter',
    ],
    Competitive: [
      'Confirm submission deadlines with each recommender well in advance of your application date',
      'Send a thank you note to each confirmed recommender - it’s the right thing to do and strengthens the relationship',
      'Make sure your letters cover different aspects of your character - avoid having all letters from the same context',
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
  if (status === 'Competitive') return { fill: 'bg-green-600', text: 'text-green-600' };
  if (status === 'Developing') return { fill: 'bg-amber-600', text: 'text-amber-600' };
  return { fill: 'bg-red-600', text: 'text-red-600' };
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
    effectiveGpa >= 3.8
      ? buildCategory('GPA', 100, 'Competitive')
      : effectiveGpa >= 3.6
        ? buildCategory('GPA', 82, 'Competitive')
        : effectiveGpa >= 3.4
          ? buildCategory('GPA', 62, 'Developing')
          : effectiveGpa >= 3.2
            ? buildCategory('GPA', 40, 'Developing')
            : buildCategory('GPA', 20, 'Needs work'),
    mcatStatus !== 'Taken'
      ? buildCategory('MCAT', 15, 'Needs work')
      : mcatScore >= 517
        ? buildCategory('MCAT', 100, 'Competitive')
        : mcatScore >= 511
          ? buildCategory('MCAT', 82, 'Competitive')
          : mcatScore >= 506
            ? buildCategory('MCAT', 62, 'Developing')
            : mcatScore >= 500
              ? buildCategory('MCAT', 44, 'Developing')
              : buildCategory('MCAT', 25, 'Needs work'),
    clinical >= 200
      ? buildCategory('Clinical experience', 100, 'Competitive')
      : clinical >= 100
        ? buildCategory('Clinical experience', 70, 'Competitive')
        : clinical >= 50
          ? buildCategory('Clinical experience', 50, 'Developing')
          : clinical >= 20
            ? buildCategory('Clinical experience', 30, 'Developing')
            : buildCategory('Clinical experience', 12, 'Needs work'),
    shadowing >= 50
      ? buildCategory('Physician shadowing', 100, 'Competitive')
      : shadowing >= 20
        ? buildCategory('Physician shadowing', 72, 'Competitive')
        : shadowing >= 10
          ? buildCategory('Physician shadowing', 50, 'Developing')
          : shadowing >= 1
            ? buildCategory('Physician shadowing', 30, 'Developing')
            : buildCategory('Physician shadowing', 10, 'Needs work'),
    volunteering >= 150
      ? buildCategory('Community service', 100, 'Competitive')
      : volunteering >= 75
        ? buildCategory('Community service', 72, 'Competitive')
        : volunteering >= 25
          ? buildCategory('Community service', 50, 'Developing')
          : volunteering >= 1
            ? buildCategory('Community service', 30, 'Developing')
            : buildCategory('Community service', 10, 'Needs work'),
    research >= 150
      ? buildCategory('Research', 100, 'Competitive')
      : research >= 50
        ? buildCategory('Research', 70, 'Competitive')
        : research >= 1
          ? buildCategory('Research', 45, 'Developing')
          : buildCategory('Research', 10, 'Needs work'),
    leadership >= 3
      ? buildCategory('Leadership', 100, 'Competitive')
      : leadership >= 1
        ? buildCategory('Leadership', 55, 'Developing')
        : buildCategory('Leadership', 10, 'Needs work'),
    buildCategory('Extracurriculars', 0, 'Needs work'),
    buildCategory('Letters of Recommendation', 0, 'Needs work'),
  ];
}

export function getCategoryDefinitionByLabel(label: string) {
  return categoryDefinitions.find((category) => category.label === label);
}

export function getCategoryDefinitionBySlug(slug: string) {
  return categoryDefinitions.find((category) => category.slug === slug);
}
