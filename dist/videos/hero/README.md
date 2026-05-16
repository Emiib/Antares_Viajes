# Videos optimizados del hero

Esta carpeta debe contener los videos finales del hero en versiones livianas.

## Archivos esperados

Para cada slide del hero se esperan estos archivos:

- `tailandia-desktop.webm`
- `tailandia-desktop.mp4`
- `tailandia-mobile.webm`
- `tailandia-mobile.mp4`
- `tailandia-poster.jpg`
- `roma-desktop.webm`
- `roma-desktop.mp4`
- `roma-mobile.webm`
- `roma-mobile.mp4`
- `roma-poster.jpg`
- `bali-desktop.webm`
- `bali-desktop.mp4`
- `bali-mobile.webm`
- `bali-mobile.mp4`
- `bali-poster.jpg`

## Tamaños recomendados

- Desktop: 2560x1440, 24 o 30 fps, 6 a 10 segundos, 5 a 10 MB aprox.
- Mobile: 1080x1920 o 1920x1080 segun encuadre, 24 o 30 fps, 2 a 5 MB aprox.
- Poster: JPG o WebP de 1920x1080, menos de 300 KB.

## Como generar archivos con FFmpeg

Reemplazar `original.mp4` por el video descargado/licenciado.

Desktop MP4:

```bash
ffmpeg -i original.mp4 -t 8 -vf "scale=2560:-2,crop=2560:1440" -r 30 -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -an tailandia-desktop.mp4
```

Desktop WebM:

```bash
ffmpeg -i original.mp4 -t 8 -vf "scale=2560:-2,crop=2560:1440" -r 30 -c:v libvpx-vp9 -b:v 0 -crf 32 -an tailandia-desktop.webm
```

Mobile MP4:

```bash
ffmpeg -i original.mp4 -t 8 -vf "scale=-2:1080,crop=1080:1080" -r 30 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -an tailandia-mobile.mp4
```

Mobile WebM:

```bash
ffmpeg -i original.mp4 -t 8 -vf "scale=-2:1080,crop=1080:1080" -r 30 -c:v libvpx-vp9 -b:v 0 -crf 36 -an tailandia-mobile.webm
```

Poster:

```bash
ffmpeg -i original.mp4 -ss 00:00:02 -vframes 1 -vf "scale=1920:-2" -q:v 4 tailandia-poster.jpg
```

## Nota

Mientras estos archivos no existan, el sitio usa un fallback remoto de Pexels. Cuando cargues estos archivos, el navegador usara primero las versiones locales optimizadas.