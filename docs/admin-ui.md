# Admin UI Design

This document outlines the design philosophy for the `/admin` interface.

The admin page allows community organizers to publish new posts and events. It is built with SolidJS and styled using Tailwind CSS.

## Goals
- **Clarity**: keep the interface focused on content entry with minimal distractions.
- **Accessibility**: use labels and semantic markup so screen readers can announce form fields correctly.
- **Responsiveness**: maintain comfortable margins and spacing on both mobile and desktop screens.
- **Feedback**: show clear status messages after submitting a post.

The form is implemented in `src/components/pages/admin/components/admin-form/admin-form.tsx`.
