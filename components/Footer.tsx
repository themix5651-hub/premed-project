export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} My Premed Path. Built by a premed student, for premed students.
      </div>
    </footer>
  );
}
