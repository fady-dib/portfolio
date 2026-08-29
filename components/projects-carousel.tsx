'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard, Pagination } from 'swiper/modules'
import { ProjectCard } from '@/components/project-card'
import { RevealItem } from '@/components/reveal-item'
import { projects } from '@/lib/content'

import 'swiper/css'
import 'swiper/css/pagination'

/**
 * Projects as a carousel on phones and a plain grid from md up.
 *
 * Swiper handles the touch case because it resolves drag direction itself and
 * releases vertical gestures back to the page — it sets touch-action: pan-y,
 * where a native overflow container claims every touch that lands on it and
 * made the page hard to scroll past this section.
 *
 * Above md it is switched off rather than swapped for a second copy of the
 * markup: `enabled: false` stops Swiper transforming anything, and CSS lays
 * the same slides out as a grid. One DOM, nineteen cards, no duplication.
 */
export function ProjectsCarousel() {
  return (
    <Swiper
      modules={[Pagination, A11y, Keyboard]}
      spaceBetween={20}
      // A fractional count on the smallest breakpoint: the sliver of the next
      // card is what tells a visitor the row moves at all.
      slidesPerView={1.1}
      breakpoints={{
        480: { slidesPerView: 1.6 },
        640: { slidesPerView: 2.2 },
        768: { slidesPerView: 3, enabled: false },
      }}
      grabCursor
      keyboard={{ enabled: true }}
      a11y={{ enabled: true }}
      pagination={{ clickable: true }}
      // Swiper's own stylesheet is injected after globals.css, so plain rules
      // there lose on load order. Its variables are the supported override
      // and are immune to that.
      style={
        {
          '--swiper-theme-color': 'var(--accent)',
          '--swiper-pagination-color': 'var(--accent)',
          '--swiper-pagination-bullet-inactive-color': 'var(--muted)',
          '--swiper-pagination-bullet-inactive-opacity': '0.35',
          '--swiper-pagination-bullet-size': '6px',
          '--swiper-pagination-bullet-horizontal-gap': '4px',
          // Sits the bullets at the very bottom of the padded box, so the
          // padding below becomes clear space between them and the cards.
          '--swiper-pagination-bottom': '4px',
        } as React.CSSProperties
      }
      // Room for the cards' hover lift and shadow, which would otherwise clip.
      className="projects-swiper !px-5 !pt-2 !pb-20 md:!pb-2"
    >
      {projects.map((project, index) => (
        <SwiperSlide key={project.title} className="!h-auto">
          {/* Stagger across a row of three rather than all nineteen — a
              linear delay would leave the last card waiting seconds. */}
          <RevealItem delay={(index % 3) * 90}>
            <ProjectCard project={project} />
          </RevealItem>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
