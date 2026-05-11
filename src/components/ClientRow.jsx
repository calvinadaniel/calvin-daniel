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
