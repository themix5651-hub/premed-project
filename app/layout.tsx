'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './globals.css';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/intake', label: 'Intake Form' },
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
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-bold text-brand-900">
              Premed Path
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <ul className="flex items-center gap-2 sm:gap-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {email ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{email}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSigningOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Login
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
