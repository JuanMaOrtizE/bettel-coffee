# PROJECT.md

## Objetivo
Sistema web para la operación de un café: mesas, pedidos, barra, caja, inventario, contabilidad, reportes, usuarios y auditoría.

## Stack

### Frontend
- React + TypeScript + Vite
- React Router
- Redux Toolkit + RTK Query
- React Hook Form + Zod
- Tailwind CSS
- Socket.IO Client

### Backend
- NestJS + TypeScript
- Prisma
- PostgreSQL
- JWT + cookies httpOnly
- Swagger
- Socket.IO

## Arquitectura
Monolito modular.

Módulos previstos:
`auth`, `users`, `roles`, `tables`, `catalog`, `orders`, `kitchen`, `sales`, `cash-register`, `inventory`, `accounting`, `debts`, `reports`, `audit`, `notifications`.

Crear módulos solo cuando llegue su fase.

## Roles
- `OWNER`: máxima autoridad. Gestiona ADMIN, auditoría y finanzas sensibles.
- `ADMIN`: gestiona operación y usuarios operativos.
- `WAITER`: mesas y pedidos.
- `BARISTA`: cola y preparación.
- `PARTNER`: lectura financiera autorizada.
- `CLIENT`: acceso limitado.

No hay registro público de empleados.

## Modelo conceptual clave

### Pedido
`Order -> OrderSubmission -> OrderItem`

Un pedido puede tener varios envíos a barra.

### Venta y pagos
`Order -> Sale -> Payment[]`

Un `Payment` registra solamente cómo se pagó:
- `CASH`
- `CARD`
- `TRANSFER`

No hay pasarela de pagos ni integración bancaria en el MVP.

### Inventario
`Product -> RecipeItem -> Ingredient`

Todo cambio de stock debe generar `InventoryMovement`.

## Reglas importantes
- El backend valida precios, roles, totales y estados.
- Una venta pagada/anulada no se borra.
- El precio histórico no cambia si cambia el catálogo.
- Dinero: PostgreSQL `numeric` / Prisma `Decimal`, nunca float.
- Un cierre de caja cerrado es inmutable.
- Ajustes de inventario requieren motivo.
- Auditoría es append-only.

## Realtime
REST realiza la mutación y guarda en PostgreSQL.
Después del commit se emite el evento WebSocket.

Eventos previstos:
- `order.submitted`
- `order-item.status-changed`
- `order.ready`
- `table.status-changed`
- `inventory.low-stock`

Al reconectar, el frontend vuelve a consultar el estado con RTK Query.

## Transacciones críticas
Usar transacción para:
- checkout;
- anulación;
- cierre de caja;
- ajustes/consumo de inventario cuando involucren varios registros.

## Deploy inicial
Candidato barato/free-tier:
- frontend: Cloudflare Pages;
- API: Render;
- PostgreSQL: Neon.

Revalidar precios y límites al momento del deploy.
