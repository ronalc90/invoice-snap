# InvoiceSnap Wiki

Bienvenido a la wiki de **InvoiceSnap** -- generador de facturas profesionales para freelancers.

## Indice

- [Guia Rapida](Guia-Rapida.md) -- Primeros pasos e instalacion
- [Ciclo de Vida de Factura](Ciclo-de-Vida-Factura.md) -- Estados y transiciones
- [Arquitectura](Arquitectura.md) -- Estructura del proyecto y decisiones tecnicas
- [Generacion PDF](Generacion-PDF.md) -- Como funciona la generacion de facturas en PDF
- [Autenticacion](Autenticacion.md) -- Configuracion de NextAuth v5

## Vision General

InvoiceSnap permite a freelancers:

1. **Crear facturas** con items dinamicos, impuestos y notas personalizadas
2. **Enviarlas por email** al cliente con un link de vista publica
3. **Rastrear el estado** automaticamente (Borrador -> Enviada -> Vista -> Pagada)
4. **Visualizar metricas** de ingresos, pagos pendientes y facturas vencidas

## Stack Tecnologico

- **Next.js 14** con App Router y Server Actions
- **TypeScript** para tipado completo
- **Prisma** como ORM (SQLite dev / PostgreSQL prod)
- **NextAuth v5** para autenticacion
- **Tailwind CSS** para estilos
- **Zod** para validacion
- **React-PDF** para generacion de facturas
- **Resend** para envio de emails
- **Vitest** para testing (49 tests)

## Links Utiles

- [Repositorio en GitHub](https://github.com/ronalc90/invoice-snap)
- [Documentacion tecnica](../ARCHITECTURE.md)
- [Guia de despliegue](../DEPLOYMENT.md)
- [Decisiones tecnicas (ADRs)](../DECISIONS.md)
