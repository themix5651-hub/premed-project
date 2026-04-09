'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';

type SearchParams = {
  gpa?: string;
  scienceGpa?: string;
  schoolYear?: string;
  clinicalHours?: string;
  shadowingHours?: string;
  volunteeringHours?: string;
  researchHours?: string;
  leadershipExperiences?: string;
  extracurriculars?: string;
  lettersOfRec?: string;
  mcatStatus?: string;
  mcatScore?: string;
  targetApplicationYear?: string;
};

type CategoryBar = {
  label: string;
  percent: number;
  status: 'Strong' | 'Competitive' | 'Developing' | 'Needs Work' | 'Critical';
};

type ResultsClientProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

function toValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: string | undefined) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function buildCategory(label: string, percent: number, status: CategoryBar['status']): CategoryBar {
  return { label, percent, status };
}

function generateReport(params: SearchParams) {
  const cgpa = toNumber(params.gpa);
  const sgpa = toNumber(params.scienceGpa);
  const effectiveGpa = sgpa > 0 ? Math.min(cgpa, sgpa) : cgpa;
  const clinical = toNumber(params.clinicalHours);
  const shadowing = toNumber(params.shadowingHours);
  const volunteering = toNumber(params.volunteeringHours);
  const research = toNumber(params.researchHours);
  const leadership = toNumber(params.leadershipExperiences);
  const extracurriculars = toNumber(params.extracurriculars);
  const lettersOfRec = toNumber(params.lettersOfRec);
  const mcatStatus = params.mcatStatus ?? 'Planning';
  const mcatScore = toNumber(params.mcatScore);

  const tierScore: Record<string, number> = { Strong: 92, Competitive: 72, Developing: 48, 'Needs Work': 22, Critical: 8 };

  const gpaTier = effectiveGpa >= 3.85 ? 'Strong' : effectiveGpa >= 3.7 ? 'Competitive' : effectiveGpa >= 3.5 ? 'Developing' : effectiveGpa >= 3.2 ? 'Needs Work' : 'Critical';
  const mcatTier = mcatStatus !== 'Taken' ? 'Critical' : mcatScore >= 517 ? 'Strong' : mcatScore >= 511 ? 'Competitive' : mcatScore >= 505 ? 'Developing' : mcatScore >= 500 ? 'Needs Work' : 'Critical';
  const clinicalTier = clinical >= 500 ? 'Strong' : clinical >= 200 ? 'Competitive' : clinical >= 100 ? 'Developing' : clinical >= 50 ? 'Needs Work' : 'Critical';
  const shadowingTier = shadowing >= 100 ? 'Strong' : shadowing >= 60 ? 'Competitive' : shadowing >= 30 ? 'Developing' : shadowing >= 15 ? 'Needs Work' : 'Critical';
  const volunteeringTier = volunteering >= 250 ? 'Strong' : volunteering >= 100 ? 'Competitive' : volunteering >= 50 ? 'Developing' : volunteering >= 20 ? 'Needs Work' : 'Critical';
  const researchTier = research >= 400 ? 'Strong' : research >= 200 ? 'Competitive' : research >= 100 ? 'Developing' : research >= 50 ? 'Needs Work' : 'Critical';
  const leadershipTier = leadership >= 3 ? 'Strong' : leadership >= 2 ? 'Competitive' : leadership >= 1 ? 'Developing' : 'Critical';
  const extracurricularsTier = extracurriculars >= 4 ? 'Strong' : extracurriculars >= 3 ? 'Competitive' : extracurriculars >= 2 ? 'Developing' : extracurriculars >= 1 ? 'Needs Work' : 'Critical';
  const lettersOfRecTier = lettersOfRec >= 5 ? 'Strong' : lettersOfRec >= 4 ? 'Competitive' : lettersOfRec >= 3 ? 'Developing' : lettersOfRec >= 2 ? 'Needs Work' : 'Critical';

  const score = Math.round(
    tierScore[mcatTier] * 0.25 +
    tierScore[gpaTier] * 0.20 +
    tierScore[clinicalTier] * 0.15 +
    tierScore[lettersOfRecTier] * 0.10 +
    tierScore[researchTier] * 0.10 +
    tierScore[shadowingTier] * 0.07 +
    tierScore[volunteeringTier] * 0.06 +
    tierScore[leadershipTier] * 0.04 +
    tierScore[extracurricularsTier] * 0.03
  );

  const strengths: string[] = [];
  const weakSpots: string[] = [];
  const priorities: string[] = [];
  const actionPlan: string[] = [];

  if (effectiveGpa >= 3.6) strengths.push('Your academic metrics currently clear a competitive baseline.');
  else if (effectiveGpa >= 3.4) strengths.push('Your GPA remains workable and gives the rest of the application something to build from.');
  else weakSpots.push('The lower of your cumulative and science GPA is below a comfortable range for a strong cycle.');

  if (clinical >= 100) strengths.push('Your clinical exposure shows meaningful patient-facing involvement.');
  else { weakSpots.push('Clinical experience is still too light to convincingly show durable patient-facing commitment.'); priorities.push('Increase clinical volume'); actionPlan.push('Add a steady patient-facing role and build weekly clinical hours instead of relying on short bursts.'); }

  if (shadowing >= 20) strengths.push('Your physician shadowing supports a more informed interest in medicine.');
  else { weakSpots.push('Shadowing is limited, so the application still lacks enough direct observation of physicians.'); priorities.push('Increase shadowing'); actionPlan.push('Set up multiple shadowing sessions over the next month and log them by specialty and date.'); }

  if (volunteering >= 75) strengths.push('Your service work adds a credible community-facing dimension.');
  else if (volunteering < 25) { weakSpots.push('Community service is thin and does not yet show sustained service orientation.'); priorities.push('Build non-clinical service'); actionPlan.push('Commit to one recurring non-clinical service role and maintain it long enough to show continuity.'); }

  if (research >= 50) strengths.push('Your research experience adds useful academic depth to the profile.');
  else if (research === 0) { weakSpots.push('Research is absent, which limits breadth for research-oriented schools.'); priorities.push('Add research exposure'); actionPlan.push('Reach out to a faculty mentor or lab and secure a regular research commitment.'); }

  if (leadership >= 1) strengths.push('Your leadership experience shows some ability to take ownership and work with others.');
  else { weakSpots.push('Leadership is minimal, making the profile feel more observational than accountable.'); priorities.push('Build leadership responsibility'); actionPlan.push('Pursue one role where you coordinate people, operations, or projects rather than only participating.'); }

  if (mcatStatus === 'Taken') {
    if (mcatScore >= 511) strengths.push('Your MCAT helps reinforce academic readiness.');
    else if (mcatScore < 500) { weakSpots.push('The current MCAT score is a meaningful academic concern.'); priorities.push('Rework MCAT preparation'); actionPlan.push('Build a structured retake plan around full-length exams, review cycles, and a realistic target score.'); }
  } else { weakSpots.push('Without a completed MCAT, one major academic checkpoint is still missing from the profile.'); }

  if (effectiveGpa < 3.4 && clinical < 50) { weakSpots.push('Lower GPA combined with very limited clinical exposure creates a compounded readiness problem.'); priorities.push('Address GPA and clinical exposure together'); actionPlan.push('Put academic repair and patient-facing hours ahead of lower-priority resume-building activities.'); }
  if (clinical < 50 && shadowing < 15) { weakSpots.push('Clinical experience and shadowing are both too limited to show informed commitment to medicine.'); priorities.push('Raise direct medical exposure'); actionPlan.push('Build both clinical hours and shadowing together so the profile gains substance quickly.'); }
  if (research > 100 && clinical < 50) { weakSpots.push('The profile leans too heavily on research relative to direct patient exposure.'); priorities.push('Rebalance toward patient-facing work'); actionPlan.push('Keep research stable, but shift the next block of effort into consistent clinical experience.'); }

  const strengthFallbacks = ['You have an early foundation that can become more competitive with consistent execution.', 'Several parts of the profile are moving in the right direction even if the overall picture is still uneven.', 'There is enough momentum here to improve the application meaningfully over the next few months.'];
  const backupWeakSpots = ['No critical weak spots stand out at this stage, but continued consistency still matters.', 'Keep deepening your strongest experiences rather than only adding new ones.', 'Make sure your application narrative clearly connects your preparation to your motivation for medicine.'];
  const backupPriorities = ['Maintain consistency across your strongest academic and experiential areas.', 'Deepen your most meaningful commitments instead of spreading effort too broadly.', 'Refine how you present your experiences so the application reads as cohesive and intentional.'];
  const backupActionPlan = ['Keep your current commitments steady and continue tracking progress across each category.', 'Use the next month to deepen one or two high-value activities instead of adding low-yield extras.', 'Start drafting reflection notes so your personal narrative is easier to articulate when you apply.'];

  for (const fallback of strengthFallbacks) { if (strengths.length >= 3) break; if (!strengths.includes(fallback)) strengths.push(fallback); }
  while (weakSpots.length < 3) { weakSpots.push(backupWeakSpots[weakSpots.length]); }
  while (priorities.length < 3) { priorities.push(backupPriorities[priorities.length]); }
  while (actionPlan.length < 3) { actionPlan.push(backupActionPlan[actionPlan.length]); }

  let summary = 'Your application currently reads as early-stage, with several core signals still needing stronger support.';
  if (score >= 80) summary = 'Your profile reads as strong across the major admissions categories and already looks meaningfully competitive.';
  else if (score >= 65) summary = 'Your profile is competitive in several important areas, though a few visible gaps still remain.';
  else if (score >= 45) summary = 'Your application has some credible strengths, but committees would still see clear areas that need more development.';
  else if (score >= 25) summary = 'Your profile shows some progress, but it still reads as underdeveloped in multiple high-signal categories.';

  let signal = 'A high-risk applicant profile that currently signals limited readiness for a strong medical school application cycle.';
  if (score >= 80) signal = 'A strong applicant who already signals academic readiness, substantive exposure, and credible preparation for applying.';
  else if (score >= 65) signal = 'A competitive applicant with a believable path to a solid cycle, though some weaknesses are still visible.';
  else if (score >= 45) signal = 'A developing applicant whose profile has real traction, but still leaves meaningful questions about readiness.';
  else if (score >= 25) signal = 'A developing applicant whose current record still signals uneven preparation across key premed categories.';

  const categories: CategoryBar[] = [
    effectiveGpa >= 3.85 ? buildCategory('GPA', 100, 'Strong') : effectiveGpa >= 3.7 ? buildCategory('GPA', 82, 'Competitive') : effectiveGpa >= 3.5 ? buildCategory('GPA', 62, 'Developing') : effectiveGpa >= 3.2 ? buildCategory('GPA', 38, 'Needs Work') : buildCategory('GPA', 15, 'Critical'),
    mcatStatus !== 'Taken' ? buildCategory('MCAT', 15, 'Critical') : mcatScore >= 517 ? buildCategory('MCAT', 100, 'Strong') : mcatScore >= 511 ? buildCategory('MCAT', 82, 'Competitive') : mcatScore >= 505 ? buildCategory('MCAT', 62, 'Developing') : mcatScore >= 500 ? buildCategory('MCAT', 38, 'Needs Work') : buildCategory('MCAT', 15, 'Critical'),
    clinical >= 500 ? buildCategory('Clinical experience', 100, 'Strong') : clinical >= 200 ? buildCategory('Clinical experience', 80, 'Competitive') : clinical >= 100 ? buildCategory('Clinical experience', 60, 'Developing') : clinical >= 50 ? buildCategory('Clinical experience', 35, 'Needs Work') : buildCategory('Clinical experience', 15, 'Critical'),
    shadowing >= 100 ? buildCategory('Physician shadowing', 100, 'Strong') : shadowing >= 60 ? buildCategory('Physician shadowing', 80, 'Competitive') : shadowing >= 30 ? buildCategory('Physician shadowing', 60, 'Developing') : shadowing >= 15 ? buildCategory('Physician shadowing', 35, 'Needs Work') : buildCategory('Physician shadowing', 15, 'Critical'),
    volunteering >= 250 ? buildCategory('Community service', 100, 'Strong') : volunteering >= 100 ? buildCategory('Community service', 80, 'Competitive') : volunteering >= 50 ? buildCategory('Community service', 60, 'Developing') : volunteering >= 20 ? buildCategory('Community service', 35, 'Needs Work') : buildCategory('Community service', 15, 'Critical'),
    research >= 400 ? buildCategory('Research', 100, 'Strong') : research >= 200 ? buildCategory('Research', 80, 'Competitive') : research >= 100 ? buildCategory('Research', 60, 'Developing') : research >= 50 ? buildCategory('Research', 35, 'Needs Work') : buildCategory('Research', 15, 'Critical'),
    leadership >= 3 ? buildCategory('Leadership', 100, 'Strong') : leadership >= 2 ? buildCategory('Leadership', 80, 'Competitive') : leadership >= 1 ? buildCategory('Leadership', 55, 'Developing') : buildCategory('Leadership', 15, 'Critical'),
    extracurriculars >= 4 ? buildCategory('Extracurriculars', 100, 'Strong') : extracurriculars >= 3 ? buildCategory('Extracurriculars', 80, 'Competitive') : extracurriculars >= 2 ? buildCategory('Extracurriculars', 55, 'Developing') : extracurriculars >= 1 ? buildCategory('Extracurriculars', 30, 'Needs Work') : buildCategory('Extracurriculars', 15, 'Critical'),
    lettersOfRec >= 5 ? buildCategory('Letters of Recommendation', 100, 'Strong') : lettersOfRec >= 4 ? buildCategory('Letters of Recommendation', 80, 'Competitive') : lettersOfRec >= 3 ? buildCategory('Letters of Recommendation', 60, 'Developing') : lettersOfRec >= 2 ? buildCategory('Letters of Recommendation', 38, 'Needs Work') : buildCategory('Letters of Recommendation', 15, 'Critical'),
  ];

  const tier =
    score >= 80 ? { label: 'Strong', color: '#15803d' }
    : score >= 65 ? { label: 'Competitive', color: '#1a5fa8' }
    : score >= 45 ? { label: 'Developing', color: '#d97706' }
    : score >= 25 ? { label: 'Needs Work', color: '#ef4444' }
    : { label: 'Critical', color: '#7f1d1d' };

  return { score, summary, strengths, weakSpots: weakSpots.slice(0, 3), priorities: priorities.slice(0, 3), actionPlan: actionPlan.slice(0, 3), signal, categories, tier };
}

const statusColorMap: Record<string, string> = {
  'Strong': '#15803d',
  'Competitive': '#1a5fa8',
  'Developing': '#d97706',
  'Needs Work': '#ef4444',
  'Critical': '#7f1d1d',
};

const schoolYearMessages: Record<string, string> = {
  'Freshman': "You're ahead of the game just by knowing where you stand. Your score will look very different by the time you apply — use this to build smart habits early.",
  'Sophomore': "Good time to check in. You still have runway — but clinical hours and research take longer to build than people think. Start now and you won't be scrambling senior year.",
  'Junior': "This is the window that matters most. Most applicants submit the summer after junior year, which means your score today is close to what adcoms will actually see.",
  'Senior': "If you're applying this cycle, your profile is mostly set. Double down on your strongest categories and make sure your weakest ones have a story behind them.",
  'Gap Year': "You've got more time than a traditional applicant — use it with intention. A focused gap year can move every bar on this page.",
};

export default function ResultsClient({ searchParams }: ResultsClientProps) {
  const [saveMessage, setSaveMessage] = useState('');

  const params = useMemo<SearchParams>(
    () => ({
      gpa: toValue(searchParams.gpa),
      scienceGpa: toValue(searchParams.scienceGpa),
      schoolYear: toValue(searchParams.schoolYear),
      clinicalHours: toValue(searchParams.clinicalHours),
      shadowingHours: toValue(searchParams.shadowingHours),
      volunteeringHours: toValue(searchParams.volunteeringHours),
      researchHours: toValue(searchParams.researchHours),
      leadershipExperiences: toValue(searchParams.leadershipExperiences),
      extracurriculars: toValue(searchParams.extracurriculars),
      lettersOfRec: toValue(searchParams.lettersOfRec),
      mcatStatus: toValue(searchParams.mcatStatus),
      mcatScore: toValue(searchParams.mcatScore),
      targetApplicationYear: toValue(searchParams.targetApplicationYear),
    }),
    [searchParams]
  );

  const report = useMemo(() => generateReport(params), [params]);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    async function saveReport() {
      if (!paramsKey) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('profiles').upsert(
        { id: user.id, reports: { savedAt: new Date().toISOString(), inputs: params, score: report.score, summary: report.summary, signal: report.signal, categories: report.categories } },
        { onConflict: 'id' }
      );
      if (error) { setSaveMessage('We could not save this report to your dashboard yet.'); return; }
      setSaveMessage('Latest report saved to your dashboard.');
    }
    saveReport();
  }, [paramsKey, params, report]);

  const contextMessage = params.schoolYear ? schoolYearMessages[params.schoolYear] : null;

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>

      {/* Hero score section */}
      <div style={{ background: '#0f1f3d', padding: '32px 32px 36px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(245,247,250,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Readiness Score</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 56, fontWeight: 400, color: '#f5f7fa', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {report.score}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: 'rgba(245,247,250,0.3)', fontWeight: 400 }}>/100</div>
              </div>
            </div>
            <div style={{ background: 'rgba(126,184,224,0.12)', border: '0.5px solid rgba(126,184,224,0.2)', padding: '8px 16px', borderRadius: 9999, color: '#7eb8e0', fontSize: 13, fontWeight: 500, marginTop: 8 }}>
              {report.tier.label}
            </div>
          </div>
          {contextMessage && (
            <div style={{ background: 'rgba(126,184,224,0.07)', border: '0.5px solid rgba(126,184,224,0.15)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'rgba(126,184,224,0.75)', lineHeight: 1.55 }}>
              {contextMessage}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 32px' }}>

        {/* Disclaimer */}
        <p style={{ fontSize: 12, color: '#8a9eb8', textAlign: 'center', lineHeight: 1.65, marginBottom: 24 }}>
          This score is built on real AAMC matriculant data — not guesswork. It measures everything that can be measured: your GPA, MCAT, clinical hours, research, and more. What it can&apos;t measure is your story, your letters, or how you interview. Think of it as an honest starting point, not a verdict.
        </p>

        {/* Category breakdown */}
        <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '20px 22px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#0f1f3d' }}>Category breakdown</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/dashboard" style={{ fontSize: 12, color: '#1a5fa8', textDecoration: 'none', padding: '6px 14px', border: '0.5px solid #dde3ed', borderRadius: 9999 }}>Log activity</Link>
              <Link href="/intake" style={{ fontSize: 12, color: '#0f1f3d', textDecoration: 'none', padding: '6px 14px', background: '#0f1f3d', color: '#f5f7fa', borderRadius: 9999 }}>Edit inputs</Link>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {report.categories.map((category) => {
              const color = statusColorMap[category.status] ?? '#8a9eb8';
              return (
                <div key={category.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: '#3a4a5c' }}>{category.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color }}>{category.status}</span>
                  </div>
                  <div style={{ height: 5, background: '#edf1f7', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${category.percent}%`, background: color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 16 }}>
            {[{ label: 'Strong', color: '#15803d' }, { label: 'Competitive', color: '#1a5fa8' }, { label: 'Developing', color: '#d97706' }, { label: 'Needs Work', color: '#ef4444' }, { label: 'Critical', color: '#7f1d1d' }].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#8a9eb8' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Signal */}
        <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 8 }}>What your application currently signals</div>
          <p style={{ fontSize: 13, color: '#3a4a5c', lineHeight: 1.65 }}>{report.signal}</p>
          {saveMessage && <p style={{ fontSize: 11, color: '#8a9eb8', marginTop: 8 }}>{saveMessage}</p>}
        </div>

        {/* Strengths */}
        <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 12 }}>Strengths</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.strengths.slice(0, 3).map((item) => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#15803d', marginTop: 5, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#3a4a5c', lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weak spots */}
        <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 12 }}>Weak spots</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.weakSpots.map((item) => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', marginTop: 5, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#3a4a5c', lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 12 }}>Top 3 priorities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.priorities.map((item, i) => (
              <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#0f1f3d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 10, color: '#7eb8e0', fontWeight: 500 }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 13, color: '#3a4a5c', lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action plan */}
        <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 12 }}>30-day action plan</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.actionPlan.map((item) => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a5fa8', marginTop: 5, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#3a4a5c', lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Baseline report */}
        <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 4 }}>Your baseline report</div>
          <p style={{ fontSize: 12, color: '#8a9eb8', marginBottom: 16, lineHeight: 1.5 }}>These are the stats you entered. Your category bars reflect your current totals as you log new activity.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {[
              { label: 'GPA', value: params.gpa },
              { label: 'Science GPA', value: params.scienceGpa },
              { label: 'MCAT status', value: params.mcatStatus },
              { label: 'MCAT score', value: params.mcatScore },
              { label: 'Clinical hours', value: params.clinicalHours },
              { label: 'Shadowing hours', value: params.shadowingHours },
              { label: 'Volunteering hours', value: params.volunteeringHours },
              { label: 'Research hours', value: params.researchHours },
              { label: 'Leadership count', value: params.leadershipExperiences },
              { label: 'Extracurriculars', value: params.extracurriculars },
              { label: 'Letters of Recommendation', value: params.lettersOfRec },
              { label: 'School year', value: params.schoolYear },
              { label: 'Target application year', value: params.targetApplicationYear },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: 11, color: '#8a9eb8', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 13, color: '#0f1f3d', fontWeight: 500 }}>{value ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Save CTA */}
        <div style={{ background: '#0f1f3d', borderRadius: 16, padding: '28px 24px', marginBottom: 16, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#f5f7fa', letterSpacing: '-0.02em', marginBottom: 12 }}>Don&apos;t lose your results.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, textAlign: 'left', maxWidth: 320, margin: '0 auto 20px' }}>
            {[
              'Track progress as you log clinical hours, research, and more',
              'Watch your category bars move in real time as your application grows',
              'Come back anytime to update your stats and regenerate your score',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#7eb8e0', marginTop: 5, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'rgba(245,247,250,0.6)', lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>
          <Link href="/auth" style={{ display: 'inline-block', background: '#1a5fa8', color: '#f5f7fa', textDecoration: 'none', padding: '13px 28px', borderRadius: 9999, fontSize: 13, fontWeight: 500 }}>
            Create Free Account →
          </Link>
        </div>

        {/* Premium pitch */}
        <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '22px 22px', marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 10 }}>Coming soon</div>
          <h2 style={{ fontSize: 16, fontWeight: 500, color: '#0f1f3d', marginBottom: 10, letterSpacing: '-0.01em' }}>Want to actually fix your weak spots — not just know about them?</h2>
          <p style={{ fontSize: 13, color: '#5a6b80', lineHeight: 1.7, marginBottom: 16 }}>
            My Premed Path Premium finds real, personalized opportunities based on your exact gaps. If your clinical hours are low, we find clinics near you currently accepting scribes or volunteers — with direct links to apply. Not generic advice. Actual next steps, built for your profile, your location, and your timeline.
          </p>
          <Link href="/intake" style={{ display: 'inline-block', background: '#0f1f3d', color: '#f5f7fa', textDecoration: 'none', padding: '10px 20px', borderRadius: 9999, fontSize: 13, fontWeight: 500 }}>
            Join the waitlist →
          </Link>
          <p style={{ fontSize: 11, color: '#8a9eb8', marginTop: 8 }}>Premium is coming soon.</p>
        </div>

      </div>
    </div>
  );
}
