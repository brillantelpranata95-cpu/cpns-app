'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

type Task = { id: string; content: string; status: 'pending' | 'completed'; priority: number; created_at: string; completed_at: string | null }
type Session = { id: string; duration_minutes: number; type: string; started_at: string; ended_at: string | null }

export default function Dashboard({ email }: { email: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [task, setTask] = useState('')
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const [{ data: taskData }, { data: sessionData }] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('pomodoro_sessions').select('*').order('started_at', { ascending: false }),
    ])
    setTasks((taskData ?? []) as Task[])
    setSessions((sessionData ?? []) as Session[])
  }, [supabase])

  const finishPomodoro = useCallback(async () => {
    setRunning(false)
    setSaving(true)
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (!user) return router.push('/auth/login')
    const now = new Date()
    const started = new Date(now.getTime() - 25 * 60 * 1000)
    const { data } = await supabase.from('pomodoro_sessions').insert({ user_id: user.id, duration_minutes: 25, type: 'work', started_at: started.toISOString(), ended_at: now.toISOString() }).select().single()
    if (data) setSessions(prev => [data as Session, ...prev])
    setSeconds(25 * 60)
    setSaving(false)
    if ('Notification' in window && Notification.permission === 'granted') new Notification('Pomodoro selesai. Break dulu, jagoan.')
  }, [router, supabase])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (seconds === 0 && running) finishPomodoro()
  }, [finishPomodoro, seconds, running])

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!task.trim()) return
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (!user) return router.push('/auth/login')
    const { data } = await supabase.from('tasks').insert({ user_id: user.id, content: task.trim() }).select().single()
    if (data) setTasks(prev => [data as Task, ...prev])
    setTask('')
  }

  async function toggleTask(t: Task) {
    const completed = t.status !== 'completed'
    const patch = { status: completed ? 'completed' : 'pending', completed_at: completed ? new Date().toISOString() : null }
    await supabase.from('tasks').update(patch).eq('id', t.id)
    setTasks(tasks.map(x => (x.id === t.id ? { ...x, ...patch } as Task : x)))
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const completed = tasks.filter(t => t.status === 'completed').length
  const minutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
  const time = useMemo(() => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`, [seconds])

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <nav className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black">CPNS Focus Hub</h1><p className="text-sm text-slate-400">{email}</p></div>
        <button onClick={logout} className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10">Logout</button>
      </nav>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat title="Pomodoro" value={sessions.length} sub={`${minutes} menit fokus`} />
        <Stat title="Tugas selesai" value={completed} sub={`${tasks.length} total tugas`} />
        <Stat title="Pending" value={tasks.length - completed} sub="target berikutnya" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-xl font-bold">Pomodoro</h2>
          <div className="my-8 text-center text-7xl font-black tabular-nums">{time}</div>
          <div className="grid grid-cols-3 gap-2">
            <button className="rounded-2xl bg-blue-500 py-3 font-bold" onClick={async () => { if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission(); setRunning(!running) }}>{running ? 'Pause' : 'Start'}</button>
            <button className="rounded-2xl bg-white/10 py-3 font-bold" onClick={() => setSeconds(25 * 60)}>Reset</button>
            <button className="rounded-2xl bg-green-500 py-3 font-bold disabled:opacity-50" disabled={saving} onClick={finishPomodoro}>Finish</button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-xl font-bold">Tugas Hari Ini</h2>
          <form onSubmit={addTask} className="mt-4 flex gap-2">
            <input className="flex-1 rounded-2xl border border-white/15 bg-slate-950/60 p-3 outline-none focus:border-blue-500" placeholder="Contoh: Review TWK 30 menit" value={task} onChange={e => setTask(e.target.value)} />
            <button className="rounded-2xl bg-blue-500 px-5 font-bold">Tambah</button>
          </form>
          <div className="mt-5 space-y-2">
            {tasks.length === 0 && <p className="rounded-2xl bg-slate-950/50 p-4 text-slate-400">Belum ada tugas. Tambah satu dulu.</p>}
            {tasks.map(t => <div key={t.id} className="flex items-center gap-3 rounded-2xl bg-slate-950/50 p-4"><input type="checkbox" checked={t.status === 'completed'} onChange={() => toggleTask(t)} className="h-5 w-5" /><span className={`flex-1 ${t.status === 'completed' ? 'text-slate-500 line-through' : ''}`}>{t.content}</span><button className="text-red-300 hover:text-red-200" onClick={() => deleteTask(t.id)}>Hapus</button></div>)}
          </div>
        </div>
      </section>
    </main>
  )
}

function Stat({ title, value, sub }: { title: string; value: number; sub: string }) {
  return <div className="rounded-3xl border border-white/10 bg-white/10 p-6"><p className="text-sm text-slate-400">{title}</p><div className="mt-2 text-4xl font-black">{value}</div><p className="mt-1 text-sm text-slate-400">{sub}</p></div>
}
