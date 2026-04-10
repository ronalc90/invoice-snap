# Runbook Operacional - InvoiceSnap

Guia de procedimientos operacionales para la gestion y resolucion de incidentes en InvoiceSnap.

## Informacion del Sistema

| Atributo | Valor |
|---|---|
| Aplicacion | InvoiceSnap |
| Framework | Next.js 14 |
| Puerto | 3003 |
| Healthcheck | `GET /` |
| Metricas | `GET /api/metrics` |
| Base de datos | SQLite (dev) / PostgreSQL (prod) |
| Deploy | Vercel / Docker / Kubernetes |

## Procedimientos de Emergencia

### 1. La aplicacion no responde

**Sintomas**: HTTP 502/503, healthcheck falla.

**Diagnostico**:

```bash
# Verificar estado del contenedor
docker compose ps
docker compose logs app --tail=50

# En Kubernetes
kubectl get pods -n invoicesnap
kubectl describe pod <pod-name> -n invoicesnap
kubectl logs <pod-name> -n invoicesnap --tail=50
```

**Resolucion**:

```bash
# Docker: reiniciar la aplicacion
docker compose restart app

# Kubernetes: reiniciar el deployment
kubectl rollout restart deployment invoicesnap -n invoicesnap
```

### 2. Base de datos no disponible

**Sintomas**: Errores de conexion Prisma, timeouts en consultas.

**Diagnostico**:

```bash
# Docker: verificar PostgreSQL
docker compose ps postgres
docker compose logs postgres --tail=30

# Verificar conectividad
docker compose exec postgres pg_isready -U invoicesnap
```

**Resolucion**:

```bash
# Reiniciar PostgreSQL
docker compose restart postgres

# Verificar espacio en disco
docker system df

# Si hay corrupcion, restaurar desde backup
# (ver seccion de Backups)
```

### 3. Pipeline CI/CD falla

**Sintomas**: GitHub Actions marcado como fallido.

**Diagnostico**:

1. Ir a la pestana Actions del repositorio.
2. Identificar el job que fallo.
3. Revisar los logs del step especifico.

**Causas comunes**:

| Error | Causa | Solucion |
|---|---|---|
| `npm ci` falla | Lockfile desactualizado | Ejecutar `npm install` localmente y commitear `package-lock.json` |
| Tests fallan | Codigo roto o test fragil | Corregir el test o el codigo |
| Docker build falla | Dependencia incompatible | Verificar versiones en Dockerfile |
| Vercel deploy falla | Token expirado | Regenerar `VERCEL_TOKEN` en Settings > Secrets |

### 4. Alto uso de memoria

**Sintomas**: Pod reiniciandose (OOMKilled), respuestas lentas.

**Diagnostico**:

```bash
# Kubernetes
kubectl top pods -n invoicesnap
kubectl describe pod <pod-name> -n invoicesnap | grep -A5 "Resources"

# Docker
docker stats invoicesnap-app
```

**Resolucion**:

```bash
# Aumentar limites en deployment.yml
# resources.limits.memory: 1Gi

# Aplicar cambios
kubectl apply -f infra/kubernetes/deployment.yml
```

### 5. Certificado SSL expirado

**Sintomas**: Errores de certificado en el navegador.

**Diagnostico**:

```bash
# Verificar certificado
kubectl get certificate -n invoicesnap
kubectl describe certificate invoicesnap-tls -n invoicesnap
```

**Resolucion**:

```bash
# Forzar renovacion con cert-manager
kubectl delete certificate invoicesnap-tls -n invoicesnap
# cert-manager lo regenerara automaticamente
```

## Despliegue

### Deploy a Produccion (Vercel)

El deploy ocurre automaticamente al hacer push a `main`.

**Deploy manual**:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy de produccion
vercel --prod
```

### Rollback

**Vercel**:

1. Ir a Vercel Dashboard > Deployments.
2. Seleccionar el deploy anterior que funcionaba.
3. Click en "Promote to Production".

**Kubernetes**:

```bash
# Ver historial de rollouts
kubectl rollout history deployment invoicesnap -n invoicesnap

# Rollback al revision anterior
kubectl rollout undo deployment invoicesnap -n invoicesnap

# Rollback a una revision especifica
kubectl rollout undo deployment invoicesnap -n invoicesnap --to-revision=2
```

## Backups

### Base de Datos PostgreSQL

```bash
# Backup manual
docker compose exec postgres pg_dump -U invoicesnap invoicesnap > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
cat backup_YYYYMMDD_HHMMSS.sql | docker compose exec -T postgres psql -U invoicesnap invoicesnap
```

### Backup Automatizado (cron)

```bash
# Agregar al crontab del servidor
# Backup diario a las 2:00 AM
0 2 * * * docker compose -f /path/to/docker-compose.yml exec -T postgres pg_dump -U invoicesnap invoicesnap | gzip > /backups/invoicesnap_$(date +\%Y\%m\%d).sql.gz
```

## Monitoreo

### Endpoints de Salud

| Endpoint | Descripcion |
|---|---|
| `GET /` | Healthcheck basico |
| `GET /api/metrics` | Metricas Prometheus |

### Acceso a Dashboards

| Herramienta | URL | Credenciales |
|---|---|---|
| Grafana | http://localhost:3001 | admin / invoicesnap |
| Prometheus | http://localhost:9090 | - |

### Alertas Recomendadas

| Metrica | Umbral | Accion |
|---|---|---|
| CPU > 80% | 5 min sostenido | Revisar procesos, escalar pods |
| Memoria > 85% | 3 min sostenido | Investigar leaks, aumentar limites |
| Error rate > 5% | 2 min sostenido | Revisar logs, posible rollback |
| Latencia P99 > 3s | 5 min sostenido | Optimizar consultas, revisar DB |

## Tareas de Mantenimiento

### Semanal

- [ ] Revisar reportes de seguridad en GitHub Actions
- [ ] Verificar espacio en disco de volumes Docker
- [ ] Revisar metricas de rendimiento en Grafana

### Mensual

- [ ] Actualizar dependencias (`npm update`)
- [ ] Ejecutar `npm audit fix`
- [ ] Rotar secretos y API keys
- [ ] Verificar backups restaurando en ambiente de prueba

### Trimestral

- [ ] Actualizar versiones base de Docker (Node.js, PostgreSQL)
- [ ] Revisar y optimizar queries de Prisma
- [ ] Auditar permisos y accesos

## Contacto

- **Autor**: Ronald
- **Repositorio**: https://github.com/ronalc90/invoice-snap
