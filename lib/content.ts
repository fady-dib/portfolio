import type { StaticImageData } from 'next/image'

import africell from '@/assets/africell.webp'
import bidfood from '@/assets/bidfood.png'
import ccib from '@/assets/ccib.svg'
import hibou from '@/assets/hibou-logo.webp'
import homeresa from '@/assets/homeresa.png'
import maabar from '@/assets/maabar.svg'
import macrolab from '@/assets/macrolab.png'
import loto from '@/assets/logo-ball.webp'
import mabanee from '@/assets/mabanee.png'
import matter from '@/assets/matter.svg'
import naturaseal from '@/assets/naturaseal.svg'
import neo from '@/assets/neo-4496.svg'
import ofinance from '@/assets/ofinance.svg'
import olm from '@/assets/olm.png'
import purpl from '@/assets/purpl.png'
import quinta from '@/assets/quinta.png'
import sigma from '@/assets/sigma-logo.jpeg'
import yellowDoor from '@/assets/yellow_door.png'
import youSport from '@/assets/yousport-logo.webp'

export type Stat = { number: number; title: string; text: string }
export type Project = {
  title: string
  image: StaticImageData
  url?: string
  /**
   * Which theme the logo needs flipping in, for artwork built for one
   * background only. CCIB is near-black and vanishes on a dark card;
   * Maabar is white and vanishes on a light one — opposite directions, so
   * the flag carries which. Opt-in per project: applied to everything it
   * would turn the opaque logo tiles into negatives.
   */
  invertOn?: 'dark' | 'light'
  /**
   * What was built, in the client's language rather than the stack's — the
   * kind of system and what it manages. Keep it to one line; these sit on a
   * card and stop being read past about twelve words.
   */
  summary?: string
}

export const SITE = {
  name: 'Fady Dib',
  role: 'Full Stack Developer',
  tagline:
    'Passionate Full Stack Developer dedicated to developing and optimizing websites and web applications for maximum impact',
  url: 'https://www.fadydib.com',
  whatsapp: 'https://wa.me/96170544067',
  linkedin: 'https://www.linkedin.com/in/fady-dib',
  github: 'https://github.com/fady-dib',
} as const

export const stats: Stat[] = [
  {
    number: 30,
    title: 'Projects Completed',
    text: 'Successfully delivered 30+ diverse projects across web development, showcasing my expertise in building scalable and efficient web applications.',
  },
  {
    number: 5,
    title: 'Years of Experience',
    text: 'With 5+ years of professional experience in web development, I have honed my skills in front-end and back-end technologies.',
  },
  {
    number: 15,
    title: 'Technologies Mastered',
    text: 'Proficient in 15+ key technologies including React, Angular, Node.js, and Tailwind CSS, ensuring flexibility and adaptability in any project.',
  },
]

export const skills: string[] = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'PHP',
  'Node.js',
  'Express.js',
  'Laravel',
  'Angular',
  'React',
  'Next.js',
  'Socket.IO',
  'Bootstrap',
  'Tailwind CSS',
  'Electron.js',
  'SQL',
  'NoSQL',
  'Redis',
  'Redux',
  'Strapi',
  'Supabase',
]

export const projects: Project[] = [
  { title: 'Homeresa', image: homeresa, url: 'https://www.homeresa.com/', summary: 'Property listing and booking platform' },
  { title: 'Loto Iraq', image: loto, url: 'https://iraqloto.com/en', summary: 'Charity lottery platform with online ticketing' },
  { title: 'Matter Nutrition', image: matter, url: 'https://www.matternutrition.xyz/', summary: 'Meal-plan platform' },
  { title: 'O Finance', image: ofinance, url: 'https://www.ofinance.com.lb/en', invertOn: 'dark', summary: 'Lending platform with an admin panel' },
  { title: 'Purpl Wallet', image: purpl, url: 'https://www.purplwallet.com/', summary: 'Digital wallet platform with an admin panel for features and campaigns' },
  { title: 'Naturaseal', image: naturaseal, url: 'https://naturaseal.com/', invertOn: 'dark', summary: 'Corporate site with an admin panel' },
  { title: 'Maabar Podcast', image: maabar, url: 'https://www.maabarpodcast.com/', invertOn: 'light', summary: 'Podcast platform with an episode CMS for publishing the series' },
  { title: 'Mabanee', image: mabanee, url: 'https://mabanee.com/en', summary: 'Corporate site for a real-estate developer' },
  { title: 'Africell', image: africell, summary: 'Corporate site for a telecom operator' },
  { title: 'OLM Website & Mobile App', image: olm, url: 'https://olm.org.lb/ar', summary: 'Website and mobile app with a member portal' },
  { title: 'You Sport', image: youSport, url: 'https://watchyousport.com/en', summary: 'Sports streaming platform' },
  {
    title: 'Hibou Mobile App',
    image: hibou,
    url: 'https://play.google.com/store/apps/details?id=com.tedmob.hibou&hl=en',
    summary: 'Mobile app published on Google Play',
  },
  { title: 'Yellow Door', image: yellowDoor, url: 'https://www.yellowdoorenergy.com/', summary: 'Corporate site with a CMS' },
  { title: 'Neo', image: neo, url: 'https://neo.iq/en', summary: 'Customer portal with account management' },
  { title: 'Sigma Cylinders', image: sigma, url: 'https://www.sigmacylinders.com/', summary: 'Corporate site for an LPG manufacturer' },
  { title: 'MacroLab', image: macrolab, url: 'https://www.macrolablb.com/', summary: 'Corporate site with an admin panel' },
  { title: 'Bidfood', image: bidfood, url: 'https://www.bidfoodme.com/', summary: 'Product catalogue site with an admin panel for a 12,000-item range' },
  { title: 'CCIB', image: ccib, url: 'https://www.ccib.org.lb/en', invertOn: 'dark', summary: 'Chamber portal with member e-services' },
  { title: 'The Quinta Group', image: quinta, url: 'https://www.thequintagroup.com/', summary: 'Group site with an admin panel' },
]
