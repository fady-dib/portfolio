import type { StaticImageData } from 'next/image'

import africell from '@/assets/africell.webp'
import hibou from '@/assets/hibou-logo.webp'
import homeresa from '@/assets/homeresa.png'
import loto from '@/assets/logo-ball.webp'
import mabanee from '@/assets/mabanee.png'
import neo from '@/assets/neo-4496.svg'
import olm from '@/assets/olm.png'
import sigma from '@/assets/sigma-logo.jpeg'
import yellowDoor from '@/assets/yellow_door.png'
import youSport from '@/assets/yousport-logo.webp'

export type Stat = { number: number; title: string; text: string }
export type Project = { title: string; image: StaticImageData; url?: string }

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
    number: 20,
    title: 'Projects Completed',
    text: 'Successfully delivered 20+ diverse projects across web development, showcasing my expertise in building scalable and efficient web applications.',
  },
  {
    number: 3,
    title: 'Years of Experience',
    text: 'With 3+ years of professional experience in web development, I have honed my skills in front-end and back-end technologies.',
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
  { title: 'Homeresa', image: homeresa, url: 'https://www.homeresa.com/' },
  { title: 'Loto Iraq', image: loto, url: 'https://iraqloto.com/en' },
  { title: 'Mabanee', image: mabanee, url: 'https://mabanee.com/en' },
  { title: 'Africell', image: africell },
  { title: 'OLM Website & Mobile App', image: olm, url: 'https://olm.org.lb/ar' },
  { title: 'You Sport', image: youSport, url: 'https://watchyousport.com/en' },
  {
    title: 'Hibou Mobile App',
    image: hibou,
    url: 'https://play.google.com/store/apps/details?id=com.tedmob.hibou&hl=en',
  },
  { title: 'Yellow Door', image: yellowDoor, url: 'https://www.yellowdoorenergy.com/' },
  { title: 'Neo', image: neo, url: 'https://neo.iq/en' },
  { title: 'Sigma Cylinders', image: sigma, url: 'https://www.sigmacylinders.com/' },
]
