# STATUS.md

Fase actual: **2 — Catálogo y mesas**
Estado: **Análisis funcional**

Fase 0 completada:
- [x] crear monorepo;
- [x] crear frontend con React/Vite;
- [x] configurar Tailwind CSS;
- [x] crear API con NestJS;
- [x] configurar Prisma y conectar PostgreSQL;
- [x] completar configuración de entorno;
- [x] configurar Swagger;
- [x] implementar `/health`.

Fase 1 completada:
- [x] definir el modelo `User` y el enum `Role`;
- [x] crear el OWNER inicial;
- [x] implementar login, refresh y logout;
- [x] usar JWT mediante cookies `httpOnly` y sesiones persistidas;
- [x] bloquear usuarios inactivos y revocar sesiones;
- [x] proteger rutas mediante Guards y roles;
- [x] gestionar usuarios y restablecer contraseñas administrativamente.

Objetivo inmediato:
- confirmar las reglas mínimas de categorías y productos;
- modelar el catálogo antes de crear sus endpoints;
- reconstruir las reglas de mesas, porque `HU-M01` a `HU-M07` no aparecen en la fuente entregada.

Reglas confirmadas:
- no existe el rol `CLIENT` en el MVP;
- los clientes presenciales no tienen cuentas;
- los usuarios se desactivan y no se eliminan físicamente.

No implementar todavía pedidos, pagos, inventario o reportes.
