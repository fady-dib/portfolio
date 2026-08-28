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

const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent'

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

/** Resolves a fresh reCAPTCHA token, or '' if the script never loaded. */
function getToken(): Promise<string> {
  return new Promise((resolve) => {
    if (!window.grecaptcha || !SITE_KEY) return resolve('')
    window.grecaptcha.ready(() => {
      window.grecaptcha!.execute(SITE_KEY, { action: 'submit' })
        .then(resolve)
        .catch(() => resolve(''))
    })
  })
}

export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(submitContact, {
    status: 'idle',
  })
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state.status])

  // The token is minted at submit time rather than on mount, so it cannot
  // go stale on a page left open.
  async function handleAction(formData: FormData) {
    formData.set('token', await getToken())
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
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={7}
          required
          className={`${inputClass} resize-none`}
          placeholder="Tell me about your project"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
