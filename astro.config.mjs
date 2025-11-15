// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import solidJs from '@astrojs/solid-js';

export default defineConfig({
  site: 'https://www.bierecode.com',

  integrations: [mdx(), solidJs(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  },
  
  output: 'static',
});
