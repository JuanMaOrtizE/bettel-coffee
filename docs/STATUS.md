# STATUS.md

Fase actual: **2.5 — Multi-tenancy**
Estado: **Migración estructural aplicada; administración de plataforma y pruebas cruzadas pendientes**

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
- [x] confirmar, modelar e implementar la gestión de categorías;
- [x] confirmar, modelar e implementar productos y su relación con categorías;
- [x] implementar la lectura operativa del catálogo para Mesero y Barra;
- [x] reconstruir las reglas de mesas, porque `HU-M01` a `HU-M07` no aparecen en la fuente entregada;
- [x] modelar mesas y sus estados;
- [x] implementar creación, consulta por rol y edición de mesas;
- [x] implementar activación y desactivación segura de mesas.

Multi-tenancy completado hasta ahora:
- [x] crear `Business` y migrar Bettel Coffee como primer tenant;
- [x] aislar usuarios, sesiones, catálogo y mesas por `businessId`;
- [x] conservar el tenant en las rutas del frontend mediante `businessSlug`;
- [x] separar la identidad de Pathmin de la identidad de cada negocio;
- [ ] crear la administración de negocios para `PLATFORM_ADMIN`;
- [ ] automatizar pruebas de acceso cruzado entre tenants.

Reglas confirmadas:
- no existe el rol `CLIENT` en el MVP;
- los clientes presenciales no tienen cuentas;
- los usuarios se desactivan y no se eliminan físicamente.

No implementar todavía pedidos, pagos, inventario o reportes.
