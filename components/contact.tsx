import { ContactForm } from '@/components/contact-form'
import { SectionHeading } from '@/components/section-heading'
import { SITE } from '@/lib/content'

export function Contact() {
  return (
    <section id="contact" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading eyebrow="Contact" label="Let's work together" />
        <p className="mb-6 text-lg text-pretty text-muted">
          Send me a message and I will get back to you as soon as I can.
        </p>

        {/* Phone and location as real text and a tel: link, not an image or a
            script — both are things a search engine reads and a visitor can
            tap straight from a phone. */}
        <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-2 transition-colors hover:text-accent"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
            </svg>
            {SITE.phone}
          </a>

          <span className="inline-flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {SITE.city}, {SITE.country}
          </span>
        </div>
        {/* Same glass treatment as the cards, so the panels read as one
            material across the page. */}
        <div className="relative overflow-hidden rounded-card border border-glass-edge bg-glass p-6 shadow-card backdrop-blur-xl md:p-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
