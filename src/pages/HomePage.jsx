import Hero    from '../components/Hero'
import About   from '../components/About'
import WebDev  from '../components/WebDev'
import Analyst from '../components/Analyst'
import Running from '../components/Running'
import Pricing from '../components/Pricing'
import Contact from '../components/Contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <WebDev />
      <Analyst />
      <Running />
      <Pricing />
      <Contact />
    </>
  )
}
