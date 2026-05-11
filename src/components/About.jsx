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
