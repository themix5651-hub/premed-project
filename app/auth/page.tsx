'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

type AuthMode = 'login' | 'signup';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && isMounted) router.replace('/dashboard');
    }
    checkUser();
    return () => { isMounted = false; };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setErrorMessage(error.message); setIsSubmitting(false); return; }
      if (data.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, reports: null }, { onConflict: 'id' });
      }
      router.push('/intake');
      router.refresh();
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErrorMessage(error.message); setIsSubmitting(false); return; }
    router.push('/dashboard');
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <div style={{ background: '#f5f7fa', minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>

      {/* Hero */}
      <div style={{ background: '#0f1f3d', padding: '40px 32px 44px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(126,184,224,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Free account
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#f5f7fa', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 8 }}>
          Save your score.<br />Track your progress.
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(245,247,250,0.4)', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
          Create a free account to save your results and log hours over time.
        </p>
      </div>

      {/* Form */}
      <div style={{ padding: '28px 24px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '24px 22px', width: '100%', maxWidth: 420 }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: '#f5f7fa', border: '0.5px solid #dde3ed', borderRadius: 9999, padding: 3, marginBottom: 22 }}>
            {(['signup', 'login'] as AuthMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setErrorMessage(''); }}
                style={{
                  flex: 1, padding: '7px', borderRadius: 9999, fontSize: 13, fontWeight: mode === m ? 500 : 400,
                  background: mode === m ? '#0f1f3d' : 'transparent',
                  color: mode === m ? '#f5f7fa' : '#8a9eb8',
                  border: 'none', cursor: 'pointer'
                }}
              >
                {m === 'signup' ? 'Sign up' : 'Log in'}
              </button>
            ))}
          </div>

          {/* Benefits — only show on signup */}
          {mode === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {[
                'Your score and category breakdown saved automatically',
                'Log clinical hours, shadowing, and research over time',
                'Watch your bars move as your application grows',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(126,184,224,0.15)', border: '0.5px solid rgba(126,184,224,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <div style={{ width: 5, height: 5, background: '#7eb8e0', borderRadius: '50%' }} />
                  </div>
                  <p style={{ fontSize: 12, color: '#5a6b80', lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#8a9eb8', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ width: '100%', background: '#f5f7fa', border: '0.5px solid #dde3ed', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#3a4a5c', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, color: '#8a9eb8', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
                style={{ width: '100%', background: '#f5f7fa', border: '0.5px solid #dde3ed', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#3a4a5c', outline: 'none' }}
              />
            </div>

            {errorMessage && (
              <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8, marginBottom: 4 }}>{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ width: '100%', background: '#0f1f3d', color: '#f5f7fa', border: 'none', borderRadius: 9999, padding: '12px', fontSize: 13, fontWeight: 500, marginTop: 18, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create free account →' : 'Log in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
