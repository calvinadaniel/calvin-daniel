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
