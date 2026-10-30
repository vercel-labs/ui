# Tracker

An issue tracker built on ui-sdk, the same app in each framework. It uses about thirty components together: tabs, menus, a command palette, dialogs, a resizable split, comboboxes, a tree, a date picker, toasts and more.

- `data/`: the seed issues, people and labels every version shares.
- `react/`: Next.js, on port 5600.
- `svelte/`: SvelteKit, on port 5601.
- `vue/`: Nuxt, on port 5602.
- `solid/`: Solid with Vite, on port 5603.
- `web/`: web components with lit-html and Vite, on port 5604.

## Run it

```bash
pnpm install
pnpm --filter tracker-react dev
```

Open http://localhost:5600. For another framework, swap in `tracker-svelte`, `tracker-vue`, `tracker-solid` or `tracker-web` and open its port. Set `TRACKER_PORT` to use another port. Changes live in memory, on the server for React, Svelte and Vue and in the page for Solid and web components, so a restart or a reload brings the seed data back.

## Try

- Press ⌘K or Ctrl+K to search issues and run commands, and C to create an issue.
- Select rows to change their status or delete them together, or use a row's ⋯ menu.
- Open an issue to edit it in the side panel. Drag the divider to resize it; the size is kept, in a cookie for the server-rendered versions.
- Type @ in a comment to mention someone, then hover the mention.
- On a phone, filters open in a drawer.
