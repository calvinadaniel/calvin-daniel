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
