'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Correo o contrasena incorrectos');
    }

    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, businessName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al crear la cuenta');
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const loginResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.ok) {
        router.push('/');
        router.refresh();
      } else {
        setSuccess('Cuenta creada. Inicia sesion con tus credenciales.');
        switchTab('login');
      }
    } catch {
      setError('Error de conexion. Intenta de nuevo.');
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

      {/* Formulario login / registro */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg p-8 shadow-2xl relative z-10 animate-fade-in-up-delay">
        {/* Tabs */}
        <div className="flex mb-6 rounded-lg bg-white/10 p-1">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Iniciar sesion
          </button>
          <button
            type="button"
            onClick={() => switchTab('register')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Crear cuenta
          </button>
        </div>

        {/* Error / Success messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 border border-red-400/30 px-4 py-2.5 text-sm text-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-500/20 border border-green-400/30 px-4 py-2.5 text-sm text-green-100">
            {success}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-primary-100">
                Correo electronico
              </label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-primary-300 shadow-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                required
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-primary-100">
                Contrasena
              </label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-primary-300 shadow-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                required
                placeholder="Tu contrasena"
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
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-primary-100">
                Nombre completo
              </label>
              <input
                type="text"
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-primary-300 shadow-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                required
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="reg-business" className="block text-sm font-medium text-primary-100">
                Nombre del negocio
                <span className="ml-1 text-primary-300/60 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                id="reg-business"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-primary-300 shadow-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Mi Empresa S.A."
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-primary-100">
                Correo electronico
              </label>
              <input
                type="email"
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-primary-300 shadow-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                required
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-primary-100">
                Contrasena
              </label>
              <input
                type="password"
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-primary-300 shadow-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                required
                minLength={8}
                placeholder="Minimo 8 caracteres"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-lg hover:bg-primary-50 disabled:opacity-50 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-xs text-primary-300/50 relative z-10 animate-fade-in-up-delay-2">
        InvoiceSnap v1.0 &mdash; Facturacion inteligente para freelancers
      </p>
    </div>
  );
}
