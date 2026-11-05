# Editar el contenido

Los textos visibles, las marcas, los ritmos y las sesiones están en los archivos HTML. No hace falta modificar JavaScript para editar un entrenamiento.

- `index.html`: contenido principal y todas las tablas. Busca `CONTENIDO EDITABLE: ASFALTO` o `CONTENIDO EDITABLE: TRAIL`.
- `contacto.html`: formulario, dirección de correo, asunto y plantillas del mensaje y de su confirmación.
- `blog.html`: presentación y listado del blog.
- `articulo-plantilla.html`: plantilla para crear artículos. Consulta `BLOG.md`.
- `core.html`: tres plantillas de core y seis fichas de técnica. Edita los ejercicios, las dosis, descansos y explicaciones directamente en el HTML. `core.css` incluye el diseño de impresión A4; `core.js` solo selecciona la plantilla que se imprime. Los botones permiten guardar como PDF desde el diálogo del navegador. Las casillas son un registro temporal y se reinician al recargar.

## Tablas de asfalto

Cada bloque `data-asphalt-distance` corresponde a una distancia. Incluye un selector con sus marcas y un bloque `data-goal-panel` por marca. Dentro de cada bloque puedes editar la explicación, los ritmos, el título de la tabla y las celdas de las cuatro semanas.

Para añadir una marca, duplica un bloque `data-goal-panel`, dale un identificador único dentro de esa distancia y añade un `<option>` con el mismo `value` en su selector. Por ejemplo: `<option value="18">Sub 18 min</option>` corresponde a `data-goal-panel="18"`. Escribe sus sesiones y ritmos directamente en HTML: ya no se calculan automáticamente.

## Tablas de trail

Cada modalidad tiene un bloque `data-trail-panel`. Su identificador coincide con el `data-trail` del botón correspondiente. Edita el párrafo, el título y las sesiones dentro del bloque.

`running.js` y `trail.js` solo cambian qué bloques se muestran. Sin JavaScript se muestran todas las tablas y se ocultan los selectores. Conserva los atributos `data-*` y los identificadores al editar para mantener la interacción.
