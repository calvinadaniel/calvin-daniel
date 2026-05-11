import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'

const FILTERS = ['All', 'Web Dev', 'Data / Analytics', 'Tool']

const PROJECTS = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'Personal portfolio built with React, Vite, and Tailwind CSS. Features dark/light mode, particle canvas, and scroll animations.',
    tags: ['React', 'Tailwind', 'Vite'],
    category: 'Web Dev',
    liveUrl: '#',
    codeUrl: '#',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Operations Dashboard',
    description: 'Power BI dashboard for commercial operations tracking KPIs, revenue trends, and pipeline metrics across business units.',
    tags: ['Power BI', 'DAX', 'SQL'],
    category: 'Data / Analytics',
    liveUrl: '#',
    codeUrl: '#',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Race Training Tracker',
    description: 'A lightweight tool for logging marathon training runs, race results, and personal records over time.',
    tags: ['JavaScript', 'CSS', 'HTML'],
    category: 'Tool',
    liveUrl: '#',
    codeUrl: '#',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Small Business Site',
    description: 'Custom WordPress theme for a local service business. Mobile-first, SEO optimized, and easy for the owner to manage.',
    tags: ['WordPress', 'PHP', 'CSS'],
    category: 'Web Dev',
    liveUrl: '#',
    codeUrl: '#',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=80',
  },
]

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter)

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-navy-bg">
      <PageHeader title="Projects" subtitle="Personal builds, experiments, and tools" />
      <div className="w-[90%] max-w-[1240px] mx-auto py-16">
        <Reveal className="flex flex-wrap gap-3 mb-12">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 rounded-sm border transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-orange border-orange text-offwhite'
                  : 'border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 hover:border-orange/50 hover:text-orange'
              }`}
            >
              {f}
            </button>
          ))}
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <Reveal key={project.id} delay={i * 80}>
              <ProjectCard {...project} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
