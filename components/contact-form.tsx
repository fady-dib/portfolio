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
      className="group relative isolate overflow-hidden rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-bg shadow-lg shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40 active:translate-y-0 active:scale-[0.97] disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none"
    >
      {/* Light sweeps across once per hover. -z-10 keeps it under the label
          without needing a wrapper element for the text. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      {/* A ring that expands and fades on press, so the click has a physical
          response rather than only a colour change. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full ring-2 ring-accent/50 opacity-0 transition-all duration-500 group-active:scale-125 group-active:opacity-100"
      />

      <span className="flex items-center gap-2">
        {pending ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Sending…
          </>
        ) : (
          <>
            Send message
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              &#8594;
            </span>
          </>
        )}
      </span>
    </button>
  )
}

/**
 * Waits for the reCAPTCHA script to appear, then mints a token.
 *
 * The script is loaded lazily, so a visitor who fills the form quickly can
 * submit before `window.grecaptcha` exists. Returning '' immediately in that
 * case made the server reject a perfectly legitimate submission with "could
 * not verify you are human", which blames the visitor for a timing problem.
 * Poll for it instead, and only give up after the timeout.
 */
async function waitForGrecaptcha(timeoutMs = 8000): Promise<boolean> {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (window.grecaptcha?.execute) return true
    await new Promise((resolve) => setTimeout(resolve, 120))
  }
  return false
}

/** Resolves a fresh reCAPTCHA token, or '' if the script never became ready. */
async function getToken(): Promise<string> {
  if (!SITE_KEY) return ''
  if (!(await waitForGrecaptcha())) return ''

  return new Promise((resolve) => {
    window.grecaptcha!.ready(() => {
      window
        .grecaptcha!.execute(SITE_KEY, { action: 'submit' })
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
