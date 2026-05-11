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
