import { projects, skills, stats, SITE } from '@/lib/content'

describe('content', () => {
  it('exposes every project with a title and an image', () => {
    expect(projects).toHaveLength(10)
    for (const project of projects) {
      expect(project.title).toBeTruthy()
      expect(project.image).toBeTruthy()
    }
  })

  it('only uses absolute urls for projects that link out', () => {
    for (const project of projects.filter((p) => p.url)) {
      expect(project.url).toMatch(/^https:\/\//)
    }
  })

  it('exposes three stats and a non-empty skill list', () => {
    expect(stats).toHaveLength(3)
    expect(skills.length).toBeGreaterThan(10)
  })

  it('has a canonical site url without a trailing slash', () => {
    expect(SITE.url).toBe('https://www.fadydib.com')
  })
})
