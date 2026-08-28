import Image from 'next/image'
import { MobileNav } from '@/components/mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { NAV_LINKS } from '@/lib/nav'
import { SITE } from '@/lib/content'
import portrait from '@/assets/fady_portfolio_2.webp'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60">
      {/* The blur lives on this child, not the header. backdrop-filter makes
          an element a containing block for fixed descendants, which would
          trap the mobile menu overlay inside the header instead of letting
          it cover the viewport. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg/80 backdrop-blur-md" />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#home" className="flex items-center gap-3">
          {/* Decorative: the name sits right beside it. */}
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
