import PageHeader from '../components/PageHeader'
import ClientRow from '../components/ClientRow'
import Reveal from '../components/Reveal'

const CLIENTS = [
  {
    id: 1,
    client: 'Gurvis Miner Dispute Resolution',
    industry: 'Legal / Mediation',
    description: 'Independent freelancer website built on WordPress with a polished, professional presence that immediately establishes credibility. Features a custom contact form implementation for client intake, mobile-first responsive design, and optimized load times — giving a solo practitioner the same digital authority as a full firm.',
    platform: ['WordPress', 'Custom CSS', 'Contact Form', 'SEO'],
    siteUrl: 'https://minerdisputeresolution.com/',
    image: '/images/client-miner-dispute.jpg',
  },
  {
    id: 2,
    client: 'Bachata Bakery',
    industry: 'Food & Beverage',
    description: 'Fully custom-coded storefront built from the ground up — no templates, no shortcuts. Features dynamic order forms, presale window open/close functionality that activates and deactivates ordering on a schedule, and deep SEO optimization to drive organic traffic. Fast load times and a mobile experience as smooth as the desktop keep customers engaged from first visit to checkout.',
    platform: ['Custom Code', 'JavaScript', 'Order Forms', 'SEO'],
    siteUrl: 'https://bachatabakery.com/',
    image: '/images/client-bachata-bakery.jpg',
  },
  {
    id: 3,
    client: 'Raquel Ariana',
    industry: 'Beauty / Makeup Artist',
    description: 'A single-page freelance site for a professional makeup artist serving DE, PA, NJ, and MD. Beautifully showcases services and pricing in a clean, scrollable layout, with integrated contact form functionality for booking inquiries. Optimized for mobile — because clients are booking on their phones — with lightning-fast load times and a customized visual identity that reflects the brand.',
    platform: ['Custom Code', 'CSS', 'Contact Form', 'Mobile-First'],
    siteUrl: 'https://raquelariana.com/',
    image: '/images/client-raquel-ariana.jpg',
  },
]

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-warm-bg dark:bg-navy-bg">
      <PageHeader title="Client Work" subtitle="Real businesses. Real results." />
      <div className="w-[90%] max-w-[1240px] mx-auto py-16">
        <div className="flex flex-col gap-24">
          {CLIENTS.map((client, i) => (
            <Reveal key={client.id}>
              <ClientRow {...client} reverse={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
