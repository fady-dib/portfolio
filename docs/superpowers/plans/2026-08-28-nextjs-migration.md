# Next.js Migration + Design Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Create React App portfolio with a Next.js 16 App Router site whose content is server-rendered into the HTML, restyled with a new palette and a light/dark theme.

**Architecture:** One statically generated page composed of Server Components, with client interactivity isolated to four leaf components (theme toggle, mobile nav, contact form, scroll-triggered animation). Content is a typed module consumed at build time. The contact form posts to a Server Action that verifies reCAPTCHA server-side before sending mail.

**Tech Stack:** Next.js 16.3, React 19.2, TypeScript 5, Tailwind CSS 4.3, next-themes 0.4, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-28-nextjs-migration-design.md`

## Global Constraints

- Branch is `next-js`. Never commit to `main`.
- Migration is **in place** — same repository, same git history. Not a subdirectory, not a fresh `create-next-app` in a new folder.
- **No `tailwind.config.js`.** Tailwind v4 is configured in CSS with `@theme` / `@theme inline`. Creating a config file is a defect.
- **No custom webpack config.** Turbopack is the default builder in Next.js 16; a webpack config forces builds onto `--webpack`.
- **`next lint` does not exist in Next.js 16.** Lint with the ESLint CLI.
- **Server Components by default.** Add `"use client"` only to the four components this plan names. A `"use client"` directive on a section component pulls its text out of the static HTML and defeats the migration.
- **No raw hex colours in components.** Every colour is a token from `app/globals.css`. The old values (`#1F4959`, `#204958`, `#CDF8C9`, `#b8e4c3`, `#2B4A4D`, `#32819F`, `#E0F5FF`) must not appear outside that file.
- Palette, verbatim:

  | Token | Light | Dark |
  |---|---|---|
  | `--bg` | `#FAF9F7` | `#0B0F14` |
  | `--surface` | `#FFFFFF` | `#151B23` |
  | `--border` | `#E6E2DC` | `#232C38` |
  | `--text` | `#141210` | `#E8EDF4` |
  | `--muted` | `#6B645C` | `#8A97A8` |
  | `--accent` | `#B45309` | `#F5A524` |
  | `--accent-soft` | `#FEF3C7` | `#3A2A0B` |

- Secrets live in `.env.local` (gitignored) and the Vercel dashboard. Never inline a key in source. `NEXT_PUBLIC_*` is for values that are already public by nature.
- Every task ends with a commit. Run `npm run build` before any commit that touches `app/` or `components/`.

---

### Task 1: Replace the CRA toolchain with Next.js

Strips CRA out and stands up a Next.js app that builds. The page renders a placeholder — real sections arrive in later tasks. This is the only task that leaves the site visually broken, which is why it does not touch design.

**Files:**
- Modify: `package.json` (full rewrite of deps and scripts)
- Create: `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `next-env.d.ts` (generated), `.env.example`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Delete: `src/App.js`, `src/App.css`, `src/App.test.js`, `src/index.js`, `src/index.css`, `src/store.js`, `src/logo.svg`, `src/reportWebVitals.js`, `src/setupTests.js`, `src/pages/home.jsx`, `src/components/*.jsx`, `src/assets/images/github-ico.png`, `tailwind.config.js`, `public/index.html`, `public/sitemap.xml`, `public/robots.txt`, `public/manifest.json`
- Move: `src/assets/images/*` → `assets/` (keep `background.webp`, `common-bg.svg` only if a later task uses them; the hero background is replaced in Task 5, so `background.webp` and `common-bg.svg` are deleted)
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing
- Produces: a `npm run build` that succeeds; path alias `@/*` → repo root; `npm test` runs Vitest

- [ ] **Step 1: Write the new `package.json`**

```json
{
  "name": "portfolio",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^16.3.3",
    "next-themes": "^0.4.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-config-next": "^16.3.3",
    "jsdom": "^25.0.1",
    "tailwindcss": "^4.3.3",
    "typescript": "^5.7.2",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Delete the CRA files**

Order matters: move the assets while they are still tracked, then delete the rest. Running `git rm --cached` first would untrack the files and make `git mv` fail.

```bash
mkdir -p assets
git mv src/assets/images/africell.webp src/assets/images/homeresa.png src/assets/images/olm.png \
  src/assets/images/logo-ball.webp src/assets/images/neo-4496.svg src/assets/images/mabanee.png \
  src/assets/images/yousport-logo.webp src/assets/images/yellow_door.png src/assets/images/hibou-logo.webp \
  src/assets/images/sigma-logo.jpeg src/assets/images/fady_portfolio_2.webp assets/

git rm -r --quiet src tailwind.config.js public/index.html public/sitemap.xml \
  public/robots.txt public/manifest.json
```

The hamburger and close SVGs are not moved — Task 5 replaces them with inline SVG, so they go with `src/`. `background.webp` and `common-bg.svg` go too; Task 5 replaces the hero background with a CSS gradient.

Expected after this: `public/` holds only `favicon.ico`, `logo.svg`, `fady_portfolio_2.webp`.

- [ ] **Step 3: Write the config files**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

export default nextConfig
```

`postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

`eslint.config.mjs`:

```js
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { ignores: ['.next/**', 'node_modules/**'] },
]
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

`vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Add `@eslint/eslintrc` and install**

```bash
npm install --save-dev @eslint/eslintrc
npm install
```

- [ ] **Step 5: Write a minimal app that builds**

`app/globals.css`:

```css
@import "tailwindcss";
```

`app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fady Dib',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

`app/page.tsx`:

```tsx
export default function Page() {
  return <main>Migration in progress</main>
}
```

- [ ] **Step 6: Update `.gitignore`**

Replace the CRA-specific entries:

```
/node_modules
/.next
/out
/build
.DS_Store
.env*.local
*.tsbuildinfo
next-env.d.ts
/coverage
```

- [ ] **Step 7: Verify the build**

Run: `npm run build`
Expected: PASS. Output lists `/` as a static route (`○`). No webpack warning.

Run: `npm test`
Expected: PASS with "No test files found" — the runner works, there is nothing to run yet.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "build: replace CRA toolchain with Next.js 16 + TypeScript"
```

---

### Task 2: Design tokens, fonts, and theme switching

Establishes the palette, the type scale, and the light/dark mechanism everything else consumes.

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `components/theme-provider.tsx`, `components/theme-toggle.tsx`
- Test: `components/__tests__/theme-toggle.test.tsx`

**Interfaces:**
- Consumes: Task 1's app shell
- Produces:
  - Tailwind colour utilities `bg-bg`, `bg-surface`, `text-text`, `text-muted`, `text-accent`, `border-border`, `bg-accent-soft`
  - `<ThemeProvider>` — wraps children, class-based, system default
  - `<ThemeToggle />` — renders a `<button>` with `aria-label="Toggle theme"`

- [ ] **Step 1: Write the failing test**

`components/__tests__/theme-toggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('ThemeToggle', () => {
  it('exposes an accessible label', () => {
    renderToggle()
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('puts the dark class on the document when toggled to dark', async () => {
    const user = userEvent.setup()
    renderToggle()
    const button = screen.getByRole('button', { name: /toggle theme/i })

    await user.click(button)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- theme-toggle`
Expected: FAIL — cannot resolve `@/components/theme-provider`.

- [ ] **Step 3: Write the theme components**

`components/theme-provider.tsx`:

```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  )
}
```

`components/theme-toggle.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-full border border-border p-2 text-muted transition-colors hover:text-accent"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        {isDark ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  )
}
```

The `mounted` guard matters: `resolvedTheme` is undefined on the server, so rendering the icon from it directly causes a hydration mismatch.

- [ ] **Step 4: Write the tokens into `app/globals.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: #FAF9F7;
  --surface: #FFFFFF;
  --border: #E6E2DC;
  --text: #141210;
  --muted: #6B645C;
  --accent: #B45309;
  --accent-soft: #FEF3C7;
}

.dark {
  --bg: #0B0F14;
  --surface: #151B23;
  --border: #232C38;
  --text: #E8EDF4;
  --muted: #8A97A8;
  --accent: #F5A524;
  --accent-soft: #3A2A0B;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);

  --font-sans: var(--font-inter);

  --breakpoint-custom: 551px;

  --text-display: 4.5rem;
  --text-display--line-height: 1.02;
  --text-display--letter-spacing: -0.03em;
  --text-h2: 2.25rem;
  --text-h2--line-height: 1.1;
  --text-h2--letter-spacing: -0.02em;
}

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 6rem;
  }

  body {
    background-color: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background-color: var(--accent);
    color: var(--bg);
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

`@theme inline` is required rather than plain `@theme` — the tokens reference other CSS variables, and without `inline` the utilities emit a var-of-var that fails to resolve when the `.dark` class is on an ancestor rather than the element itself.

- [ ] **Step 5: Wire fonts and the provider into the layout**

`app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Fady Dib',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

`suppressHydrationWarning` is mandatory — next-themes writes the class before hydration, so the server and client markup differ by design.

- [ ] **Step 6: Run the tests**

Run: `npm test -- theme-toggle`
Expected: PASS, both cases.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, Inter font, and light/dark theme toggle"
```

---

### Task 3: Typed content module

Moves site content out of components and into one typed source, with static image imports so `next/image` gets intrinsic dimensions.

**Files:**
- Create: `lib/content.ts`
- Test: `lib/__tests__/content.test.ts`

**Interfaces:**
- Consumes: images in `assets/`
- Produces:

```ts
export type Stat = { number: number; title: string; text: string }
export type Project = { title: string; image: StaticImageData; url?: string }
export const SITE: { name: string; role: string; tagline: string; url: string;
  email: string; whatsapp: string; linkedin: string; github: string }
export const stats: Stat[]
export const skills: string[]
export const projects: Project[]
```

- [ ] **Step 1: Write the failing test**

`lib/__tests__/content.test.ts`:

```ts
import { projects, skills, stats, SITE } from '@/lib/content'

describe('content', () => {
  it('exposes every project with a title and an image', () => {
    expect(projects).toHaveLength(10)
    for (const project of projects) {
      expect(project.title).toBeTruthy()
      expect(project.image).toBeTruthy()
    }
  })

  it('only uses absolute urls for projects that link out', () => {
    for (const project of projects.filter((p) => p.url)) {
      expect(project.url).toMatch(/^https:\/\//)
    }
  })

  it('exposes three stats and a non-empty skill list', () => {
    expect(stats).toHaveLength(3)
    expect(skills.length).toBeGreaterThan(10)
  })

  it('has a canonical site url without a trailing slash', () => {
    expect(SITE.url).toBe('https://www.fadydib.com')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content`
Expected: FAIL — cannot resolve `@/lib/content`.

- [ ] **Step 3: Write `lib/content.ts`**

```ts
import type { StaticImageData } from 'next/image'

import africell from '@/assets/africell.webp'
import hibou from '@/assets/hibou-logo.webp'
import homeresa from '@/assets/homeresa.png'
import loto from '@/assets/logo-ball.webp'
import mabanee from '@/assets/mabanee.png'
import neo from '@/assets/neo-4496.svg'
import olm from '@/assets/olm.png'
import sigma from '@/assets/sigma-logo.jpeg'
import yellowDoor from '@/assets/yellow_door.png'
import youSport from '@/assets/yousport-logo.webp'

export type Stat = { number: number; title: string; text: string }
export type Project = { title: string; image: StaticImageData; url?: string }

export const SITE = {
  name: 'Fady Dib',
  role: 'Full Stack Developer',
  tagline:
    'Passionate Full Stack Developer dedicated to developing and optimizing websites and web applications for maximum impact',
  url: 'https://www.fadydib.com',
  email: 'contact@fadydib.com',
  whatsapp: 'https://wa.me/96170544067',
  linkedin: 'https://www.linkedin.com/in/fady-dib',
  github: 'https://github.com/fady-dib',
} as const

export const stats: Stat[] = [
  {
    number: 20,
    title: 'Projects Completed',
    text: 'Successfully delivered 20+ diverse projects across web development, showcasing my expertise in building scalable and efficient web applications.',
  },
  {
    number: 3,
    title: 'Years of Experience',
    text: 'With 3+ years of professional experience in web development, I have honed my skills in front-end and back-end technologies.',
  },
  {
    number: 15,
    title: 'Technologies Mastered',
    text: 'Proficient in 15+ key technologies including React, Angular, Node.js, and Tailwind CSS, ensuring flexibility and adaptability in any project.',
  },
]

export const skills: string[] = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'PHP', 'Node.js', 'Express.js',
  'Laravel', 'Angular', 'React', 'Next.js', 'Socket.IO', 'Bootstrap',
  'Tailwind CSS', 'Electron.js', 'SQL', 'NoSQL', 'Redis', 'Redux', 'Strapi', 'Supabase',
]

export const projects: Project[] = [
  { title: 'Homeresa', image: homeresa, url: 'https://www.homeresa.com/' },
  { title: 'Loto Iraq', image: loto, url: 'https://iraqloto.com/en' },
  { title: 'Mabanee', image: mabanee, url: 'https://mabanee.com/en' },
  { title: 'Africell', image: africell },
  { title: 'OLM Website & Mobile App', image: olm, url: 'https://olm.org.lb/ar' },
  { title: 'You Sport', image: youSport, url: 'https://watchyousport.com/en' },
  {
    title: 'Hibou Mobile App',
    image: hibou,
    url: 'https://play.google.com/store/apps/details?id=com.tedmob.hibou&hl=en',
  },
  { title: 'Yellow Door', image: yellowDoor, url: 'https://www.yellowdoorenergy.com/' },
  { title: 'Neo', image: neo, url: 'https://neo.iq/en' },
  { title: 'Sigma Cylinders', image: sigma, url: 'https://www.sigmacylinders.com/' },
]
```

Titles move from SHOUTING to title case — the old markup shouted via content, which is a styling decision. Uppercase now comes from CSS where it belongs.

- [ ] **Step 4: Typecheck the static image imports**

Run: `npx tsc --noEmit`
Expected: PASS.

Do **not** hand-write module declarations for the image types. `next-env.d.ts` references `next/image-types/global`, which already declares `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.avif`, `.ico`, `.bmp`, and `.svg` as `StaticImageData`. Adding a `types/images.d.ts` duplicates those declarations. If this step fails, the cause is a missing `next-env.d.ts` — regenerate it by running `npm run dev` once, not by writing declarations.

- [ ] **Step 5: Run the tests**

Run: `npm test -- content`
Expected: PASS, all four cases.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: extract site content into a typed module"
```

---

### Task 4: `useInView` hook and `CountUp`

The one piece of real client logic. Built before the sections that use it.

**Files:**
- Create: `lib/use-in-view.ts`, `components/count-up.tsx`, `components/reveal.tsx`
- Test: `lib/__tests__/use-in-view.test.tsx`, `components/__tests__/count-up.test.tsx`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `useInView<T extends Element>(): { ref: RefObject<T | null>; inView: boolean }` — latches `true` on first intersection and disconnects
  - `<CountUp value={number} />` — renders `0` until in view, animates to `value`
  - `<Reveal>{children}</Reveal>` — wraps children in a div that fades and rises when scrolled into view

- [ ] **Step 1: Write the failing tests**

`lib/__tests__/use-in-view.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { useInView } from '@/lib/use-in-view'

let trigger: (entries: { isIntersecting: boolean }[]) => void
const disconnect = vi.fn()

beforeEach(() => {
  disconnect.mockClear()
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
        trigger = cb
      }
      observe() {}
      disconnect = disconnect
      unobserve() {}
    },
  )
})

function Probe() {
  const { ref, inView } = useInView<HTMLDivElement>()
  return <div ref={ref} data-testid="probe" data-in-view={inView} />
}

describe('useInView', () => {
  it('starts out of view', () => {
    render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false')
  })

  it('latches to in view and disconnects the observer', () => {
    render(<Probe />)
    act(() => trigger([{ isIntersecting: true }]))
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true')
    expect(disconnect).toHaveBeenCalled()
  })

  it('stays in view after the element leaves again', () => {
    render(<Probe />)
    act(() => trigger([{ isIntersecting: true }]))
    act(() => trigger([{ isIntersecting: false }]))
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true')
  })
})
```

`components/__tests__/count-up.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { CountUp } from '@/components/count-up'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
        cb([{ isIntersecting: true }])
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  )
})

function mockReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  )
}

describe('CountUp', () => {
  it('renders the final value immediately when motion is reduced', () => {
    mockReducedMotion(true)
    render(<CountUp value={20} />)
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('reaches the final value once the animation completes', async () => {
    mockReducedMotion(false)
    render(<CountUp value={15} />)
    expect(await screen.findByText('15', {}, { timeout: 3000 })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- use-in-view count-up`
Expected: FAIL — cannot resolve `@/lib/use-in-view`.

- [ ] **Step 3: Write the hook and components**

`lib/use-in-view.ts`:

```ts
'use client'

import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(rootMargin = '0px 0px -15% 0px') {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || inView) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.1 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [inView, rootMargin])

  return { ref, inView }
}
```

Latching on `inView` and disconnecting is what makes a Strict Mode double-invoke harmless.

`components/count-up.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/lib/use-in-view'

const DURATION_MS = 1600

export function CountUp({ value }: { value: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(value)
      return
    }

    let frame = 0
    let start: number | null = null

    const tick = (now: number) => {
      start ??= now
      const progress = Math.min((now - start) / DURATION_MS, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}
```

`components/reveal.tsx`:

```tsx
'use client'

import { useInView } from '@/lib/use-in-view'

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- use-in-view count-up`
Expected: PASS, all five cases.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useInView hook with CountUp and Reveal components"
```

---

### Task 5: Header, mobile nav, and hero

**Files:**
- Create: `components/site-header.tsx`, `components/mobile-nav.tsx`, `components/hero.tsx`, `lib/nav.ts`
- Modify: `app/page.tsx`
- Test: `components/__tests__/mobile-nav.test.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` (Task 2), `SITE` (Task 3)
- Produces:
  - `NAV_LINKS: { href: string; label: string }[]` from `lib/nav.ts`
  - `<SiteHeader />` server component containing `<MobileNav />` and `<ThemeToggle />`
  - `<Hero />` server component rendering the `#home` section

- [ ] **Step 1: Write the failing test**

`components/__tests__/mobile-nav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNav } from '@/components/mobile-nav'

describe('MobileNav', () => {
  it('starts closed', () => {
    render(<MobileNav />)
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('opens and exposes anchor links to every section', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)

    await user.click(screen.getByRole('button', { name: /open menu/i }))

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })

  it('closes when a link is followed', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)

    await user.click(screen.getByRole('button', { name: /open menu/i }))
    await user.click(screen.getByRole('link', { name: 'About' }))

    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- mobile-nav`
Expected: FAIL — cannot resolve `@/components/mobile-nav`.

- [ ] **Step 3: Write `lib/nav.ts`**

```ts
export const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
] as const
```

- [ ] **Step 4: Write `components/mobile-nav.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { NAV_LINKS } from '@/lib/nav'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-border p-2 text-muted transition-colors hover:text-accent"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-surface"
      >
        <ul className="flex flex-col p-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-accent-soft hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

`hidden` rather than conditional rendering keeps the links in the DOM for crawlers and assistive tech, and the test can query them after opening.

- [ ] **Step 5: Write `components/site-header.tsx`**

```tsx
import Image from 'next/image'
import { MobileNav } from '@/components/mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { NAV_LINKS } from '@/lib/nav'
import { SITE } from '@/lib/content'
import portrait from '@/assets/fady_portfolio_2.webp'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#home" className="flex items-center gap-3">
          <Image
            src={portrait}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
            priority
          />
          <span className="text-sm font-bold tracking-[0.18em] uppercase">{SITE.name}</span>
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative text-sm font-medium tracking-wide text-muted transition-colors hover:text-text after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
```

The portrait is decorative next to the name, so `alt=""` — announcing it would make screen readers read the name twice.

- [ ] **Step 6: Write `components/hero.tsx`**

```tsx
import { SITE } from '@/lib/content'

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-28 md:py-40">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium tracking-wider text-muted uppercase">
          <span className="size-1.5 rounded-full bg-accent" />
          Available for work
        </p>

        <h1 className="max-w-4xl text-5xl font-black tracking-tight text-balance md:text-display">
          {SITE.role.split(' ').slice(0, 2).join(' ')}{' '}
          <span className="text-accent">building fast, durable web products.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg text-pretty text-muted">{SITE.tagline}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-transform duration-300 hover:-translate-y-0.5"
          >
            View work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Compose them in `app/page.tsx`**

```tsx
import { Hero } from '@/components/hero'
import { SiteHeader } from '@/components/site-header'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
      </main>
    </>
  )
}
```

- [ ] **Step 8: Run tests and build**

Run: `npm test -- mobile-nav`
Expected: PASS, all three cases.

Run: `npm run build`
Expected: PASS, `/` still static.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add sticky header, mobile nav, and hero section"
```

---

### Task 6: About and Skills sections

**Files:**
- Create: `components/section-heading.tsx`, `components/about.tsx`, `components/skills.tsx`
- Modify: `app/page.tsx`
- Test: `components/__tests__/about.test.tsx`

**Interfaces:**
- Consumes: `CountUp`, `Reveal` (Task 4), `stats`, `skills` (Task 3)
- Produces: `<SectionHeading eyebrow label>` reusable by Tasks 7 and 8; `<About />` renders `#about`; `<Skills />` renders inside `#about`

- [ ] **Step 1: Write the failing test**

`components/__tests__/about.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { About } from '@/components/about'
import { stats } from '@/lib/content'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  )
})

describe('About', () => {
  it('renders every stat title as static text', () => {
    render(<About />)
    for (const stat of stats) {
      expect(screen.getByText(stat.title)).toBeInTheDocument()
    }
  })

  it('renders the section landmark with the about id', () => {
    const { container } = render(<About />)
    expect(container.querySelector('section#about')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- about`
Expected: FAIL — cannot resolve `@/components/about`.

- [ ] **Step 3: Write `components/section-heading.tsx`**

```tsx
export function SectionHeading({ eyebrow, label }: { eyebrow: string; label: string }) {
  return (
    <div className="mb-14">
      <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      <h2 className="text-4xl font-black tracking-tight md:text-h2">{label}</h2>
    </div>
  )
}
```

- [ ] **Step 4: Write `components/about.tsx`**

```tsx
import { CountUp } from '@/components/count-up'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Skills } from '@/components/skills'
import { stats } from '@/lib/content'

export function About() {
  return (
    <section id="about" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="About" label="Building both sides of the web" />

        <div className="max-w-3xl space-y-5 text-lg text-pretty text-muted">
          <Reveal>
            <p>
              I am a <strong className="font-semibold text-text">Full Stack Web Developer</strong>{' '}
              focused on building and managing both the front-end and back-end of websites and web
              applications, contributing to the overall success of the product.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p>
              Feel free to connect or follow me on LinkedIn and GitHub. I am open to roles where I
              can contribute, learn, and grow.
            </p>
          </Reveal>
        </div>

        <dl className="mt-16 grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal key={stat.title} delay={index * 100}>
              <div className="h-full rounded-2xl border border-border bg-surface p-7">
                <dd className="text-5xl font-black tracking-tight text-accent">
                  <CountUp value={stat.number} />+
                </dd>
                <dt className="mt-3 font-semibold">{stat.title}</dt>
                <p className="mt-3 text-sm leading-relaxed text-muted">{stat.text}</p>
              </div>
            </Reveal>
          ))}
        </dl>

        <Skills />
      </div>
    </section>
  )
}
```

`<dl>` with `<dd>` before `<dt>` is valid and correct here — the number is the value, the label is the term, and visually the number leads.

- [ ] **Step 5: Write `components/skills.tsx`**

```tsx
import { skills } from '@/lib/content'

export function Skills() {
  return (
    <div className="mt-20">
      <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        Tools I work with
      </h3>
      <ul className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 6: Add to `app/page.tsx`**

Insert `<About />` after `<Hero />`, importing it from `@/components/about`.

- [ ] **Step 7: Run tests and build**

Run: `npm test -- about`
Expected: PASS, both cases.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add about section with animated stats and skills"
```

---

### Task 7: Projects section

Replaces the react-slick carousel with a CSS scroll-snap row.

**Files:**
- Create: `components/projects.tsx`
- Modify: `app/page.tsx`
- Test: `components/__tests__/projects.test.tsx`

**Interfaces:**
- Consumes: `projects` (Task 3), `SectionHeading` (Task 6)
- Produces: `<Projects />` renders `#projects`

- [ ] **Step 1: Write the failing test**

`components/__tests__/projects.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Projects } from '@/components/projects'
import { projects } from '@/lib/content'

describe('Projects', () => {
  it('renders every project title in the markup', () => {
    render(<Projects />)
    for (const project of projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument()
    }
  })

  it('links out only for projects that have a url, safely', () => {
    render(<Projects />)
    for (const project of projects.filter((p) => p.url)) {
      const link = screen.getByRole('link', { name: new RegExp(project.title, 'i') })
      expect(link).toHaveAttribute('href', project.url)
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    }
  })

  it('does not render a link for projects without a url', () => {
    render(<Projects />)
    expect(screen.queryByRole('link', { name: /africell/i })).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- projects`
Expected: FAIL — cannot resolve `@/components/projects`.

- [ ] **Step 3: Write `components/projects.tsx`**

```tsx
import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'
import { projects, type Project } from '@/lib/content'

function Card({ project }: { project: Project }) {
  const body = (
    <>
      <div className="flex h-40 items-center justify-center rounded-xl bg-bg p-6">
        <Image
          src={project.image}
          alt={`${project.title} logo`}
          className="max-h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="font-semibold">{project.title}</p>
        {project.url ? (
          <span aria-hidden="true" className="text-muted transition-colors group-hover:text-accent">
            &#8599;
          </span>
        ) : null}
      </div>
    </>
  )

  const className =
    'group block h-full min-w-[17rem] snap-start rounded-2xl border border-border bg-surface p-5 transition-colors duration-300 hover:border-accent md:min-w-0'

  return project.url ? (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  )
}

export function Projects() {
  return (
    <section id="projects" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Work" label="Projects I contributed to" />
      </div>

      <ul className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:grid md:grid-cols-3 md:overflow-visible">
        {projects.map((project) => (
          <li key={project.title} className="contents md:block">
            <Card project={project} />
          </li>
        ))}
      </ul>
    </section>
  )
}
```

Horizontal scroll-snap on small screens, a plain three-column grid from `md` up. No JavaScript, no resize listener, no slide chunking.

- [ ] **Step 4: Add to `app/page.tsx`**

Insert `<Projects />` after `<About />`.

- [ ] **Step 5: Run tests and build**

Run: `npm test -- projects`
Expected: PASS, all three cases.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: replace react-slick carousel with a scroll-snap project grid"
```

---

### Task 8: Contact form with server-side reCAPTCHA verification

The only task needing credentials. If `EMAILJS_PRIVATE_KEY` cannot be obtained, stop and report rather than working around it.

**Files:**
- Create: `app/actions/contact.ts`, `components/contact-form.tsx`, `components/contact.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx` (reCAPTCHA script), `.env.example`
- Test: `app/actions/__tests__/contact.test.ts`

**Interfaces:**
- Consumes: `SITE` (Task 3), `SectionHeading` (Task 6)
- Produces:

```ts
export type ContactState = { status: 'idle' | 'success' | 'error'; message?: string }
export async function submitContact(prev: ContactState, formData: FormData): Promise<ContactState>
```

- [ ] **Step 1: Write the failing test**

`app/actions/__tests__/contact.test.ts`:

```ts
import { submitContact, type ContactState } from '@/app/actions/contact'

const idle: ContactState = { status: 'idle' }

function form(fields: Record<string, string>) {
  const data = new FormData()
  for (const [key, value] of Object.entries(fields)) data.append(key, value)
  return data
}

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like to discuss a project with you.',
  token: 'test-token',
}

beforeEach(() => {
  vi.stubEnv('RECAPTCHA_SECRET_KEY', 'secret')
  vi.stubEnv('EMAILJS_SERVICE_ID', 'service')
  vi.stubEnv('EMAILJS_TEMPLATE_ID', 'template')
  vi.stubEnv('EMAILJS_PUBLIC_KEY', 'public')
  vi.stubEnv('EMAILJS_PRIVATE_KEY', 'private')
  vi.restoreAllMocks()
})

describe('submitContact', () => {
  it('rejects a missing message without calling out', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    const result = await submitContact(idle, form({ ...valid, message: '' }))
    expect(result.status).toBe('error')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('rejects a malformed email without calling out', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    const result = await submitContact(idle, form({ ...valid, email: 'not-an-email' }))
    expect(result.status).toBe('error')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('rejects a missing captcha token without calling out', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    const result = await submitContact(idle, form({ ...valid, token: '' }))
    expect(result.status).toBe('error')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('does not send mail when verification fails', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ success: false, score: 0 })))

    const result = await submitContact(idle, form(valid))

    expect(result.status).toBe('error')
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('does not send mail when the score is below the threshold', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ success: true, score: 0.1 })))

    const result = await submitContact(idle, form(valid))

    expect(result.status).toBe('error')
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('sends mail when verification passes', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, score: 0.9 })))
      .mockResolvedValueOnce(new Response('OK'))

    const result = await submitContact(idle, form(valid))

    expect(result.status).toBe('success')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(fetchSpy.mock.calls[1][0]).toContain('api.emailjs.com')
  })

  it('reports an error when the mail provider fails', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, score: 0.9 })))
      .mockResolvedValueOnce(new Response('Bad Request', { status: 400 }))

    const result = await submitContact(idle, form(valid))

    expect(result.status).toBe('error')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- contact`
Expected: FAIL — cannot resolve `@/app/actions/contact`.

- [ ] **Step 3: Write `app/actions/contact.ts`**

```ts
'use server'

const MIN_SCORE = 0.5
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ContactState = { status: 'idle' | 'success' | 'error'; message?: string }

function fail(message: string): ContactState {
  return { status: 'error', message }
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const token = String(formData.get('token') ?? '').trim()

  if (name.length < 2) return fail('Please enter your name.')
  if (!EMAIL_PATTERN.test(email)) return fail('Please enter a valid email address.')
  if (message.length < 10) return fail('Please write a slightly longer message.')
  if (!token) return fail('Could not verify you are human. Please reload and try again.')

  try {
    const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY ?? '',
        response: token,
      }),
    })

    const verdict = (await verifyResponse.json()) as { success: boolean; score?: number }

    if (!verdict.success || (verdict.score ?? 0) < MIN_SCORE) {
      return fail('Could not verify you are human. Please reload and try again.')
    }

    const sendResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: { name, email, message },
      }),
    })

    if (!sendResponse.ok) {
      return fail('Something went wrong sending your message. Please try again.')
    }

    return { status: 'success', message: 'Thanks — I will get back to you shortly.' }
  } catch {
    return fail('Something went wrong sending your message. Please try again.')
  }
}
```

Validation runs before any network call, so a bad submission costs nothing. The catch returns a generic message rather than the error — provider errors can carry configuration detail that should not reach a visitor.

- [ ] **Step 4: Write `components/contact-form.tsx`**

```tsx
'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { submitContact, type ContactState } from '@/app/actions/contact'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-bg transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send message'}
    </button>
  )
}

const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent'

export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(submitContact, {
    status: 'idle',
  })
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state.status])

  async function handleAction(formData: FormData) {
    const token = await new Promise<string>((resolve) => {
      if (!window.grecaptcha || !SITE_KEY) return resolve('')
      window.grecaptcha.ready(() => {
        window.grecaptcha!.execute(SITE_KEY, { action: 'submit' }).then(resolve).catch(() => resolve(''))
      })
    })
    formData.set('token', token)
    formAction(formData)
  }

  return (
    <form ref={formRef} action={handleAction} className="space-y-5">
      {state.status !== 'idle' && (
        <p
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${
            state.status === 'success'
              ? 'border-accent bg-accent-soft text-accent'
              : 'border-red-500/40 bg-red-500/10 text-red-500'
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">Name</label>
          <input id="name" name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@company.com" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">Message</label>
        <textarea id="message" name="message" rows={7} required className={`${inputClass} resize-none`} placeholder="Tell me about your project" />
      </div>

      <SubmitButton />
    </form>
  )
}
```

The token is fetched inside the submit handler, not on mount — this is the fix for the stale-token bug in the current implementation.

- [ ] **Step 5: Write `components/contact.tsx`**

```tsx
import { ContactForm } from '@/components/contact-form'
import { SectionHeading } from '@/components/section-heading'

export function Contact() {
  return (
    <section id="contact" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading eyebrow="Contact" label="Let's work together" />
        <p className="mb-10 text-lg text-pretty text-muted">
          Send me a message and I will get back to you as soon as I can.
        </p>
        <ContactForm />
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Load the reCAPTCHA script and write `.env.example`**

Add to `app/layout.tsx`, inside `<body>` after `{children}`:

```tsx
<Script
  src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
  strategy="lazyOnload"
/>
```

with `import Script from 'next/script'` at the top.

`.env.example`:

```
# Server-only — never prefixed with NEXT_PUBLIC
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
# EmailJS dashboard > Account > API Keys. "Allow API calls" must be enabled.
EMAILJS_PRIVATE_KEY=
# Google reCAPTCHA admin console > Settings > reCAPTCHA keys
RECAPTCHA_SECRET_KEY=

# Public — safe in the browser bundle
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_PUBLIC_SITE_URL=https://www.fadydib.com
NEXT_PUBLIC_GA_ID=
```

- [ ] **Step 7: Add to `app/page.tsx`**

Insert `<Contact />` after `<Projects />`.

- [ ] **Step 8: Run tests and build**

Run: `npm test -- contact`
Expected: PASS, all seven cases.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add contact form with server-side reCAPTCHA verification"
```

---

### Task 9: Footer and floating WhatsApp link

**Files:**
- Create: `components/footer.tsx`, `components/whatsapp-link.tsx`
- Modify: `app/page.tsx`
- Delete: nothing

**Interfaces:**
- Consumes: `SITE` (Task 3)
- Produces: `<Footer />`, `<WhatsAppLink />`

- [ ] **Step 1: Write `components/footer.tsx`**

Icons are inline SVG rather than remote images — this removes the icons8 and Wikipedia requests the old site made.

```tsx
import { SITE } from '@/lib/content'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-sm font-bold tracking-[0.18em] uppercase">{SITE.name}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Building scalable, high-performing, user-centric web solutions.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
            Connect
          </p>
          <div className="flex gap-3">
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-full border border-border p-2.5 text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05A4.16 4.16 0 0 1 17.6 8.7c4 0 4.74 2.5 4.74 5.78V21h-4v-5.7c0-1.36-.03-3.11-1.94-3.11-1.94 0-2.24 1.48-2.24 3.01V21h-4V9Z" />
              </svg>
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-full border border-border p-2.5 text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 0 1 6.01 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.66.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.24 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-14 max-w-6xl border-t border-border px-5 pt-8 text-center text-xs text-muted">
        &copy; {YEAR} {SITE.name}
      </p>
    </footer>
  )
}
```

- [ ] **Step 2: Write `components/whatsapp-link.tsx`**

```tsx
import { SITE } from '@/lib/content'

export function WhatsAppLink() {
  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message me on WhatsApp"
      className="fixed bottom-5 left-5 z-40 rounded-full border border-border bg-surface p-3.5 text-[#25D366] shadow-lg transition-transform duration-300 hover:-translate-y-1"
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.58-.35ZM12.05 21.8h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.7.97.99-3.62-.24-.37a9.8 9.8 0 1 1 8.31 4.6ZM12.05 0a11.9 11.9 0 0 0-10.2 18.02L0 24l6.13-1.61A11.9 11.9 0 1 0 12.05 0Z" />
      </svg>
    </a>
  )
}
```

- [ ] **Step 3: Add to `app/page.tsx`**

Final composition:

```tsx
import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Projects } from '@/components/projects'
import { SiteHeader } from '@/components/site-header'
import { WhatsAppLink } from '@/components/whatsapp-link'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <WhatsAppLink />
    </>
  )
}
```

- [ ] **Step 4: Verify the build**

Run: `npm run build && npm test`
Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add footer and WhatsApp link with inline icons"
```

---

### Task 10: SEO metadata, structured data, sitemap, robots, analytics

**Files:**
- Create: `lib/schema.ts`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx`
- Test: `lib/__tests__/schema.test.ts`

**Interfaces:**
- Consumes: `SITE` (Task 3)
- Produces: `buildJsonLd(): object` — a `@graph` with a `Person` and a `WebSite` node

- [ ] **Step 1: Write the failing test**

`lib/__tests__/schema.test.ts`:

```ts
import { buildJsonLd } from '@/lib/schema'

describe('buildJsonLd', () => {
  it('uses the correctly cased WebSite type', () => {
    const graph = buildJsonLd()['@graph'] as { '@type': string }[]
    expect(graph.map((node) => node['@type'])).toContain('WebSite')
  })

  it('puts jobTitle on the Person node, not the website', () => {
    const graph = buildJsonLd()['@graph'] as Record<string, unknown>[]
    const person = graph.find((node) => node['@type'] === 'Person')!
    const website = graph.find((node) => node['@type'] === 'WebSite')!

    expect(person.jobTitle).toBe('Full Stack Developer')
    expect(website.jobTitle).toBeUndefined()
  })

  it('lists both social profiles under sameAs', () => {
    const graph = buildJsonLd()['@graph'] as Record<string, unknown>[]
    const person = graph.find((node) => node['@type'] === 'Person')!
    expect(person.sameAs).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- schema`
Expected: FAIL — cannot resolve `@/lib/schema`.

- [ ] **Step 3: Write `lib/schema.ts`**

```ts
import { SITE, skills } from '@/lib/content'

export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE.url}/#person`,
        name: SITE.name,
        url: SITE.url,
        jobTitle: SITE.role,
        knowsAbout: skills,
        sameAs: [SITE.linkedin, SITE.github],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: `${SITE.name} — ${SITE.role}`,
        publisher: { '@id': `${SITE.url}/#person` },
      },
    ],
  }
}
```

This replaces the old block, which used `"@type": "website"` (lowercase, not a real schema.org type) and put `jobTitle` and `worksFor` on a website object.

- [ ] **Step 4: Write `app/sitemap.ts` and `app/robots.ts`**

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }]
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/content'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
```

- [ ] **Step 5: Write the full metadata into `app/layout.tsx`**

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.role}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    'Full Stack Developer specializing in React, Next.js, Laravel, and Angular, building fast and accessible web applications.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.role}`,
    description:
      'Full Stack Developer specializing in React, Next.js, Laravel, and Angular, building fast and accessible web applications.',
    images: [{ url: '/fady_portfolio_2.webp', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} | ${SITE.role}`,
    description: 'Full Stack Developer specializing in React, Next.js, Laravel, and Angular.',
    images: ['/fady_portfolio_2.webp'],
  },
  robots: { index: true, follow: true },
  verification: { google: 'Cj0HXgiwEoZFLgeqWW_ue-yly-VWotez1U2Hl5sG8Mo' },
}
```

Add the JSON-LD and GA4 inside `<body>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
/>

{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      strategy="afterInteractive"
    />
    <Script id="ga" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
    </Script>
  </>
)}
```

`dangerouslySetInnerHTML` is the documented way to emit JSON-LD in Next.js. The content is built from a local module, not user input.

- [ ] **Step 6: Run tests and build**

Run: `npm test -- schema`
Expected: PASS, all three cases.

Run: `npm run build`
Expected: PASS. Output lists `/sitemap.xml` and `/robots.txt` as routes.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add metadata, corrected JSON-LD, sitemap, robots, and GA4"
```

---

### Task 11: Verify the migration achieved its goal

The SEO claim gets demonstrated, not asserted. This task produces evidence.

**Files:**
- Modify: `CLAUDE.md` (rewrite for the new architecture), `README.md`

- [ ] **Step 1: Build and serve the production output**

```bash
npm run build
npm start &
sleep 4
```

- [ ] **Step 2: Prove the content is in the served HTML**

```bash
curl -s http://localhost:3000 > /tmp/rendered.html

for phrase in "Full Stack Developer" "Homeresa" "Sigma Cylinders" "Years of Experience" "Supabase" "Let's work together"; do
  grep -qF "$phrase" /tmp/rendered.html && echo "FOUND: $phrase" || echo "MISSING: $phrase"
done

grep -c 'application/ld+json' /tmp/rendered.html
```

Expected: every phrase FOUND, and exactly one JSON-LD block. Any MISSING means a Client Component boundary was placed too high and that content is no longer server-rendered — fix before continuing.

Compare against the old behaviour to confirm the change is real:

```bash
git show main:public/index.html | grep -c "Homeresa" || echo "0 — old HTML contained no project names"
```

- [ ] **Step 3: Verify routes and check the sitemap**

```bash
curl -s http://localhost:3000/sitemap.xml
curl -s http://localhost:3000/robots.txt
kill %1
```

Expected: valid XML naming `https://www.fadydib.com`, and robots allowing `/` with the sitemap URL.

- [ ] **Step 4: Run the full suite and lint**

```bash
npm test
npm run lint
```

Expected: all tests PASS, lint clean.

- [ ] **Step 5: Manual checks**

Run `npm run dev` and confirm:
- Toggling the theme changes every surface, with no flash of the wrong theme on reload
- Text is readable in both themes, including the accent on buttons
- Projects scroll horizontally on a narrow viewport and become a 3-column grid at `md`
- Tab order reaches every nav link, the theme toggle, all project cards, and the form
- Stat counters animate once when scrolled to, and hold their final value

- [ ] **Step 6: Rewrite `CLAUDE.md` and `README.md`**

`CLAUDE.md` currently documents the CRA architecture and is now wrong in almost every particular. Rewrite it for the Next.js structure: the commands from Task 1's `package.json`, the Server/Client Component split, the token system, the content module, and the contact action's environment variables.

Replace the CRA boilerplate `README.md` with a short project readme: what the site is, how to run it, and the required environment variables.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs: update CLAUDE.md and README for the Next.js architecture"
```

- [ ] **Step 8: Push and open a preview**

```bash
git push -u origin next-js
```

Then, before merging:
1. Check Vercel → Settings → General → Framework Preset. If it is pinned to Create React App with output directory `build`, change it to Next.js and clear the override.
2. Add all six non-public environment variables in Vercel → Settings → Environment Variables.
3. Open the preview URL and submit the contact form once to confirm mail arrives in production, not just locally.

---

## Notes for the executor

- **Task 8 is the only task that can be blocked externally.** If the EmailJS private key is unavailable or "Allow API calls" cannot be enabled, stop and report. Do not fall back to a client-side send without saying so — that silently reintroduces the vulnerability this migration exists to fix.
- **If a build fails complaining about webpack**, something added a custom webpack config. Remove it; Turbopack is the Next.js 16 default.
- **If colours do not change with the theme**, check that `@theme inline` was used rather than `@theme`. Plain `@theme` emits a var-of-var that will not resolve from a `.dark` ancestor.
- **If the page flashes the wrong theme on load**, `suppressHydrationWarning` is missing from `<html>`.
- Do not add a `tailwind.config.js` for any reason. If something seems to need one, it belongs in `@theme` instead.
