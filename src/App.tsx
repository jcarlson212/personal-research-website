import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Research from './components/Research'
import Publications from './components/Publications'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'

// Code-split the blog: KaTeX + markdown rendering stay out of the home bundle.
const Blog = lazy(() => import('./components/Blog'))
const BlogPost = lazy(() => import('./components/BlogPost'))

/** Scroll to the hash target after in-app navigation (e.g. /#about from /blog). */
function ScrollToHash() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView()
    } else if (pathname === '/') {
      window.scrollTo(0, 0)
    }
  }, [hash, pathname])
  return null
}

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Research />
      <Publications />
      <Experience />
      <Projects />
      <Contact />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <a href="#top" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <ScrollToHash />
      <main id="main">
        <Suspense fallback={<div className="container post__status">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  )
}
