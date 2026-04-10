# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

## [1.0.0] - 2024-12-01

### Agregado

- **Dashboard principal** con metricas de ingresos, facturas pendientes, vencidas y total de clientes
- **Grafico de ingresos** de los ultimos 6 meses con barras visuales
- **CRUD completo de facturas** con items dinamicos, impuestos configurables y notas
- **Ciclo de vida de facturas** con maquina de estados: DRAFT, SENT, VIEWED, PAID, OVERDUE
- **Envio de facturas por email** via Resend con HTML template profesional
- **Vista publica de facturas** accesible sin autenticacion para clientes
- **Tracking automatico** de visualizacion de facturas (SENT -> VIEWED)
- **Registro de pagos** con metodo y referencia
- **CRUD completo de clientes** con busqueda por nombre, email y empresa
- **Generacion de PDF** profesional con React-PDF (plantilla A4)
- **Autenticacion** con NextAuth v5, estrategia JWT y Prisma Adapter
- **Validacion** con Zod en cliente y servidor (schemas compartidos)
- **Middleware** de proteccion de rutas con soporte para rutas publicas
- **Busqueda y filtros** por estado en la lista de facturas
- **Numeracion automatica** de facturas con formato INV-YYYY-NNNN
- **Multi-moneda** con formato internacionalizado
- **49 tests** cubriendo calculos, ciclo de vida, transiciones de estado, validaciones y utilidades
- **Responsive design** con Tailwind CSS y paleta personalizada
- **Documentacion completa** con ARCHITECTURE.md, API.md, DECISIONS.md, DEPLOYMENT.md
- **GitHub Actions CI** con lint, test y build
- **Docker Compose** para PostgreSQL en produccion

### Stack Inicial

- Next.js 14 (App Router)
- TypeScript 5.7
- Prisma 5.22 (SQLite dev / PostgreSQL prod)
- NextAuth v5
- Tailwind CSS 3.4
- Zod 3.23
- Resend
- React-PDF 4.1
- Recharts 2.15
- Vitest
