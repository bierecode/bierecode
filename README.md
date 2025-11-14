# Bière Code Site

Bière Code runs on [Astro](https://astro.build) as a fully static site. Community updates are managed as markdown files using Astro content collections.

## Stack
- **Astro 5** for static site generation
- **Astro Content Collections** for managing community updates
- **MDX** for rich markdown content
- **SolidJS** for interactive components
- **Tailwind CSS** for styling

## Local Development
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm run dev
   ```
   The site will be available at <http://localhost:4321>.
3. **Build the static site**
   ```bash
   npm run build
   ```
4. **Preview the production build**
   ```bash
   npm run preview
   ```

### Useful scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start Astro dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the static build |

## Managing Content

### Community Updates
Community updates are stored as markdown files in `src/content/updates/`. To add a new update:

1. Create a new `.md` file in `src/content/updates/`
2. Add frontmatter with the required fields:
   ```markdown
   ---
   title: "Your Update Title"
   published: 2025-01-15T10:00:00Z
   type: post  # or "event"
   tags: ["tag1", "tag2"]
   ---

   Your content here...
   ```

For events, you can add event details:
```markdown
---
title: "Upcoming Meetup"
published: 2025-01-15T10:00:00Z
type: event
tags: ["meetup"]
event:
  date: "2025-02-01"
  time: "18:00"
  location: "Paris, France"
  duration: "2 hours"
---

Event details here...
```

The updates will automatically appear on the `/updates` page, sorted by publish date.

## Deployment
This is a static site that can be deployed to any static hosting provider:
- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages
- Any other static hosting service

Simply build the site with `npm run build` and deploy the `dist/` directory.

