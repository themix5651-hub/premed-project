import { IntakeData, Report } from './types';

const buildSummary = (score: number, data: IntakeData): string => {
  if (score >= 80) {
    return `You are in a competitive range for the ${data.targetApplicationYear} cycle with strong core metrics. Focus now on consistency and polishing your story.`;
  }
  if (score >= 60) {
    return `You are building a solid profile for ${data.targetApplicationYear}, but a few key areas need more depth before you apply.`;
  }
  return `Your foundation is in progress for ${data.targetApplicationYear}. Strategic improvements over the next few months can significantly strengthen your application.`;
};

export const generateReport = (data: IntakeData): Report => {
  let readinessScore = 30;
  const strengths: string[] = [];
  const weakSpots: string[] = [];
  const priorities: string[] = [];
  const actionPlan: string[] = [];

  // GPA scoring
  if (data.gpa >= 3.8) {
    readinessScore += 20;
    strengths.push(`Excellent academic performance (GPA ${data.gpa.toFixed(2)}).`);
  } else if (data.gpa >= 3.5) {
    readinessScore += 14;
    strengths.push(`Strong GPA foundation (${data.gpa.toFixed(2)}).`);
  } else if (data.gpa >= 3.2) {
    readinessScore += 8;
    weakSpots.push(`GPA at ${data.gpa.toFixed(2)} is workable but could be more competitive.`);
    priorities.push('Raise your academic trend with strong upcoming science coursework.');
  } else {
    readinessScore += 4;
    weakSpots.push(`GPA (${data.gpa.toFixed(2)}) is below common MD/DO competitive ranges.`);
    priorities.push('Build an academic repair plan (post-bacc classes or high-credit science term).');
  }

  // Clinical experience
  if (data.clinicalHours >= 300) {
    readinessScore += 18;
    strengths.push(`Robust patient exposure with ${data.clinicalHours} clinical hours.`);
  } else if (data.clinicalHours >= 150) {
    readinessScore += 11;
    strengths.push(`Meaningful clinical involvement with ${data.clinicalHours} hours.`);
  } else {
    readinessScore += 4;
    weakSpots.push(`Limited clinical exposure (${data.clinicalHours} hours) weakens patient-facing readiness.`);
    priorities.push('Increase direct clinical experience through consistent weekly shifts.');
  }

  // Shadowing
  if (data.shadowingHours >= 60) {
    readinessScore += 10;
    strengths.push(`Strong physician exposure with ${data.shadowingHours} shadowing hours.`);
  } else if (data.shadowingHours >= 30) {
    readinessScore += 6;
  } else {
    readinessScore += 2;
    weakSpots.push(`Physician exposure is thin (${data.shadowingHours} shadowing hours).`);
    priorities.push('Schedule shadowing across at least two specialties.');
  }

  // Volunteering
  if (data.volunteeringHours >= 150) {
    readinessScore += 12;
    strengths.push(`Service commitment stands out with ${data.volunteeringHours} volunteering hours.`);
  } else if (data.volunteeringHours >= 75) {
    readinessScore += 7;
  } else {
    readinessScore += 3;
    weakSpots.push(`Community service is limited (${data.volunteeringHours} hours).`);
    priorities.push('Add longitudinal non-clinical volunteering to demonstrate service orientation.');
  }

  // Research
  if (data.researchHours >= 250) {
    readinessScore += 10;
    strengths.push(`Research depth is a plus with ${data.researchHours} hours.`);
  } else if (data.researchHours > 0) {
    readinessScore += 5;
  } else {
    readinessScore += 0;
    weakSpots.push('No research hours reported, which may be a gap for research-focused programs.');
    priorities.push('Join a research project and aim for sustained involvement.');
  }

  // Leadership
  if (data.leadershipExperiences >= 3) {
    readinessScore += 9;
    strengths.push(`Leadership profile is strong with ${data.leadershipExperiences} experiences.`);
  } else if (data.leadershipExperiences >= 1) {
    readinessScore += 5;
  } else {
    readinessScore += 1;
    weakSpots.push('No leadership experiences listed.');
    priorities.push('Take on a leadership role in a campus or community organization.');
  }

  // MCAT status
  if (data.mcatStatus === 'Taken') {
    readinessScore += 8;
    strengths.push('MCAT has already been completed, which improves application timing confidence.');
  } else if (data.mcatStatus === 'Planning') {
    readinessScore += 4;
    priorities.push('Finalize your MCAT timeline and complete a diagnostic + weekly study schedule.');
  } else {
    readinessScore += 1;
    weakSpots.push('MCAT not taken yet; timeline risk can affect your target application cycle.');
    priorities.push('Set an MCAT date early enough to allow a retake buffer if needed.');
  }

  readinessScore = Math.max(20, Math.min(100, readinessScore));

  while (strengths.length < 3) {
    strengths.push('You are building key competencies with room to deepen impact and consistency.');
  }
  while (weakSpots.length < 3) {
    weakSpots.push('Personal narrative and reflection quality were not assessed in this MVP report.');
  }
  while (priorities.length < 3) {
    priorities.push('Continue maintaining consistency in current commitments and document outcomes.');
  }

  actionPlan.push(
    `Week 1: Audit your current activities, then schedule ${data.schoolYear === 'Gap Year' ? '12-15' : '8-10'} weekly hours toward top priority areas.`,
    'Week 2: Reach out to 3 potential mentors (physicians, PI, advisor) and secure one guidance conversation.',
    'Week 3: Create experience impact bullets (action + context + measurable result) for your top 5 activities.',
    'Week 4: Review progress, adjust targets, and lock in a 90-day consistency plan before your next report.'
  );

  return {
    readinessScore,
    summary: buildSummary(readinessScore, data),
    strengths: strengths.slice(0, 3),
    weakSpots: weakSpots.slice(0, 3),
    priorities: priorities.slice(0, 3),
    actionPlan
  };
};
