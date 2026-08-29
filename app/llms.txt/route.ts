import { SITE, projects, skills, stats } from '@/lib/content'

/**
 * /llms.txt — a plain-language description of the site for language models
 * and AI crawlers, which read prose far better than they read a rendered
 * grid of logos.
 *
 * Generated from lib/content.ts rather than written by hand, so adding a
 * project updates this file too. Static, so it costs nothing at runtime.
 */
export const dynamic = 'force-static'

function build(): string {
  const linked = projects.filter((project) => project.url)
  const unlinked = projects.filter((project) => !project.url)

  const line = (p: (typeof projects)[number]) =>
    p.url
      ? `- [${p.title}](${p.url})${p.summary ? `: ${p.summary}` : ''}`
      : `- ${p.title}${p.summary ? `: ${p.summary}` : ''}`

  return `# ${SITE.name}

> ${SITE.role} based in Lebanon, building web platforms and the admin panels and CMSes that run them.

${SITE.tagline}

## About

${stats.map((s) => `- ${s.number}+ ${s.title.toLowerCase()}`).join('\n')}

Work spans the full stack: customer-facing platforms in React and Next.js,
backed by Laravel and Node APIs, with custom admin panels and content
management for the teams who run them day to day.

## Selected work

${linked.map(line).join('\n')}

${unlinked.length ? `${unlinked.map(line).join('\n')}\n` : ''}
## Technologies

${skills.join(', ')}

## Contact

- Website: ${SITE.url}
- LinkedIn: ${SITE.linkedin}
- GitHub: ${SITE.github}
- WhatsApp: ${SITE.whatsapp}
- Contact form: ${SITE.url}/#contact

## Notes

Available for full-time roles and client projects.
Content on this site is authored by ${SITE.name}; client logos remain the
property of their respective owners.
`
}

export function GET() {
  return new Response(build(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
