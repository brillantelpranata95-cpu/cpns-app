'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-black">Masuk</h1>
        <p className="mt-2 text-slate-400">Masuk untuk lanjut belajar.</p>

        {error && <div className="mt-4 rounded-xl bg-red-500/20 p-4 text-sm text-red-300">{error}</div>}

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 p-3 outline-none focus:border-blue-500" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 p-3 outline-none focus:border-blue-500" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="mt-4 rounded-2xl bg-blue-500 py-3 font-bold text-white hover:bg-blue-400 disabled:opacity-50" disabled={loading} type="submit">{loading ? 'Memuat...' : 'Masuk'}</button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">Belum punya akun? <Link className="text-blue-400 font-semibold" href="/auth/register">Daftar</Link></p>
      </div>
    </main>
  )
}
