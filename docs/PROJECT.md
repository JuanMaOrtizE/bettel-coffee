# PROJECT.md

## Objetivo
Pathmin es una plataforma web multi-tenant para la operación de negocios de café: mesas,
pedidos, barra, caja, inventario, contabilidad, reportes, usuarios y auditoría.

Cada negocio utiliza el mismo sistema, pero sus usuarios y datos permanecen
aislados de los demás. Bettel Coffee será el primer negocio registrado, no la
identidad global de la plataforma.

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
`platform`, `businesses`, `auth`, `users`, `roles`, `tables`, `catalog`,
`orders`, `kitchen`, `sales`, `cash-register`, `inventory`, `accounting`,
`debts`, `reports`, `audit`, `notifications`.

Crear módulos solo cuando llegue su fase.

## Multi-tenancy

- Se usará una base de datos PostgreSQL compartida y un esquema compartido.
- `Business` representa un negocio independiente y funciona como tenant.
- En el MVP, cada `Business` representa también un único local físico.
- Los usuarios operativos pertenecen a un solo negocio.
- Los datos operativos se relacionan con `Business` mediante `businessId`.
- El backend obtiene `businessId` de la identidad autenticada; no confía en un
  `businessId` enviado por el frontend para decidir a qué negocio acceder.
- Todas las consultas y restricciones de unicidad operativas deben estar
  limitadas al negocio autenticado.
- Las sucursales quedan fuera del MVP. Si se necesitan más adelante, se añadirá
  una entidad `Location` dentro de cada `Business`.

## Roles
- `PLATFORM_ADMIN`: administra la plataforma, crea o suspende negocios y crea
  el OWNER inicial. No participa normalmente en la operación de cada negocio.
- `OWNER`: máxima autoridad dentro de su negocio. Gestiona ADMIN, auditoría y
  finanzas sensibles de ese negocio.
- `ADMIN`: gestiona operación y usuarios operativos.
- `WAITER`: mesas y pedidos.
- `BARISTA`: cola y preparación.
- `PARTNER`: lectura financiera autorizada.

`PLATFORM_ADMIN` usa una identidad separada de los usuarios de negocio. No es
un rol asignable a un `User` operativo.

No existe un rol `CLIENT` en el MVP. Los clientes presenciales no necesitan
una cuenta para realizar pedidos atendidos por un mesero.

No hay registro público de usuarios.

Los usuarios se desactivan en lugar de eliminarse físicamente, para conservar
la trazabilidad de sus acciones.

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
- Ninguna operación puede leer o modificar datos de otro negocio.
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

Las conexiones WebSocket se separarán por negocio para que un evento nunca se
emita a usuarios de otro tenant.

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
