import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Research from './components/Research'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Research />
        {/* Sections added in subsequent commits. */}
      </main>
    </>
  )
}
