'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('ronald@invoicesnap.dev');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/');
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4 py-12 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 right-10 w-40 h-40 bg-white/5 rounded-full animate-float" />

      {/* Hero / Descripcion del proyecto */}
      <div className="mb-10 w-full max-w-lg text-center relative z-10 animate-fade-in-up">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary-600 font-bold text-2xl shadow-lg animate-float">
          IS
        </div>
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
          InvoiceSnap
        </h1>
        <p className="mt-3 text-lg font-medium text-primary-200">
          Genera facturas profesionales en 60 segundos
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-primary-200/80">
          Crea facturas profesionales al instante, envialas por email, y rastrea su estado en
          tiempo real. Sabe cuando tu cliente abre la factura y recibe recordatorios automaticos
          de pago. Disenado para freelancers que quieren cobrar mas rapido.
        </p>

        <ul className="mx-auto mt-6 grid max-w-md grid-cols-1 gap-2 text-left text-sm text-white/90 sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold">&#10003;</span>
            Facturacion en 60 segundos
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold">&#10003;</span>
            Seguimiento de estado
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold">&#10003;</span>
            Recordatorios automaticos
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold">&#10003;</span>
            Dashboard de ingresos
          </li>
          <li className="flex items-center gap-2 sm:col-span-2 sm:justify-center">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold">&#10003;</span>
            Exportacion PDF profesional
          </li>
        </ul>

        <p className="mt-4 text-xs text-primary-300/70">
          Borrador &rarr; Enviada &rarr; Vista &rarr; Pagada
        </p>
      </div>

      {/* Formulario de login */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg p-8 shadow-2xl relative z-10 animate-fade-in-up-delay">
        <h2 className="mb-6 text-center text-xl font-bold text-white">Iniciar sesion</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-100">
              Correo electronico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-primary-300 shadow-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              required
              placeholder="tu@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-lg hover:bg-primary-50 disabled:opacity-50 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-5 rounded-lg bg-white/10 border border-white/10 p-3 text-center">
          <p className="text-xs text-primary-200 font-medium mb-1">Credenciales de demo</p>
          <p className="text-sm text-white font-mono">ronald@invoicesnap.dev</p>
        </div>
      </div>

      <p className="mt-6 text-xs text-primary-300/50 relative z-10 animate-fade-in-up-delay-2">
        InvoiceSnap v1.0 &mdash; Facturacion inteligente para freelancers
      </p>
    </div>
  );
}
