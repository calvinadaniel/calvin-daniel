import PageHeader from '../components/PageHeader'
import ClientRow from '../components/ClientRow'
import Reveal from '../components/Reveal'

const CLIENTS = [
  {
    id: 1,
    client: 'Coastal Cuts Barbershop',
    industry: 'Small Business',
    description: 'Built a clean, mobile-first WordPress site for a local barbershop. Includes online booking integration, service menu, and Google Maps embed. Traffic increased 40% in the first month post-launch.',
    platform: ['WordPress', 'Hostinger', 'Custom CSS'],
    siteUrl: '#',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    client: 'Elevate Fitness Studio',
    industry: 'Health & Fitness',
    description: "Custom Squarespace build for a boutique fitness studio. Class schedule integration, instructor bios, and a membership inquiry form. Designed to reflect the brand's high-energy aesthetic.",
    platform: ['Squarespace', 'Custom CSS', 'SEO'],
    siteUrl: '#',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    client: 'Harbor View Restaurant',
    industry: 'Restaurant',
    description: 'Full brand website for a waterfront restaurant. Features a full menu display, photo gallery, reservation CTA, and OpenTable integration. Optimized for local search to drive foot traffic.',
    platform: ['WordPress', 'Elementor', 'OpenTable'],
    siteUrl: '#',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop&q=80',
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
