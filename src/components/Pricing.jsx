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
