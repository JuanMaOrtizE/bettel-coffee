# DECISIONS.md

## Confirmado
- NestJS + TypeScript.
- PostgreSQL + Prisma.
- React + Vite + Tailwind.
- Monolito modular.
- WebSockets para Mesero/Barra.
- `OWNER` es la máxima autoridad; no existe `SUPER_ADMIN` separado.
- Los roles autenticados del MVP son `OWNER`, `ADMIN`, `WAITER`, `BARISTA` y `PARTNER`.
- No existe el rol `CLIENT` en el MVP.
- Los clientes presenciales no necesitan una cuenta de usuario.
- OWNER crea/gestiona cuentas ADMIN.
- ADMIN solo crea/gestiona cuentas WAITER y BARISTA.
- Los usuarios se desactivan; no se eliminan físicamente.
- No hay signup público de empleados.
- Pagos son registros internos, sin pasarela.
- `Sale` y `Payment` son entidades separadas.
- Una venta puede tener varios pagos.
- Conservar precios históricos.

## Pendiente de confirmar cuando corresponda
- Momento exacto de descuento de inventario. Propuesta: al enviar a barra.
- Qué ocurre al cancelar un producto ya enviado.
- Límites/autorización de descuentos del mesero.
- Si se guardan `cashReceived` y `changeGiven`.
- Propinas.
- Fondo inicial de caja.
- Varias sesiones de caja por día.
- HU-M01 a HU-M07, ausentes en el documento entregado.
