# Autenticacion

## Tecnologia

InvoiceSnap usa **NextAuth v5 (Auth.js)** con las siguientes caracteristicas:

- Estrategia de sesion: **JWT**
- Adapter: **Prisma** (para persistir usuarios y cuentas)
- Provider actual: **Credentials** (email-based)

## Configuracion

La configuracion esta en `src/lib/auth.ts`:

```typescript
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        // Buscar o crear usuario
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) { /* incluir user.id en token */ },
    session({ session, token }) { /* incluir id en session */ },
  },
  pages: {
    signIn: '/login',
  },
};
```

## Estrategia JWT

Se usa JWT en lugar de sesiones de base de datos porque:

1. No requiere query a la BD en cada request
2. Funciona mejor con Server Actions
3. Compatible con edge runtime
4. El token contiene el `user.id` necesario para todas las operaciones

## Flujo de Autenticacion

### Login

1. Usuario ingresa email en `/login`
2. Se llama `signIn('credentials', { email })`
3. El provider `authorize()` busca el usuario por email
4. Si no existe (modo desarrollo), lo crea automaticamente
5. Se genera JWT con `user.id`
6. Redireccion a `/`

### Proteccion de Rutas

El middleware (`src/middleware.ts`) protege todas las rutas excepto:

- `/login` -- Pagina de login
- `/api/auth/*` -- Endpoints de NextAuth
- `/invoices/[id]/preview` -- Vista publica de facturas
- `/api/invoices/[id]/view` -- API publica de facturas

```typescript
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  // Redirigir a /login si no esta autenticado
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});
```

### Verificacion en Server Actions

Cada Server Action verifica la autenticacion al inicio:

```typescript
async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}
```

El `userId` se usa para filtrar datos (cada usuario solo ve sus facturas y clientes).

## Modelo de Datos

NextAuth usa tres tablas gestionadas por Prisma Adapter:

- **User** -- Datos del usuario (email, nombre, datos de negocio)
- **Account** -- Cuentas OAuth vinculadas
- **Session** -- Sesiones (no se usa con JWT, pero el adapter lo crea)
- **VerificationToken** -- Tokens de verificacion de email

## Agregar Providers OAuth (Produccion)

Para produccion, se recomienda agregar providers OAuth:

```typescript
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),
],
```

Variables de entorno necesarias:

```env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

## Seguridad

- `NEXTAUTH_SECRET` debe ser un valor aleatorio seguro en produccion
- Generar con: `openssl rand -base64 32`
- Los tokens JWT expiran automaticamente
- Las rutas protegidas redireccionan a login transparentemente
- Cada operacion verifica que el recurso pertenece al usuario autenticado
