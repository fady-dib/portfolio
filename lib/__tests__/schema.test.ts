import { buildJsonLd } from '@/lib/schema'

type Node = Record<string, unknown> & { '@type': string }

function graph(): Node[] {
  return buildJsonLd()['@graph'] as Node[]
}

describe('buildJsonLd', () => {
  it('uses the correctly cased WebSite type', () => {
    expect(graph().map((node) => node['@type'])).toContain('WebSite')
  })

  it('puts jobTitle on the Person node, not the website', () => {
    const person = graph().find((node) => node['@type'] === 'Person')!
    const website = graph().find((node) => node['@type'] === 'WebSite')!

    expect(person.jobTitle).toBe('Full Stack Developer')
    expect(website.jobTitle).toBeUndefined()
  })

  it('lists both social profiles under sameAs', () => {
    const person = graph().find((node) => node['@type'] === 'Person')!
    expect(person.sameAs).toHaveLength(2)
  })

  it('links the website to the person as publisher', () => {
    const person = graph().find((node) => node['@type'] === 'Person')!
    const website = graph().find((node) => node['@type'] === 'WebSite')!

    expect(website.publisher).toEqual({ '@id': person['@id'] })
  })

  it('serialises without characters that would break a script tag', () => {
    expect(JSON.stringify(buildJsonLd())).not.toContain('</')
  })
})
