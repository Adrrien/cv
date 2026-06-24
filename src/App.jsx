import { useState, useEffect } from 'react'
import Background3D from './components/Background3D'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import Contact from './components/Contact'

export default function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      {/* Deep space background gradient */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: theme === 'dark'
          ? 'linear-gradient(160deg, #060A14 0%, #08101E 60%, #060C18 100%)'
          : 'linear-gradient(160deg, #EEF2F8 0%, #E2EAF4 60%, #EEF2F8 100%)',
        transition: 'background 0.5s ease',
      }} />

      <Background3D />

      <Navbar theme={theme} setTheme={setTheme} />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Timeline />
        <Contact />
      </main>
    </>
  )
}
