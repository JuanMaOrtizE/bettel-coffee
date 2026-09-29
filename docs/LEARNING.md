# Aprendizaje técnico — Bettel Coffee

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
7. implementación en Bettel Coffee;
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

Las casillas representan conceptos revisados y explicados, no solo código existente.

## Próximo punto de reanudación

Los Guards globales y `@Public()` ya están funcionando. `POST /users` integra autenticación, autorización por ruta, validación Zod, autorización de negocio, Argon2 y persistencia segura. El siguiente bloque será la consulta de usuarios con visibilidad limitada según el rol del solicitante.
