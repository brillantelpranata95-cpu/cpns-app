import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
      <nav className="flex items-center justify-between">
        <div className="text-xl font-bold">CPNS Focus Hub</div>
        <Link className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950" href={data.user ? '/dashboard' : '/auth/login'}>
          {data.user ? 'Dashboard' : 'Masuk'}
        </Link>
      </nav>

      <section className="grid flex-1 items-center gap-10 py-16 md:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-white/15 px-3 py-1 text-sm text-blue-200">Bukan drill soal. Ini sistem belajarnya.</p>
          <h1 className="text-5xl font-black tracking-tight md:text-7xl">Belajar CPNS lebih fokus, rapi, terukur.</h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">Pomodoro timer, task harian, progress tracker. Dibuat untuk pejuang CPNS yang butuh konsistensi — bukan cuma bank soal.</p>
          <div className="mt-8 flex gap-3">
            <Link className="rounded-2xl bg-blue-500 px-6 py-3 font-bold text-white hover:bg-blue-400" href="/auth/register">Mulai Gratis</Link>
            <Link className="rounded-2xl border border-white/15 px-6 py-3 font-bold text-white hover:bg-white/10" href="/auth/login">Login</Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          {[
            ['⏱️', 'Pomodoro', 'Fokus 25 menit, break otomatis.'],
            ['✅', 'Study Tasks', 'Target harian jelas, bisa dicentang.'],
            ['📊', 'Progress', 'Lihat sesi, tugas selesai, streak.'],
          ].map(([icon, title, body]) => (
            <div key={title} className="mb-4 rounded-2xl bg-slate-950/60 p-5 last:mb-0">
              <div className="text-3xl">{icon}</div>
              <h2 className="mt-3 text-xl font-bold">{title}</h2>
              <p className="mt-1 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
