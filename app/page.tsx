'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push('/dashboard')
    })
  }, [router])

  return (
    <main style={{ background: '#f5f7fa', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* HERO */}
      <section style={{
        background: '#0f1f3d', padding: '80px 40px 88px',
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 520, height: 400,
          background: 'radial-gradient(ellipse, rgba(30,80,160,0.28) 0%, transparent 68%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -40, right: -40, width: 200, height: 200,
          background: 'radial-gradient(ellipse, rgba(126,184,224,0.07) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(126,184,224,0.1)', border: '0.5px solid rgba(126,184,224,0.22)',
          padding: '6px 16px', borderRadius: 9999, marginBottom: 24
        }}>
          <div style={{ width: 5, height: 5, background: '#7eb8e0', borderRadius: '50%' }} />
          <span style={{ fontSize: 11, color: '#7eb8e0', letterSpacing: '0.05em' }}>
            Free · No credit card · Built for MD applicants
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(245,247,250,0.4)', marginBottom: 10, letterSpacing: '0.01em' }}>
          My Premed Path
        </p>
        <h1 style={{ marginBottom: 18, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          <span style={{ display: 'block', fontSize: 48, fontWeight: 400, color: '#f5f7fa', fontFamily: 'Georgia, serif' }}>
            Know exactly where
          </span>
          <span style={{ display: 'block', fontSize: 48, fontWeight: 400, color: '#7eb8e0', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            your application stands.
          </span>
        </h1>
        <p style={{
          fontSize: 14, color: 'rgba(245,247,250,0.38)', lineHeight: 1.75,
          maxWidth: 320, margin: '0 auto 36px'
        }}>
          Scored across 9 categories adcoms actually evaluate — calibrated against real AAMC matriculant data.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/intake" style={{
            background: '#1a5fa8', color: '#f5f7fa', textDecoration: 'none',
            padding: '14px 32px', borderRadius: 9999, fontSize: 14, fontWeight: 500
          }}>
            Get My Free Score →
          </Link>
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} style={{
            background: 'transparent', color: 'rgba(245,247,250,0.45)',
            border: '0.5px solid rgba(245,247,250,0.15)', padding: '14px 22px',
            borderRadius: 9999, fontSize: 14, cursor: 'pointer'
          }}>
            See how it works
          </button>
        </div>
        <div style={{ marginTop: 36, display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['AAMC matriculant data', 'Built by a premed student', 'Every stage welcome'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 5, height: 5, background: '#1a5fa8', borderRadius: '50%' }} />
              <span style={{ fontSize: 11, color: 'rgba(245,247,250,0.28)' }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: '0.5px', background: 'linear-gradient(90deg, transparent, rgba(15,31,61,0.12), transparent)' }} />

      <section id="how-it-works" style={{ background: '#f5f7fa', padding: '56px 40px 48px' }}>
        <p style={{ textAlign: 'center', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 32 }}>
          How it works
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 480, margin: '0 auto' }}>
          {[
            { n: '1', title: 'Fill out your stats', body: 'GPA, MCAT, hours — takes 2 minutes' },
            { n: '2', title: 'Get your score', body: '0–100 across 9 weighted categories' },
            { n: '3', title: 'See what to fix', body: 'Specific steps for your exact profile' },
            { n: '4', title: 'Track progress', body: 'Log hours and watch your bars move' },
          ].map(c => (
            <div key={c.n} style={{ background: '#fff', border: '0.5px solid #dde3ed', borderRadius: 14, padding: '20px 18px' }}>
              <div style={{ width: 28, height: 28, background: '#0f1f3d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: '#7eb8e0', fontWeight: 500 }}>{c.n}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#0f1f3d', marginBottom: 5, letterSpacing: '-0.01em' }}>{c.title}</p>
              <p style={{ fontSize: 12, color: '#8a9eb8', lineHeight: 1.5 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#0f1f3d', padding: '56px 40px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(126,184,224,0.5)', marginBottom: 16 }}>
            Built for the long game
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 400, color: '#f5f7fa', letterSpacing: '-0.03em', lineHeight: 1.25, marginBottom: 12 }}>
            Ditch the spreadsheet.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,247,250,0.45)', lineHeight: 1.75, marginBottom: 28 }}>
            Most premeds track clinical hours, shadowing, and research in a notes app or Excel sheet. My Premed Path replaces all of that — log every activity, watch your bars update in real time, and always know exactly where you stand.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'Log clinical hours', sub: 'Track hours by category with supervisor info' },
              { label: 'Watch your score grow', sub: 'Bars update every time you log new activity' },
              { label: 'Know your weak spots', sub: 'See exactly which categories need attention' },
              { label: 'Always application-ready', sub: 'Your data organized the way AMCAS expects it' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(126,184,224,0.15)', border: '0.5px solid rgba(126,184,224,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, background: '#7eb8e0', borderRadius: '50%' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#f5f7fa', marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: 'rgba(245,247,250,0.4)', lineHeight: 1.5 }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/intake" style={{ display: 'inline-block', background: '#1a5fa8', color: '#f5f7fa', textDecoration: 'none', padding: '13px 26px', borderRadius: 9999, fontSize: 13, fontWeight: 500 }}>
            Start tracking for free →
          </Link>
        </div>
      </section>

      <section style={{ background: '#edf1f7', padding: '0 40px 56px', borderTop: '0.5px solid #dde3ed' }}>
        <p style={{ textAlign: 'center', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a9eb8', paddingTop: 48, marginBottom: 24 }}>
          What your results look like
        </p>
        <div style={{ maxWidth: 460, margin: '0 auto', borderRadius: 18, overflow: 'hidden', border: '0.5px solid #d0d9e8' }}>
          <div style={{ background: '#0f1f3d', padding: '26px 24px 22px' }}>
            <p style={{ fontSize: 10, color: 'rgba(126,184,224,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Readiness Score
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 56, color: '#f5f7fa', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 1 }}>
                74<span style={{ fontSize: 22, color: 'rgba(245,247,250,0.28)' }}>/100</span>
              </div>
              <div style={{ background: 'rgba(126,184,224,0.12)', color: '#7eb8e0', fontSize: 11, padding: '7px 16px', borderRadius: 9999, border: '0.5px solid rgba(126,184,224,0.2)' }}>
                Competitive
              </div>
            </div>
            <div style={{ background: 'rgba(126,184,224,0.07)', border: '0.5px solid rgba(126,184,224,0.14)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'rgba(126,184,224,0.72)', lineHeight: 1.55 }}>
              This is the window that matters most — your score today is close to what adcoms will actually see.
            </div>
          </div>
          <div style={{ background: '#fff', padding: '22px 24px' }}>
            {[
              { name: 'GPA', pct: 82, status: 'Competitive', color: '#1a5fa8' },
              { name: 'MCAT', pct: 76, status: 'Competitive', color: '#1a5fa8' },
              { name: 'Clinical experience', pct: 44, status: 'Developing', color: '#d97706' },
              { name: 'Research', pct: 36, status: 'Developing', color: '#d97706' },
              { name: 'Letters of rec', pct: 20, status: 'Needs Work', color: '#dc2626' },
            ].map(b => (
              <div key={b.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#5a6b80' }}>{b.name}</span>
                  <span style={{ fontSize: 11, color: b.color, fontWeight: 500 }}>{b.status}</span>
                </div>
                <div style={{ height: 4, background: '#edf1f7', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.pct}%`, background: b.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
            <Link href="/intake" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, width: '100%', background: '#0f1f3d', color: '#f5f7fa', textDecoration: 'none', padding: '14px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500 }}>
              <span>Get My Free Score</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: '#0f1f3d', padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 400, color: '#f5f7fa', letterSpacing: '-0.03em', lineHeight: 1.25, maxWidth: 300, margin: '0 auto 10px' }}>
          Most premeds find out too late.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(245,247,250,0.32)', margin: '0 auto 28px', maxWidth: 280, lineHeight: 1.65 }}>
          My Premed Path tells you now — while you still have time to fix it.
        </p>
        <Link href="/intake" style={{ background: '#1a5fa8', color: '#f5f7fa', textDecoration: 'none', padding: '14px 32px', borderRadius: 9999, fontSize: 14, fontWeight: 500 }}>
          Get My Free Score →
        </Link>
      </section>

    </main>
  )
}
