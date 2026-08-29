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
      'error-codes'?: string[]
    }

    if (!verdict.success || (verdict.score ?? 0) < MIN_SCORE) {
      // Kept: Google returns the same outcome for a bad secret, a stale
      // token, and a low score, so without the error-codes a future failure
      // is indistinguishable from the visitor's point of view.
      console.error('Contact: reCAPTCHA rejected', JSON.stringify(verdict['error-codes'] ?? verdict))
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
