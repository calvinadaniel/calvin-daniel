import { useRef, useEffect, useState } from 'react'
import Reveal from './Reveal'

function SkillBar({ name, level, width }) {
  const ref = useRef(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setAnimated(true); observer.unobserve(entry.target) }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-mono text-[0.75rem] tracking-[0.08em] uppercase text-navy-bg dark:text-offwhite">{name}</span>
        <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-orange">{level}</span>
      </div>
      <div className="h-[3px] bg-navy-bg/10 dark:bg-offwhite/10 rounded-sm overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange to-navy-light rounded-sm transition-[width] duration-[1200ms]"
          style={{
            width: animated ? `${width}%` : '0%',
            transitionTimingFunction: 'cubic-bezier(0.25,1,0.5,1)',
          }}
        />
      </div>
    </div>
  )
}

const TOOLS = [
  { name: 'Power BI',      level: 'Expert',   width: 92 },
  { name: 'SQL',           level: 'Advanced', width: 88 },
  { name: 'Data Modeling', level: 'Advanced', width: 80 },
  { name: 'Python',        level: 'Growing',  width: 45 },
]

const FOCUS_TAGS = [
  'Dashboard Design', 'Data Ingestion', 'Report Automation', 'SQL Scripting',
  'KPI Frameworks', 'Business Intelligence', 'Python Automation', 'Commercial Operations',
]

const MINI_BARS = [55, 70, 60, 85, 75, 90, 100]

export default function Analyst() {
  return (
    <section id="analyst" className="bg-warm-section dark:bg-navy-section py-24 scroll-mt-[70px]">
      <div className="w-[90%] max-w-[1240px] mx-auto">

        <div className="grid gap-16 md:grid-cols-2 md:items-start">

          <div>
            <Reveal>
              <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">What I Measure</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">
                Data Analyst
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8] mt-4">
                As a Commercial Operations Specialist, I live in data. From SQL scripting to Power BI
                dashboard design, I turn raw numbers into visual stories that drive real business decisions.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8] mt-4">
                I'm actively deepening my Python expertise — building automation scripts that eliminate
                repetitive weekly, monthly, and quarterly tasks so teams can focus on work that actually matters.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-16 flex flex-col gap-8">
                {TOOLS.map(tool => <SkillBar key={tool.name} {...tool} />)}
              </div>
            </Reveal>
          </div>

          <Reveal direction="right">
            <div className="flex flex-col gap-4">

              <div className="bg-warm-bg dark:bg-[rgba(0,15,50,0.7)] border border-navy-bg/10 dark:border-offwhite/10 rounded p-6 hover:border-navy-bg/25 dark:hover:border-offwhite/25 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Weekly Reports</span>
                  <span className="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60 border border-navy-bg/10 dark:border-offwhite/10 px-2 py-0.5 rounded-sm">SQL</span>
                </div>
                <div className="font-display text-[2.5rem] text-navy-bg dark:text-offwhite leading-none">
                  40<span className="text-[1.4rem] opacity-60">+</span>
                </div>
                <div className="font-mono text-[0.65rem] tracking-widest text-navy-bg/60 dark:text-offwhite/60 mt-1">queries executed per week</div>
                <div className="flex items-end gap-1 h-9 mt-4">
                  {MINI_BARS.map((h, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-sm ${i === MINI_BARS.length - 1 ? 'bg-orange' : 'bg-orange/35'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-warm-bg dark:bg-[rgba(0,15,50,0.7)] border border-navy-bg/10 dark:border-offwhite/10 rounded p-6 hover:border-navy-bg/25 dark:hover:border-offwhite/25 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Dashboard Platform</span>
                  <span className="font-mono text-[0.6rem] tracking-widest uppercase text-orange border border-orange px-2 py-0.5 rounded-sm">Power BI</span>
                </div>
                <div className="relative flex flex-col items-center">
                  <svg className="w-full max-w-[200px]" viewBox="0 0 120 70" fill="none">
                    <path d="M15 60 A45 45 0 0 1 105 60" stroke="currentColor" className="text-navy-bg/10 dark:text-offwhite/10" strokeWidth="10" strokeLinecap="round" />
                    <path d="M15 60 A45 45 0 0 1 105 60" stroke="#FF5910" strokeWidth="10" strokeLinecap="round" strokeDasharray="141" strokeDashoffset="25" className="gauge-path" />
                  </svg>
                  <span className="font-display text-[1.8rem] text-orange absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2">82%</span>
                  <span className="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60 mt-2">efficiency gain</span>
                </div>
              </div>

              <div className="bg-warm-bg dark:bg-[rgba(0,15,50,0.7)] border border-navy-bg/10 dark:border-offwhite/10 rounded p-6 hover:border-navy-bg/25 dark:hover:border-offwhite/25 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Automation Goal</span>
                  <span className="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60 border border-navy-bg/10 dark:border-offwhite/10 px-2 py-0.5 rounded-sm">Python</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Weekly', 'Monthly', 'Quarterly'].map(tag => (
                    <span key={tag} className="font-mono text-[0.65rem] tracking-[0.08em] uppercase bg-orange/15 text-orange border border-orange/30 px-2.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="font-mono text-[0.65rem] tracking-widest text-navy-bg/60 dark:text-offwhite/60">Tasks being automated</div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 pt-16 border-t border-navy-bg/10 dark:border-offwhite/10">
          <h3 className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-8">Areas of Focus</h3>
          <div className="flex flex-wrap gap-2">
            {FOCUS_TAGS.map(tag => (
              <span
                key={tag}
                className="font-mono text-[0.7rem] tracking-[0.08em] uppercase border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 px-4 py-1.5 rounded-sm hover:border-orange hover:text-orange transition-all duration-200 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
