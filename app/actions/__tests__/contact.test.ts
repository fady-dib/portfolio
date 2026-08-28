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
  vi.restoreAllMocks()
  vi.stubEnv('RECAPTCHA_SECRET_KEY', 'secret')
  vi.stubEnv('EMAILJS_SERVICE_ID', 'service')
  vi.stubEnv('EMAILJS_TEMPLATE_ID', 'template')
  vi.stubEnv('EMAILJS_PUBLIC_KEY', 'public')
  vi.stubEnv('EMAILJS_PRIVATE_KEY', 'private')
})

describe('submitContact', () => {
  it('rejects a missing name without calling out', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    const result = await submitContact(idle, form({ ...valid, name: '' }))
    expect(result.status).toBe('error')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

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
    expect(String(fetchSpy.mock.calls[1][0])).toContain('api.emailjs.com')
  })

  it('reports an error when the mail provider fails', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, score: 0.9 })))
      .mockResolvedValueOnce(new Response('Bad Request', { status: 400 }))

    const result = await submitContact(idle, form(valid))

    expect(result.status).toBe('error')
  })

  it('reports an error rather than leaking provider detail when fetch throws', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('ECONNREFUSED secret-host:443'))

    const result = await submitContact(idle, form(valid))

    expect(result.status).toBe('error')
    expect(result.message).not.toContain('ECONNREFUSED')
  })
})
