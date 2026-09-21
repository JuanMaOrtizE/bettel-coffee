# ROADMAP.md

Trabajar por vertical slices. No adelantar fases.

## 0. Base
Monorepo, React/Vite, NestJS, Prisma/PostgreSQL, env, Swagger, `/health`.

## 1. Auth y roles
Login/logout/refresh, OWNER inicial, Guards y autorización.

## 2. Catálogo y mesas
Productos, categorías, mesas y estados.

## 3. Pedidos en borrador
Order, OrderItem, notas, cantidades y snapshot de precio.

## 4. Envíos + realtime
OrderSubmission, enviar a barra, WebSocket y cola de cocina.

## 5. Preparación
`PENDING -> PREPARING -> READY -> DELIVERED` y nuevos envíos.

## 6. Cobro
Sale, Payment, pagos combinados, cambio en efectivo y liberar mesa.

**Primer MVP demostrable.**

## 7. Inventario
Ingredientes, recetas, movimientos, consumo, ajustes y stock bajo.

## 8. Caja
CashSession, conteo físico, faltante/sobrante y cierre.

## 9. Descuentos, anulaciones y auditoría
Trazabilidad y reversión.

## 10. Contabilidad
Ingresos automáticos, egresos y balance.

## 11. Deudas
Obligaciones y pagos.

## 12. Reportes
Dashboard, comparativos y PDF.

## 13. Alertas
Notificaciones internas y reglas críticas.

## 14. Hardening + deploy
Tests críticos, seguridad, logs, Docker/CI y producción.
