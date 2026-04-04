'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { supabase } from '../../../lib/supabase';
import {
  CategoryBar,
  categoryNextSteps,
  getCategoryDefinitionBySlug,
  getStatusClasses,
  SearchParamsInput,
} from '../../../lib/dashboardCategories';

type StoredReport = {
  inputs?: SearchParamsInput;
  categories?: CategoryBar[];
  summary?: string;
};

type ActivityLog = {
  id: string;
  category: string;
  hours: number | null;
  note: string | null;
  logged_at: string;
};

type CategoryDetailClientProps = {
  categorySlug: string;
};

type FormState = {
  hours: string;
  date: string;
  organization: string;
  supervisorName: string;
  supervisorEmail: string;
  physicianName: string;
  physicianEmail: string;
  specialty: string;
  piName: string;
  piEmail: string;
  labProjectName: string;
  roleTitle: string;
  startDate: string;
  score: string;
  activityName: string;
  activityType: string;
  yearsInvolved: string;
  recommenderName: string;
  recommenderEmail: string;
  relationship: string;
  dateRequested: string;
  recommendationStatus: string;
  note: string;
};

const initialFormState: FormState = {
  hours: '',
  date: '',
  organization: '',
  supervisorName: '',
  supervisorEmail: '',
  physicianName: '',
  physicianEmail: '',
  specialty: '',
  piName: '',
  piEmail: '',
  labProjectName: '',
  roleTitle: '',
  startDate: '',
  score: '',
  activityName: '',
  activityType: 'Sport',
  yearsInvolved: '',
  recommenderName: '',
  recommenderEmail: '',
  relationship: 'Science professor',
  dateRequested: '',
  recommendationStatus: 'Planning to ask',
  note: '',
};

function toNumber(value: string | undefined) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function smoothFill(total: number, max: number) {
  return Math.min(Math.round((total / max) * 100), 100);
}

function buildFormattedNote(parts: Array<[string, string]>) {
  return parts
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`)
    .join(' | ');
}

function getFormMode(categorySlug: string) {
  if (categorySlug === 'gpa') return 'gpa';
  if (categorySlug === 'clinical-experience') return 'clinical';
  if (categorySlug === 'physician-shadowing') return 'shadowing';
  if (categorySlug === 'community-service') return 'service';
  if (categorySlug === 'research') return 'research';
  if (categorySlug === 'leadership') return 'leadership';
  if (categorySlug === 'mcat') return 'mcat';
  if (categorySlug === 'extracurriculars') return 'extracurriculars';
  if (categorySlug === 'letters-of-recommendation') return 'letters';
  return 'default';
}

function getLatestMcatScore(logs: ActivityLog[]) {
  const latest = [...logs].sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())[0];
  return latest?.hours ?? null;
}

function buildCategoryBar(inputs: SearchParamsInput | undefined, logs: ActivityLog[], categorySlug: string, label: string): CategoryBar | null {
  if (!inputs) return null;

  const cgpa = toNumber(inputs.gpa);
  const sgpa = toNumber(inputs.scienceGpa);
  const effectiveGpa = sgpa > 0 ? Math.min(cgpa, sgpa) : cgpa;
  const baselineClinical = toNumber(inputs.clinicalHours);
  const baselineShadowing = toNumber(inputs.shadowingHours);
  const baselineVolunteering = toNumber(inputs.volunteeringHours);
  const baselineResearch = toNumber(inputs.researchHours);
  const baselineLeadership = toNumber(inputs.leadershipExperiences);
  const mcatStatus = inputs.mcatStatus ?? 'Planning';

  if (categorySlug === 'gpa') {
    const status =
      effectiveGpa >= 3.85 ? 'Strong' : effectiveGpa >= 3.7 ? 'Competitive' : effectiveGpa >= 3.5 ? 'Developing' : effectiveGpa >= 3.2 ? 'Needs Work' : 'Critical';
    const percent =
      status === 'Strong' ? 100 : status === 'Competitive' ? 82 : status === 'Developing' ? 62 : status === 'Needs Work' ? 38 : 15;
    return { label, percent, status } as CategoryBar;
  }

  if (categorySlug === 'mcat') {
    const mcatScore = getLatestMcatScore(logs) ?? (inputs.mcatScore ? toNumber(inputs.mcatScore) : null);
    if (mcatScore === null || mcatStatus !== 'Taken') return { label, percent: 15, status: 'Critical' };
    const status =
      mcatScore >= 517 ? 'Strong' : mcatScore >= 511 ? 'Competitive' : mcatScore >= 505 ? 'Developing' : mcatScore >= 500 ? 'Needs Work' : 'Critical';
    const percent =
      status === 'Strong' ? 100 : status === 'Competitive' ? 82 : status === 'Developing' ? 62 : status === 'Needs Work' ? 38 : 15;
    return { label, percent, status } as CategoryBar;
  }

  if (categorySlug === 'clinical-experience') {
    const loggedHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0);
    const total = baselineClinical + loggedHours;
    const status: CategoryBar['status'] =
      total >= 500 ? 'Strong' : total >= 200 ? 'Competitive' : total >= 100 ? 'Developing' : total >= 50 ? 'Needs Work' : 'Critical';
    return { label, percent: smoothFill(total, 500), status, baselinePercent: smoothFill(baselineClinical, 500) };
  }

  if (categorySlug === 'physician-shadowing') {
    const loggedHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0);
    const total = baselineShadowing + loggedHours;
    const status: CategoryBar['status'] =
      total >= 100 ? 'Strong' : total >= 60 ? 'Competitive' : total >= 30 ? 'Developing' : total >= 15 ? 'Needs Work' : 'Critical';
    return { label, percent: smoothFill(total, 100), status, baselinePercent: smoothFill(baselineShadowing, 100) };
  }

  if (categorySlug === 'community-service') {
    const loggedHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0);
    const total = baselineVolunteering + loggedHours;
    const status: CategoryBar['status'] =
      total >= 250 ? 'Strong' : total >= 100 ? 'Competitive' : total >= 50 ? 'Developing' : total >= 20 ? 'Needs Work' : 'Critical';
    return { label, percent: smoothFill(total, 250), status, baselinePercent: smoothFill(baselineVolunteering, 250) };
  }

  if (categorySlug === 'research') {
    const loggedHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0);
    const total = baselineResearch + loggedHours;
    const status: CategoryBar['status'] =
      total >= 400 ? 'Strong' : total >= 200 ? 'Competitive' : total >= 100 ? 'Developing' : total >= 50 ? 'Needs Work' : 'Critical';
    return { label, percent: smoothFill(total, 400), status, baselinePercent: smoothFill(baselineResearch, 400) };
  }

  if (categorySlug === 'leadership') {
    const total = baselineLeadership + logs.length;
    const status: CategoryBar['status'] =
      total >= 3 ? 'Strong' : total >= 2 ? 'Competitive' : total >= 1 ? 'Developing' : 'Critical';
    return { label, percent: smoothFill(total, 3), status, baselinePercent: smoothFill(baselineLeadership, 3) };
  }

  if (categorySlug === 'extracurriculars') {
    const baselineExtracurriculars = toNumber(inputs.extracurriculars);
    const total = baselineExtracurriculars + logs.length;
    const status: CategoryBar['status'] =
      total >= 4 ? 'Strong' : total >= 3 ? 'Competitive' : total >= 2 ? 'Developing' : total >= 1 ? 'Needs Work' : 'Critical';
    return { label, percent: smoothFill(total, 4), status, baselinePercent: smoothFill(baselineExtracurriculars, 4) };
  }

  if (categorySlug === 'letters-of-recommendation') {
    const baselineLetters = toNumber(inputs.lettersOfRec);
    const loggedConfirmed = logs.filter((log) => log.note?.includes('Status: Confirmed') || log.note?.includes('Status: Received')).length;
    const confirmed = baselineLetters + loggedConfirmed;
    const status: CategoryBar['status'] =
      confirmed >= 5 ? 'Strong' : confirmed >= 4 ? 'Competitive' : confirmed >= 3 ? 'Developing' : confirmed >= 2 ? 'Needs Work' : 'Critical';
    return { label, percent: smoothFill(confirmed, 5), status, baselinePercent: smoothFill(baselineLetters, 5) };
  }

  return null;
}

function extractField(note: string | null, label: string) {
  return note?.match(new RegExp(`${label}: ([^|]+)`))?.[1]?.trim() ?? '';
}

function recommendationStatusClasses(status: string) {
  if (status === 'Confirmed' || status === 'Received') return 'bg-green-100 text-green-700';
  if (status === 'Asked') return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-700';
}

export default function CategoryDetailClient({ categorySlug }: CategoryDetailClientProps) {
  const router = useRouter();
  const categoryDefinition = getCategoryDefinitionBySlug(categorySlug);
  const [storedReport, setStoredReport] = useState<StoredReport | null>(null);
  const [entries, setEntries] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const formMode = getFormMode(categorySlug);
  const baselineInputs = storedReport?.inputs;
  const categoryBar = useMemo(
    () => (categoryDefinition ? buildCategoryBar(baselineInputs, entries, categorySlug, categoryDefinition.label) : null),
    [baselineInputs, categoryDefinition, categorySlug, entries]
  );
  const latestMcatScore = useMemo(() => getLatestMcatScore(entries), [entries]);
  const extracurricularCount = entries.length;
  const confirmedLorCount = entries.filter((entry) => entry.note?.includes('Status: Confirmed') || entry.note?.includes('Status: Received')).length;
  const totalHours = useMemo(() => {
    if (categorySlug === 'leadership') return toNumber(baselineInputs?.leadershipExperiences) + entries.length;
    if (categorySlug === 'clinical-experience') return toNumber(baselineInputs?.clinicalHours) + entries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    if (categorySlug === 'physician-shadowing') return toNumber(baselineInputs?.shadowingHours) + entries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    if (categorySlug === 'community-service') return toNumber(baselineInputs?.volunteeringHours) + entries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    if (categorySlug === 'research') return toNumber(baselineInputs?.researchHours) + entries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    return 0;
  }, [baselineInputs, categorySlug, entries]);
  const nextSteps = categoryDefinition && categoryBar ? categoryNextSteps[categoryDefinition.label][categoryBar.status] : [];

  async function loadCategoryData() {
    if (!categoryDefinition) {
      router.replace('/dashboard');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace('/auth');
      return;
    }

    const [{ data: profileData, error: profileError }, { data: activityData, error: activityError }] = await Promise.all([
      supabase.from('profiles').select('reports').eq('id', user.id).maybeSingle(),
      supabase
        .from('activity_logs')
        .select('id, category, hours, note, logged_at')
        .eq('user_id', user.id)
        .eq('category', categorySlug)
        .order('logged_at', { ascending: false }),
    ]);

    if (profileError) {
      setErrorMessage(profileError.message);
    } else {
      setStoredReport((profileData?.reports as StoredReport | null) ?? null);
    }

    if (activityError) {
      setErrorMessage(activityError.message);
    } else {
      setEntries((activityData as ActivityLog[] | null) ?? []);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadCategoryData();
  }, [categorySlug]);

  useEffect(() => {
    if (formMode !== 'gpa') return;

    setFormState((current) => ({
      ...current,
      hours: baselineInputs?.gpa ?? '',
      score: baselineInputs?.scienceGpa ?? '',
    }));
  }, [baselineInputs, formMode]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  async function handleGpaSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user || !storedReport) {
      router.replace('/auth');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const nextReport: StoredReport = {
      ...storedReport,
      inputs: {
        ...(storedReport.inputs ?? {}),
        gpa: formState.hours,
        scienceGpa: formState.score,
      },
    };

    const { error } = await supabase.from('profiles').update({ reports: nextReport }).eq('id', user.id);

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setStoredReport(nextReport);
    setIsSubmitting(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!categoryDefinition) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace('/auth');
      return;
    }

    let hoursValue = Number(formState.hours);
    let loggedAtValue = formState.date || new Date().toISOString();
    let noteValue = formState.note.trim();

    if (formMode === 'clinical' || formMode === 'service') {
      noteValue = buildFormattedNote([
        ['Organization', formState.organization],
        ['Supervisor', formState.supervisorName],
        ['Email', formState.supervisorEmail],
        ['Note', formState.note],
      ]);
    } else if (formMode === 'shadowing') {
      noteValue = buildFormattedNote([
        ['Physician', formState.physicianName],
        ['Email', formState.physicianEmail],
        ['Specialty', formState.specialty],
        ['Note', formState.note],
      ]);
    } else if (formMode === 'research') {
      noteValue = buildFormattedNote([
        ['PI', formState.piName],
        ['Email', formState.piEmail],
        ['Project', formState.labProjectName],
        ['Note', formState.note],
      ]);
    } else if (formMode === 'leadership') {
      hoursValue = 1;
      loggedAtValue = formState.startDate;
      noteValue = buildFormattedNote([
        ['Role', formState.roleTitle],
        ['Org', formState.organization],
        ['Start', formState.startDate],
        ['Description', formState.note],
      ]);
    } else if (formMode === 'mcat') {
      hoursValue = Number(formState.score);
      loggedAtValue = formState.date;
      noteValue = buildFormattedNote([
        ['Score', formState.score],
        ['Note', formState.note],
      ]);
    } else if (formMode === 'extracurriculars') {
      hoursValue = Number(formState.yearsInvolved);
      loggedAtValue = new Date().toISOString();
      noteValue = buildFormattedNote([
        ['Activity', formState.activityName],
        ['Type', formState.activityType],
        ['Years', formState.yearsInvolved],
        ['Description', formState.note],
      ]);
    } else if (formMode === 'letters') {
      hoursValue = 1;
      loggedAtValue = formState.dateRequested || new Date().toISOString();
      noteValue = buildFormattedNote([
        ['Name', formState.recommenderName],
        ['Email', formState.recommenderEmail],
        ['Relationship', formState.relationship],
        ['Status', formState.recommendationStatus],
        ['Notes', formState.note],
      ]);
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        category: categorySlug,
        hours: hoursValue,
        logged_at: loggedAtValue,
        note: noteValue || null,
      })
      .select('id, category, hours, note, logged_at');

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setFormState(initialFormState);
    setIsFormOpen(false);
    if (data?.length) {
      setEntries((current) => [data[0] as ActivityLog, ...current]);
    }
    setIsSubmitting(false);
  }

  if (!categoryDefinition) return null;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Card title={`Loading ${categoryDefinition.label}`}>
          <p className="text-sm text-slate-600">Fetching your saved report and activity log.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-brand-700 transition hover:text-brand-900">
          ← Back to dashboard
        </Link>

        <Card>
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{categoryDefinition.label}</h1>
                <p className="mt-1 text-sm text-slate-600">
                  {formMode === 'mcat'
                    ? latestMcatScore
                      ? `Current score: ${latestMcatScore}`
                      : 'No score logged yet'
                    : formMode === 'leadership'
                      ? `Total experiences: ${totalHours}`
                      : formMode === 'extracurriculars'
                        ? `${extracurricularCount} activities documented`
                        : formMode === 'letters'
                          ? `${confirmedLorCount} of 3 letters confirmed`
                          : `Total hours logged: ${totalHours}`}
                </p>
              </div>

              {categoryBar ? (
                <div className="min-w-[220px] space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-700">{categoryBar.label}</span>
                    <span className="flex items-center gap-1.5">
                      <span className={`font-medium ${getStatusClasses(categoryBar.status).text}`}>{categoryBar.status}</span>
                      <span className={`text-xs font-medium ${getStatusClasses(categoryBar.status).text}`}>{categoryBar.percent}%</span>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    {(() => {
                      const baselineFill = categoryBar.baselinePercent ?? categoryBar.percent;
                      const progressFill = Math.max(0, categoryBar.percent - baselineFill);
                      const barColorMap: Record<string, string> = {
                        'Strong': '#15803d',
                        'Competitive': '#22c55e',
                        'Developing': '#f59e0b',
                        'Needs Work': '#ef4444',
                        'Critical': '#7f1d1d',
                      };
                      if (progressFill > 0) {
                        return (
                          <div style={{ display: 'flex', height: '100%' }}>
                            <div style={{ width: `${baselineFill}%`, background: 'rgba(100,100,100,0.4)', borderRadius: '4px 0 0 4px' }} />
                            <div style={{ width: `${progressFill}%`, background: barColorMap[categoryBar.status], borderRadius: '0 4px 4px 0' }} />
                          </div>
                        );
                      }
                      return <div className={`h-full rounded-full ${getStatusClasses(categoryBar.status).fill}`} style={{ width: `${categoryBar.percent}%` }} />;
                    })()}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
                <span>Strong</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span>Competitive</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span>Developing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span>Needs Work</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-900" />
                <span>Critical</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {errorMessage ? (
        <Card title="Category notice">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </Card>
      ) : null}

      <Card title="Next steps">
        {nextSteps.length ? (
          <ul className="space-y-2 text-sm text-slate-700">
            {nextSteps.map((step) => (
              <li key={step}>• {step}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">Generate a report first to unlock tailored next steps for this category.</p>
        )}
      </Card>

      <Card title="Activity log">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">Every logged entry for this category appears here.</p>
            {formMode === 'gpa' ? null : (
              <button
                type="button"
                onClick={() => setIsFormOpen((current) => !current)}
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                {isFormOpen ? 'Close form' : 'Log new entry'}
              </button>
            )}
          </div>

          {formMode === 'gpa' ? (
            <form onSubmit={handleGpaSave} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Cumulative GPA</label>
                  <input type="number" step="0.01" max="4.0" value={formState.hours} onChange={(event) => updateForm('hours', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Science GPA</label>
                  <input type="number" step="0.01" max="4.0" value={formState.score} onChange={(event) => updateForm('score', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required />
                </div>
              </div>
              <div className="mt-4">
                <Button type="submit">{isSubmitting ? 'Saving...' : 'Save GPA'}</Button>
              </div>
            </form>
          ) : null}

          {isFormOpen && formMode === 'clinical' ? (
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Hours</label><input type="number" min="1" value={formState.hours} onChange={(event) => updateForm('hours', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Date</label><input type="date" value={formState.date} onChange={(event) => updateForm('date', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Organization</label><input value={formState.organization} onChange={(event) => updateForm('organization', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Supervisor name</label><input value={formState.supervisorName} onChange={(event) => updateForm('supervisorName', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Supervisor email</label><input type="email" value={formState.supervisorEmail} onChange={(event) => updateForm('supervisorEmail', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Note</label><textarea value={formState.note} onChange={(event) => updateForm('note', event.target.value)} className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
              </div>
              <div className="mt-4"><Button type="submit">{isSubmitting ? 'Saving...' : 'Save entry'}</Button></div>
            </form>
          ) : null}

          {isFormOpen && formMode === 'shadowing' ? (
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Hours</label><input type="number" min="1" value={formState.hours} onChange={(event) => updateForm('hours', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Date</label><input type="date" value={formState.date} onChange={(event) => updateForm('date', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Physician name</label><input value={formState.physicianName} onChange={(event) => updateForm('physicianName', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Physician email</label><input type="email" value={formState.physicianEmail} onChange={(event) => updateForm('physicianEmail', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Specialty</label><input value={formState.specialty} onChange={(event) => updateForm('specialty', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Note</label><textarea value={formState.note} onChange={(event) => updateForm('note', event.target.value)} className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
              </div>
              <div className="mt-4"><Button type="submit">{isSubmitting ? 'Saving...' : 'Save entry'}</Button></div>
            </form>
          ) : null}

          {isFormOpen && formMode === 'service' ? (
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Hours</label><input type="number" min="1" value={formState.hours} onChange={(event) => updateForm('hours', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Date</label><input type="date" value={formState.date} onChange={(event) => updateForm('date', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Organization</label><input value={formState.organization} onChange={(event) => updateForm('organization', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Supervisor name</label><input value={formState.supervisorName} onChange={(event) => updateForm('supervisorName', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Supervisor email</label><input type="email" value={formState.supervisorEmail} onChange={(event) => updateForm('supervisorEmail', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Note</label><textarea value={formState.note} onChange={(event) => updateForm('note', event.target.value)} className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
              </div>
              <div className="mt-4"><Button type="submit">{isSubmitting ? 'Saving...' : 'Save entry'}</Button></div>
            </form>
          ) : null}

          {isFormOpen && formMode === 'research' ? (
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Hours</label><input type="number" min="1" value={formState.hours} onChange={(event) => updateForm('hours', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Date</label><input type="date" value={formState.date} onChange={(event) => updateForm('date', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">PI name</label><input value={formState.piName} onChange={(event) => updateForm('piName', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">PI email</label><input type="email" value={formState.piEmail} onChange={(event) => updateForm('piEmail', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Lab or project name</label><input value={formState.labProjectName} onChange={(event) => updateForm('labProjectName', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Note</label><textarea value={formState.note} onChange={(event) => updateForm('note', event.target.value)} className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
              </div>
              <div className="mt-4"><Button type="submit">{isSubmitting ? 'Saving...' : 'Save entry'}</Button></div>
            </form>
          ) : null}

          {isFormOpen && formMode === 'leadership' ? (
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Role title</label><input value={formState.roleTitle} onChange={(event) => updateForm('roleTitle', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Organization</label><input value={formState.organization} onChange={(event) => updateForm('organization', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Start date</label><input type="date" value={formState.startDate} onChange={(event) => updateForm('startDate', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Description</label><textarea value={formState.note} onChange={(event) => updateForm('note', event.target.value)} className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
              </div>
              <div className="mt-4"><Button type="submit">{isSubmitting ? 'Saving...' : 'Save entry'}</Button></div>
            </form>
          ) : null}

          {isFormOpen && formMode === 'mcat' ? (
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Score</label><input type="number" min="472" max="528" value={formState.score} onChange={(event) => updateForm('score', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Test date</label><input type="date" value={formState.date} onChange={(event) => updateForm('date', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Note</label><textarea value={formState.note} onChange={(event) => updateForm('note', event.target.value)} className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
              </div>
              <div className="mt-4"><Button type="submit">{isSubmitting ? 'Saving...' : 'Save entry'}</Button></div>
            </form>
          ) : null}

          {isFormOpen && formMode === 'extracurriculars' ? (
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Activity name</label><input value={formState.activityName} onChange={(event) => updateForm('activityName', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Type</label><select value={formState.activityType} onChange={(event) => updateForm('activityType', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"><option>Sport</option><option>Music</option><option>Art</option><option>Language</option><option>Creative hobby</option><option>Other</option></select></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Years involved</label><input type="number" min="0" max="10" step="0.5" value={formState.yearsInvolved} onChange={(event) => updateForm('yearsInvolved', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Description</label><textarea value={formState.note} onChange={(event) => updateForm('note', event.target.value)} className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
              </div>
              <div className="mt-4"><Button type="submit">{isSubmitting ? 'Saving...' : 'Save entry'}</Button></div>
            </form>
          ) : null}

          {isFormOpen && formMode === 'letters' ? (
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Recommender name</label><input value={formState.recommenderName} onChange={(event) => updateForm('recommenderName', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" required /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Recommender email</label><input value={formState.recommenderEmail} onChange={(event) => updateForm('recommenderEmail', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Relationship</label><select value={formState.relationship} onChange={(event) => updateForm('relationship', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"><option>Science professor</option><option>Non-science professor</option><option>Physician</option><option>Research PI</option><option>Employer</option><option>Other</option></select></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Date requested</label><input type="date" value={formState.dateRequested} onChange={(event) => updateForm('dateRequested', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Status</label><select value={formState.recommendationStatus} onChange={(event) => updateForm('recommendationStatus', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"><option>Planning to ask</option><option>Asked</option><option>Confirmed</option><option>Received</option></select></div>
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Notes</label><textarea value={formState.note} onChange={(event) => updateForm('note', event.target.value)} className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" /></div>
              </div>
              <div className="mt-4"><Button type="submit">{isSubmitting ? 'Saving...' : 'Save entry'}</Button></div>
            </form>
          ) : null}

          {entries.length ? (
            <ul className="space-y-3">
              {entries.map((entry) => {
                if (formMode === 'extracurriculars') {
                  const activityName = extractField(entry.note, 'Activity') || 'Extracurricular activity';
                  const type = extractField(entry.note, 'Type') || 'Other';
                  const years = extractField(entry.note, 'Years');
                  const description = extractField(entry.note, 'Description');

                  return (
                    <li key={entry.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-800">{activityName}</p>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{type}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{years ? `${years} years involved` : 'Years not specified'}</p>
                      {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
                    </li>
                  );
                }

                if (formMode === 'letters') {
                  const name = extractField(entry.note, 'Name') || 'Recommender';
                  const relationship = extractField(entry.note, 'Relationship') || 'Other';
                  const status = extractField(entry.note, 'Status') || 'Planning to ask';
                  const notes = extractField(entry.note, 'Notes');

                  return (
                    <li key={entry.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-800">{name}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{relationship}</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${recommendationStatusClasses(status)}`}>{status}</span>
                        </div>
                      </div>
                      {entry.logged_at ? <p className="mt-2 text-sm text-slate-600">Date requested: {new Date(entry.logged_at).toLocaleDateString()}</p> : null}
                      {notes ? <p className="mt-2 text-sm text-slate-600">{notes}</p> : null}
                    </li>
                  );
                }

                const genericDetail =
                  formMode === 'mcat'
                    ? `Score: ${entry.hours}`
                    : formMode === 'leadership'
                      ? 'Experience logged'
                      : `Hours: ${entry.hours}`;

                const contact = ['Supervisor', 'Email', 'Organization', 'Physician', 'Specialty', 'PI', 'Project', 'Role', 'Org', 'Start']
                  .map((label) => {
                    const value = extractField(entry.note, label);
                    return value ? `${label}: ${value}` : '';
                  })
                  .filter(Boolean)
                  .join(' | ');
                const note = extractField(entry.note, 'Note') || extractField(entry.note, 'Description') || extractField(entry.note, 'Notes');

                return (
                  <li key={entry.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-slate-800">{new Date(entry.logged_at).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-600">{genericDetail}</p>
                    </div>
                    {contact ? <p className="mt-2 text-sm text-slate-700">Supervisor/Contact: {contact}</p> : null}
                    {note ? <p className="mt-2 text-sm text-slate-600">{note}</p> : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">No entries yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
