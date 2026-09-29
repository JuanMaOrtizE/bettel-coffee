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
