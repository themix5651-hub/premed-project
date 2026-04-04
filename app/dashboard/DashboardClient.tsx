'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
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
  if (score >= 85) return { label: 'Strong', classes: 'bg-green-100 text-green-700' };
  if (score >= 70) return { label: 'Competitive', classes: 'bg-blue-100 text-blue-700' };
  if (score >= 55) return { label: 'Building', classes: 'bg-yellow-100 text-yellow-700' };
  if (score >= 40) return { label: 'Developing', classes: 'bg-orange-100 text-orange-700' };
  return { label: 'Needs work', classes: 'bg-red-100 text-red-700' };
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

  const gpaPercent = effectiveGpa >= 3.8 ? 100 : effectiveGpa >= 3.6 ? 82 : effectiveGpa >= 3.4 ? 62 : effectiveGpa >= 3.2 ? 40 : 20;
  const gpaStatus: CategoryBar['status'] = effectiveGpa >= 3.6 ? 'Competitive' : effectiveGpa >= 3.2 ? 'Developing' : 'Needs work';

  const mcatPercent = mcatScore !== null
    ? (mcatScore >= 517 ? 100 : mcatScore >= 511 ? 82 : mcatScore >= 506 ? 62 : mcatScore >= 500 ? 44 : 25)
    : 15;
  const mcatStatusVal: CategoryBar['status'] = mcatScore !== null
    ? (mcatScore >= 511 ? 'Competitive' : mcatScore >= 500 ? 'Developing' : 'Needs work')
    : 'Needs work';

  const confirmedLetters = logs.filter(
    (log) =>
      log.category === 'letters-of-recommendation' &&
      (log.note?.includes('Status: Confirmed') || log.note?.includes('Status: Received'))
  ).length;

  return [
    { label: 'GPA', percent: gpaPercent, status: gpaStatus, baselinePercent: gpaPercent },
    { label: 'MCAT', percent: mcatPercent, status: mcatStatusVal, baselinePercent: mcatPercent },
    {
      label: 'Clinical experience',
      percent: smoothFill(totalClinical, 200),
      status: totalClinical >= 200 ? 'Competitive' : totalClinical >= 50 ? 'Developing' : 'Needs work',
      baselinePercent: smoothFill(baselineClinical, 200),
    },
    {
      label: 'Physician shadowing',
      percent: smoothFill(totalShadowing, 100),
      status: totalShadowing >= 100 ? 'Competitive' : totalShadowing >= 20 ? 'Developing' : 'Needs work',
      baselinePercent: smoothFill(baselineShadowing, 100),
    },
    {
      label: 'Community service',
      percent: smoothFill(totalVolunteering, 150),
      status: totalVolunteering >= 150 ? 'Competitive' : totalVolunteering >= 75 ? 'Developing' : 'Needs work',
      baselinePercent: smoothFill(baselineVolunteering, 150),
    },
    {
      label: 'Research',
      percent: smoothFill(totalResearch, 150),
      status: totalResearch >= 150 ? 'Competitive' : totalResearch >= 50 ? 'Developing' : 'Needs work',
      baselinePercent: smoothFill(baselineResearch, 150),
    },
    {
      label: 'Leadership',
      percent: smoothFill(totalLeadership, 3),
      status: totalLeadership >= 3 ? 'Competitive' : totalLeadership >= 1 ? 'Developing' : 'Needs work',
      baselinePercent: smoothFill(baselineLeadership, 3),
    },
    {
      label: 'Extracurriculars',
      percent: smoothFill(logs.filter((log) => log.category === 'extracurriculars').length, 3),
      status:
        logs.filter((log) => log.category === 'extracurriculars').length >= 3
          ? 'Competitive'
          : logs.filter((log) => log.category === 'extracurriculars').length >= 1
            ? 'Developing'
            : 'Needs work',
      baselinePercent: 0,
    },
    {
      label: 'Letters of Recommendation',
      percent: smoothFill(confirmedLetters, 3),
      status: confirmedLetters >= 3 ? 'Competitive' : confirmedLetters >= 1 ? 'Developing' : 'Needs work',
      baselinePercent: 0,
    },
  ] as CategoryBar[];
}

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

  async function loadDashboardData() {
    setIsLoading(true);
    setErrorMessage('');

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace('/auth');
      return;
    }

    setUserEmail(user.email ?? '');

    const [{ data: profileData, error: profileError }, { data: activityData, error: activityError }] = await Promise.all([
      supabase.from('profiles').select('reports').eq('id', user.id).maybeSingle(),
      supabase.from('activity_logs').select('id, category, hours, note, logged_at').eq('user_id', user.id),
    ]);

    if (profileError) {
      setErrorMessage(profileError.message);
    } else {
      setStoredReport((profileData?.reports as StoredReport | null) ?? null);
    }

    if (activityError) {
      setErrorMessage(activityError.message);
    } else {
      setActivityLogs((activityData as ActivityLog[] | null) ?? []);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadDashboardData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Card title="Loading dashboard">
          <p className="text-sm text-slate-600">Checking your account and recent activity.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            {userEmail ? `Signed in as ${userEmail}.` : 'Track your latest report and log progress over time.'}
          </p>
        </div>
        <Button href="/intake">Create New Report</Button>
      </div>

      {errorMessage ? (
        <Card title="Dashboard notice">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </Card>
      ) : null}

      <Card>
        {displayCategories.length ? (
          <>
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">Current category bars</h3>
              {storedReport?.score != null ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Score: {storedReport.score}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getScoreTier(storedReport.score).classes}`}>
                    {getScoreTier(storedReport.score).label}
                  </span>
                </div>
              ) : null}
            </div>
            {storedReport?.summary ? <p className="mb-4 text-sm text-slate-600">{storedReport.summary}</p> : null}
            {baselineReportHref ? (
              <p className="mb-4">
                <Link href={baselineReportHref} className="text-sm font-medium text-brand-700 transition hover:text-brand-900">
                  View my baseline report
                </Link>
              </p>
            ) : null}
            <div className="space-y-4">
              {displayCategories.map((category) => {
                const statusClasses = getStatusClasses(category.status);
                const categoryDefinition = getCategoryDefinitionByLabel(category.label);
                const baselineFill = category.baselinePercent ?? category.percent;
                const progressFill = Math.max(0, category.percent - baselineFill);
                const barColorMap: Record<string, string> = {
                  'Competitive': '#16a34a',
                  'Developing': '#d97706',
                  'Needs work': '#dc2626',
                };

                return (
                  <Link
                    key={category.label}
                    href={categoryDefinition ? `/dashboard/${categoryDefinition.slug}` : '/dashboard'}
                    className="block space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-700">{category.label}</span>
                      <span className="flex items-center gap-2">
                        <span className={`font-medium ${statusClasses.text}`}>{category.status}</span>
                        <span className="text-slate-400">→</span>
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      {progressFill > 0 ? (
                        <div style={{ display: 'flex', height: '100%' }}>
                          <div style={{ width: `${baselineFill}%`, background: 'rgba(100,100,100,0.4)', borderRadius: '4px 0 0 4px' }} />
                          <div style={{ width: `${progressFill}%`, background: barColorMap[category.status], borderRadius: '0 4px 4px 0' }} />
                        </div>
                      ) : (
                        <div className={`h-full rounded-full ${statusClasses.fill}`} style={{ width: `${category.percent}%` }} />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                <span>Competitive</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
                <span>Developing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                <span>Needs work</span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-3 rounded-sm" style={{ background: 'rgba(100,100,100,0.4)' }} />
                <span>Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-3 rounded-sm bg-blue-500" />
                <span>Progress added</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-600">Generate a report first to see your current category bars here.</p>
        )}
      </Card>
    </div>
  );
}
