import Link from 'next/link'

export default function ReportNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Report not found</h1>
        <p className="text-slate-500">
          This audit report does not exist or has been removed.
        </p>
      </div>
      <Link
        href="/audit"
        className="font-medium hover:underline transition-colors"
        style={{ color: 'var(--brand-600)' }}
      >
        Run a new audit →
      </Link>
    </main>
  )
}
