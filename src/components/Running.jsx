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
  { text: 'Run Boston Marathon', achieved: false },
  { text: 'Complete Chicago Major', achieved: false },
  { text: '1,000 miles in 2026', achieved: false },
]

const MAJORS = [
  { name: 'New York City', status: '3× Finisher',  completed: true  },
  { name: 'Chicago',       status: 'Next Target',  completed: false },
  { name: 'Boston',        status: 'Next Target',  completed: false },
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
                    3:54<span className="text-[0.5em] opacity-60">:23</span>
                  </div>
                  <div className="font-mono text-[0.65rem] tracking-widest text-navy-bg/60 dark:text-offwhite/60 mt-2">~8:57 / mile</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-orange text-offwhite px-3 py-1 rounded-full font-mono text-[0.6rem] tracking-widest uppercase">
                    <span>✓</span> Sub-4 Achieved
                  </div>
                </div>
              </div>
            </div>

            {/* Goal banner */}
            <div>
              <h3 className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-4">
                Current Goals
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 border border-orange bg-orange text-offwhite px-4 py-2 rounded-full font-mono text-[0.7rem] tracking-[0.05em]">
                  <span aria-hidden="true">✓</span>
                  Sub-4:00 Marathon
                </span>
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
