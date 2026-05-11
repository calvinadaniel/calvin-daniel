import { useRef, useEffect, useState } from 'react'

const INITIAL = {
  up:    'opacity-0 translate-y-7',
  left:  'opacity-0 -translate-x-9',
  right: 'opacity-0 translate-x-9',
  fade:  'opacity-0',
}
const VISIBLE = {
  up:    'opacity-100 translate-y-0',
  left:  'opacity-100 translate-x-0',
  right: 'opacity-100 translate-x-0',
  fade:  'opacity-100',
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  as: Tag = 'div',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const state = visible
    ? (VISIBLE[direction] ?? VISIBLE.up)
    : (INITIAL[direction] ?? INITIAL.up)

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${state} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
