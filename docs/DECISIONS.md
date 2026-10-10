# DECISIONS.md

## Confirmado
- La plataforma se llama **Pathmin**. Bettel Coffee es su primer negocio
  registrado y conserva su propia identidad dentro del sistema.
- NestJS + TypeScript.
- PostgreSQL + Prisma.
- React + Vite + Tailwind.
- Monolito modular.
- WebSockets para Mesero/Barra.
- El sistema será multi-tenant con una base PostgreSQL compartida y un esquema
  compartido.
- `Business` representa un negocio independiente y su único local físico en el
  MVP. Las sucursales quedan fuera de esta etapa.
- Bettel Coffee será el primer `Business`, no la identidad de la plataforma.
- Cada usuario operativo pertenece a un solo `Business`.
- `OWNER` es la máxima autoridad dentro de su negocio.
- La plataforma tendrá cuentas `PLATFORM_ADMIN` separadas de los usuarios de
  negocio. No se añadirá `PLATFORM_ADMIN` al enum de roles operativos.
- `PLATFORM_ADMIN` puede crear o suspender negocios y crear el OWNER inicial,
  pero no accede normalmente a mesas, pedidos, caja ni demás información
  operativa.
- La creación de un negocio y de su OWNER inicial debe ejecutarse en una misma
  transacción: se crean ambos o no se crea ninguno.
- No habrá registro público de negocios ni de empleados en el MVP.
- El backend obtiene el `businessId` del contexto autenticado. Los endpoints
  operativos no aceptan un `businessId` del frontend para decidir el tenant.
- Las consultas operativas deben filtrar siempre por `businessId`, incluso si
  también buscan por un identificador único como `id`.
- Los nombres y usernames que deban ser únicos lo serán dentro de cada negocio,
  no globalmente en toda la plataforma.
- El inicio de sesión de usuarios de negocio identificará tanto el negocio como
  el username, además de validar la contraseña.
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
- Los nombres de categoría tienen entre 2 y 60 caracteres, normalizan espacios y se consideran duplicados dentro de cada negocio sin distinguir mayúsculas y minúsculas. Los acentos sí distinguen nombres.
- Desactivar una categoría no modifica el estado individual de sus futuros productos; la carta operativa exigirá que tanto la categoría como el producto estén activos.
- Cada producto pertenece a una categoría. Puede crearse o editarse dentro de una categoría inactiva, pero la categoría debe existir.
- Los nombres de producto tienen entre 2 y 100 caracteres y son únicos dentro de cada negocio sin distinguir mayúsculas y minúsculas; los acentos sí distinguen nombres.
- Un producto y su categoría deben compartir el mismo `businessId`; PostgreSQL lo garantiza mediante una clave foránea compuesta, no solamente mediante validación del service.
- Los precios llegan por HTTP como texto, se convierten a `Prisma.Decimal` y se almacenan como `DECIMAL(12,2)`; deben ser mayores que cero y tener máximo dos decimales.
- `Product.isActive` indica pertenencia administrativa al catálogo y solo lo cambia OWNER/ADMIN. `Product.isAvailable` indica disponibilidad temporal y lo cambia OWNER/ADMIN/BARISTA.
- En la carta operativa solo aparecen categorías y productos activos. Los productos no disponibles permanecen visibles con `isAvailable: false`; las categorías sin productos activos no aparecen.
- Las mesas usan un identificador visible `label` de 1 a 50 caracteres. Se normalizan espacios y los duplicados se detectan dentro de cada negocio sin distinguir mayúsculas y minúsculas mediante `normalizedLabel`.
- Una mesa nueva inicia activa y con estado `AVAILABLE`. Los estados previstos son `AVAILABLE`, `OCCUPIED` y `PENDING_PAYMENT`.
- OWNER y ADMIN administran mesas. WAITER puede consultar únicamente mesas activas; BARISTA y PARTNER no acceden a esta consulta.
- Desactivar y activar mesas son operaciones idempotentes. Una mesa solo puede desactivarse mientras está `AVAILABLE`; los cambios de estado operativo se implementarán junto con pedidos y cobros.
- Las mesas no tendrán capacidad ni orden manual en el MVP inicial; se muestran alfabéticamente por `label`.

## Pendiente de confirmar cuando corresponda
- Momento exacto de descuento de inventario. Propuesta: al enviar a barra.
- Qué ocurre al cancelar un producto ya enviado.
- Límites/autorización de descuentos del mesero.
- Si se guardan `cashReceived` y `changeGiven`.
- Propinas.
- Fondo inicial de caja.
- Varias sesiones de caja por día.
- HU-M01 a HU-M07, ausentes en el documento entregado.
