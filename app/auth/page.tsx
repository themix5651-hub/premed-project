'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user && isMounted) {
        router.replace('/intake');
      }
    }

    checkUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setErrorMessage('');

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, reports: null }, { onConflict: 'id' });
      }

      setStatusMessage('Check your email to confirm your account.');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    router.push('/intake');
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <Card title={mode === 'login' ? 'Log in to Premed Path' : 'Create your Premed Path account'} className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </div>

          {statusMessage ? <p className="text-sm text-green-700">{statusMessage}</p> : null}
          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="submit">{isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign up'}</Button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setStatusMessage('');
                setErrorMessage('');
              }}
              className="text-sm font-medium text-brand-700 transition hover:text-brand-900"
            >
              {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
