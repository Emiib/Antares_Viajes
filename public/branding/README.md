# Branding editable

Esta carpeta está pensada para que el sitio tome los assets de marca desde archivos locales fáciles de reemplazar.

## Archivo usado actualmente por el header y footer

- `logo-header.png`

## Media opcional para el bloque final previo al footer

Podés configurar esto en `src/App.tsx` dentro de `SITE_CONFIG.branding.footerShowcase`.

Archivos posibles:

- `footer-media.jpg`
- `footer-media.webm`
- `footer-media.mp4`
- `footer-media-poster.jpg`

## Cómo cambiar el logo

1. Reemplazá `logo-header.png` por tu nuevo logo.
2. Mantené el mismo nombre para no tocar código.
3. Recomendado:
   - PNG con fondo transparente
   - alto aprox 140px a 220px
   - peso menor a 400 KB

## Futuro panel admin

Más adelante, el panel admin podrá subir automáticamente archivos a esta carpeta o a un storage conectado, y el sitio seguirá apuntando a la misma ruta:

`/branding/logo-header.png`
