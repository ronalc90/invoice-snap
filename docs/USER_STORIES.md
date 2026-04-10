# InvoiceSnap -- Historias de Usuario

Autor: Ronald

---

## Formato

Cada historia de usuario sigue el formato estandar:

**Como** [tipo de usuario], **quiero** [accion], **para** [beneficio].

Prioridades: P0 (MVP critico), P1 (MVP importante), P2 (post-MVP).

---

## Epica 1: Gestion de Clientes

### US-1.1: Registrar un nuevo cliente
- **Como** freelancer, **quiero** registrar los datos de un nuevo cliente, **para** poder facturarle sin tener que ingresar sus datos cada vez.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Puedo ingresar nombre, email, empresa, telefono, direccion completa, NIT/RFC.
  - El email es obligatorio y unico dentro de mis clientes.
  - El nombre es obligatorio.
  - Los demas campos son opcionales.
  - Al guardar, el cliente aparece en mi lista de clientes.
  - Se muestra mensaje de confirmacion al guardar.
  - Si el email ya existe para otro cliente mio, se muestra error descriptivo.

### US-1.2: Ver lista de clientes
- **Como** freelancer, **quiero** ver todos mis clientes en una lista organizada, **para** encontrar rapidamente al cliente que necesito.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - La lista muestra nombre, email, empresa y numero de facturas asociadas.
  - Puedo buscar clientes por nombre o email.
  - La lista esta paginada (20 clientes por pagina).
  - Puedo ordenar por nombre o por fecha de creacion.
  - Si no tengo clientes, se muestra un estado vacio con boton para crear el primero.

### US-1.3: Editar datos de un cliente
- **Como** freelancer, **quiero** actualizar los datos de un cliente existente, **para** mantener la informacion actualizada.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Puedo editar todos los campos del cliente.
  - Los cambios no afectan facturas ya emitidas (snapshot de datos en la factura).
  - Se muestra confirmacion al guardar los cambios.
  - La validacion de email unico se mantiene (excluyendo el cliente actual).

### US-1.4: Eliminar un cliente
- **Como** freelancer, **quiero** eliminar un cliente que ya no necesito, **para** mantener mi lista limpia.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Se muestra dialogo de confirmacion antes de eliminar.
  - Si el cliente tiene facturas asociadas, se muestra advertencia y se requiere confirmacion adicional.
  - Al eliminar un cliente con facturas, las facturas se mantienen (con los datos del cliente embebidos).
  - El cliente desaparece de la lista inmediatamente.

### US-1.5: Ver detalle de un cliente
- **Como** freelancer, **quiero** ver toda la informacion de un cliente junto con su historial de facturas, **para** tener contexto completo antes de facturar.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Se muestran todos los datos del cliente.
  - Se muestra la lista de facturas asociadas con estado y monto.
  - Se muestra un resumen: total facturado, total cobrado, total pendiente.
  - Desde esta vista puedo crear una nueva factura para este cliente.

### US-1.6: Crear cliente rapido desde factura
- **Como** freelancer, **quiero** crear un nuevo cliente directamente desde el formulario de factura, **para** no interrumpir mi flujo de creacion.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - En el formulario de factura, al buscar un cliente que no existe, aparece la opcion "Crear nuevo cliente".
  - Se abre un modal con el formulario simplificado (nombre y email minimo).
  - Al guardar, el cliente queda seleccionado automaticamente en la factura.
  - El cliente se guarda en la base de datos para uso futuro.

---

## Epica 2: Creacion de Facturas

### US-2.1: Crear una factura nueva
- **Como** freelancer, **quiero** crear una factura con multiples items de servicio, **para** cobrar por mi trabajo de forma profesional.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Puedo seleccionar un cliente existente o crear uno nuevo.
  - Puedo agregar multiples items con descripcion, cantidad y precio unitario.
  - El monto de cada item se calcula automaticamente (cantidad x precio).
  - El subtotal se calcula como la suma de todos los items.
  - Puedo aplicar un porcentaje de impuesto (el monto se calcula automaticamente).
  - Puedo aplicar un porcentaje de descuento (el monto se calcula automaticamente).
  - El total se calcula como: subtotal + impuesto - descuento.
  - Puedo agregar notas y terminos de pago.
  - La fecha de emision es hoy por defecto (editable).
  - La fecha de vencimiento es obligatoria.
  - La factura se crea en estado "borrador".
  - Se genera automaticamente un numero de factura secuencial.

### US-2.2: Editar una factura en borrador
- **Como** freelancer, **quiero** editar una factura que aun no he enviado, **para** corregir errores o agregar items.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Solo se pueden editar facturas en estado "borrador".
  - Puedo modificar todos los campos: cliente, items, impuestos, descuento, fechas, notas.
  - Puedo agregar o eliminar items.
  - Los calculos se actualizan en tiempo real al editar.
  - Se muestra confirmacion al guardar cambios.

### US-2.3: Eliminar una factura
- **Como** freelancer, **quiero** eliminar una factura que ya no necesito, **para** mantener mi lista limpia.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Solo se pueden eliminar facturas en estado "borrador".
  - Las facturas enviadas, pagadas o vencidas no se pueden eliminar (solo cancelar).
  - Se muestra dialogo de confirmacion antes de eliminar.
  - Al eliminar, la factura desaparece de la lista permanentemente.

### US-2.4: Duplicar una factura
- **Como** freelancer, **quiero** duplicar una factura existente, **para** crear rapidamente una factura similar para el mismo o diferente cliente.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Puedo duplicar cualquier factura independientemente de su estado.
  - La factura duplicada se crea como "borrador" con un nuevo numero.
  - Se copian: cliente, items, impuestos, descuento, notas, terminos, plantilla.
  - Se actualizan: numero de factura, fecha de emision (hoy), fecha de vencimiento.
  - Se abre el formulario de edicion con la factura duplicada.

### US-2.5: Ver lista de facturas con filtros
- **Como** freelancer, **quiero** ver todas mis facturas con opcion de filtrar por estado, **para** gestionar mi facturacion eficientemente.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - La lista muestra: numero, cliente, fecha, monto total, estado.
  - Puedo filtrar por estado: todos, borrador, enviada, vista, pagada, parcialmente pagada, vencida, cancelada.
  - Puedo buscar por numero de factura o nombre de cliente.
  - La lista esta paginada (20 facturas por pagina).
  - Los estados se muestran con colores distintivos.
  - Puedo ordenar por fecha, monto o estado.

### US-2.6: Ver detalle completo de una factura
- **Como** freelancer, **quiero** ver toda la informacion de una factura incluyendo historial de pagos y envios, **para** tener visibilidad completa.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Se muestra la factura con todos sus datos y items.
  - Se muestra el historial de envios (fecha, canal, estado).
  - Se muestra el historial de pagos (fecha, monto, metodo).
  - Se muestran las acciones disponibles segun el estado (enviar, marcar pagada, etc.).
  - Se muestra la vista previa de la factura con la plantilla seleccionada.

### US-2.7: Cancelar una factura
- **Como** freelancer, **quiero** cancelar una factura que ya envie pero que ya no es valida, **para** mantener un registro limpio.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Puedo cancelar facturas en estado enviada, vista o vencida.
  - No se pueden cancelar facturas pagadas o parcialmente pagadas.
  - Se muestra dialogo de confirmacion con advertencia.
  - Al cancelar, el estado cambia a "cancelada" y se registra la fecha.
  - La factura cancelada sigue visible en la lista pero no cuenta en las metricas.

---

## Epica 3: Plantillas de Factura

### US-3.1: Seleccionar plantilla al crear factura
- **Como** freelancer, **quiero** elegir entre diferentes plantillas al crear una factura, **para** dar una imagen profesional acorde a mi marca.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Se muestran las plantillas disponibles segun mi plan (1 en Free, 3 en Pro).
  - Cada plantilla tiene una miniatura de vista previa.
  - Al seleccionar una plantilla, la vista previa de la factura se actualiza.
  - La plantilla seleccionada se guarda con la factura.
  - Las plantillas del plan Pro muestran un badge de "Pro" en el plan Free.

### US-3.2: Vista previa en tiempo real
- **Como** freelancer, **quiero** ver como quedara mi factura mientras la creo, **para** asegurarme de que se ve profesional antes de enviarla.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - La vista previa se muestra al lado del formulario (desktop) o debajo (mobile).
  - La vista previa se actualiza en tiempo real al modificar cualquier campo.
  - La vista previa refleja la plantilla seleccionada.
  - La vista previa incluye el logo del usuario si lo ha subido.
  - Puedo hacer zoom in/out en la vista previa.

### US-3.3: Personalizar colores de la plantilla
- **Como** freelancer con plan Pro, **quiero** personalizar los colores de la plantilla, **para** que mis facturas reflejen mi marca personal.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Puedo seleccionar un color primario desde un color picker.
  - El color se aplica a los acentos de la plantilla (headers, bordes, botones).
  - El color se guarda en mi perfil y se aplica a todas las facturas nuevas.
  - En el plan Free, el selector de color muestra un badge "Pro" y redirige al upgrade.

### US-3.4: Subir logo personalizado
- **Como** freelancer con plan Pro, **quiero** subir mi logo para que aparezca en mis facturas, **para** dar una imagen mas profesional y de marca.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Puedo subir una imagen en formato PNG, JPG o SVG.
  - El tamano maximo es 2MB.
  - La imagen se muestra en la vista previa inmediatamente despues de subir.
  - El logo aparece en el header de todas mis facturas.
  - Puedo eliminar el logo y volver al texto del nombre de empresa.
  - En el plan Free, el area de logo muestra "Powered by InvoiceSnap".

---

## Epica 4: Envio y Comparticion

### US-4.1: Enviar factura por email
- **Como** freelancer, **quiero** enviar una factura directamente al email de mi cliente, **para** que la reciba sin tener que adjuntar archivos manualmente.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Puedo enviar la factura con un clic desde el detalle de la factura.
  - El email se envia al email registrado del cliente.
  - El email incluye: asunto personalizado, mensaje del freelancer, boton para ver factura, PDF adjunto.
  - Al enviar, el estado cambia de "borrador" a "enviada".
  - Se registra la fecha y hora de envio.
  - Puedo reenviar una factura ya enviada.
  - Se muestra confirmacion de envio exitoso.

### US-4.2: Generar enlace compartible
- **Como** freelancer, **quiero** generar un enlace unico para mi factura, **para** compartirla por WhatsApp u otros canales.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Se genera un enlace unico con token aleatorio (ej: invoicesnap.com/invoice/abc123xyz).
  - El enlace se puede copiar al portapapeles con un clic.
  - Se muestra boton para compartir directamente por WhatsApp (abre wa.me con el link).
  - La pagina del enlace muestra la factura con la plantilla seleccionada.
  - La pagina es accesible sin autenticacion.
  - El enlace no expira (es el recibo permanente del cliente).

### US-4.3: Vista publica de factura
- **Como** cliente que recibio una factura, **quiero** ver la factura en una pagina profesional, **para** entender que debo pagar y como.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - La pagina publica muestra la factura completa con la plantilla del freelancer.
  - Se muestra el nombre del freelancer, su empresa y datos de contacto.
  - Se muestran los items, subtotal, impuestos, descuento y total.
  - Se muestra la fecha de vencimiento de forma prominente.
  - Se muestra el estado actual de la factura.
  - Si Stripe Connect esta habilitado, se muestra un boton "Pagar ahora" (Fase 3).
  - La pagina tiene metadatos Open Graph para previsualizacion en WhatsApp/redes.

### US-4.4: Rastrear apertura de email
- **Como** freelancer, **quiero** saber si mi cliente abrio el email con la factura, **para** tener visibilidad del proceso.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Cuando el cliente abre el email, se registra la apertura automaticamente.
  - El estado de la factura cambia de "enviada" a "vista".
  - En el detalle de la factura, se muestra la fecha y hora de la primera apertura.
  - En la lista de facturas, el badge cambia de "Enviada" a "Vista".

### US-4.5: Personalizar mensaje de envio
- **Como** freelancer, **quiero** personalizar el mensaje que acompana la factura por email, **para** dar un toque personal a la comunicacion.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Antes de enviar, se muestra un campo de texto para el mensaje personalizado.
  - El mensaje tiene un texto predeterminado que puedo editar.
  - El mensaje aparece en el cuerpo del email sobre la factura.
  - Puedo guardar un mensaje predeterminado en mi configuracion.

---

## Epica 5: Rastreo de Pagos

### US-5.1: Marcar factura como pagada
- **Como** freelancer, **quiero** marcar una factura como pagada cuando recibo el dinero, **para** llevar control de mis cobros.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Puedo marcar como pagada desde el detalle de la factura.
  - Al marcar como pagada, debo ingresar: fecha de pago, metodo de pago.
  - Los metodos disponibles son: transferencia bancaria, efectivo, cheque, tarjeta de credito, PayPal, Stripe, otro.
  - Puedo agregar una referencia (ej: numero de transferencia) y notas opcionales.
  - El monto se establece automaticamente al total pendiente (editable para pago parcial).
  - El estado cambia a "pagada" y se registra la fecha.

### US-5.2: Registrar pago parcial
- **Como** freelancer, **quiero** registrar un pago parcial, **para** reflejar cuando un cliente paga en cuotas.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Puedo registrar un pago por un monto menor al total pendiente.
  - El estado cambia a "parcialmente pagada".
  - El monto pagado y el monto pendiente se actualizan automaticamente.
  - Puedo registrar multiples pagos parciales hasta completar el total.
  - Cuando la suma de pagos iguala o supera el total, el estado cambia a "pagada".

### US-5.3: Ver historial de pagos
- **Como** freelancer, **quiero** ver todos los pagos registrados de una factura, **para** tener un registro completo de los cobros.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - En el detalle de la factura, se muestra la lista de pagos con fecha, monto, metodo y referencia.
  - Se muestra una barra de progreso visual del porcentaje pagado.
  - Se muestra el monto total pagado y el monto pendiente.
  - Puedo eliminar un registro de pago si fue un error (con confirmacion).

### US-5.4: Factura marcada automaticamente como vencida
- **Como** freelancer, **quiero** que mis facturas se marquen automaticamente como vencidas, **para** no tener que revisar fechas manualmente.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Cada dia a las 6:00 AM, un proceso revisa las facturas pendientes.
  - Las facturas con fecha de vencimiento pasada y estado en (enviada, vista, parcialmente pagada) se marcan como "vencida".
  - El badge de estado cambia a rojo con "Vencida".
  - Se muestra un indicador de cuantos dias lleva vencida.

### US-5.5: Eliminar registro de pago
- **Como** freelancer, **quiero** eliminar un registro de pago erroneo, **para** corregir errores en mis registros.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Puedo eliminar un pago desde el historial de pagos de la factura.
  - Se muestra dialogo de confirmacion.
  - Al eliminar, se recalculan el monto pagado y el monto pendiente.
  - El estado de la factura se actualiza segun corresponda.

---

## Epica 6: Facturas Recurrentes

### US-6.1: Crear factura recurrente (Pro)
- **Como** freelancer con plan Pro, **quiero** configurar una factura para que se genere automaticamente cada mes, **para** automatizar la facturacion de servicios fijos.
- **Prioridad**: P2
- **Criterios de aceptacion**:
  - Al crear una factura, puedo activar la opcion "Recurrente".
  - Puedo configurar la frecuencia: semanal, quincenal, mensual, trimestral, anual.
  - Puedo establecer una fecha de inicio y una fecha de fin (o "sin fin").
  - La factura recurrente genera automaticamente una nueva factura en la fecha programada.
  - La nueva factura hereda: cliente, items, plantilla, impuestos, terminos.
  - La nueva factura se crea como "borrador" (para revision) o se envia automaticamente segun configuracion.
  - Puedo pausar o cancelar la recurrencia en cualquier momento.

### US-6.2: Ver facturas recurrentes activas
- **Como** freelancer, **quiero** ver una lista de mis facturas recurrentes, **para** gestionar mis cobros automaticos.
- **Prioridad**: P2
- **Criterios de aceptacion**:
  - Se muestra una seccion separada con las facturas recurrentes.
  - Cada entrada muestra: cliente, monto, frecuencia, proxima generacion, estado (activa/pausada).
  - Puedo acceder al historial de facturas generadas por cada recurrencia.

### US-6.3: Editar factura recurrente
- **Como** freelancer, **quiero** modificar los datos de una factura recurrente, **para** reflejar cambios en mis servicios o precios.
- **Prioridad**: P2
- **Criterios de aceptacion**:
  - Puedo editar items, montos, frecuencia y fechas.
  - Los cambios se aplican a la proxima factura a generar (no retroactivos).
  - Se muestra un resumen de los cambios antes de confirmar.

---

## Epica 7: Dashboard y Reportes

### US-7.1: Ver resumen financiero
- **Como** freelancer, **quiero** ver un resumen de mi situacion financiera actual, **para** tomar decisiones informadas.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - El dashboard muestra 4 tarjetas principales:
    - Total facturado (monto acumulado).
    - Pendiente de cobro (facturas enviadas + vistas + parcialmente pagadas).
    - Cobrado (facturas pagadas).
    - Vencido (facturas vencidas).
  - Los montos se muestran en la moneda configurada.
  - Cada tarjeta muestra el cambio porcentual vs periodo anterior.

### US-7.2: Ver grafico de ingresos
- **Como** freelancer, **quiero** ver un grafico de mis ingresos en el tiempo, **para** identificar tendencias y estacionalidad.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Se muestra un grafico de barras o lineas con ingresos mensuales.
  - El periodo predeterminado son los ultimos 6 meses.
  - Puedo cambiar el periodo (3, 6, 12 meses).
  - El grafico distingue entre montos cobrados y pendientes.
  - Se muestran los ejes con etiquetas claras (meses y montos).

### US-7.3: Ver facturas recientes
- **Como** freelancer, **quiero** ver mis ultimas facturas en el dashboard, **para** tener acceso rapido a la actividad reciente.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Se muestran las ultimas 5 facturas con numero, cliente, monto y estado.
  - Cada factura es un enlace a su detalle.
  - Se muestra un enlace "Ver todas" que lleva a la lista completa.

### US-7.4: Ver clientes con pagos pendientes
- **Como** freelancer, **quiero** ver una lista de clientes que me deben dinero, **para** priorizar el seguimiento de cobros.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Se muestra la lista de clientes con facturas pendientes o vencidas.
  - Cada entrada muestra: nombre del cliente, monto total pendiente, facturas pendientes.
  - La lista esta ordenada por monto pendiente (mayor a menor).
  - Puedo hacer clic en cada cliente para ver sus facturas pendientes.

### US-7.5: Acciones rapidas desde el dashboard
- **Como** freelancer, **quiero** acceder a las acciones mas comunes desde el dashboard, **para** ser mas productivo.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Se muestran botones de accion rapida: "Nueva factura", "Nuevo cliente".
  - Los botones son visibles y accesibles sin hacer scroll.
  - Al hacer clic, se abre el formulario correspondiente.

### US-7.6: Filtrar dashboard por periodo
- **Como** freelancer, **quiero** filtrar las metricas del dashboard por rango de fechas, **para** analizar periodos especificos.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Se muestra un selector de periodo con opciones predefinidas: esta semana, este mes, ultimo trimestre, este ano, personalizado.
  - Al cambiar el periodo, todas las metricas se actualizan.
  - El filtro personalizado permite seleccionar fecha de inicio y fin.

### US-7.7: Exportar resumen en CSV
- **Como** freelancer, **quiero** exportar un resumen de mis facturas en CSV, **para** importarlo en mi herramienta de contabilidad.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Puedo exportar la lista de facturas filtrada en formato CSV.
  - El CSV incluye: numero, cliente, fecha emision, fecha vencimiento, monto total, estado, fecha de pago.
  - El archivo se descarga inmediatamente con nombre descriptivo (ej: facturas_2026_04.csv).
  - Los montos usan punto como separador decimal.

---

## Historias de Usuario Transversales

### US-T.1: Configurar datos de mi empresa
- **Como** freelancer, **quiero** configurar los datos de mi empresa una sola vez, **para** que aparezcan automaticamente en todas mis facturas.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Puedo configurar: nombre completo, nombre de empresa, direccion, NIT/RFC, telefono, email.
  - Los datos se muestran automaticamente en todas las facturas nuevas.
  - Al iniciar sesion por primera vez, se me guia a completar estos datos.

### US-T.2: Configurar moneda predeterminada
- **Como** freelancer, **quiero** configurar mi moneda predeterminada, **para** no tener que seleccionarla cada vez.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Puedo seleccionar mi moneda predeterminada en la configuracion.
  - Monedas disponibles en el MVP: USD, EUR, MXN, COP, ARS, CLP.
  - Las nuevas facturas usan esta moneda por defecto (editable por factura).

### US-T.3: Configurar prefijo de numero de factura
- **Como** freelancer, **quiero** personalizar el prefijo de mis numeros de factura, **para** que se ajusten a mis requisitos.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Puedo configurar un prefijo personalizado (ej: INV, FACT, RC).
  - El formato final es: PREFIJO-001, PREFIJO-002, etc.
  - El numero se incrementa automaticamente.
  - No puedo establecer un numero menor al ultimo emitido.

### US-T.4: Experiencia responsive
- **Como** freelancer, **quiero** acceder a InvoiceSnap desde mi telefono, **para** crear o revisar facturas cuando no estoy en mi escritorio.
- **Prioridad**: P0
- **Criterios de aceptacion**:
  - Todas las pantallas son usables en dispositivos moviles (320px+).
  - La navegacion se adapta a mobile (menu hamburguesa).
  - El formulario de factura es funcional en mobile (items apilados, calculos visibles).
  - La lista de facturas tiene un layout adaptado para pantallas pequenas.
  - Los botones de accion son suficientemente grandes para touch.

### US-T.5: Onboarding de primer uso
- **Como** nuevo usuario, **quiero** ser guiado para configurar mi cuenta y crear mi primera factura, **para** empezar a usar la herramienta rapidamente.
- **Prioridad**: P1
- **Criterios de aceptacion**:
  - Al registrarse, el usuario es guiado en 3 pasos: datos de empresa, primer cliente, primera factura.
  - Cada paso tiene instrucciones claras y boton para saltar.
  - Se muestra una barra de progreso del onboarding.
  - Una vez completado, no se muestra de nuevo.
  - Si se salta, se muestra un recordatorio suave en el dashboard.
