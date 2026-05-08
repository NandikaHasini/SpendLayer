import Link from 'next/link'

export default function ReportNotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Report not found</h1>
          <p className="text-slate-500">
            This audit report does not exist or is no longer available.
          </p>
        </div>
        <Link
          href="/audit"
          className="mt-6 inline-flex h-8 items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Run a new audit
        </Link>
      </div>
    </main>
  )
}
