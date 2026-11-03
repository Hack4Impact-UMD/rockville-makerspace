# Frontend assets

Images and icons used by the app. Import them from code so Vite fingerprints
them (cache-busting) and the build fails if a file goes missing:

```tsx
import workshopBg from "@frontend/assets/images/backgrounds/workshop.jpg";

<div style={{ backgroundImage: `url(${workshopBg})` }} />;
// or <img src={workshopBg} alt="..." />
```

CSS can reference them with a relative path too:
`background-image: url("../assets/images/backgrounds/workshop.jpg");`

| Folder                | For                                     |
| --------------------- | --------------------------------------- |
| `images/backgrounds/` | full-screen / section background photos |
| `images/logos/`       | Rockville Makerspace and partner logos  |
| `icons/`              | small UI icons (prefer `.svg`)          |

Naming: lowercase-kebab-case (`member-search-bg.jpg`), no spaces.
Size: compress photos before committing (aim for under ~500 KB; `.webp` is smallest).

Not here:

- `packages/frontend/public/` is only for files that need a fixed URL and are
  never imported (e.g. `favicon.svg`, `robots.txt`).
- `/assets/` at the repo root is for the README (team photos), not the app.
