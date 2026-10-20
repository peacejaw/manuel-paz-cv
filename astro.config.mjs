import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://peacejaw.github.io',
  base: '/manuel-paz-cv',
  devToolbar: { enabled: false },
  build: {
    // Una sola página: incrustar el CSS evita una petición que bloquea el render
    inlineStylesheets: 'always'
  }
});
