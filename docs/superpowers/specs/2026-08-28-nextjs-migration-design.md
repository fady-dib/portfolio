# Next.js Migration + Design Refresh

**Date:** 2026-08-28
**Branch:** `next-js`
**Status:** Approved, pending implementation plan

## Goal

Move `fadydib.com` from Create React App to Next.js so the site's content is present in the served HTML, and refresh the visual design with a new palette and a light/dark theme.

Two outcomes, one migration:

1. **SEO.** CRA serves an empty `<div id="root">`. No crawler sees the hero copy, the about text, the skills, or the project names without executing JavaScript. Static generation fixes this at the root; everything else in the SEO section is secondary.
2. **Design.** Same content and same sections, new palette, modernized layout, light and dark themes.

Non-goals: new content, a blog, a CMS, multiple routes, i18n.

## Current state

Single-page CRA app. `src/App.js` routes `/` to `src/pages/home.jsx`, which owns the header, mobile menu, hero, and four `<section>` landmarks (`#home`, `#about`, `#projects`, `#contact`). Content lives in `src/utils/data.js` and is passed down as props. Redux is installed and configured but the `Provider` is commented out and the reducer map is empty.

Known defects to fix as part of the work, not separately:

- JSON-LD in `public/index.html` uses `"@type": "website"` (should be `WebSite` — the value is case-sensitive) and hangs `jobTitle`/`worksFor`, which are `Person` properties, off a website object. Search engines likely discard it.
- `Contact.jsx` fetches a reCAPTCHA token once on mount and never verifies it anywhere. There is no server, so the token is decorative and the form is unprotected. Long-open pages submit a stale token.
- `About.jsx` runs a `useEffect` with no dependency array (a trailing comma where the array should be), so it re-runs on every render, re-registering GSAP and re-scanning the DOM.
- The footer GitHub icon loads from icons8's CDN and the WhatsApp button from Wikipedia's upload host — uncontrolled third-party requests on the critical path. `github-ico.png` is imported and unused.
- Nav is `onClick` + `scrollIntoView` rather than anchors, so it does not work without JS and the section links are invisible to crawlers. "HOME" calls `window.location.reload()`.

## Stack

| | Version | Note |
|---|---|---|
| Next.js | 16.3 | App Router |
| React | 19.2 | Server Components, Server Actions |
| TypeScript | 5.x | full conversion from `.jsx` |
| Tailwind | 4.3 | CSS-first config |
| next-themes | 0.4 | light/dark toggle |

Migrated in place on `next-js`, preserving git history. Not a new repository, not a subdirectory.

Two consequences of the versions chosen, both verified against current docs:

- **Tailwind v4 has no `tailwind.config.js`.** Configuration moves into CSS via `@theme`. The existing config file is deleted rather than ported; its `custom: 551px` breakpoint becomes `--breakpoint-custom` and the `fade-in` keyframes move into the stylesheet. `@tailwindcss/aspect-ratio` is dropped — v4 relies on the native `aspect-ratio` property.
- **Next.js 16 removed `next lint`** in favour of the ESLint CLI, and Turbopack is the default for both `next dev` and `next build`. No custom webpack config is needed or wanted; adding one would force builds onto the `--webpack` flag.

## Architecture

### Routing

The site stays a **single page with hash sections**. Splitting `/about` and `/projects` into routes would manufacture thin pages — the projects are client logos linking to external sites, with no unique content of their own to rank. One substantial page outranks four thin ones.

What changes is that nav becomes real `<a href="#about">` anchors instead of click handlers, so links are crawlable and work without JavaScript. Smooth scrolling comes from `scroll-behavior: smooth` in CSS, wrapped in a `prefers-reduced-motion` guard, rather than `scrollIntoView`. The "HOME" link stops reloading the page.

### Component boundaries

Server Components by default. A component becomes a Client Component only if it needs state, effects, or event handlers:

| Component | Kind | Reason |
|---|---|---|
| `app/page.tsx` shell, `Hero`, `AboutCopy`, `Skills`, `ProjectCard`, `Footer` | Server | static content, no interactivity |
| `ThemeToggle` | Client | reads/writes theme |
| `MobileNav` | Client | open/close state |
| `ContactForm` | Client | form state, pending UI |
| `CountUp` | Client | IntersectionObserver + rAF |

The rule to hold to: interactivity lives in small leaf components, so the text stays server-rendered. A Client Component boundary placed too high in the tree pulls the content back out of the static HTML and undoes the migration's whole purpose.

### Data

`src/utils/data.js` becomes `lib/content.ts` with typed exports:

```ts
type Stat    = { number: number; title: string; text: string }
type Project = { title: string; image: StaticImageData; url?: string }
```

Images stay static imports so `next/image` receives intrinsic dimensions at build time and can reserve layout space, which is what prevents cumulative layout shift.

### File layout

```
app/
  layout.tsx          root layout, metadata, fonts, theme provider
  page.tsx            the single page, composes sections
  globals.css         @import "tailwindcss", @theme tokens, base styles
  sitemap.ts          replaces public/sitemap.xml
  robots.ts           replaces public/robots.txt
  actions/contact.ts  "use server" form handler
components/
  hero.tsx  about.tsx  count-up.tsx  skills.tsx
  projects.tsx  contact-form.tsx  footer.tsx
  site-header.tsx  mobile-nav.tsx  theme-toggle.tsx
lib/
  content.ts          typed content + static image imports
  schema.ts           JSON-LD builders
public/               favicon, og image, static assets
```

## Design system

Tokens are CSS custom properties declared in `@theme`, with light as the `:root` default and dark applied by a `.dark` class. Tailwind v4 does not use a `darkMode` config key — the class-based variant is registered in CSS:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

`next-themes` sets the class on `<html>`, which requires `suppressHydrationWarning` on that element because the class is written by a pre-hydration script and would otherwise mismatch.

### Palette

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#FAF9F7` | `#0B0F14` |
| `--color-surface` | `#FFFFFF` | `#151B23` |
| `--color-border` | `#E6E2DC` | `#232C38` |
| `--color-text` | `#141210` | `#E8EDF4` |
| `--color-muted` | `#6B645C` | `#8A97A8` |
| `--color-accent` | `#B45309` | `#F5A524` |
| `--color-accent-soft` | `#FEF3C7` | `#3A2A0B` |

The accent darkens in light mode because `#F5A524` on white is roughly 2:1 contrast — it fails WCAG AA for text. `#B45309` clears 4.5:1. Both are the same hue, so the brand reads as continuous across themes. Every existing hardcoded hex (`#1F4959`, `#204958`, `#CDF8C9`, `#b8e4c3`, `#2B4A4D`, `#32819F`, `#E0F5FF`) is replaced by a token; no raw hex values remain in components.

### Typography

Inter, self-hosted through `next/font/google`, which removes the render-blocking request to `fonts.googleapis.com` in the current `<head>` and eliminates the flash of unstyled text. This is a direct LCP improvement, not a cosmetic one.

The nine `.inter-*` helper classes in `index.css` are deleted. They duplicate Tailwind's `font-*` weight utilities, which is why the codebase currently mixes both. A defined type scale replaces the arbitrary `text-[35px]` / `text-[28px]` / `text-[60px]` values.

## SEO

- **Metadata API** in `app/layout.tsx` replaces the hand-written tags in `public/index.html`: title template, description, OpenGraph, Twitter card, canonical, and the Google site verification token (`Cj0HXgiwEoZFLgeqWW_ue-yly-VWotez1U2Hl5sG8Mo`). `metadataBase` is set to the production origin so OG image URLs resolve absolutely.
- **Corrected JSON-LD** in `lib/schema.ts`: a `Person` node carrying `jobTitle`, `sameAs`, and `knowsAbout`, plus a `WebSite` node, emitted as a `@graph`. Replaces the malformed object described above.
- **`app/sitemap.ts` and `app/robots.ts`** generate what are currently two hand-maintained static files.
- **`next/image`** for every local asset, producing responsive `srcset` and AVIF/WebP. The hero portrait gets `priority`; everything below the fold stays lazy. Project logos keep `object-contain` so varied aspect ratios are not distorted.
- **GA4** (`G-FN1YQVM26L`) moves to `next/script` with `afterInteractive`, so it stops competing with first paint.
- **Third-party images come local**: the icons8 GitHub glyph and the Wikipedia WhatsApp mark are vendored into `public/`, removing two uncontrolled external requests.

## Components to rewrite

Two components are rewritten rather than ported. Both are load-bearing decisions, so the reasoning is recorded here.

### Stat counters (`About.jsx` → `CountUp`)

The current odometer injects ten `<span>` elements per digit with `insertAdjacentHTML`, drives them with inline `transform` styles, tracks which sections have animated in a `Set` ref, listens on `scroll`, and depends on `#number` / `.n-scroll` rules in `App.css`. SplitType additionally mutates DOM that React owns. It works, but it is imperative DOM manipulation underneath a framework that assumes it owns the tree, and the missing dependency array makes it re-run continuously.

Replacement: a `CountUp` client component using `IntersectionObserver` to trigger once and `requestAnimationFrame` to interpolate, honouring `prefers-reduced-motion` by rendering the final value immediately.

### Scroll reveal (`split-type` + GSAP → `useInView`)

The about text currently animates line by line: SplitType splits the paragraph into `.line` elements, a `.line-mask` div is injected into each, and GSAP ScrollTrigger animates the masks to `width: 0`.

Both libraries exist to serve that one effect, and SplitType's DOM mutation is what makes it fragile — it rewrites text nodes React owns. Replacing the per-line reveal with a per-element fade-and-rise gives a comparable result with no library at all: one `useInView` hook wrapping `IntersectionObserver`, and a CSS transition.

The same hook drives `CountUp`, so the observer logic is written and tested once. **Drops `split-type`, `gsap`, and `@gsap/react`.**

### Projects carousel (`Projects.jsx`)

react-slick is a jQuery-era library that ships its own CSS, does not server-render cleanly, and is already being worked around — the component ignores slick's `responsive` config and reimplements breakpoints with a `resize` listener, manually chunking projects into slides.

Replacement: a CSS scroll-snap row (`overflow-x: auto`, `scroll-snap-type: x mandatory`). Zero JavaScript, renders on the server, scrolls natively on touch, and is keyboard-accessible. **Drops `react-slick` and `slick-carousel`.**

### Deletions

Full list, including the dependencies dropped by the two rewrites above.

**Dependencies:** `@reduxjs/toolkit`, `react-redux`, `redux` (empty store, `Provider` commented out), `react-router-dom` (one route), `react-scripts`, `web-vitals`, `split-type` + `gsap` + `@gsap/react` (replaced by `useInView`), `react-slick` + `slick-carousel` (replaced by scroll-snap), `@tailwindcss/aspect-ratio` (native in v4), `emailjs-com` (server now calls the REST API directly), `react-google-recaptcha-v3` (token requested via the `grecaptcha` script at submit time), and the CRA testing-library packages, superseded by Vitest.

Every runtime dependency in the current `package.json` is removed. The new one runs on `next`, `react`, `react-dom`, and `next-themes`.

**Files:** `reportWebVitals.js`, `setupTests.js`, `App.test.js`, `App.js`, `pages/home.jsx`, `src/logo.svg`, `src/assets/images/github-ico.png`, `tailwind.config.js`, `public/index.html`, `public/sitemap.xml`, `public/robots.txt`. `App.css` and `index.css` are folded into `app/globals.css`, minus the odometer and `.inter-*` rules, which no longer have consumers.

## Contact form

```
ContactForm (client)     grecaptcha.execute() on submit, not on mount
    ↓ useActionState
submitContact (server)   "use server"
    ↓                    1. validate name / email / message
    ↓                    2. POST token to google siteverify
    ↓                    3. reject if !success or score < 0.5
    ↓                    4. send via EmailJS REST API
returns { ok } | { error }
```

The token is generated at submit time rather than on mount, which fixes the stale-token problem. Verification happens server-side, which is the point — today nothing checks it. Credentials move out of the bundle into environment variables.

Deploy target is Vercel via GitHub, so the Node runtime a Server Action needs is available.

### Environment variables

| Name | Scope | Source |
|---|---|---|
| `EMAILJS_SERVICE_ID` | server | EmailJS dashboard |
| `EMAILJS_TEMPLATE_ID` | server | EmailJS dashboard |
| `EMAILJS_PUBLIC_KEY` | server | EmailJS dashboard |
| `EMAILJS_PRIVATE_KEY` | server | EmailJS → Account → API Keys, **"Allow API calls" must be enabled** |
| `RECAPTCHA_SECRET_KEY` | server | Google reCAPTCHA admin console |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | client | existing: `6LeBMMIqAAAAAL_OwMDNqGpTTO21ZpvlOFgWIdTH` |
| `NEXT_PUBLIC_SITE_URL` | client | `https://www.fadydib.com` |
| `NEXT_PUBLIC_GA_ID` | client | existing: `G-FN1YQVM26L` |

`.env.example` is committed; `.env.local` is not. The two secrets must also be added in the Vercel dashboard, or the form works locally and fails in production.

The old hardcoded EmailJS IDs have been public in the repository and in the client bundle. Rotating them is advisable but is the owner's call, and is out of scope here.

## Deployment

Vercel, via GitHub. Two things to check before the first deploy:

1. **The Vercel project's Framework Preset may be pinned to Create React App**, with output directory `build`. If it is set explicitly rather than auto-detected, the first Next.js build fails. Set the preset to Next.js and clear the output directory override.
2. Pushing `next-js` produces a preview deployment on its own URL. Production is untouched until `next-js` merges to `main`, so the preview is where the redesign gets reviewed.

## Verification

CRA's Jest setup disappears with `react-scripts`, replaced by Vitest + Testing Library. Coverage is deliberately light — this is a portfolio, not a product:

- `CountUp` reaches its target value and respects `prefers-reduced-motion`
- `submitContact` rejects a missing token, a failed siteverify, and a low score, and does not send mail in any of those cases
- Contact form renders its error and success states

The check that actually proves the migration worked is not a unit test. After `next build`, fetch the rendered page and confirm the hero copy, about paragraphs, skill names, and all ten project titles appear in the raw HTML. That is the difference between the old site and the new one, and it gets demonstrated rather than asserted.

Also verified before calling the work done: Lighthouse SEO and accessibility on the preview URL, both themes checked for contrast, and keyboard navigation through the project carousel.

## Risks

| Risk | Mitigation |
|---|---|
| EmailJS private key unavailable or API calls disabled on the account | Form is built last; if blocked, ship with client-side EmailJS and a TODO rather than block the migration |
| Vercel preset pinned to CRA breaks the first deploy | Checked before pushing, noted above |
| React 19 Strict Mode double-invoking effects | `useInView` disconnects its observer in the effect cleanup and latches on first intersection, so a double invoke is idempotent |
| Theme flash on first paint | `next-themes` injects a pre-hydration script; `suppressHydrationWarning` on `<html>` |
| Redesign lands badly | Preview URL exists before anything reaches production |
