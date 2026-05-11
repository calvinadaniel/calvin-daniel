import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const ANCHOR_LINKS = [
  { href: '#about',   label: 'About' },
  { href: '#web-dev', label: 'Developer' },
  { href: '#analyst', label: 'Analyst' },
  { href: '#running', label: 'Runner' },
]

const PAGE_LINKS = [
  { to: '/projects', label: 'Projects' },
  { to: '/clients',  label: 'Clients' },
]

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const { theme, toggle } = useTheme()
  const { pathname }      = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const close = () => setMenuOpen(false)
  const anchorHref = (hash) => isHome ? hash : `/${hash}`

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'h-[58px] bg-white/90 dark:bg-[rgba(0,10,35,0.95)] backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.5)]'
            : 'h-[70px]'
        }`}
      >
        <div className="flex items-center justify-between h-full px-[5%] max-w-[1240px] mx-auto">
          <Link to="/" aria-label="Calvin Daniel Home" className="hover:opacity-90 transition-opacity">
            <span className="font-script text-[1.9rem] font-bold text-orange leading-none">
              Calvin Daniel
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex gap-6 items-center" aria-label="Main navigation">
            {ANCHOR_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={anchorHref(href)}
                className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors"
              >
                {label}
              </a>
            ))}
            {PAGE_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `font-mono text-[0.75rem] tracking-[0.1em] uppercase transition-colors ${
                    isActive
                      ? 'text-orange border-b-2 border-orange pb-0.5'
                      : 'text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="text-navy-bg/50 dark:text-offwhite/60 hover:text-orange dark:hover:text-orange transition-colors p-1"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <a
              href={anchorHref('#contact')}
              className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border border-orange px-4 py-[0.4rem] rounded-sm hover:bg-orange hover:text-offwhite transition-all"
            >
              Let's Connect
            </a>
          </nav>

          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col justify-center gap-[5px] w-9 h-9 p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="off-canvas-nav"
          >
            <span className="block w-full h-[2px] bg-navy-bg dark:bg-offwhite rounded-sm" />
            <span className="block w-full h-[2px] bg-navy-bg dark:bg-offwhite rounded-sm" />
            <span className="block w-full h-[2px] bg-navy-bg dark:bg-offwhite rounded-sm" />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/65 z-[200] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Off-canvas */}
      <nav
        id="off-canvas-nav"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`fixed top-0 right-0 h-full w-[min(320px,85vw)] bg-warm-section dark:bg-navy-dark z-[300] flex flex-col px-8 pt-16 pb-8 border-l border-navy-bg/10 dark:border-offwhite/10 transition-transform duration-500 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-5 right-5 text-navy-bg/40 dark:text-offwhite/60 text-xl hover:text-navy-bg dark:hover:text-offwhite transition-colors"
          onClick={close}
          aria-label="Close navigation menu"
        >
          &#10005;
        </button>

        {/* Theme toggle inside mobile menu */}
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="absolute top-5 left-8 flex items-center gap-2 font-mono text-[0.65rem] tracking-widest uppercase text-navy-bg/50 dark:text-offwhite/50 hover:text-orange dark:hover:text-orange transition-colors"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        <ul className="flex flex-col gap-8 mt-4">
          {ANCHOR_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={anchorHref(href)}
                onClick={close}
                className="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
          {PAGE_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={close}
                className="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={anchorHref('#contact')}
              onClick={close}
              className="font-display text-[2rem] text-orange tracking-wide hover:text-orange/80 transition-colors"
            >
              Let's Connect
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}
