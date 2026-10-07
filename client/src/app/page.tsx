export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white">
        PlaceMate
      </span>
      <h1 className="max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
        Campus Placement &amp; Referral Portal
      </h1>
      <p className="max-w-md text-sm text-slate-500 md:text-base">
        Resume matching, application tracking and batch analytics for students,
        TPC admins and recruiters.
      </p>
      <p className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
        Phase 0 scaffold ready — open TASKS.md and start with TASK-001.
      </p>
    </main>
  );
}
