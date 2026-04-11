'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './globals.css';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/intake', label: 'Get My Score' },
  { href: '/dashboard', label: 'Dashboard' }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (isMounted) {
        setEmail(user?.email ?? null);
      }
    }

    loadUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setEmail(session?.user?.email ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setEmail(null);
    router.push('/auth');
    router.refresh();
    setIsSigningOut(false);
  }

  return (
    <html lang="en">
      <body>
        <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '0.5px solid #e4e9f0', background: '#f5f7fa' }}>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 40px', maxWidth: 1152, margin: '0 auto', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: '#0f1f3d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, background: '#7eb8e0', borderRadius: '50%' }} />
              </div>
              <span style={{ color: '#0f1f3d', fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>My Premed Path</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
              {navLinks.filter((link) => !email || (link.href !== '/intake' && link.href !== '/')).map((link) => (
                <Link key={link.href} href={link.href} style={{ color: '#8a9eb8', fontSize: 13, textDecoration: 'none' }}>
                  {link.label}
                </Link>
              ))}

              {email ? (
                <>
                  <span style={{ color: '#8a9eb8', fontSize: 13 }}>{email}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    style={{ color: '#0f1f3d', fontSize: 13, textDecoration: 'none', border: '0.5px solid rgba(15,31,61,0.25)', padding: '7px 18px', borderRadius: 9999, fontWeight: 500, background: 'transparent', cursor: 'pointer', opacity: isSigningOut ? 0.6 : 1 }}
                  >
                    {isSigningOut ? 'Logging out...' : 'Logout'}
                  </button>
                </>
              ) : (
                <Link href="/auth?mode=signup" style={{ color: '#0f1f3d', fontSize: 13, textDecoration: 'none', border: '0.5px solid rgba(15,31,61,0.25)', padding: '7px 18px', borderRadius: 9999, fontWeight: 500 }}>
                  Sign up
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
