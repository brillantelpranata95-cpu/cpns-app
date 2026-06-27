'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-black">Daftar Akun</h1>
        <p className="mt-2 text-slate-400">Mulai perjalan belajar CPNS kamu.</p>

        {error && <div className="mt-4 rounded-xl bg-red-500/20 p-4 text-sm text-red-300">{error}</div>}
        {success && <div className="mt-4 rounded-xl bg-green-500/20 p-4 text-sm text-green-300">Pendaftaran berhasil! Cek email untuk verifikasi.</div>}

        <form onSubmit={handleRegister} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 p-3 outline-none focus:border-blue-500" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 p-3 outline-none focus:border-blue-500" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="mt-4 rounded-2xl bg-blue-500 py-3 font-bold text-white hover:bg-blue-400 disabled:opacity-50" disabled={loading} type="submit">{loading ? 'Memuat...' : 'Daftar'}</button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">Sudah punya akun? <Link className="text-blue-400 font-semibold" href="/auth/login">Masuk</Link></p>
      </div>
    </main>
  )
}
