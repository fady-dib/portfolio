'use server'

const MIN_SCORE = 0.5
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
const SEND_URL = 'https://api.emailjs.com/api/v1.0/email/send'

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

  // Validate before any network call, so a bad submission costs nothing.
  if (name.length < 2) return fail('Please enter your name.')
  if (!EMAIL_PATTERN.test(email)) return fail('Please enter a valid email address.')
  if (message.length < 10) return fail('Please write a slightly longer message.')
  if (!token) {
    console.error('Contact: no reCAPTCHA token reached the server')
    return fail('Could not verify you are human. Please reload and try again.')
  }

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.error('Contact: RECAPTCHA_SECRET_KEY is not set in this environment')
    return fail('The form is not configured correctly. Please email me directly.')
  }

  try {
    const verifyResponse = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY ?? '',
        response: token,
      }),
    })

    const verdict = (await verifyResponse.json()) as {
      success: boolean
      score?: number
      hostname?: string
      'error-codes'?: string[]
    }

    if (!verdict.success || (verdict.score ?? 0) < MIN_SCORE) {
      // Google's error-codes are the only way to tell a bad secret from a bad
      // token from a low score, and all three surface the same message.
      // The token shape is logged alongside: a live v3 token is ~2500 chars
      // starting "0cAFcWeA", so a short or differently-prefixed value here
      // means it was mangled in transit rather than rejected on merit.
      console.error(
        'Contact: reCAPTCHA verification rejected',
        JSON.stringify({
          verdict,
          tokenLength: token.length,
          tokenHead: token.slice(0, 12),
          tokenTail: token.slice(-8),
          secretLength: (process.env.RECAPTCHA_SECRET_KEY ?? '').length,
        }),
      )
      return fail('Could not verify you are human. Please reload and try again.')
    }

    const sendResponse = await fetch(SEND_URL, {
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
      console.error('EmailJS send failed', sendResponse.status, await sendResponse.text())
      return fail('Something went wrong sending your message. Please try again.')
    }

    return { status: 'success', message: 'Thanks — I will get back to you shortly.' }
  } catch (error) {
    // Logged server-side, never returned: provider errors can carry
    // configuration detail that should not reach a visitor.
    console.error('Contact submission failed', error)
    return fail('Something went wrong sending your message. Please try again.')
  }
}
