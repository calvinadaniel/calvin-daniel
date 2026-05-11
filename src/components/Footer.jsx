import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-warm-section dark:bg-navy-dark border-t border-navy-bg/10 dark:border-offwhite/10 py-8">
      <div className="w-[90%] max-w-[1240px] mx-auto">
        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:justify-between">
          <Link to="/" aria-label="Calvin Daniel Home" className="hover:opacity-80 transition-opacity">
            <span className="font-script text-[1.7rem] font-bold text-orange leading-none">
              Calvin Daniel
            </span>
          </Link>
          <span className="font-mono text-[0.65rem] tracking-[0.1em] text-navy-bg/60 dark:text-offwhite/60">
            © 2026 · Developer · Analyst · Runner
          </span>
          <a
            href="https://calantdigital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-orange hover:opacity-75 transition-opacity"
          >
            Calant Digital
          </a>
        </div>
      </div>
    </footer>
  )
}
