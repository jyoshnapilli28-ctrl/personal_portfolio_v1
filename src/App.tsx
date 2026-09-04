import { useState } from 'react';
import Preloader from './components/Preloader/Preloader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Expertise from './components/Expertise/Expertise';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Certifications from './components/Certifications/Certifications';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative selection:bg-accent/30 selection:text-text-ivory">
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div
        className={
          loading
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100 transition-opacity duration-700'
        }
      >
        <Navbar />
        <main>
          <Hero />
          <About />
          <Expertise />
          <Skills />
          <Projects />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </div>
      <div className="bg-noise-overlay pointer-events-none" />
    </div>
  );
}
