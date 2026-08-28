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
      {/* Previously loaded from Wikipedia's upload host on every page view. */}
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.58-.35ZM12.05 21.8h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.7.97.99-3.62-.24-.37a9.8 9.8 0 1 1 8.31 4.6ZM12.05 0a11.9 11.9 0 0 0-10.2 18.02L0 24l6.13-1.61A11.9 11.9 0 1 0 12.05 0Z" />
      </svg>
    </a>
  )
}
