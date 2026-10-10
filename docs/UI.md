# UI.md

## Base

Usar Tailwind CSS.
La UI debe ser profesional, limpia y rápida de operar.

Evitar estética genérica de dashboard, efectos decorativos excesivos y animaciones innecesarias.

## Mesero

- acciones grandes y rápidas;
- mesas y estados muy visibles;
- pedido fácil de editar;
- botón de enviar a barra evidente.

## Barra

Estilo Kitchen Display System:

- tarjetas grandes;
- pedido más antiguo primero;
- mesa, tiempo y notas muy visibles;
- cambio de estado con pocos clics.

## Admin / Owner

- navegación clara;
- tablas y filtros;
- formularios consistentes;
- dashboards y reportes legibles.

Las vistas de consulta del OWNER deben funcionar bien en móvil.

## Componentes

Crear componentes reutilizables cuando aparezca repetición real:
Button, Input, Select, Dialog, Card, Badge, Tabs, Toast, DataTable.

## Accesibilidad

- foco visible;
- labels reales;
- buen contraste;
- no usar solo color para comunicar estados.

## Mobile y touch

La web debe diseñarse mobile-first, especialmente para Mesero.

- Priorizar interacción táctil.
- Se pueden usar tap, long press y swipe cuando mejoren la operación.
- Implementar gestos web con Pointer Events cuando sea suficiente.
- Ninguna acción crítica debe depender exclusivamente de un gesto oculto:
  debe existir también un botón o menú visible.
- No se requiere app nativa para estos comportamientos.

Una skill externa de frontend puede ayudar, pero debe respetar este archivo.

## Navegación confirmada

Rutas iniciales:

```text
/b/:businessSlug/login

/b/:businessSlug/app
├── /tables
├── /catalog
└── /management
    ├── /users
    ├── /categories
    └── /products
```

- `businessSlug` identifica el negocio en la navegación, pero el backend usa
  el `businessId` autenticado como límite de seguridad.

- OWNER y ADMIN inician en Mesas y acceden a Mesas, Carta y Gestión.
- WAITER inicia en Mesas y accede a Mesas y Carta.
- BARISTA inicia en Carta; Barra se añadirá junto con pedidos y realtime.
- PARTNER tendrá una pantalla informativa hasta que exista el módulo financiero.
- En móvil, Usuarios, Categorías y Productos se agrupan bajo Gestión para no sobrecargar la navegación principal.
- Ocultar opciones según el rol mejora la experiencia, pero la autorización real continúa en el backend.

## Shell adaptable

- Escritorio: navegación lateral, encabezado de sesión y contenido principal.
- Móvil: encabezado compacto, contenido y navegación inferior con máximo cinco destinos.
- Cada destino muestra icono y texto; la ubicación actual debe ser evidente.
- Las rutas importantes admiten acceso directo por URL y conservan un comportamiento de retroceso predecible.

## Dirección inicial

- El MVP empieza con modo claro.
- Pathmin es la identidad de la plataforma; cada `Business`, empezando por
  Bettel Coffee, conserva su nombre dentro del espacio de trabajo.
- La identidad debe sentirse propia de una estación de servicio de café: operativa, táctil y precisa, no como una plantilla SaaS genérica.
- Los colores y la tipografía se definirán mediante tokens semánticos.
- Usar un único sistema de iconos SVG; no usar emojis como iconos.
- Los controles táctiles deben medir al menos 44–48 px y mostrar respuesta al presionar.
- Los estados siempre combinan texto o icono con el color.
- El backend sigue siendo la fuente de verdad para sesión, roles y estados.

## Primera vertical del frontend

1. iniciar sesión;
2. restaurar la sesión mediante `GET /auth/me`;
3. mostrar navegación según el rol;
4. cerrar sesión;
5. proteger rutas del frontend;
6. implementar Mesas como primera pantalla operativa.
