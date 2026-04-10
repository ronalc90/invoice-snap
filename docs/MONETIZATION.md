# InvoiceSnap -- Modelo de Monetizacion

Autor: Ronald

---

## Modelo de Negocio: Freemium con Suscripcion Mensual

InvoiceSnap sigue un modelo freemium donde el plan gratuito ofrece funcionalidad suficiente para probar el producto, y los planes de pago desbloquean capacidades profesionales que justifican la inversion para freelancers activos.

---

## Planes y Precios

### Plan Free -- $0/mes

Ideal para freelancers que recien comienzan o facturan ocasionalmente.

| Caracteristica | Limite |
|---|---|
| Facturas por mes | 5 |
| Clientes | 10 |
| Plantillas | 1 (Minimalista) |
| Envio por email | Si |
| Enlace compartible | Si |
| Rastreo de estado | Manual |
| Recordatorios automaticos | No |
| Facturas recurrentes | No |
| Logo personalizado | No |
| Soporte | Documentacion |
| Marca "Powered by InvoiceSnap" | Si (en factura publica) |

### Plan Pro -- $4.99/mes ($49.99/anual - 2 meses gratis)

Para freelancers activos que facturan regularmente y necesitan profesionalismo.

| Caracteristica | Limite |
|---|---|
| Facturas por mes | Ilimitadas |
| Clientes | Ilimitados |
| Plantillas | 3 (todas + personalizacion de colores) |
| Envio por email | Si |
| Enlace compartible | Si |
| Rastreo de estado | Automatico (con tracking de apertura) |
| Recordatorios automaticos | Si (3, 7, 14, 30 dias) |
| Facturas recurrentes | Si |
| Logo personalizado | Si |
| Exportacion PDF | Si |
| Multi-moneda | Si |
| Soporte | Email (respuesta en 24h) |
| Marca "Powered by InvoiceSnap" | No (marca blanca) |

### Plan Business -- $12.99/mes ($129.99/anual - 2 meses gratis)

Para pequenas agencias y equipos que necesitan colaboracion y automatizacion.

| Caracteristica | Limite |
|---|---|
| Todo lo de Pro | Si |
| Usuarios por cuenta | Hasta 5 |
| Roles de usuario | Admin, Contador, Vendedor |
| API publica | Si (10,000 requests/mes) |
| Stripe Connect | Si (pagos directos en factura) |
| Reportes avanzados | Si |
| Exportacion masiva | Si (CSV, Excel) |
| Plantillas premium | Si (10+) |
| Plantillas personalizadas | Si (subir HTML/CSS) |
| Soporte | Email prioritario (respuesta en 4h) |
| Onboarding personalizado | Si (1 sesion de 30 min) |

---

## Estrategia de Precios

### Justificacion del Precio

| Factor | Analisis |
|---|---|
| Competencia directa | FreshBooks: $17-55/mes, Wave: gratis (con comision), PayPal: gratis (con comision) |
| Disposicion a pagar | Encuestas indican que freelancers pagan $5-15/mes por herramientas de productividad |
| Valor generado | Ahorro de 3-5 horas/semana en admin = $75-150/semana para un freelancer promedio |
| Posicionamiento | Precio agresivamente bajo vs FreshBooks para capturar mercado |
| Costo por usuario | ~$0.50/mes (infra + email), margen bruto ~90% en Pro |

### Palancas de Conversion (Free -> Pro)

1. **Limite de 5 facturas/mes**: El trigger principal. Un freelancer activo supera este limite en la segunda semana.
2. **Marca de agua**: "Powered by InvoiceSnap" en facturas del plan Free reduce la percepcion profesional.
3. **Sin logo**: No poder poner su logo incentiva la actualizacion.
4. **Recordatorios manuales**: La frustracion de perseguir pagos manualmente motiva la actualizacion.
5. **Una sola plantilla**: Limita la personalidad de marca del freelancer.

### Estrategia de Descuentos

| Descuento | Condicion | Objetivo |
|---|---|---|
| 2 meses gratis | Pago anual | Incrementar LTV y reducir churn |
| 50% primer mes | Upgrade desde Free despues de 14 dias | Acelerar conversion |
| Referidos | 1 mes gratis por cada referido que pague | Adquisicion organica |
| Estudiantes/ONGs | 30% descuento permanente | Impacto social + boca a boca |

---

## Proyecciones de Ingresos (12 meses)

### Supuestos

- Lanzamiento en Mes 1 con plan Free unicamente.
- Plan Pro disponible desde Mes 2.
- Plan Business disponible desde Mes 5.
- Tasa de conversion Free -> Pro: 5% inicial, creciendo a 8%.
- Tasa de conversion Pro -> Business: 3% inicial, creciendo a 5%.
- Churn mensual Pro: 6%. Churn mensual Business: 4%.
- 80% pago mensual, 20% pago anual.

### Tabla de Proyecciones

| Mes | Usuarios Totales | Free | Pro | Business | MRR (USD) | ARR Acum. |
|---|---|---|---|---|---|---|
| 1 | 200 | 200 | 0 | 0 | $0 | $0 |
| 2 | 450 | 418 | 32 | 0 | $160 | $160 |
| 3 | 800 | 730 | 70 | 0 | $350 | $510 |
| 4 | 1,200 | 1,078 | 122 | 0 | $609 | $1,119 |
| 5 | 1,800 | 1,578 | 195 | 27 | $1,325 | $2,444 |
| 6 | 2,500 | 2,150 | 300 | 50 | $2,148 | $4,592 |
| 7 | 3,200 | 2,700 | 420 | 80 | $3,135 | $7,727 |
| 8 | 4,000 | 3,320 | 570 | 110 | $4,276 | $12,003 |
| 9 | 5,000 | 4,080 | 770 | 150 | $5,795 | $17,798 |
| 10 | 6,000 | 4,800 | 1,000 | 200 | $7,590 | $25,388 |
| 11 | 7,000 | 5,460 | 1,280 | 260 | $9,763 | $35,151 |
| 12 | 8,000 | 6,080 | 1,600 | 320 | $12,136 | $47,287 |

**MRR Mes 12**: $12,136

**Ingresos acumulados Ano 1**: $47,287

### Desglose del MRR por Plan (Mes 12)

| Plan | Usuarios | Precio | MRR |
|---|---|---|---|
| Pro mensual | 1,280 | $4.99 | $6,387 |
| Pro anual | 320 | $4.17/mes | $1,333 |
| Business mensual | 256 | $12.99 | $3,325 |
| Business anual | 64 | $10.83/mes | $693 |
| **Total** | **1,920 pagando** | | **$11,738** |

Nota: La diferencia con la tabla anterior se debe a redondeos y al modelo de conversion progresivo.

---

## CAC y LTV

### Costo de Adquisicion por Cliente (CAC)

| Canal | CAC Estimado | % del Total |
|---|---|---|
| Organico (SEO, boca a boca) | $0 | 40% |
| Content marketing (blog, videos) | $3-5 | 25% |
| Product Hunt / comunidades | $1-2 | 15% |
| Redes sociales (ads) | $8-15 | 10% |
| Google Ads | $12-20 | 10% |
| **Promedio ponderado** | **$4.50** | |

### Valor de Vida del Cliente (LTV)

| Plan | ARPU Mensual | Vida Promedio (meses) | LTV |
|---|---|---|---|
| Free | $0 | 6 | $0 (pero genera referidos) |
| Pro | $4.99 | 14 | $69.86 |
| Business | $12.99 | 18 | $233.82 |
| **Promedio ponderado** | | | **$85.40** |

### Ratio LTV:CAC

| Metrica | Valor | Benchmark |
|---|---|---|
| LTV promedio | $85.40 | |
| CAC promedio | $4.50 | |
| **LTV:CAC** | **18.9x** | Saludable: >3x |
| Payback period | <1 mes | Saludable: <12 meses |

El ratio es saludable gracias al alto componente organico de adquisicion. A medida que se invierta mas en ads pagados, el CAC subira, pero el ratio seguira por encima de 5x.

---

## Canales de Adquisicion

### Canal 1: SEO y Contenido (40% de nuevos usuarios)

- Blog con articulos sobre facturacion freelance, guias de precios, tips financieros.
- Palabras clave objetivo: "crear factura gratis", "generador de facturas", "factura freelancer".
- Landing pages para cada tipo de profesional (facturas para disenadores, facturas para developers, etc.).
- Costo: $200/mes en herramientas SEO + tiempo de escritura.

### Canal 2: Product Hunt y Comunidades (15%)

- Lanzamiento en Product Hunt con preparacion de 4 semanas.
- Publicaciones en comunidades: r/freelance, r/smallbusiness, Indie Hackers, Twitter/X.
- Participacion en foros de Upwork, Fiverr, Freelancer.
- Costo: $0-50/mes.

### Canal 3: Redes Sociales Organicas (10%)

- Contenido en Twitter/X sobre vida freelance y tips de facturacion.
- Videos cortos en TikTok/Reels mostrando la velocidad de creacion.
- LinkedIn para consultores y profesionales B2B.
- Costo: Tiempo de creacion de contenido.

### Canal 4: Referidos (15%)

- Programa: 1 mes gratis de Pro por cada referido que se suscriba.
- Link de referido en cada factura enviada ("Creado con InvoiceSnap").
- Incentivo al referido: 50% de descuento en primer mes.
- Costo: $4.99 por referido convertido.

### Canal 5: Paid Ads (10%)

- Google Ads para keywords de alta intencion ("invoice generator", "factura online").
- Facebook/Instagram ads segmentados a freelancers.
- Retargeting para usuarios Free que no convirtieron.
- Presupuesto inicial: $500/mes, escalando segun ROI.

### Canal 6: Alianzas (10%)

- Integraciones con plataformas freelance (Upwork, Fiverr).
- Partnerships con comunidades de freelancers en LATAM.
- Co-marketing con herramientas complementarias (gestion de proyectos, contabilidad).
- Costo: Variable segun acuerdo.

---

## Costos Operativos Mensuales

### Infraestructura

| Concepto | Mes 1-3 | Mes 4-6 | Mes 7-12 |
|---|---|---|---|
| Vercel (hosting) | $0 (Hobby) | $20 (Pro) | $20 (Pro) |
| Supabase (BD + storage) | $0 (Free) | $25 (Pro) | $25 (Pro) |
| Resend (emails) | $0 (100/dia) | $20 (5,000/mes) | $40 (50,000/mes) |
| Dominio (.com) | $1 (prorrateado) | $1 | $1 |
| Sentry (monitoreo) | $0 (Free) | $0 (Free) | $26 (Team) |
| **Subtotal Infra** | **$1** | **$66** | **$112** |

### Marketing

| Concepto | Mes 1-3 | Mes 4-6 | Mes 7-12 |
|---|---|---|---|
| Herramientas SEO (Ahrefs) | $0 | $99 | $99 |
| Google Ads | $0 | $300 | $500 |
| Social media ads | $0 | $200 | $300 |
| Contenido (freelance writers) | $0 | $200 | $400 |
| **Subtotal Marketing** | **$0** | **$799** | **$1,299** |

### Operaciones

| Concepto | Mes 1-3 | Mes 4-6 | Mes 7-12 |
|---|---|---|---|
| Soporte al cliente (herramienta) | $0 | $0 | $50 |
| Stripe fees (2.9% + $0.30) | $0 | $62 | $220 |
| Otros (legal, contabilidad) | $50 | $100 | $150 |
| **Subtotal Operaciones** | **$50** | **$162** | **$420** |

### Resumen de Costos

| Periodo | Costo Mensual Total |
|---|---|
| Mes 1-3 | $51 |
| Mes 4-6 | $1,027 |
| Mes 7-12 | $1,831 |

---

## Punto de Equilibrio

| Metrica | Valor |
|---|---|
| Costos mensuales (promedio 12 meses) | $1,100 |
| ARPU promedio (usuarios de pago) | $6.50 |
| Usuarios de pago para break even | 169 |
| Mes estimado de break even | **Mes 5-6** |

Con las proyecciones actuales, InvoiceSnap alcanza el punto de equilibrio entre el mes 5 y 6, cuando los ingresos por suscripciones superan los costos operativos.

---

## Proyeccion de Rentabilidad

| Mes | MRR | Costos | Beneficio Neto | Margen |
|---|---|---|---|---|
| 1 | $0 | $51 | -$51 | N/A |
| 3 | $350 | $51 | +$299 | 85% |
| 6 | $2,148 | $1,027 | +$1,121 | 52% |
| 9 | $5,795 | $1,831 | +$3,964 | 68% |
| 12 | $12,136 | $1,831 | +$10,305 | 85% |

**Beneficio neto acumulado Ano 1**: ~$33,000 USD

---

## Fuentes de Ingreso Adicionales (Post-MVP)

### Corto Plazo (Meses 6-12)
1. **Comision por Stripe Connect**: 1% adicional sobre pagos procesados a traves de la plataforma.
2. **Plantillas premium**: Venta individual de plantillas de alta calidad ($2.99-$9.99 c/u).

### Mediano Plazo (Ano 2)
3. **Marketplace de plantillas**: Disenadores pueden vender sus plantillas, InvoiceSnap cobra 30% comision.
4. **API para integradores**: Plan API separado para apps que integren la facturacion de InvoiceSnap.
5. **White-label**: Version sin marca para agencias y plataformas.

### Largo Plazo (Ano 3+)
6. **Servicios financieros**: Adelanto de facturas (invoice factoring), integracion con contabilidad.
7. **Expansion a cotizaciones y contratos**: Ampliar el producto para cubrir todo el ciclo de venta.
