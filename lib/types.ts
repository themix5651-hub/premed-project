export type SchoolYear = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Gap Year';
export type McatStatus = 'Not taken' | 'Planning' | 'Taken';

export type IntakeData = {
  gpa: number;
  schoolYear: SchoolYear;
  clinicalHours: number;
  shadowingHours: number;
  volunteeringHours: number;
  researchHours: number;
  leadershipExperiences: number;
  mcatStatus: McatStatus;
  targetApplicationYear: number;
};

export type Report = {
  readinessScore: number;
  summary: string;
  strengths: string[];
  weakSpots: string[];
  priorities: string[];
  actionPlan: string[];
};
