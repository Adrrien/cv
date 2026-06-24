import { useState, useEffect } from 'react'
import { AdminProvider } from './context/AdminContext'
import Background3D from './components/Background3D'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import Skills from './components/Skills'
import Contact from './components/Contact'
import AdminPanel from './components/AdminPanel'
import './i18n'

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('cv_theme') || 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('cv_theme', theme)
  }, [theme])

  return (
    <AdminProvider>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: theme === 'dark'
          ? 'var(--bg-gradient-dark)'
          : 'var(--bg-gradient-light)',
        transition: 'background 0.5s ease',
        pointerEvents: 'none',
      }} />

      <Background3D theme={theme} />

      <Navbar theme={theme} setTheme={setTheme} />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Timeline />
        <Skills />
        <Contact />
      </main>

      <AdminPanel />
    </AdminProvider>
  )
}
