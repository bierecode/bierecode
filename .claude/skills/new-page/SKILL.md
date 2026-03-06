---
name: new-page
description: Scaffold a new page with Astro layout wrapper, SolidJS component, and i18n strings.
argument-hint: "[page-name]"
allowed-tools: Read, Write, Glob
---

1. Create `src/pages/[name].astro` importing Layout and page component
2. Create `src/components/pages/[name]/[name].astro` as Astro wrapper
3. Create `src/components/pages/[name]/components/[name]/[name].tsx` as SolidJS component skeleton
4. Add i18n keys to both `src/locales/en.json` and `src/locales/fr.json`
5. Follow existing patterns from homepage structure
6. Use proper types, signals, and Tailwind classes
