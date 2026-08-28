# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (Turbopack) on http://localhost:3000
- `npm run build` — production build
- `npm start` — serve the production build
- `npm test` — Vitest, single run
- `npm test -- projects` — run one test file by name fragment
- `npm run lint` — ESLint

`next lint` does not exist in Next.js 16; lint through the ESLint CLI, which is what `npm run lint` does. Turbopack is the default for both `dev` and `build` — do not add a webpack config, or builds will require the `--webpack` flag.

## Architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind v4. Deployed to Vercel from GitHub. Migrated from Create React App in August 2026; the design spec and implementation plan are in `docs/superpowers/`.

**One statically generated page.** `app/page.tsx` composes the sections; there are no other routes. Navigation is real `<a href="#about">` anchors into four `<section>` landmarks (`#home`, `#about`, `#projects`, `#contact`), with smooth scrolling from CSS. Splitting into separate routes was considered and rejected — the projects are client logos linking to external sites, so per-project pages would be thin.

**Server Components by default.** Only four components are clients: `theme-toggle`, `mobile-nav`, `contact-form`, and anything using `useInView` (`count-up`, `reveal`). This is load-bearing: the entire point of the migration was getting content into the served HTML, and a `"use client"` directive placed on a section component pulls its text back out. If you add one, re-run the verification below.

**Content lives in `lib/content.ts`** as typed exports (`SITE`, `stats`, `skills`, `projects`). Project images are static imports so `next/image` gets intrinsic dimensions at build time. Adding a project means adding an import there — components never define content.

### Styling

Tailwind v4 with **no config file** — tokens are declared in `app/globals.css`. The pattern matters:

- Raw palette values are CSS custom properties on `:root` and `.dark`
- `@theme inline` maps them to Tailwind colours (`--color-bg: var(--bg)`)
- `@custom-variant dark (&:where(.dark, .dark *))` registers the class-based dark variant

`inline` is required, not stylistic: without it the utilities emit a var-of-var that fails to resolve when `.dark` sits on an ancestor rather than the element.

`next-themes` sets the class on `<html>`, which is why `<html>` carries `suppressHydrationWarning` — the class is written by a pre-hydration script and would otherwise mismatch.

**No raw hex in components.** Everything goes through a token. One deliberate exception in the token file: `--logo-plate` is defined only in `:root` and never overridden in `.dark`, because several client logos are dark artwork on transparent backgrounds and vanish on a dark card.

### Client-side behaviour

`lib/use-in-view.ts` is the single IntersectionObserver hook behind both the stat counters and the scroll reveals. It **latches** — once in view it stays in view and disconnects — which makes Strict Mode double-invokes idempotent. It takes the observer from the callback's second argument rather than closing over the variable, because an entry can arrive before the constructor returns.

`lib/use-reduced-motion.ts` reads `prefers-reduced-motion` through `useSyncExternalStore`, not an effect. Assigning it to state inside an effect trips `react-hooks/set-state-in-effect` and causes a cascading render.

### Contact form

`components/contact-form.tsx` posts to the `submitContact` Server Action in `app/actions/contact.ts`, which verifies the reCAPTCHA token against Google's `siteverify` and checks the score before sending through the EmailJS REST API. The reCAPTCHA token is minted at submit time, not on mount.

Requires the environment variables in `.env.example`, set both in `.env.local` and in the Vercel dashboard. `EMAILJS_PRIVATE_KEY` needs "Allow API calls" enabled on the EmailJS account. Provider errors are logged server-side and never returned to the visitor.

### SEO

Metadata is the Metadata API in `app/layout.tsx`. Structured data is built in `lib/schema.ts` as a `Person` + `WebSite` graph. `app/sitemap.ts` and `app/robots.ts` generate what used to be hand-maintained static files.

**Verifying the migration still holds** — after any structural change:

```bash
npm run build && npm start &
curl -s http://localhost:3000 | grep -c "Sigma Cylinders"
```

Content must appear in the raw HTML. On `main` (the old CRA site) that count was 0 for every string, because CRA served an empty `<div id="root">`.

## Testing

Vitest + Testing Library, jsdom. Two setup details worth knowing:

- `vitest.setup.ts` polyfills `matchMedia`, which jsdom does not implement and `next-themes` calls during render.
- `vitest.config.ts` includes a `staticImageData` plugin. Next resolves image imports to a `StaticImageData` object; Vite resolves them to a URL string, which makes `next/image` throw "missing required width property" on markup that builds correctly. The plugin matches Next's shape so the real `next/image` stays under test.
