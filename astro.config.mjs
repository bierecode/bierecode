// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import solidJs from '@astrojs/solid-js';
import rehypeExternalLinks from 'rehype-external-links';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://www.bierecode.com',

  server: {
    allowedHosts: ['.simple-agent-manager.org']
  },

  integrations: [mdx(), solidJs(), sitemap(), icon()],

  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
    ]
  },

  vite: {
    plugins: [tailwindcss()]
  },
  
  output: 'static',
});
