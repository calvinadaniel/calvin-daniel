import { Link } from 'react-router-dom'
import Reveal from './Reveal'

export default function PageHeader({ title, subtitle }) {
  return (
    <section className="bg-warm-bg dark:bg-navy-bg pt-[100px] pb-14 border-b border-navy-bg/10 dark:border-offwhite/10">
      <div className="w-[90%] max-w-[1240px] mx-auto">
        <Reveal>
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-mono text-[0.65rem] tracking-[0.15em] uppercase text-navy-bg/45 dark:text-offwhite/45 hover:text-orange transition-colors mb-6"
          >
            ← Home
          </Link>
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-none text-navy-bg dark:text-offwhite">
            {title}
          </h1>
          <p className="font-body text-[1.05rem] text-navy-bg/60 dark:text-offwhite/60 mt-3">
            {subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
