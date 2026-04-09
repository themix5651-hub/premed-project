'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import {
  CategoryBar,
  getCategoryDefinitionByLabel,
  getStatusClasses,
  SearchParamsInput,
} from '../../lib/dashboardCategories';

type StoredReport = {
  inputs?: SearchParamsInput;
  score?: number;
  summary?: string;
  signal?: string;
  categories?: CategoryBar[];
  savedAt?: string;
};

type ActivityLog = {
  id: string;
  category: string;
  hours: number | null;
  note?: string | null;
  logged_at: string;
};

type DashboardClientProps = {
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

function smoothFill(total: number, max: number) {
  return Math.min(Math.round((total / max) * 100), 100);
}

function getScoreTier(score: number) {
  if (score >= 80) return { label: 'Strong', color: '#15803d' };
  if (score >= 65) return { label: 'Competitive', color: '#22c55e' };
  if (score >= 45) return { label: 'Developing', color: '#f59e0b' };
  if (score >= 25) return { label: 'Needs Work', color: '#ef4444' };
  return { label: 'Critical', color: '#7f1d1d' };
}

function getLatestMcatScore(logs: ActivityLog[]) {
  const latest = logs
    .filter((log) => log.category === 'mcat')
    .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())[0];
  return latest?.hours ?? null;
}

function buildDashboardCategories(inputs: SearchParamsInput, logs: ActivityLog[]): CategoryBar[] {
  const cgpa = toNumber(inputs.gpa);
  const sgpa = toNumber(inputs.scienceGpa);
  const effectiveGpa = sgpa > 0 ? Math.min(cgpa, sgpa) : cgpa;
  const baselineClinical = toNumber(inputs.clinicalHours);
  const baselineShadowing = toNumber(inputs.shadowingHours);
  const baselineVolunteering = toNumber(inputs.volunteeringHours);
  const baselineResearch = toNumber(inputs.researchHours);
  const baselineLeadership = toNumber(inputs.leadershipExperiences);
  const loggedClinical = logs.filter((log) => log.category === 'clinical-experience').reduce((sum, log) => sum + (log.hours || 0), 0);
  const loggedShadowing = logs.filter((log) => log.category === 'physician-shadowing').reduce((sum, log) => sum + (log.hours || 0), 0);
  const loggedVolunteering = logs.filter((log) => log.category === 'community-service').reduce((sum, log) => sum + (log.hours || 0), 0);
  const loggedResearch = logs.filter((log) => log.category === 'research').reduce((sum, log) => sum + (log.hours || 0), 0);
  const loggedLeadership = logs.filter((log) => log.category === 'leadership').length;
  const totalClinical = baselineClinical + loggedClinical;
  const totalShadowing = baselineShadowing + loggedShadowing;
  const totalVolunteering = baselineVolunteering + loggedVolunteering;
  const totalResearch = baselineResearch + loggedResearch;
  const totalLeadership = baselineLeadership + loggedLeadership;
  const mcatStatus = inputs.mcatStatus ?? 'Planning';
  const mcatScore = getLatestMcatScore(logs) ?? (inputs.mcatScore ? toNumber(inputs.mcatScore) : null);

  const gpaStatus: CategoryBar['status'] =
    effectiveGpa >= 3.85 ? 'Strong' : effectiveGpa >= 3.7 ? 'Competitive' : effectiveGpa >= 3.5 ? 'Developing' : effectiveGpa >= 3.2 ? 'Needs Work' : 'Critical';
  const gpaPercent =
    gpaStatus === 'Strong' ? 100 : gpaStatus === 'Competitive' ? 82 : gpaStatus === 'Developing' ? 62 : gpaStatus === 'Needs Work' ? 38 : 15;

  const mcatTierStatus: CategoryBar['status'] = mcatStatus !== 'Taken'
    ? 'Critical'
    : mcatScore !== null
      ? (mcatScore >= 517 ? 'Strong' : mcatScore >= 511 ? 'Competitive' : mcatScore >= 505 ? 'Developing' : mcatScore >= 500 ? 'Needs Work' : 'Critical')
      : 'Critical';
  const mcatPercent =
    mcatTierStatus === 'Strong' ? 100 : mcatTierStatus === 'Competitive' ? 82 : mcatTierStatus === 'Developing' ? 62 : mcatTierStatus === 'Needs Work' ? 38 : 15;

  const baselineExtracurriculars = toNumber(inputs.extracurriculars);
  const baselineLetters = toNumber(inputs.lettersOfRec);
  const loggedExtracurriculars = logs.filter((log) => log.category === 'extracurriculars').length;
  const loggedConfirmedLetters = logs.filter(
    (log) =>
      log.category === 'letters-of-recommendation' &&
      (log.note?.includes('Status: Confirmed') || log.note?.includes('Status: Received'))
  ).length;
  const totalExtracurriculars = baselineExtracurriculars + loggedExtracurriculars;
  const confirmedLetters = baselineLetters + loggedConfirmedLetters;

  const clinicalStatus: CategoryBar['status'] =
    totalClinical >= 500 ? 'Strong' : totalClinical >= 200 ? 'Competitive' : totalClinical >= 100 ? 'Developing' : totalClinical >= 50 ? 'Needs Work' : 'Critical';
  const shadowingStatus: CategoryBar['status'] =
    totalShadowing >= 100 ? 'Strong' : totalShadowing >= 60 ? 'Competitive' : totalShadowing >= 30 ? 'Developing' : totalShadowing >= 15 ? 'Needs Work' : 'Critical';
  const volunteeringStatus: CategoryBar['status'] =
    totalVolunteering >= 250 ? 'Strong' : totalVolunteering >= 100 ? 'Competitive' : totalVolunteering >= 50 ? 'Developing' : totalVolunteering >= 20 ? 'Needs Work' : 'Critical';
  const researchStatus: CategoryBar['status'] =
    totalResearch >= 400 ? 'Strong' : totalResearch >= 200 ? 'Competitive' : totalResearch >= 100 ? 'Developing' : totalResearch >= 50 ? 'Needs Work' : 'Critical';
  const leadershipStatus: CategoryBar['status'] =
    totalLeadership >= 3 ? 'Strong' : totalLeadership >= 2 ? 'Competitive' : totalLeadership >= 1 ? 'Developing' : 'Critical';
  const extracurricularStatus: CategoryBar['status'] =
    totalExtracurriculars >= 4 ? 'Strong' : totalExtracurriculars >= 3 ? 'Competitive' : totalExtracurriculars >= 2 ? 'Developing' : totalExtracurriculars >= 1 ? 'Needs Work' : 'Critical';
  const lettersStatus: CategoryBar['status'] =
    confirmedLetters >= 5 ? 'Strong' : confirmedLetters >= 4 ? 'Competitive' : confirmedLetters >= 3 ? 'Developing' : confirmedLetters >= 2 ? 'Needs Work' : 'Critical';

  return [
    { label: 'GPA', percent: gpaPercent, status: gpaStatus, baselinePercent: gpaPercent },
    { label: 'MCAT', percent: mcatPercent, status: mcatTierStatus, baselinePercent: mcatPercent },
    { label: 'Clinical experience', percent: smoothFill(totalClinical, 500), status: clinicalStatus, baselinePercent: smoothFill(baselineClinical, 500) },
    { label: 'Physician shadowing', percent: smoothFill(totalShadowing, 100), status: shadowingStatus, baselinePercent: smoothFill(baselineShadowing, 100) },
    { label: 'Community service', percent: smoothFill(totalVolunteering, 250), status: volunteeringStatus, baselinePercent: smoothFill(baselineVolunteering, 250) },
    { label: 'Research', percent: smoothFill(totalResearch, 400), status: researchStatus, baselinePercent: smoothFill(baselineResearch, 400) },
    { label: 'Leadership', percent: smoothFill(totalLeadership, 3), status: leadershipStatus, baselinePercent: smoothFill(baselineLeadership, 3) },
    { label: 'Extracurriculars', percent: smoothFill(totalExtracurriculars, 4), status: extracurricularStatus, baselinePercent: smoothFill(baselineExtracurriculars, 4) },
    { label: 'Letters of Recommendation', percent: smoothFill(confirmedLetters, 5), status: lettersStatus, baselinePercent: smoothFill(baselineLetters, 5) },
  ] as CategoryBar[];
}

const statusColorMap: Record<string, string> = {
  'Strong': '#15803d',
  'Competitive': '#1a5fa8',
  'Developing': '#d97706',
  'Needs Work': '#ef4444',
  'Critical': '#7f1d1d',
};

const statusTextColorMap: Record<string, string> = {
  'Strong': '#15803d',
  'Competitive': '#1a5fa8',
  'Developing': '#d97706',
  'Needs Work': '#ef4444',
  'Critical': '#7f1d1d',
};

export default function DashboardClient({ searchParams }: DashboardClientProps) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [storedReport, setStoredReport] = useState<StoredReport | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const intakeParams = useMemo<SearchParamsInput>(
    () => ({
      gpa: toValue(searchParams.gpa),
      scienceGpa: toValue(searchParams.scienceGpa),
      clinicalHours: toValue(searchParams.clinicalHours),
      shadowingHours: toValue(searchParams.shadowingHours),
      volunteeringHours: toValue(searchParams.volunteeringHours),
      researchHours: toValue(searchParams.researchHours),
      leadershipExperiences: toValue(searchParams.leadershipExperiences),
      extracurriculars: toValue(searchParams.extracurriculars),
      lettersOfRec: toValue(searchParams.lettersOfRec),
      mcatStatus: toValue(searchParams.mcatStatus),
      mcatScore: toValue(searchParams.mcatScore),
    }),
    [searchParams]
  );

  const baselineInputs = storedReport?.inputs ?? (Object.values(intakeParams).some(Boolean) ? intakeParams : null);
  const displayCategories = useMemo(
    () => (baselineInputs ? buildDashboardCategories(baselineInputs, activityLogs) : storedReport?.categories ?? []),
    [activityLogs, baselineInputs, storedReport]
  );

  const baselineReportHref = useMemo(() => {
    const inputs = storedReport?.inputs;
    if (!inputs) return '';
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const query = params.toString();
    return query ? `/results?${query}` : '';
  }, [storedReport]);

  // Compute logged hours per category for progress badges
  const loggedHours = useMemo(() => ({
    clinical: activityLogs.filter((l) => l.category === 'clinical-experience').reduce((s, l) => s + (l.hours || 0), 0),
    shadowing: activityLogs.filter((l) => l.category === 'physician-shadowing').reduce((s, l) => s + (l.hours || 0), 0),
    volunteering: activityLogs.filter((l) => l.category === 'community-service').reduce((s, l) => s + (l.hours || 0), 0),
    research: activityLogs.filter((l) => l.category === 'research').reduce((s, l) => s + (l.hours || 0), 0),
  }), [activityLogs]);

  const loggedHoursMap: Record<string, number> = {
    'Clinical experience': loggedHours.clinical,
    'Physician shadowing': loggedHours.shadowing,
    'Community service': loggedHours.volunteering,
    'Research': loggedHours.research,
  };

  async function loadDashboardData() {
    setIsLoading(true);
    setErrorMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/auth'); return; }
    setUserEmail(user.email ?? '');
    const [{ data: profileData, error: profileError }, { data: activityData, error: activityError }] = await Promise.all([
      supabase.from('profiles').select('reports').eq('id', user.id).maybeSingle(),
      supabase.from('activity_logs').select('id, category, hours, note, logged_at').eq('user_id', user.id),
    ]);
    if (profileError) setErrorMessage(profileError.message);
    else setStoredReport((profileData?.reports as StoredReport | null) ?? null);
    if (activityError) setErrorMessage(activityError.message);
    else setActivityLogs((activityData as ActivityLog[] | null) ?? []);
    setIsLoading(false);
  }

  useEffect(() => { loadDashboardData(); }, []);
  useEffect(() => {
    const handleFocus = () => { loadDashboardData(); };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const schoolYear = storedReport?.inputs?.schoolYear ?? '';
  const schoolYearMessages: Record<string, string> = {
    'Freshman': "You're early in your journey — use this as a roadmap, not a verdict.",
    'Sophomore': "Good time to check in. You still have runway to build strong clinical hours and research.",
    'Junior': "This is the window that matters most. Your score today is close to what adcoms will actually see.",
    'Senior': "If you're applying this cycle, what you have now is largely what you'll submit with.",
    'Gap Year': "You've got more time than a traditional applicant — use it with intention.",
  };
  const contextMessage = schoolYearMessages[schoolYear] ?? "Track your progress and log new hours to watch your score grow.";

  if (isLoading) {
    return (
      <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Card title="Loading dashboard">
            <p className="text-sm text-slate-600">Checking your account and recent activity.</p>
          </Card>
        </div>
      </div>
    );
  }

  const score = storedReport?.score;
  const scoreTier = score != null ? getScoreTier(score) : null;

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>

      {/* Hero bar */}
      <div style={{ background: '#0f1f3d', padding: '28px 32px 32px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(245,247,250,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                Your readiness
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: '#f5f7fa', letterSpacing: '-0.02em' }}>
                Your dashboard
              </div>
            </div>
            {score != null && scoreTier && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(126,184,224,0.1)', border: '0.5px solid rgba(126,184,224,0.2)', padding: '10px 16px', borderRadius: 12 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#f5f7fa', letterSpacing: '-0.03em' }}>
                  {score}<span style={{ fontSize: 14, color: 'rgba(245,247,250,0.35)' }}>/100</span>
                </div>
                <div style={{ background: 'rgba(126,184,224,0.15)', color: '#7eb8e0', fontSize: 11, padding: '4px 10px', borderRadius: 9999, border: '0.5px solid rgba(126,184,224,0.2)' }}>
                  {scoreTier.label}
                </div>
              </div>
            )}
          </div>
          <div style={{ background: 'rgba(126,184,224,0.07)', border: '0.5px solid rgba(126,184,224,0.15)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'rgba(126,184,224,0.75)', lineHeight: 1.55 }}>
            {contextMessage}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 32px' }}>

        {errorMessage && (
          <div style={{ background: '#fff', border: '0.5px solid #fca5a5', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
            {errorMessage}
          </div>
        )}

        {/* Hours at a glance */}
        {displayCategories.length > 0 && (
          <>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 12 }}>
              Hours at a glance
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Clinical', baseline: toNumber(storedReport?.inputs?.clinicalHours), logged: loggedHours.clinical },
                { label: 'Shadowing', baseline: toNumber(storedReport?.inputs?.shadowingHours), logged: loggedHours.shadowing },
                { label: 'Research', baseline: toNumber(storedReport?.inputs?.researchHours), logged: loggedHours.research },
                { label: 'Volunteering', baseline: toNumber(storedReport?.inputs?.volunteeringHours), logged: loggedHours.volunteering },
              ].map((stat) => (
                <div key={stat.label} style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: '#8a9eb8', marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 500, color: '#0f1f3d', letterSpacing: '-0.02em' }}>
                    {stat.baseline + stat.logged}
                    {stat.logged > 0 && (
                      <span style={{ fontSize: 13, color: '#1a5fa8', fontWeight: 500, marginLeft: 6 }}>+{stat.logged}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#8a9eb8', marginTop: 2 }}>hrs logged</div>
                </div>
              ))}
            </div>

            {/* Category bars */}
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 12 }}>
              Category breakdown
            </div>
            <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#0f1f3d' }}>All categories</div>
                {baselineReportHref && (
                  <Link href={baselineReportHref} style={{ fontSize: 12, color: '#1a5fa8', textDecoration: 'none' }}>
                    View baseline report
                  </Link>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {displayCategories.map((category) => {
                  const categoryDefinition = getCategoryDefinitionByLabel(category.label);
                  const logged = loggedHoursMap[category.label] ?? 0;
                  const barColor = statusColorMap[category.status] ?? '#8a9eb8';
                  const textColor = statusTextColorMap[category.status] ?? '#8a9eb8';

                  return (
                    <Link
                      key={category.label}
                      href={categoryDefinition ? `/dashboard/${categoryDefinition.slug}` : '/dashboard'}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: '#3a4a5c' }}>{category.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {logged > 0 && (
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, background: '#e6f1fb', color: '#0c447c', fontWeight: 500 }}>
                              +{logged} hrs
                            </span>
                          )}
                          <span style={{ fontSize: 12, fontWeight: 500, color: textColor }}>{category.status}</span>
                          <span style={{ fontSize: 12, color: '#c0ccd8' }}>→</span>
                        </div>
                      </div>
                      <div style={{ height: 5, background: '#edf1f7', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${category.percent}%`, background: barColor, borderRadius: 3 }} />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 18 }}>
                {[
                  { label: 'Strong', color: '#15803d' },
                  { label: 'Competitive', color: '#1a5fa8' },
                  { label: 'Developing', color: '#d97706' },
                  { label: 'Needs Work', color: '#ef4444' },
                  { label: 'Critical', color: '#7f1d1d' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#8a9eb8' }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!displayCategories.length && !storedReport && (
          <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '24px 22px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#8a9eb8', marginBottom: 16 }}>Generate a report first to see your current category bars here.</p>
            <Link href="/intake" style={{ display: 'inline-block', background: '#0f1f3d', color: '#f5f7fa', padding: '10px 22px', borderRadius: 9999, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              Get My Score →
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
