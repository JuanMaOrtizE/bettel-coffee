# STATUS.md

Fase actual: **1 — Auth y roles**
Estado: **En progreso**

Fase 0 completada:
- [x] crear monorepo;
- [x] crear frontend con React/Vite;
- [x] configurar Tailwind CSS;
- [x] crear API con NestJS;
- [x] configurar Prisma y conectar PostgreSQL;
- [x] completar configuración de entorno;
- [x] configurar Swagger;
- [x] implementar `/health`.

Objetivo inmediato:
- definir el modelo `User` y el enum `Role`;
- crear el OWNER inicial;
- implementar login, refresh y logout;
- usar JWT mediante cookies httpOnly;
- bloquear usuarios inactivos;
- proteger rutas mediante Guards y roles.

Reglas confirmadas:
- no existe el rol `CLIENT` en el MVP;
- los clientes presenciales no tienen cuentas;
- los usuarios se desactivan y no se eliminan físicamente.

No implementar todavía catálogo, mesas, pedidos, pagos, inventario o reportes.
