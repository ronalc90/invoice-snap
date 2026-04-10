# Contribuir a InvoiceSnap

Gracias por tu interes en contribuir a InvoiceSnap. Esta guia explica como participar en el desarrollo del proyecto.

## Requisitos Previos

- Node.js 18+
- npm
- Git

## Configuracion del Entorno

```bash
# 1. Fork y clonar el repositorio
git clone https://github.com/TU-USUARIO/invoice-snap.git
cd invoice-snap

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Crear base de datos
npx prisma generate
npx prisma db push

# 5. Iniciar servidor de desarrollo
npm run dev
```

## Flujo de Trabajo

### 1. Crear un issue

Antes de comenzar a trabajar, abre un issue describiendo:
- Que problema resuelve o que funcionalidad agrega
- Propuesta de solucion (si aplica)

### 2. Crear una rama

```bash
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/nombre-del-bug
```

### 3. Desarrollar

- Seguir las convenciones de codigo existentes
- Agregar tests para nuevas funcionalidades
- Mantener los Server Actions en `src/app/actions/`
- Componentes client interactivos con `'use client'`
- Validaciones con Zod en `src/lib/validations.ts`

### 4. Tests

```bash
# Ejecutar tests
npm run test:run

# Verificar tipos
npx tsc --noEmit
```

Todos los tests deben pasar antes de crear un PR.

### 5. Commit

```bash
git add .
git commit -m "feat: descripcion breve del cambio"
```

**Convenciones de commit:**
- `feat:` nueva funcionalidad
- `fix:` correccion de bug
- `docs:` documentacion
- `refactor:` refactorizacion sin cambio funcional
- `test:` agregar o modificar tests
- `chore:` mantenimiento, dependencias

### 6. Pull Request

```bash
git push origin feature/nombre-descriptivo
```

Crear un Pull Request en GitHub con:
- Titulo descriptivo
- Descripcion del cambio
- Issue relacionado (#numero)
- Screenshots si hay cambios visuales

## Estructura del Proyecto

```
src/
  app/actions/     -- Server Actions (logica de negocio)
  app/api/         -- API Routes (solo endpoints publicos)
  components/      -- Componentes React
  lib/             -- Utilidades, auth, DB, validaciones
  types/           -- Tipos TypeScript
```

## Guias de Estilo

- **TypeScript** -- tipos explicitos, evitar `any`
- **Componentes** -- Server Components por defecto, `'use client'` solo cuando sea necesario
- **Validacion** -- siempre usar Zod en Server Actions
- **Nombres** -- descriptivos, sin abreviaturas
- **Formateo** -- 2 espacios, single quotes, trailing commas

## Reporte de Bugs

Abrir un issue con:
- Descripcion del bug
- Pasos para reproducir
- Comportamiento esperado vs actual
- Version de Node.js y navegador

## Licencia

Al contribuir, aceptas que tus contribuciones se licenciaran bajo la Licencia MIT del proyecto.
