# Claude Context -- bierecode.com Website

Astro 5 static site for [bierecode.com](https://www.bierecode.com), a Paris-based tech meetup combining beer and coding.

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # Build to dist/ — ALWAYS run after changes to verify
npm run preview   # Preview production build locally
```

## Tech Stack

- Astro 5.7.4 + SolidJS 1.9.5 + Tailwind CSS 4.1.4
- MDX for rich content pages
- astro-icon for SVG icons
- Content collections with Zod schemas

## Critical Patterns (Things Claude Gets Wrong)

### SolidJS is NOT React

- Signals, not hooks: `createSignal()` not `useState()`
- `createEffect()` not `useEffect()`
- `class=` not `className=`
- `onClick=` not `onChange=` for buttons
- No dependency arrays — reactivity is automatic
- Components run once, only signals re-execute

### Astro Component Model

- `.astro` files are server-rendered by default (no JS shipped)
- SolidJS components need `client:load` directive for hydration:
  ```astro
  <MyComponent client:load />
  ```
- Without `client:load`, SolidJS interactivity will silently not work

### Tailwind CSS 4

- Uses `@import "tailwindcss"` — NOT the old `@tailwind base/components/utilities` directives
- Tailwind 4 uses CSS-first configuration, not `tailwind.config.js`

### Content Collections

- Frontmatter `published` field is a Date — schema uses `z.coerce.date()`
- Frontmatter `type` field is `'post' | 'event'`
- Path alias: `@/*` maps to `src/*`

## File Organization

```
src/
  pages/                        # File-based routing
  components/pages/[name]/      # Page components
    *.astro                     #   Astro wrapper (server)
    *.tsx                       #   SolidJS components (client)
  content/updates/              # Markdown posts with frontmatter
  layouts/main-layout.astro     # Shared layout
  locales/
    en.json                     # English translations
    fr.json                     # French translations — ALWAYS update BOTH
```

When adding or changing any user-facing text, update both `en.json` and `fr.json`.

## Styling Conventions

| Element | Value |
|---------|-------|
| Orange accent (CTAs) | `#cc6c11` |
| Cream background | `#fff0cb` |
| Sage green text | `#3f573e` |
| Font | Space Grotesk (400, 500, 700) |
| Typography | Fluid with `clamp()` |

Common component patterns:

- Cards: `bg-white/70 backdrop-blur-md rounded-lg shadow-md`
- Primary buttons: `bg-yellow-500 hover:bg-yellow-600 rounded-full`

## Git Conventions

Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`

## Verification

Always run `npm run build` after any change. The build will catch:

- Broken imports and missing files
- Invalid frontmatter schemas
- Astro/SolidJS compilation errors
- TypeScript type errors
