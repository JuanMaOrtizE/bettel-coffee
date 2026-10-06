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
- Al consultar usuarios, OWNER puede ver todas las cuentas; ADMIN solo puede ver cuentas WAITER y BARISTA.
- Nadie puede desactivar su propia cuenta y las cuentas OWNER no se desactivan desde la gestión de usuarios del MVP.
- OWNER puede desactivar ADMIN, WAITER y BARISTA; ADMIN solo puede desactivar WAITER y BARISTA. La gestión de PARTNER queda pendiente.
- Desactivar un usuario es idempotente, conserva su registro y revoca todas sus sesiones activas en la misma transacción.
- Access y refresh tokens incluyen `sid`; ambos quedan vinculados a `AuthSession`, por lo que revocar una sesión invalida ambos tipos de token.
- La edición administrativa permite cambiar nombre, username y rol, incluso en usuarios inactivos. Las contraseñas se gestionarán en una operación separada.
- OWNER puede editar y asignar roles ADMIN, WAITER y BARISTA; ADMIN solo puede editar y asignar WAITER y BARISTA. OWNER y PARTNER quedan fuera de este endpoint del MVP.
- En esta fase, la recuperación de acceso será administrativa: OWNER puede restablecer contraseñas de ADMIN, WAITER y BARISTA; ADMIN solo de WAITER y BARISTA. El restablecimiento revoca todas las sesiones.
- La recuperación por enlace de correo queda fuera del MVP actual porque todavía no existen correos verificados ni infraestructura de envío.
- Los usuarios se desactivan; no se eliminan físicamente.
- No hay signup público de empleados.
- Pagos son registros internos, sin pasarela.
- `Sale` y `Payment` son entidades separadas.
- Una venta puede tener varios pagos.
- Conservar precios históricos.
- Las contraseñas nuevas deben tener entre 10 y 128 caracteres; se permiten espacios y no se exigen reglas de composición por tipo de carácter.
- OWNER y ADMIN gestionan categorías. Las categorías se desactivan en lugar de eliminarse y la consulta administrativa incluye activas e inactivas.
- Los nombres de categoría tienen entre 2 y 60 caracteres, normalizan espacios y se consideran duplicados sin distinguir mayúsculas y minúsculas. Los acentos sí distinguen nombres.
- Desactivar una categoría no modifica el estado individual de sus futuros productos; la carta operativa exigirá que tanto la categoría como el producto estén activos.

## Pendiente de confirmar cuando corresponda
- Momento exacto de descuento de inventario. Propuesta: al enviar a barra.
- Qué ocurre al cancelar un producto ya enviado.
- Límites/autorización de descuentos del mesero.
- Si se guardan `cashReceived` y `changeGiven`.
- Propinas.
- Fondo inicial de caja.
- Varias sesiones de caja por día.
- HU-M01 a HU-M07, ausentes en el documento entregado.
