# Publicar en el blog

El blog es estático: se edita en HTML y se publica junto al resto de la web. No hay panel de administración. `blog.html` muestra inicialmente un estado vacío para no presentar artículos de ejemplo como publicaciones reales.

1. Copia `articulo-plantilla.html` con un nombre como `blog-mi-opinion.html` en la misma carpeta. Conserva la plantilla para futuras entradas.
2. Cambia el `<title>`, la descripción, la categoría, el título visible, la introducción y el contenido. Sustituye «BORRADOR» por la categoría y añade la fecha real en un elemento `<time datetime="AAAA-MM-DD">`. Elimina `<meta name="robots" content="noindex">` cuando esté listo para publicarse.
3. En el bloque final del artículo, sustituye el aviso por un enlace a la URL real del vídeo de YouTube. Puedes usar el ejemplo comentado. El enlace abre YouTube; no carga reproductores externos en la página.
4. En `blog.html`, dentro de `.article-grid`, coloca una tarjeta como esta y sustituye los campos. Añade las nuevas entradas al principio para mostrar primero las más recientes.

```html
<article class="blog-card">
  <span class="section-tag-text">OPINIÓN / RUNNING</span>
  <h3><a href="blog-mi-opinion.html">TÍTULO DEL ARTÍCULO</a></h3>
  <p>Una descripción breve de la idea que desarrollas en el artículo.</p>
  <p class="article-meta"><time datetime="AAAA-MM-DD">Fecha real de publicación</time></p>
  <div class="article-links">
    <a href="blog-mi-opinion.html">LEER ARTÍCULO →</a>
    <a href="https://www.youtube.com/watch?v=ID_REAL">VER VÍDEO EN YOUTUBE ↗</a>
  </div>
</article>
```

5. Elimina el bloque `.blog-empty` al publicar la primera entrada. Si aún no hay vídeo, omite su enlace en la tarjeta y el bloque de vídeo del artículo hasta tenerlo.
6. Comprueba los enlaces y publica los archivos en el alojamiento habitual de la web.
