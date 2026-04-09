import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ background: '#f5f7fa', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 40px', background: '#f5f7fa',
        borderBottom: '0.5px solid #e4e9f0', position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, background: '#0f1f3d',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: 7, height: 7, background: '#7eb8e0', borderRadius: '50%' }} />
          </div>
          <span style={{ color: '#0f1f3d', fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>
            My Premed Path
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <Link href="/" style={{ color: '#8a9eb8', fontSize: 13, textDecoration: 'none' }}>Home</Link>
          <Link href="/intake" style={{ color: '#8a9eb8', fontSize: 13, textDecoration: 'none' }}>Get My Score</Link>
          <Link href="/dashboard" style={{ color: '#8a9eb8', fontSize: 13, textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/auth/login" style={{
            color: '#0f1f3d', fontSize: 13, textDecoration: 'none',
            border: '0.5px solid rgba(15,31,61,0.25)', padding: '7px 18px',
            borderRadius: 9999, fontWeight: 500
          }}>Login</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: '#0f1f3d', padding: '80px 40px 88px',
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* glow orbs */}
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

        {/* pill tag */}
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

        {/* eyebrow */}
        <p style={{ fontSize: 13, color: 'rgba(245,247,250,0.4)', marginBottom: 10, letterSpacing: '0.01em' }}>
          My Premed Path
        </p>

        {/* headline */}
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

        {/* buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/intake" style={{
            background: '#1a5fa8', color: '#f5f7fa', textDecoration: 'none',
            padding: '14px 32px', borderRadius: 9999, fontSize: 14, fontWeight: 500
          }}>
            Get My Free Score →
          </Link>
          <button style={{
            background: 'transparent', color: 'rgba(245,247,250,0.45)',
            border: '0.5px solid rgba(245,247,250,0.15)', padding: '14px 22px',
            borderRadius: 9999, fontSize: 14, cursor: 'pointer'
          }}>
            See how it works
          </button>
        </div>

        {/* proof */}
        <div style={{ marginTop: 36, display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['AAMC matriculant data', 'Built by a premed student', 'Every stage welcome'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 5, height: 5, background: '#1a5fa8', borderRadius: '50%' }} />
              <span style={{ fontSize: 11, color: 'rgba(245,247,250,0.28)' }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ height: '0.5px', background: 'linear-gradient(90deg, transparent, rgba(15,31,61,0.12), transparent)' }} />

      {/* HOW IT WORKS */}
      <section style={{ background: '#f5f7fa', padding: '56px 40px 48px' }}>
        <p style={{ textAlign: 'center', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a9eb8', marginBottom: 32 }}>
          How it works
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          maxWidth: 480, margin: '0 auto'
        }}>
          {[
            { n: '1', title: 'Fill out your stats', body: 'GPA, MCAT, hours — takes 2 minutes' },
            { n: '2', title: 'Get your score', body: '0–100 across 9 weighted categories' },
            { n: '3', title: 'See what to fix', body: 'Specific steps for your exact profile' },
            { n: '4', title: 'Track progress', body: 'Log hours and watch your bars move' },
          ].map(c => (
            <div key={c.n} style={{
              background: '#fff', border: '0.5px solid #dde3ed',
              borderRadius: 14, padding: '20px 18px'
            }}>
              <div style={{
                width: 28, height: 28, background: '#0f1f3d', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14
              }}>
                <span style={{ fontSize: 11, color: '#7eb8e0', fontWeight: 500 }}>{c.n}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#0f1f3d', marginBottom: 5, letterSpacing: '-0.01em' }}>{c.title}</p>
              <p style={{ fontSize: 12, color: '#8a9eb8', lineHeight: 1.5 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RESULTS PREVIEW */}
      <section style={{ background: '#edf1f7', padding: '0 40px 56px', borderTop: '0.5px solid #dde3ed' }}>
        <p style={{ textAlign: 'center', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a9eb8', paddingTop: 48, marginBottom: 24 }}>
          What your results look like
        </p>
        <div style={{ maxWidth: 460, margin: '0 auto', borderRadius: 18, overflow: 'hidden', border: '0.5px solid #d0d9e8' }}>
          {/* dark top */}
          <div style={{ background: '#0f1f3d', padding: '26px 24px 22px' }}>
            <p style={{ fontSize: 10, color: 'rgba(126,184,224,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Readiness Score
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 56, color: '#f5f7fa', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 1 }}>
                74<span style={{ fontSize: 22, color: 'rgba(245,247,250,0.28)' }}>/100</span>
              </div>
              <div style={{
                background: 'rgba(126,184,224,0.12)', color: '#7eb8e0', fontSize: 11,
                padding: '7px 16px', borderRadius: 9999, border: '0.5px solid rgba(126,184,224,0.2)'
              }}>
                Competitive
              </div>
            </div>
            <div style={{
              background: 'rgba(126,184,224,0.07)', border: '0.5px solid rgba(126,184,224,0.14)',
              borderRadius: 8, padding: '10px 14px', fontSize: 12,
              color: 'rgba(126,184,224,0.72)', lineHeight: 1.55
            }}>
              This is the window that matters most — your score today is close to what adcoms will actually see.
            </div>
          </div>
          {/* white body */}
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
            <Link href="/intake" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 20, width: '100%', background: '#0f1f3d', color: '#f5f7fa',
              textDecoration: 'none', padding: '14px 18px', borderRadius: 10,
              fontSize: 13, fontWeight: 500
            }}>
              <span>Get My Free Score</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ background: '#0f1f3d', padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 400,
          color: '#f5f7fa', letterSpacing: '-0.03em', lineHeight: 1.25,
          maxWidth: 300, margin: '0 auto 10px'
        }}>
          Most premeds find out too late.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(245,247,250,0.32)', margin: '0 auto 28px', maxWidth: 280, lineHeight: 1.65 }}>
          My Premed Path tells you now — while you still have time to fix it.
        </p>
        <Link href="/intake" style={{
          background: '#1a5fa8', color: '#f5f7fa', textDecoration: 'none',
          padding: '14px 32px', borderRadius: 9999, fontSize: 14, fontWeight: 500
        }}>
          Get My Free Score →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#f5f7fa', padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '0.5px solid #dde3ed'
      }}>
        <span style={{ fontSize: 12, color: '#a8b8cc' }}>© 2026 My Premed Path</span>
        <span style={{ fontSize: 12, color: '#a8b8cc' }}>Built by a premed student, for premed students</span>
      </footer>

    </main>
  )
}
