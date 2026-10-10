# Aprendizaje técnico — Pathmin

## Objetivo

Este proyecto no busca solamente producir una aplicación funcional. Su objetivo principal es aprender NestJS comprendiendo el recorrido de ejecución, la separación de responsabilidades y la inyección de dependencias.

## Contrato de trabajo

Para cada concepto nuevo de NestJS se seguirá este orden:

1. problema que resuelve;
2. modelo mental;
3. comparación con Express;
4. posición dentro del ciclo de una petición;
5. dependencias y módulo que lo construye;
6. ejemplo mínimo;
7. implementación en Pathmin;
8. comprobación breve de comprensión antes de avanzar.

Pedir que Codex implemente el código no elimina estas explicaciones.

## Punto actual

Fase: autenticación y autorización.

Ya existe código funcional para:

- módulos y providers de Prisma, usuarios y autenticación;
- login, refresh y logout;
- JWT en cookies `httpOnly`;
- sesiones persistidas y revocadas;
- validación con Zod;
- un Access Token Guard;
- `GET /auth/me` y un decorador de usuario actual.

Sin embargo, antes de implementar `RolesGuard` se hará una pausa para reconstruir los fundamentos de NestJS que conectan esas piezas.

## Modelo mental que debemos dominar

```text
Petición HTTP
    ↓
Middleware
    ↓
Guard
    ↓
Pipe
    ↓
Controller
    ↓
Service / Provider
    ↓
Prisma
    ↓
PostgreSQL
```

También debemos poder explicar cómo Nest crea las clases:

```text
AppModule
└── importa AuthModule
    ├── registra AuthController
    ├── construye AuthService
    ├── inyecta UsersService, JwtService y ConfigService
    └── registra y exporta Guards
```

## Ruta de aprendizaje antes de continuar roles

- [x] Módulos: alcance de `imports`, `providers`, `controllers` y `exports`.
- [x] Providers e inyección de dependencias: quién crea cada instancia.
- [x] Controller y decoradores HTTP: cómo una ruta recibe datos y devuelve una respuesta.
- [x] Ciclo de petición: middleware, guard, pipe y controller.
- [x] Guard: por qué decide acceso y cómo coloca `request.user`.
- [x] Decorador de parámetro: cómo `@CurrentUser()` obtiene `request.user`.
- [x] Metadatos y `Reflector`: base necesaria para entender `@Roles()` y `RolesGuard`.
- [x] `RolesGuard`: diferencia entre autenticación (`401`) y autorización por rol (`403`).
- [x] Estrategia de Guards globales: proteger por defecto y declarar explícitamente las rutas públicas.
- [x] Flujo completo de autorización: Guard para acceder a la ruta y service para validar la operación concreta.
- [x] Visibilidad por rol: filtrar en PostgreSQL qué usuarios puede consultar cada actor.
- [x] Parámetros y Pipes: `@Param()` obtiene `:id` y `ParseUUIDPipe` valida antes del controller.
- [x] Desactivación transaccional: cambiar el estado del usuario y revocar sus sesiones como una unidad.
- [x] Sesiones vinculadas: `sub` identifica al usuario y `sid` identifica el inicio de sesión de ambos tokens.
- [x] Actualización parcial y concurrencia: Zod limita campos y Prisma repite la condición de autorización en el `UPDATE`.
- [x] Restablecimiento administrativo de contraseñas: el controller responde `204`, Argon2 genera el hash fuera de la transacción y PostgreSQL actualiza la contraseña y revoca las sesiones de forma atómica.
- [x] Módulo de dominio y descubrimiento: `CatalogModule` registra providers y controllers; crear un archivo decorado no basta para que Nest lo construya.
- [x] Recurso de categorías por capas: Zod transforma la entrada, el service normaliza el nombre, Prisma persiste y PostgreSQL garantiza la unicidad.
- [x] Relaciones Prisma: `Product.categoryId` almacena la clave foránea y los `select` anidados construyen lecturas con su categoría.
- [x] Dinero sin flotantes: el precio viaja como `string`, se convierte a `Prisma.Decimal` y se guarda como `DECIMAL(12,2)`.
- [x] Estados separados del producto: `isActive` representa el catálogo administrativo e `isAvailable` la disponibilidad temporal.
- [x] Filtros relacionales: el catálogo operativo filtra categorías con `some` y filtra por separado los productos incluidos.
- [x] Visibilidad de mesas por rol: `RolesGuard` decide quién entra a `GET /tables`, `@CurrentUser()` entrega el usuario autenticado y `TablesService` limita los registros que puede ver cada rol.
- [x] Cambios administrativos de mesas: el controller valida ruta y rol, mientras el service conserva la unicidad del identificador y traduce errores conocidos de Prisma.
- [x] Concurrencia al desactivar mesas: la condición `status = AVAILABLE` forma parte del `UPDATE`; una consulta posterior solo distingue entre `404` y `409`.
- [x] CORS con cookies: el navegador valida el origen antes de llegar al controller; Nest autoriza únicamente el frontend configurado y habilita credenciales sin reemplazar la autenticación.
- [x] Restauración de sesión en el frontend: `SessionGate` consulta `GET /auth/me`, RTK Query conserva el usuario como estado del servidor y las cookies `httpOnly` siguen siendo la credencial y fuente de verdad.
- [x] Enrutamiento moderno con React Router Data Mode: `createBrowserRouter` declara el árbol fuera del render, `RouterProvider` lo conecta con React y los layouts anidados comparten el usuario mediante `Outlet context`.
- [x] Protección de rutas por rol en el frontend: `RoleRoute` decide si renderiza su `Outlet` o redirige a la ruta inicial del usuario; mejora la navegación, pero la autorización de seguridad continúa en los Guards y services del backend.
- [x] Cierre de sesión en el frontend: la mutation espera el `204` de `POST /auth/logout`, el backend revoca la sesión y limpia cookies, y `resetApiState()` elimina la caché de RTK Query antes de volver al login.
- [x] Contrato de mesas en el frontend: RTK Query consulta `GET /tables`, Zod valida en ejecución la respuesta HTTP y los tipos se infieren del mismo esquema antes de guardar los registros en caché.
- [x] Renderizado de mesas por estados: `/app/tables` conserva la protección de `RoleRoute`, `TablesPage` representa carga, error, vacío o datos y `TableCard` traduce el estado del dominio a una presentación accesible.
- [x] Modelo multi-tenant: `businessId` delimita a qué negocio pertenecen los datos, mientras que el rol determina qué puede hacer el usuario dentro de ese negocio; `PLATFORM_ADMIN` queda separado de los usuarios operativos.
- [x] Contexto autenticado del tenant: `AuthSessionsService` carga `user.businessId` y el estado del negocio; `AuthService` rechaza negocios suspendidos y el Guard coloca un `AuthenticatedUser` confiable en `request.user`, sin aceptar el tenant desde el body.
- [x] Aislamiento de usuarios por tenant: listados y operaciones por `id` incluyen `businessId` en las consultas y mutaciones; un recurso de otro negocio se trata como inexistente y las revocaciones de sesiones conservan el mismo límite dentro de la transacción.
- [x] Seed multi-tenant e idempotente: una transacción prepara el `Business` inicial y su OWNER mediante claves únicas, de modo que repetir el seed no crea duplicados ni deja una de las dos entidades sin la otra.
- [x] Catálogo y mesas por tenant: controllers obtienen `businessId` desde `@CurrentUser()` y los services lo incluyen en todas las lecturas y mutaciones; nombres y etiquetas son únicos solamente dentro del negocio.
- [x] Integridad relacional entre tenants: `Product` referencia `Category` mediante `businessId + categoryId`, y PostgreSQL impide que un producto quede asociado con una categoría de otro negocio aunque el código de aplicación se equivoque.
- [x] Contexto de tenant en la URL: React Router obtiene `businessSlug` desde `/b/:businessSlug`, el formulario lo agrega a las credenciales sin pedirlo al usuario y la sesión devuelve el slug real para evitar que una URL manipulada represente otro negocio.
- [x] Identidad y presentación del tenant: `businessId` mantiene el aislamiento interno, `businessSlug` identifica el acceso legible y `businessName` presenta el nombre real en la interfaz; cada dato tiene una responsabilidad diferente.

Las casillas representan conceptos revisados y explicados, no solo código existente.

## Próximo punto de reanudación

La estructura multi-tenant de los modelos actuales ya está migrada: usuarios,
sesiones, catálogo y mesas quedan aislados por negocio, y el frontend conserva
el tenant en su URL. Antes de avanzar a pedidos faltan dos comprobaciones de la
fase 2.5: crear el flujo administrativo de plataforma para dar de alta negocios
y automatizar pruebas que intenten acceder a recursos de otro tenant.
