# Guia Rapida

## Instalacion en 5 minutos

### Prerrequisitos

- Node.js 18 o superior
- npm

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/ronalc90/invoice-snap.git
cd invoice-snap

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env

# Crear base de datos y generar cliente Prisma
npx prisma generate
npx prisma db push

# (Opcional) Cargar datos de ejemplo
npx tsx prisma/seed.ts

# Iniciar servidor
npm run dev
```

Abrir `http://localhost:3003` en el navegador.

## Primer Uso

### 1. Iniciar sesion

La pagina de login acepta cualquier email. En modo desarrollo, los usuarios se crean automaticamente.

Email de demo: `ronald@invoicesnap.dev`

### 2. Crear un cliente

1. Ir a **Clientes** en el menu lateral
2. Click en **+ Agregar Cliente**
3. Completar nombre y email (obligatorios)
4. Guardar

### 3. Crear una factura

1. Ir a **Facturas** > **+ Nueva Factura**
2. Seleccionar cliente
3. Configurar fechas de emision y vencimiento
4. Agregar items (descripcion, cantidad, precio unitario)
5. Configurar impuesto (opcional)
6. Agregar notas (opcional)
7. Click en **Crear Factura**

### 4. Enviar la factura

1. En el detalle de la factura, click en **Send Invoice**
2. El cliente recibe un email con un link para ver la factura
3. El estado cambia automaticamente a **SENT**

### 5. Rastrear el pago

- Cuando el cliente abre el link, el estado cambia a **VIEWED**
- Cuando se recibe el pago, click en **Mark as Paid**
- Se registra el pago con fecha y monto

## Scripts Disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 3003) |
| `npm run build` | Build de produccion |
| `npm run test` | Tests en modo watch |
| `npm run test:run` | Tests (una ejecucion) |
| `npm run test:coverage` | Tests con cobertura |
| `npm run db:studio` | Prisma Studio (GUI de BD) |
| `npm run db:seed` | Cargar datos de ejemplo |
| `npm run db:push` | Sincronizar esquema con BD |

## Variables de Entorno

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3003"
NEXTAUTH_SECRET="tu-secreto-aqui"

# Email (opcional en desarrollo)
RESEND_API_KEY="re_tu_api_key"

# URL publica
NEXT_PUBLIC_APP_URL="http://localhost:3003"
```

> Sin `RESEND_API_KEY`, los emails se simulan en consola.

## Siguientes Pasos

- Revisar el [Ciclo de Vida de Factura](Ciclo-de-Vida-Factura.md) para entender los estados
- Explorar la [Arquitectura](Arquitectura.md) del proyecto
- Configurar [Autenticacion](Autenticacion.md) con providers OAuth para produccion
