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
