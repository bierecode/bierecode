# Claude Context -- bierecode.com Website

Astro 5 static site for [bierecode.com](https://www.bierecode.com), a Paris-based tech meetup combining beer and coding.

## Working In SAM

If `SAM_WORKSPACE_ID` is present, this repo is running inside a SAM workspace.

- **Start with `get_instructions`.** Do this before reading files, running builds, or changing routes so you have the output branch and task-specific rules.
- **Pull prior context before inventing content.** Use `search_messages` and `search_tasks` when adding pages, event copy, or strategy-driven content so you do not restate assumptions as facts.
- **Push often because the workspace is ephemeral.** After a passing `npm run build`, a new content page, or a completed i18n change, commit and push the output branch. Unpushed work is disposable here.
- **This repo lives inside the `global` submodule workspace.** If your task changes this repo, push here first. If the parent repo also needs the new submodule pointer, update `global/` after the submodule push.
- **Check shared files before editing.** `src/locales/en.json`, `src/locales/fr.json`, `src/content/updates/`, `src/layouts/main-layout.astro`, and shared page components are common conflict points. Use `list_project_agents` before modifying them.
- **Use SAM network tools for previews.** When the human needs to see a page, run `npm run dev` or `npm run preview` and register the port with `expose_port` instead of only describing the result.
- **Verify honestly.** Run `npm run build` after every change. After pushing, use `gh` if you need to inspect workflow status for the branch. Do not claim deployment unless `get_deployment_status` or the hosting pipeline actually confirms it.

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
