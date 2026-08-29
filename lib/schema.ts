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
        telephone: SITE.phone,
        // Local signals. Without these the page competes globally for
        // "full stack developer" instead of ranking where the work is.
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE.city,
          addressCountry: SITE.countryCode,
        },
        // Worldwide first: the address below is a fact about where he is,
        // not a limit on who he works with, and without this the schema
        // implies the service area is only Lebanon.
        areaServed: [
          { '@type': 'Place', name: 'Worldwide' },
          { '@type': 'Country', name: SITE.country },
          { '@type': 'City', name: SITE.city },
        ],
        availableLanguage: 'en',
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
