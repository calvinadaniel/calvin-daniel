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
