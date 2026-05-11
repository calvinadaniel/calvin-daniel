# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-page routing, light/dark mode, a Pricing section, an upgraded Running section, a Projects page, and a Client Websites page to the existing React + Vite + Tailwind portfolio.

**Architecture:** Install `react-router-dom` for three routes (`/`, `/projects`, `/clients`). A `ThemeContext` manages dark/light state via Tailwind's `darkMode: 'class'` strategy, persisting to `localStorage`. All existing components receive `dark:` variant classes; new components follow the same pattern. New pages live under `src/pages/`.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, react-router-dom v6, Vitest, @testing-library/react

---

## File Map

### New files
```
src/context/ThemeContext.jsx          — theme state, toggle, localStorage persistence
src/context/ThemeContext.test.jsx     — Vitest tests for ThemeContext
src/components/Layout.jsx            — shared shell: Header + Footer + scroll bar + <Outlet>
src/pages/HomePage.jsx               — assembles existing homepage sections
src/pages/ProjectsPage.jsx           — /projects route with filter + card grid
src/pages/ProjectsPage.test.jsx      — Vitest tests for filter behavior
src/pages/ClientsPage.jsx            — /clients route with alternating editorial rows
src/components/Pricing.jsx           — three-tier pricing section for homepage
src/components/PageHeader.jsx        — reusable slim banner for inner pages
src/components/ProjectCard.jsx       — individual project card
src/components/ClientRow.jsx         — single alternating editorial client entry
src/test-setup.js                    — jest-dom matchers for Vitest
```

### Modified files
```
vite.config.js                       — add Vitest test config
tailwind.config.js                   — add darkMode: 'class', warm color tokens
src/main.jsx                         — wrap in BrowserRouter + ThemeProvider
src/App.jsx                          — replace with Routes + Layout + page components
src/components/Header.jsx            — new nav links, theme toggle, dark: variants
src/components/Hero.jsx              — dark: variants, theme-aware canvas colors
src/components/About.jsx             — dark: variants
src/components/WebDev.jsx            — dark: variants
src/components/Analyst.jsx           — dark: variants
src/components/Running.jsx           — dark: variants + Next Race card + Goal Banner + 2-col layout
src/components/Contact.jsx           — dark: variants
src/components/Footer.jsx            — dark: variants
```

---

## Task 1: Install Dependencies + Configure Test Environment

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `vite.config.js`
- Create: `src/test-setup.js`

- [ ] **Step 1: Install react-router-dom and testing packages**

```bash
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Expected: packages added to `node_modules`, `package.json` updated.

- [ ] **Step 2: Update vite.config.js to add Vitest config**

Replace the full file:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
    globals: true,
  },
})
```

- [ ] **Step 3: Create src/test-setup.js**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, add `"test": "vitest"` to the `"scripts"` block:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

- [ ] **Step 5: Verify vitest runs**

```bash
npm test -- --run
```

Expected: "No test files found" or 0 test suites — no error. If you see an import error for `@testing-library/jest-dom`, check that `src/test-setup.js` was saved correctly.

- [ ] **Step 6: Commit**

```bash
git add vite.config.js src/test-setup.js package.json package-lock.json
git commit -m "chore: install react-router-dom and vitest"
```

---

## Task 2: Update Tailwind Config

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Replace tailwind.config.js with dark mode and warm color tokens**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#002D72',
          mid:     '#003FA5',
          light:   '#0D4FA8',
          bg:      '#001A4D',
          dark:    '#001030',
          section: '#00245E',
        },
        orange: {
          DEFAULT: '#FF5910',
          dim:     '#CC430A',
        },
        offwhite: '#F5F7FA',
        warm: {
          bg:      '#FAF8F5',
          section: '#F0EDE8',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Arial Narrow"', 'sans-serif'],
        script:  ['"Dancing Script"', 'cursive'],
        body:    ['"DM Sans"', '"Helvetica Neue"', 'sans-serif'],
        mono:    ['"Space Mono"', '"Courier New"', 'monospace'],
      },
      opacity: {
        12: '0.12',
        15: '0.15',
        18: '0.18',
        35: '0.35',
        42: '0.42',
        55: '0.55',
        58: '0.58',
        65: '0.65',
      },
      keyframes: {
        float1: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%':      { transform: 'translate(-30px,30px) scale(1.05)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%':      { transform: 'translate(20px,-20px) scale(1.08)' },
        },
        float3: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%':      { transform: 'translate(-15px,15px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
      animation: {
        float1: 'float1 12s ease-in-out infinite',
        float2: 'float2 15s ease-in-out infinite',
        float3: 'float3 10s ease-in-out infinite',
        blink:  'blink 0.75s step-end infinite',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: add darkMode class strategy and warm color tokens to Tailwind"
```

---

## Task 3: ThemeContext (TDD)

**Files:**
- Create: `src/context/ThemeContext.jsx`
- Create: `src/context/ThemeContext.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `src/context/ThemeContext.test.jsx`:

```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext'

function TestComponent() {
  const { theme, toggle } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('defaults to dark theme when localStorage is empty', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    expect(screen.getByTestId('theme').textContent).toBe('dark')
  })

  it('adds dark class to html element on dark theme', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles to light theme and removes dark class', async () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists chosen theme to localStorage', async () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('reads initial theme from localStorage', () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggles back to dark from light', async () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeProvider><TestComponent /></ThemeProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --run src/context/ThemeContext.test.jsx
```

Expected: FAIL — "Cannot find module './ThemeContext'"

- [ ] **Step 3: Create src/context/ThemeContext.jsx**

```jsx
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  )

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --run src/context/ThemeContext.test.jsx
```

Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/context/ThemeContext.jsx src/context/ThemeContext.test.jsx
git commit -m "feat: add ThemeContext with dark/light toggle and localStorage persistence"
```

---

## Task 4: Layout Component

**Files:**
- Create: `src/components/Layout.jsx`

- [ ] **Step 1: Create src/components/Layout.jsx**

This moves the scroll-progress bar out of `App.jsx` and wraps all routes with Header, Footer, and `<Outlet>`:

```jsx
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  useEffect(() => {
    const bar = document.createElement('div')
    bar.setAttribute('aria-hidden', 'true')
    Object.assign(bar.style, {
      position: 'fixed', top: '0', left: '0',
      width: '3px', height: '0%',
      background: 'linear-gradient(to bottom,#FF5910,rgba(255,89,16,0.35))',
      zIndex: '9999', borderRadius: '0 0 2px 0',
      pointerEvents: 'none', transition: 'height 0.06s linear',
    })
    document.body.appendChild(bar)

    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      bar.style.height = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%'
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => { window.removeEventListener('scroll', update); bar.remove() }
  }, [])

  return (
    <div className="font-body bg-warm-bg dark:bg-navy-bg text-navy-bg dark:text-offwhite overflow-x-hidden">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Layout.jsx
git commit -m "feat: add Layout component with shared Header/Footer and scroll progress bar"
```

---

## Task 5: Update main.jsx + App.jsx for Routing

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`
- Create: `src/pages/HomePage.jsx`

- [ ] **Step 1: Update src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
```

- [ ] **Step 2: Replace src/App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ClientsPage from './pages/ClientsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 3: Create src/pages/HomePage.jsx**

```jsx
import Hero    from '../components/Hero'
import About   from '../components/About'
import WebDev  from '../components/WebDev'
import Analyst from '../components/Analyst'
import Running from '../components/Running'
import Pricing from '../components/Pricing'
import Contact from '../components/Contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <WebDev />
      <Analyst />
      <Running />
      <Pricing />
      <Contact />
    </>
  )
}
```

Note: `Pricing` does not exist yet — this file will cause an import error until Task 11. That is expected; the dev server will recover once Pricing is created.

- [ ] **Step 4: Start the dev server and verify routing works**

```bash
npm run dev
```

Open `http://localhost:5173`. The site should render. Navigate to `/projects` — you will see an error about missing `ProjectsPage` and `ClientsPage` imports. This is expected and will be resolved in Tasks 13–14. You can temporarily comment those two imports and their routes out to verify the homepage loads cleanly if desired.

- [ ] **Step 5: Commit**

```bash
git add src/main.jsx src/App.jsx src/pages/HomePage.jsx
git commit -m "feat: add React Router with Layout, routes, and HomePage"
```

---

## Task 6: Update Header

**Files:**
- Modify: `src/components/Header.jsx`

- [ ] **Step 1: Replace src/components/Header.jsx**

```jsx
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
```

- [ ] **Step 2: Start dev server and verify**

```bash
npm run dev
```

Check: logo links to `/`, Projects and Clients nav links appear, theme toggle button renders (sun icon in dark mode), clicking toggle switches classes on `<html>`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.jsx
git commit -m "feat: update Header with routing links, theme toggle, and dark: variants"
```

---

## Task 7: Hero — Dark: Variants + Theme-Aware Canvas

**Files:**
- Modify: `src/components/Hero.jsx`

- [ ] **Step 1: Replace src/components/Hero.jsx**

Key changes: import `useTheme`; make canvas colors and the gradient/stroke react to theme; add `dark:` variants to all color classes.

```jsx
import { useRef, useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

function useTypewriter(text, speed = 46, startDelay = 200) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone]           = useState(false)

  useEffect(() => {
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, ++i))
        } else {
          clearInterval(interval)
          setTimeout(() => setDone(true), 1400)
        }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [text, speed, startDelay])

  return { displayed, done }
}

function StaggerLine({ text, lineDelay = 0 }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 180)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {[...text].map((char, i) => (
        <span
          key={i}
          className="inline-block transition-[opacity,transform] duration-[450ms]"
          style={{
            opacity:         animated ? 1 : 0,
            transform:       animated ? 'translateY(0)' : 'translateY(0.45em)',
            transitionDelay: `${lineDelay + i * 26}ms`,
            transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </>
  )
}

function useCountUp(target, duration = 1200) {
  const ref     = useRef(null)
  const started = useRef(false)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick  = (now) => {
          const p = Math.min((now - start) / duration, 1)
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return [ref, value]
}

export default function Hero() {
  const heroRef   = useRef(null)
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const { displayed: eyebrow, done: eyebrowDone } = useTypewriter(
    'Based in Delaware | Available for freelance work'
  )
  const [racesRef,    racesVal]    = useCountUp(9)
  const [marathonRef, marathonVal] = useCountUp(10)
  const [nycRef,      nycVal]      = useCountUp(3)

  useEffect(() => {
    const hero   = heroRef.current
    const canvas = canvasRef.current
    if (!hero || !canvas) return
    const ctx = canvas.getContext('2d')

    const COLORS = theme === 'dark'
      ? ['rgba(255,255,255,0.6)', 'rgba(255,89,16,0.55)', 'rgba(100,160,255,0.5)']
      : ['rgba(13,27,62,0.45)',   'rgba(255,89,16,0.45)', 'rgba(0,45,114,0.35)']
    const CONNECT_COLOR = theme === 'dark' ? '255,255,255' : '13,27,62'
    const CONNECT_DIST = 120
    const COUNT        = 55
    let particles = []
    let raf       = null

    const rand   = (a, b) => Math.random() * (b - a) + a
    const resize = () => { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight }
    const spawn  = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: rand(0, canvas.width),  y: rand(0, canvas.height),
        vx: rand(-0.18, 0.18),     vy: rand(-0.18, 0.18),
        r: rand(1.2, 2.5),
        color: COLORS[Math.floor(rand(0, COLORS.length))],
        alpha: rand(0.4, 0.9),
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (dist < CONNECT_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${CONNECT_COLOR},${(1 - dist / CONNECT_DIST) * 0.15})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < -10)               p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10)               p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle   = p.color
        ctx.fill()
        ctx.globalAlpha = 1
      })
      raf = requestAnimationFrame(tick)
    }

    const vis = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!raf) tick() }
      else { cancelAnimationFrame(raf); raf = null }
    }, { threshold: 0 })
    vis.observe(hero)

    const res = new ResizeObserver(() => { resize(); spawn() })
    res.observe(hero)

    resize(); spawn(); tick()
    requestAnimationFrame(() => { canvas.style.opacity = '1' })

    return () => {
      cancelAnimationFrame(raf)
      vis.disconnect()
      res.disconnect()
    }
  }, [theme])

  const runnerStroke = theme === 'dark'
    ? '2px rgba(245,247,250,0.35)'
    : '2px rgba(13,27,62,0.25)'

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-svh flex flex-col justify-center pt-[70px] px-[5%] overflow-hidden bg-gradient-to-br from-warm-bg to-warm-section dark:from-navy-bg dark:to-navy-dark scroll-mt-[70px]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-0 transition-opacity duration-[1400ms]"
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-navy-light blur-[80px] opacity-[0.08] dark:opacity-18 -top-[200px] -right-[100px] animate-float1" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-orange  blur-[80px] opacity-[0.06] dark:opacity-12 -bottom-[100px] -left-[50px]   animate-float2" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-navy-mid blur-[80px] opacity-[0.08] dark:opacity-18  top-[40%]      left-[40%]      animate-float3" />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto w-full">
        <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-orange mb-4 h-4">
          {eyebrow}
          {!eyebrowDone && (
            <span className="animate-blink text-orange font-light ml-px">|</span>
          )}
        </p>

        <h1 className="font-display leading-[0.92] mb-8">
          <span className="block text-[clamp(3.5rem,13vw,9rem)] text-navy-bg dark:text-offwhite">
            <StaggerLine text="Developer." lineDelay={0} />
          </span>
          <span className="block text-[clamp(3.5rem,13vw,9rem)] text-orange">
            <StaggerLine text="Analyst." lineDelay={130} />
          </span>
          <span
            className="block text-[clamp(3.5rem,13vw,9rem)] text-transparent"
            style={{ WebkitTextStroke: runnerStroke }}
          >
            <StaggerLine text="Runner." lineDelay={260} />
          </span>
        </h1>

        <p className="text-[clamp(0.95rem,2.5vw,1.15rem)] text-navy-bg/60 dark:text-offwhite/60 max-w-[520px] mb-8 leading-[1.7]">
          I build web experiences, translate data into decisions,<br />
          and chase finish lines — all at full stride.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#web-dev"
            className="inline-flex items-center px-7 py-3 bg-orange border-2 border-orange text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:bg-orange-dim hover:border-orange-dim hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(255,89,16,0.4)]"
          >
            See My Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5"
          >
            Get In Touch
          </a>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-8 mt-16 pt-8 border-t border-navy-bg/10 dark:border-offwhite/10 max-w-[1240px] mx-auto w-full flex-wrap">
        <div ref={racesRef} className="flex flex-col gap-1 mb-[5%]">
          <span className="flex items-baseline gap-0.5 leading-none">
            <span className="font-display text-[clamp(2rem,5vw,3rem)] text-orange">{racesVal}</span>
            <span className="font-display text-[clamp(1.4rem,3vw,2rem)] text-orange opacity-70">+</span>
          </span>
          <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-navy-bg/60 dark:text-offwhite/60">Races Finished</span>
        </div>
        <div className="w-px h-10 bg-navy-bg/10 dark:bg-offwhite/10 flex-shrink-0" aria-hidden="true" />
        <div ref={marathonRef} className="flex flex-col gap-1 mb-[5%]">
          <span className="flex items-baseline gap-0.5 leading-none">
            <span className="font-display text-[clamp(2rem,5vw,3rem)] text-orange">4:</span>
            <span className="font-display text-[clamp(2rem,5vw,3rem)] text-orange">
              {String(marathonVal).padStart(2, '0')}
            </span>
          </span>
          <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-navy-bg/60 dark:text-offwhite/60">Marathon PR</span>
        </div>
        <div className="w-px h-10 bg-navy-bg/10 dark:bg-offwhite/10 flex-shrink-0" aria-hidden="true" />
        <div ref={nycRef} className="flex flex-col gap-1 mb-[5%]">
          <span className="flex items-baseline gap-0.5 leading-none">
            <span className="font-display text-[clamp(2rem,5vw,3rem)] text-orange">{nycVal}</span>
            <span className="font-display text-[clamp(1.4rem,3vw,2rem)] text-orange opacity-70">×</span>
          </span>
          <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-navy-bg/60 dark:text-offwhite/60">NYC Marathon Finisher</span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Check dark mode: particles are white/orange/blue on dark navy. Toggle to light mode: particles shift to navy/orange on warm off-white, gradient background changes to warm tones.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: add dark: variants and theme-aware canvas to Hero"
```

---

## Task 8: Add Dark: Variants to About, WebDev, Contact, Footer

**Files:**
- Modify: `src/components/About.jsx`
- Modify: `src/components/WebDev.jsx`
- Modify: `src/components/Contact.jsx`
- Modify: `src/components/Footer.jsx`

- [ ] **Step 1: Replace src/components/About.jsx**

```jsx
import Reveal from './Reveal'
const runnerImg = '/images/fitsum-admasu-oGv9xIl7DkY-unsplash.jpg'

const pillars = [
  { icon: '</>', label: 'Web Dev'   },
  { icon: '▲',   label: 'Analytics' },
  { icon: '●',   label: 'Running'   },
]

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-warm-section dark:bg-navy-section py-24 scroll-mt-[70px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-navy-light/30 dark:before:via-navy-light before:to-transparent"
    >
      <div className="w-[90%] max-w-[1240px] mx-auto">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">

          <Reveal direction="left">
            <div className="relative overflow-hidden rounded-sm aspect-[4/5] max-h-[500px] md:max-h-[600px] md:aspect-auto group">
              <img
                src={runnerImg}
                alt="Runner on city road at sunrise"
                loading="lazy"
                width={600}
                height={720}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 to-transparent" />
              <div className="absolute bottom-4 right-4 z-10 bg-orange text-offwhite px-6 py-4 rounded-sm text-center">
                <span className="block font-display text-[2.5rem] leading-none">3</span>
                <span className="block font-mono text-[0.6rem] tracking-[0.1em] uppercase opacity-90 mt-0.5">
                  NYC Marathon<br />Finishes
                </span>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">Who I Am</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">
                Three disciplines.<br />One relentless pursuit.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8] mt-4">
                I'm Calvin Daniel — a Commercial Operations Specialist by day, a freelance web developer
                building real digital experiences for real businesses, and a long-distance runner who
                believes the same mindset that gets you to mile 20 gets you to the best possible solution.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8] mt-4">
                Whether I'm designing a client's brand from scratch, architecting a Power BI dashboard
                that cuts through noise, or training for my next World Marathon Major — I bring precision,
                endurance, and hunger to every endeavor.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="flex gap-8 mt-16 flex-wrap">
                {pillars.map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <span className="text-[1.5rem] text-orange">{icon}</span>
                    <span className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace src/components/WebDev.jsx**

```jsx
import Reveal from './Reveal'

const SKILLS = [
  {
    num: '01', title: 'HTML / CSS / JavaScript',
    desc: 'Semantic, accessible markup paired with custom CSS architecture and vanilla JS — built to perform and maintain without dependencies.',
  },
  {
    num: '02', title: 'Responsive Design',
    desc: 'Mobile-first layouts with CSS Grid, Flexbox, and fluid typography. Your site looks sharp and intentional on every screen.',
  },
  {
    num: '03', title: 'WordPress Builds',
    desc: 'Custom WordPress development on Hostinger — lean, fast, and fully managed for small businesses that need real results.',
  },
  {
    num: '04', title: 'Custom Frameworks',
    desc: "No Bootstrap, no bloat. Bespoke component systems built to each client's brand and performance requirements.",
  },
  {
    num: '05', title: 'SEO & Performance',
    desc: 'Schema markup, Open Graph metadata, and page speed optimization — building for both people and search engines.',
  },
  {
    num: '06', title: 'CMS Integration',
    desc: 'Squarespace, WordPress, and headless CMS setups — giving clients full control of their content without touching code.',
  },
]

export default function WebDev() {
  return (
    <section id="web-dev" className="bg-warm-bg dark:bg-navy-bg py-24 scroll-mt-[70px]">
      <div className="w-[90%] max-w-[1240px] mx-auto">

        <Reveal className="text-center mb-16">
          <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">What I Build</p>
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">
            Web Developer
          </h2>
          <p className="max-w-[600px] mx-auto mt-4 text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-relaxed">
            From custom-coded landing pages to full brand builds, I craft lightweight, responsive digital
            experiences — no bloated frameworks, just clean architecture and intentional design.
          </p>
        </Reveal>

        <div className="grid gap-px bg-navy-bg/10 dark:bg-offwhite/10 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden md:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((skill, i) => (
            <Reveal key={skill.num} delay={i * 60}>
              <div className="bg-warm-section dark:bg-[rgba(0,30,80,0.5)] p-8 hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.7)] transition-colors h-full">
                <div className="font-mono text-[0.65rem] text-orange tracking-[0.1em] mb-4">{skill.num}</div>
                <h3 className="font-display text-[1.4rem] tracking-wide text-navy-bg dark:text-offwhite mb-2">{skill.title}</h3>
                <p className="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7]">{skill.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 border-l-[3px] border-orange pl-8">
          <blockquote className="font-display text-[clamp(1.4rem,3.5vw,2rem)] leading-[1.3] text-navy-bg/60 dark:text-offwhite/60 tracking-wide">
            "The best websites are the ones no one notices — because they just work, look right,
            and get out of the way."
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Replace src/components/Contact.jsx**

```jsx
import Reveal from './Reveal'

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-warm-section dark:bg-navy-section py-24 overflow-hidden scroll-mt-[70px] before:content-[''] before:absolute before:inset-0 before:[background:radial-gradient(ellipse_at_center,rgba(255,89,16,0.08)_0%,transparent_70%)]"
    >
      <div className="w-[90%] max-w-[1240px] mx-auto">
        <Reveal className="relative z-10 text-center max-w-[640px] mx-auto">
          <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">
            Let's Work Together
          </p>
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">
            Ready to build<br />something great?
          </h2>
          <p className="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] mt-4 mb-16 leading-[1.75]">
            Whether you need a new website, a data solution, or just want to talk shop about running
            — I'm always up for a good conversation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:calvin@calantdigital.com"
              className="inline-flex items-center px-7 py-3 bg-orange border-2 border-orange text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:bg-orange-dim hover:border-orange-dim hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(255,89,16,0.4)]"
            >
              Send Me a Message
            </a>
            <a
              href="https://calantdigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5"
            >
              Visit Calant Digital
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Replace src/components/Footer.jsx**

```jsx
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
```

- [ ] **Step 5: Verify in browser**

Toggle between dark and light mode. All four sections should transition: About and Contact from warm-section to navy-section, WebDev from warm-bg to navy-bg, Footer from warm-section to navy-dark.

- [ ] **Step 6: Commit**

```bash
git add src/components/About.jsx src/components/WebDev.jsx src/components/Contact.jsx src/components/Footer.jsx
git commit -m "feat: add dark: variants to About, WebDev, Contact, Footer"
```

---

## Task 9: Analyst Dark: Variants

**Files:**
- Modify: `src/components/Analyst.jsx`

- [ ] **Step 1: Replace src/components/Analyst.jsx**

Analyst has hardcoded `rgba(0,15,50,0.7)` card backgrounds — replace with a warm-mode fallback:

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Analyst.jsx
git commit -m "feat: add dark: variants to Analyst section"
```

---

## Task 10: Running Section Upgrade

**Files:**
- Modify: `src/components/Running.jsx`

- [ ] **Step 1: Replace src/components/Running.jsx**

Adds: Next Race Highlight card, Goal Banner, desktop 2-column layout with runner stock photo, and dark: variants throughout.

```jsx
import Reveal from './Reveal'

const runnerPhoto = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&auto=format&fit=crop&q=80'

const NEXT_RACE = {
  name:     'Chicago Marathon',
  date:     new Date('2026-10-11'),
  location: 'Chicago, IL',
  distance: '26.2 mi',
}

const daysAway = Math.max(0, Math.ceil((NEXT_RACE.date - new Date()) / (1000 * 60 * 60 * 24)))

const RACE_STATS = [
  { number: '4',  label: 'Marathons',      highlighted: false },
  { number: '3×', label: 'NYC Marathon',   highlighted: true  },
  { number: '5',  label: 'Half Marathons', highlighted: false },
  { number: '3',  label: 'Years Running',  highlighted: false },
]

const GOALS = [
  { text: 'Sub-4:00 Marathon' },
  { text: 'Complete Chicago Major' },
  { text: '1,000 miles in 2026' },
]

const MAJORS = [
  { name: 'New York City', status: '3× Finisher', completed: true  },
  { name: 'Chicago',       status: 'On the list', completed: false },
  { name: 'Boston',        status: 'On the list', completed: false },
  { name: 'London',        status: 'On the list', completed: false },
  { name: 'Berlin',        status: 'On the list', completed: false },
  { name: 'Tokyo',         status: 'On the list', completed: false },
]

export default function Running() {
  return (
    <section id="running" className="relative bg-warm-bg dark:bg-navy-bg py-24 overflow-hidden scroll-mt-[70px]">
      <span
        aria-hidden="true"
        className="absolute -right-[0.05em] -bottom-[0.1em] font-display text-[clamp(10rem,28vw,22rem)] text-transparent leading-none pointer-events-none select-none"
        style={{ WebkitTextStroke: '1px rgba(255,89,16,0.08)' }}
      >
        RUN
      </span>

      <div className="w-[90%] max-w-[1240px] mx-auto">

        <Reveal className="text-center mb-16">
          <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">Mile After Mile</p>
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">
            Marathon Runner
          </h2>
          <p className="max-w-[600px] mx-auto mt-4 text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-relaxed">
            Three years in. Nine races finished. The same discipline that builds great software and clean
            dashboards is what gets you to mile 20 when your legs are begging you to stop.
          </p>
        </Reveal>

        {/* Next Race Highlight */}
        <Reveal className="mb-12">
          <div className="border-l-4 border-orange bg-warm-section dark:bg-navy-dark/50 rounded-sm p-6 md:p-8">
            <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-orange mb-4">Next Race</p>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <h3 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-navy-bg dark:text-offwhite leading-tight">
                  {NEXT_RACE.name}
                </h3>
                <p className="font-mono text-[0.75rem] text-navy-bg/60 dark:text-offwhite/60 mt-1">
                  {NEXT_RACE.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {NEXT_RACE.location}
                </p>
              </div>
              <div className="flex flex-col items-center bg-orange/10 border border-orange/30 px-6 py-4 rounded-sm flex-shrink-0">
                <span className="font-display text-[2.8rem] text-orange leading-none">{daysAway}</span>
                <span className="font-mono text-[0.55rem] tracking-widest uppercase text-orange/70">days away</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 bg-orange/10 border border-orange/20 px-3 py-1 rounded-full font-mono text-[0.65rem] tracking-widest uppercase text-orange">
                {NEXT_RACE.distance}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Race stat grid */}
        <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-px bg-navy-bg/10 dark:bg-offwhite/10 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden mb-16">
          {RACE_STATS.map(({ number, label, highlighted }) => (
            <div
              key={label}
              className={`py-6 px-4 text-center transition-colors ${
                highlighted
                  ? 'bg-orange/12 hover:bg-orange/[.20]'
                  : 'bg-warm-section dark:bg-[rgba(0,30,80,0.4)] hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.6)]'
              }`}
            >
              <span className={`block font-display text-[clamp(3rem,8vw,5rem)] leading-none ${highlighted ? 'text-orange' : 'text-navy-bg dark:text-offwhite'}`}>
                {number}
              </span>
              <span className="block font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60 mt-1">
                {label}
              </span>
            </div>
          ))}
        </Reveal>

        {/* PRs + Goals + Photo — 2-column on desktop */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start mb-16">
          <div className="flex flex-col gap-6">
            {/* Personal records */}
            <div>
              <h3 className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-5">
                Personal Records
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-warm-section dark:bg-[rgba(0,30,80,0.4)] border border-navy-bg/10 dark:border-offwhite/10 rounded-sm p-6 hover:border-navy-bg/25 dark:hover:border-offwhite/25 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-2">Half Marathon</div>
                  <div className="font-display text-[clamp(2.5rem,8vw,4rem)] text-navy-bg dark:text-offwhite leading-none">
                    1:43<span className="text-[0.5em] opacity-60">:45</span>
                  </div>
                  <div className="font-mono text-[0.65rem] tracking-widest text-navy-bg/60 dark:text-offwhite/60 mt-2">~7:55 / mile</div>
                </div>
                <div className="relative bg-orange/10 border border-orange/40 rounded-sm p-6 hover:border-orange hover:-translate-y-0.5 transition-all duration-300">
                  <span className="absolute top-4 right-4 text-orange text-[1.2rem]">★</span>
                  <div className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-2">Full Marathon</div>
                  <div className="font-display text-[clamp(2.5rem,8vw,4rem)] text-orange leading-none">
                    4:10<span className="text-[0.5em] opacity-60">:00</span>
                  </div>
                  <div className="font-mono text-[0.65rem] tracking-widest text-navy-bg/60 dark:text-offwhite/60 mt-2">~9:33 / mile</div>
                </div>
              </div>
            </div>

            {/* Goal banner */}
            <div>
              <h3 className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-4">
                Current Goals
              </h3>
              <div className="flex flex-wrap gap-3">
                {GOALS.map(({ text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-2 border border-orange/40 text-orange bg-orange/8 px-4 py-2 rounded-full font-mono text-[0.7rem] tracking-[0.05em]"
                  >
                    <span aria-hidden="true" className="text-[0.8rem]">▶</span>
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Runner photo — visible on lg+ */}
          <div className="hidden lg:block relative overflow-hidden rounded-sm aspect-[4/5] group">
            <img
              src={runnerPhoto}
              alt="Marathon runner mid-race"
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-warm-section/30 dark:from-navy-dark/50 to-transparent" />
          </div>
        </div>

        {/* Abbott majors */}
        <Reveal className="border border-navy-bg/10 dark:border-offwhite/10 rounded-sm p-10 bg-warm-section/60 dark:bg-[rgba(0,15,50,0.4)]">
          <div className="mb-10">
            <h3 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-navy-bg dark:text-offwhite tracking-wide mb-2">
              Abbott World Marathon Majors
            </h3>
            <p className="text-navy-bg/60 dark:text-offwhite/60 text-[0.95rem]">
              Six of the world's most prestigious marathons. One 6-Star medal for those who conquer them all.
              The hunt is on.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {MAJORS.map(({ name, status, completed }) => (
              <div
                key={name}
                className={`flex flex-col gap-1 p-4 rounded-sm border transition-all duration-300 hover:-translate-y-0.5 ${
                  completed
                    ? 'bg-orange/12 border-orange/40 hover:border-orange'
                    : 'border-navy-bg/10 dark:border-offwhite/10 hover:border-navy-bg/20 dark:hover:border-offwhite/20'
                }`}
              >
                <span className={`text-[1rem] ${completed ? 'text-orange' : 'text-navy-bg/40 dark:text-offwhite/40'}`}>
                  {completed ? '★' : '○'}
                </span>
                <span className="font-display text-[1.1rem] text-navy-bg dark:text-offwhite tracking-wide">{name}</span>
                <span className={`font-mono text-[0.6rem] tracking-widest uppercase ${completed ? 'text-orange' : 'text-navy-bg/60 dark:text-offwhite/60'}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-8 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-orange text-center">
            1 star earned. 5 to go. The 6-Star medal awaits.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Confirm: Next Race card shows "Chicago Marathon" with correct days-away count. Goal pills render. On desktop (≥1024px), runner photo appears alongside the PRs. Majors tracker still intact.

- [ ] **Step 3: Commit**

```bash
git add src/components/Running.jsx
git commit -m "feat: upgrade Running section with Next Race card, Goal Banner, and 2-column desktop layout"
```

---

## Task 11: Pricing Component

**Files:**
- Create: `src/components/Pricing.jsx`

- [ ] **Step 1: Create src/components/Pricing.jsx**

```jsx
import Reveal from './Reveal'

const TIERS = [
  {
    name: 'Starter',
    price: 'Starting at $499',
    description: 'For individuals and small businesses ready to establish their online presence.',
    features: [
      'Single landing page',
      'Mobile responsive design',
      'Basic SEO setup',
      'Contact form',
      'Up to 3 revisions',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'Starting at $1,199',
    description: 'The full package for businesses ready to grow their digital footprint.',
    features: [
      'Multi-page website (up to 6 pages)',
      'CMS integration (WordPress or Squarespace)',
      'Performance & speed optimization',
      'SEO best practices',
      'Google Analytics setup',
      '30-day post-launch support',
    ],
    cta: 'Get Started',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Custom',
    price: "Let's Talk",
    description: 'Complex builds, e-commerce, and ongoing partnerships tailored to your goals.',
    features: [
      'Full brand build',
      'E-commerce or advanced functionality',
      'Custom integrations',
      'Ongoing retainer available',
      'Priority support',
    ],
    cta: 'Get In Touch',
    highlighted: false,
  },
]

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative bg-warm-section dark:bg-navy-section py-24 scroll-mt-[70px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-navy-light/20 dark:before:via-navy-light before:to-transparent"
    >
      <div className="w-[90%] max-w-[1240px] mx-auto">
        <Reveal className="text-center mb-16">
          <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">Investment</p>
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">
            Pricing
          </h2>
          <p className="max-w-[600px] mx-auto mt-4 text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-relaxed">
            Straightforward tiers to fit your project. Every engagement starts with a conversation.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {TIERS.map((tier) => (
            <Reveal key={tier.name}>
              <div
                className={`relative flex flex-col rounded-sm border p-8 h-full transition-all duration-300 hover:-translate-y-1 ${
                  tier.highlighted
                    ? 'border-orange bg-orange/5 lg:scale-[1.04] lg:z-10 shadow-[0_0_40px_rgba(255,89,16,0.12)]'
                    : 'border-navy-bg/10 dark:border-offwhite/10 bg-warm-bg dark:bg-navy-dark/30'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] tracking-widest uppercase px-4 py-1 bg-orange text-offwhite rounded-full whitespace-nowrap">
                    {tier.badge}
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-[2rem] text-navy-bg dark:text-offwhite tracking-wide mb-1">
                    {tier.name}
                  </h3>
                  <p className={`font-display text-[clamp(1.4rem,3vw,1.9rem)] leading-none mb-3 ${tier.highlighted ? 'text-orange' : 'text-navy-bg dark:text-offwhite'}`}>
                    {tier.price}
                  </p>
                  <p className="text-navy-bg/50 dark:text-offwhite/50 text-[0.9rem] leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-navy-bg/70 dark:text-offwhite/70 text-[0.9rem]">
                      <span className="text-orange mt-0.5 flex-shrink-0 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block text-center font-mono text-[0.75rem] tracking-[0.1em] uppercase px-6 py-3 rounded-sm transition-all duration-300 ${
                    tier.highlighted
                      ? 'bg-orange text-offwhite hover:bg-orange-dim hover:shadow-[0_6px_24px_rgba(255,89,16,0.4)]'
                      : 'border border-navy-bg/25 dark:border-offwhite/30 text-navy-bg/70 dark:text-offwhite/70 hover:border-orange hover:text-orange'
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="font-mono text-[0.7rem] tracking-[0.1em] text-navy-bg/40 dark:text-offwhite/40">
            All pricing is project-specific — these are starting points. Get in touch for a tailored quote.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Pricing section on homepage. Three cards render. Pro card has "Most Popular" badge and orange border. On desktop (≥1024px), Pro card is slightly taller/scaled. Check dark and light modes.

- [ ] **Step 3: Commit**

```bash
git add src/components/Pricing.jsx
git commit -m "feat: add Pricing section with Starter/Pro/Custom tiers"
```

---

## Task 12: PageHeader + ProjectCard Components

**Files:**
- Create: `src/components/PageHeader.jsx`
- Create: `src/components/ProjectCard.jsx`

- [ ] **Step 1: Create src/components/PageHeader.jsx**

```jsx
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
```

- [ ] **Step 2: Create src/components/ProjectCard.jsx**

```jsx
export default function ProjectCard({ title, description, tags, liveUrl, codeUrl, image, category }) {
  return (
    <article
      data-category={category}
      className="group flex flex-col bg-warm-section dark:bg-navy-dark/50 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
    >
      <div className="overflow-hidden aspect-video flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-display text-[1.3rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">
          {title}
        </h3>
        <p className="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7] mb-4 flex-1">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map(tag => (
            <span
              key={tag}
              className="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 bg-orange text-offwhite hover:bg-orange-dim transition-colors rounded-sm"
          >
            View Live
          </a>
          <a
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/70 dark:text-offwhite/70 hover:border-orange hover:text-orange transition-colors rounded-sm"
          >
            View Code
          </a>
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PageHeader.jsx src/components/ProjectCard.jsx
git commit -m "feat: add PageHeader and ProjectCard components"
```

---

## Task 13: ProjectsPage (TDD for Filter)

**Files:**
- Create: `src/pages/ProjectsPage.jsx`
- Create: `src/pages/ProjectsPage.test.jsx`

- [ ] **Step 1: Write the failing filter tests**

Create `src/pages/ProjectsPage.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../context/ThemeContext'
import ProjectsPage from './ProjectsPage'

function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <ThemeProvider>{children}</ThemeProvider>
    </MemoryRouter>
  )
}

describe('ProjectsPage', () => {
  it('renders all projects by default', () => {
    render(<ProjectsPage />, { wrapper: Wrapper })
    const cards = document.querySelectorAll('[data-category]')
    expect(cards.length).toBe(4)
  })

  it('shows only Web Dev projects when Web Dev filter is clicked', async () => {
    render(<ProjectsPage />, { wrapper: Wrapper })
    await userEvent.click(screen.getByRole('button', { name: 'Web Dev' }))
    const cards = document.querySelectorAll('[data-category]')
    cards.forEach(card => {
      expect(card.getAttribute('data-category')).toBe('Web Dev')
    })
  })

  it('shows only Data / Analytics projects when that filter is clicked', async () => {
    render(<ProjectsPage />, { wrapper: Wrapper })
    await userEvent.click(screen.getByRole('button', { name: 'Data / Analytics' }))
    const cards = document.querySelectorAll('[data-category]')
    cards.forEach(card => {
      expect(card.getAttribute('data-category')).toBe('Data / Analytics')
    })
  })

  it('shows all projects when All filter is clicked after filtering', async () => {
    render(<ProjectsPage />, { wrapper: Wrapper })
    await userEvent.click(screen.getByRole('button', { name: 'Web Dev' }))
    await userEvent.click(screen.getByRole('button', { name: 'All' }))
    const cards = document.querySelectorAll('[data-category]')
    expect(cards.length).toBe(4)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --run src/pages/ProjectsPage.test.jsx
```

Expected: FAIL — "Cannot find module './ProjectsPage'"

- [ ] **Step 3: Create src/pages/ProjectsPage.jsx**

```jsx
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
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --run src/pages/ProjectsPage.test.jsx
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ProjectsPage.jsx src/pages/ProjectsPage.test.jsx
git commit -m "feat: add ProjectsPage with filter and placeholder project cards"
```

---

## Task 14: ClientRow + ClientsPage

**Files:**
- Create: `src/components/ClientRow.jsx`
- Create: `src/pages/ClientsPage.jsx`

- [ ] **Step 1: Create src/components/ClientRow.jsx**

```jsx
export default function ClientRow({ client, industry, description, platform, siteUrl, image, reverse }) {
  return (
    <div className={`grid gap-10 md:grid-cols-2 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <div className="overflow-hidden rounded-sm aspect-[3/2] group">
        <img
          src={image}
          alt={`${client} website preview`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div>
        <span className="inline-block font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1 bg-orange/10 text-orange border border-orange/20 rounded-full mb-4">
          {industry}
        </span>
        <h3 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-navy-bg dark:text-offwhite leading-tight mb-4">
          {client}
        </h3>
        <p className="text-navy-bg/60 dark:text-offwhite/60 text-[1rem] leading-[1.8] mb-6">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {platform.map(p => (
            <span
              key={p}
              className="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-navy-bg/5 dark:bg-offwhite/5 text-navy-bg/60 dark:text-offwhite/60 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm"
            >
              {p}
            </span>
          ))}
        </div>
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.1em] uppercase px-6 py-3 border-2 border-orange text-orange hover:bg-orange hover:text-offwhite transition-all duration-300 rounded-sm"
        >
          Visit Site →
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create src/pages/ClientsPage.jsx**

```jsx
import PageHeader from '../components/PageHeader'
import ClientRow from '../components/ClientRow'
import Reveal from '../components/Reveal'

const CLIENTS = [
  {
    id: 1,
    client: 'Coastal Cuts Barbershop',
    industry: 'Small Business',
    description: 'Built a clean, mobile-first WordPress site for a local barbershop. Includes online booking integration, service menu, and Google Maps embed. Traffic increased 40% in the first month post-launch.',
    platform: ['WordPress', 'Hostinger', 'Custom CSS'],
    siteUrl: '#',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    client: 'Elevate Fitness Studio',
    industry: 'Health & Fitness',
    description: 'Custom Squarespace build for a boutique fitness studio. Class schedule integration, instructor bios, and a membership inquiry form. Designed to reflect the brand\'s high-energy aesthetic.',
    platform: ['Squarespace', 'Custom CSS', 'SEO'],
    siteUrl: '#',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    client: 'Harbor View Restaurant',
    industry: 'Restaurant',
    description: 'Full brand website for a waterfront restaurant. Features a full menu display, photo gallery, reservation CTA, and OpenTable integration. Optimized for local search to drive foot traffic.',
    platform: ['WordPress', 'Elementor', 'OpenTable'],
    siteUrl: '#',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop&q=80',
  },
]

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-warm-bg dark:bg-navy-bg">
      <PageHeader title="Client Work" subtitle="Real businesses. Real results." />
      <div className="w-[90%] max-w-[1240px] mx-auto py-16">
        <div className="flex flex-col gap-24">
          {CLIENTS.map((client, i) => (
            <Reveal key={client.id}>
              <ClientRow {...client} reverse={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run all tests**

```bash
npm test -- --run
```

Expected: All tests pass (ThemeContext × 6, ProjectsPage × 4 = 10 total).

- [ ] **Step 4: Commit**

```bash
git add src/components/ClientRow.jsx src/pages/ClientsPage.jsx
git commit -m "feat: add ClientRow component and ClientsPage with placeholder client entries"
```

---

## Task 15: Final Smoke Test

**Files:** None modified.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Homepage smoke test**

Visit `http://localhost:5173`.

Check:
- Hero loads with particle canvas, typewriter, stagger animation
- Dark mode is default (dark navy background)
- All existing sections scroll into view: About, Web Developer, Data Analyst, Runner, Pricing, Contact
- Pricing section shows 3 cards; Pro card has "Most Popular" badge and orange border
- Running section shows "Next Race: Chicago Marathon" card with days countdown, Goal Banner pills, desktop photo column visible at ≥1024px wide
- Footer links work

- [ ] **Step 3: Theme toggle smoke test**

Click the sun icon in the header. Verify:
- Background shifts from navy to warm off-white across all sections
- Text shifts from offwhite to navy-bg throughout
- Canvas particles shift to navy/orange palette
- Hero gradient shifts to warm tones
- Theme persists after page refresh (localStorage)

- [ ] **Step 4: Navigation smoke test**

- Click "Projects" in the nav → `/projects` loads, filter pills visible, 4 project cards render
- Click a filter pill (e.g., "Web Dev") → only Web Dev cards show
- Click "Clients" in the nav → `/clients` loads, 3 client entries render in alternating layout
- Click "← Home" breadcrumb → returns to `/`
- On mobile (resize to <1024px): hamburger menu opens, theme toggle visible inside, Projects and Clients links work

- [ ] **Step 5: Run full test suite one final time**

```bash
npm test -- --run
```

Expected: 10 tests pass, 0 failures.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete portfolio redesign — routing, dark/light mode, Projects/Clients pages, Pricing, Running upgrade"
```
