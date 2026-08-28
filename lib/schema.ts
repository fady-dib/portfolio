import { SITE, skills } from '@/lib/content'

/**
 * Replaces the old block, which declared `"@type": "website"` — lowercase,
 * and not a schema.org type — and hung jobTitle and worksFor, both Person
 * properties, off a website object.
 */
export function buildJsonLd() {
  const personId = `${SITE.url}/#person`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: SITE.name,
        url: SITE.url,
        jobTitle: SITE.role,
        knowsAbout: skills,
        sameAs: [SITE.linkedin, SITE.github],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: `${SITE.name} — ${SITE.role}`,
        publisher: { '@id': personId },
      },
    ],
  }
}
