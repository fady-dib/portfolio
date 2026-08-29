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
