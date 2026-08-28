# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Dependencies are not committed — run `npm install` before anything else.

- `npm start` — dev server on http://localhost:3000
- `npm run build` — production bundle into `build/`
- `npm test` — Jest + React Testing Library in watch mode (via react-scripts)
- `npm test -- --testPathPattern=App` — run a single test file by path pattern
- `npm test -- --watchAll=false` — single non-interactive run (use this in CI or when verifying)

There is no lint script; ESLint runs as part of `react-scripts start`/`build` using the `react-app` config declared in `package.json`.

## Architecture

Create React App (react-scripts 5) + Tailwind, deployed at https://www.fadydib.com.

**The entire site is one page.** `src/App.js` declares a single route `/` rendering `src/pages/home.jsx`. That file owns the header, mobile menu, hero, and the four `<section>` landmarks (`#home`, `#about`, `#projects`, `#contact`) and composes the components. Navigation is not routing — it is `scrollIntoView` on those section IDs, and the "HOME" link calls `window.location.reload()`. Adding a real second page means adding a `<Route>` and reconsidering that scroll-based nav.

**Content lives in `src/utils/data.js`**, not in components. It exports `portfolio` (the animated stat counters), `skills` (string array), and `projects` (title/image/optional url). Project and client logos are imported as ES modules from `src/assets/images/`, so adding a project means adding an import there. Components receive this data as props from `home.jsx` — they never import it directly.

**Redux is scaffolded but inert.** `src/store.js` configures an empty reducer map and the `<Provider>` is commented out in `src/index.js`. Treat state as local `useState` unless you deliberately wire Redux up.

### Components (`src/components/`)

- **`About.jsx`** — the most intricate file. It runs two imperative animation systems on mount: SplitType splits `.split-lines` text into lines, injects a `.line-mask` div into each, and GSAP ScrollTrigger animates those masks to `width: 0`; separately, `setup`/`addDigit`/`scrollNumber` build an odometer by injecting ten `<span>` digits per column and translating them with CSS transforms. Both depend on class names and structure defined in `src/App.css` (`.line-mask`, `.n-scroll`, `#number`) — changing the markup or those CSS rules breaks the animations silently. Note the `useEffect` has no dependency array (trailing comma), so it re-runs every render, and `visitedSectionsRef` is what prevents the counters from restarting.
- **`Projects.jsx`** — react-slick carousel. It does not use slick's responsive config; instead a `resize` listener sets `groupSize` (6/4/2/1 by breakpoint) and projects are manually chunked into that many per slide, with the grid column count derived from `groupSize`.
- **`Contact.jsx`** — EmailJS (`emailjs-com`) sending directly from the browser, wrapped in `GoogleReCaptchaProvider` (reCAPTCHA v3). The EmailJS service/template/public IDs and the reCAPTCHA site key are hardcoded in the file. The reCAPTCHA token is fetched once via `executeRecaptcha` in an effect rather than per-submit, so a long-open page can submit with a stale token. There is no server — nothing verifies the reCAPTCHA response.
- **`Footer.jsx`** — static links; the GitHub icon is loaded from icons8's CDN rather than the local `github-ico.png`, which is still imported but unused.

### Styling

Tailwind utilities inline, with colors written as arbitrary hex values (`#1F4959`, `#204958`, `#CDF8C9`, `#b8e4c3`) rather than theme tokens — there is no palette in `tailwind.config.js`, only a `custom: 551px` screen and a `fade-in` animation. `src/index.css` defines `.inter-*` font-weight helper classes (Inter is loaded via a Google Fonts `<link>` in `public/index.html`, not self-hosted). `src/App.css` holds what Tailwind can't express: section backgrounds, the odometer and line-mask animation rules, and `.underline-part` heading underlines.

### SEO

All metadata is static in `public/index.html`: description, OpenGraph, Twitter card, JSON-LD, canonical, Google site verification, and the gtag/GA4 snippet (`G-FN1YQVM26L`). `public/sitemap.xml` and `public/robots.txt` are maintained by hand. Because CRA ships an empty `<div id="root">`, page content is not in the served HTML — any SEO work beyond these tags is limited by client-side rendering.
