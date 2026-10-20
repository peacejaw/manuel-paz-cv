# Manuel Paz | CV interactivo

CV personal en español, construido con Astro y TypeScript sobre la estructura minimalista de Midudev.

Incluye perfil, experiencia, educación, proyectos con fechas y habilidades. Las experiencias y los proyectos abren detalles con fotografías. La galería usa PhotoSwipe para mostrar cada imagen completa y permite ampliar de forma opcional.

## Ejecutar en tu computador

Requisitos: Node.js 24 y pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Para generar y revisar la versión final:

```sh
pnpm build
pnpm preview
```

La carpeta `dist/` se genera al compilar y no se incluye en el repositorio.

## Editar el CV

- `cv.json`: textos, fechas, enlaces, métricas e imágenes de cada experiencia.
- `public/media/`: imágenes y miniaturas utilizadas en la web.
- `public/docs/Manuel-Paz-CV.pdf`: CV descargable.
- `src/components/sections/`: secciones del CV.
- `src/components/StoryDialogs.astro`: detalles de experiencias y proyectos.
- `src/scripts/details.ts`: apertura de detalles y visor PhotoSwipe.
- `src/styles/details.css`: estilos de las galerías y ventanas.

Cada imagen tiene una versión completa y una miniatura terminada en `-small.webp`. Sus dimensiones se guardan en `cv.json` para mantener la proporción original. Cada proyecto o experiencia enlaza con su detalle mediante `caseId`.

## Publicación

El proyecto genera una web estática mediante `pnpm build`. Puede alojarse en un servicio compatible con sitios Astro estáticos, indicando `dist` como carpeta de salida.

GitHub Pages: https://peacejaw.github.io/manuel-paz-cv/

En Settings > Pages, selecciona GitHub Actions como Source y deja Custom domain vacío. El flujo `.github/workflows/deploy.yml` compila con Node.js 24 y pnpm 11.25.0 y publica automáticamente cada actualización de `main`.

Las rutas de imágenes, galerías, fuentes y PDF respetan la base `/manuel-paz-cv`. Para usar un dominio propio en el futuro, actualiza `site`, elimina `base` en `astro.config.mjs` y actualiza `basics.url` en `cv.json`.

## Base y licencias

- Plantilla: [midudev/minimalist-portfolio-json](https://github.com/midudev/minimalist-portfolio-json). Se conserva `LICENSE.txt`.
- Galería: [PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe), licencia MIT.
- Tipografía local: Portfolio Sans, derivada de Mona Sans. Su licencia se conserva en `src/assets/fonts/OFL.txt`.
