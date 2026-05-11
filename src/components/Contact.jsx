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
