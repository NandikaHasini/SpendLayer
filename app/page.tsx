import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpendLayer - AI Spend Audit",
  description:
    "Audit your AI tooling stack with deterministic pricing intelligence and clear savings recommendations.",
  openGraph: {
    title: "SpendLayer - AI Spend Audit",
    description:
      "Audit your AI tooling stack with deterministic pricing intelligence and clear savings recommendations.",
  },
};

export default function Home() {
  return (
    <main className='min-h-screen bg-slate-950 text-white'>
      <div className='mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-16'>
        <div className='max-w-2xl space-y-6'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300'>
            SpendLayer
          </p>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            Audit AI spend with pricing data you can explain.
          </h1>
          <p className='max-w-xl text-base leading-7 text-slate-300'>
            Enter your stack, generate a deterministic audit, and review
            concrete savings recommendations across your AI tools.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Link
              href='/audit'
              className='inline-flex h-11 items-center justify-center rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            >
              Start audit
            </Link>
            <Link
              href='/spend-report/a3lsiqu1'
              className='inline-flex h-11 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            >
              View report example
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
