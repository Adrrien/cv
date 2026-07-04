import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'

export default function Navbar({ theme, setTheme }) {
  const { t, i18n } = useTranslation()
  const { data } = useAdmin()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLight = theme === 'light'
  const toggleTheme = () => setTheme(isLight ? 'dark' : 'light')
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')

  const navLinks = [
    { href: '#experience', label: t('nav.experience') },
    { href: '#education', label: t('nav.education') },
    { href: '#skills', label: t('nav.skills') },
    { href: '#contact', label: t('nav.contact') },
  ]

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
        height: 60,
        background: scrolled
          ? (isLight ? 'rgba(238,242,248,0.92)' : 'rgba(6,10,20,0.88)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}
    >
      <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32,
          border: '1.5px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, fontWeight: 700,
            color: 'var(--accent)', letterSpacing: '0.05em',
          }}>
            {(data.profile.name || 'CV').slice(0, 2).toUpperCase()}
          </span>
        </div>
      </a>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {navLinks.map(({ href, label }) => (
          <NavLink key={href} href={href}>{label}</NavLink>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CtrlBtn onClick={toggleLang}>
              {i18n.language === 'fr' ? 'EN' : 'FR'}
          </CtrlBtn>
        <CtrlBtn onClick={toggleTheme} aria-label="Toggle theme">
          {isLight
            ? <MoonIcon />
            : <SunIcon />
          }
        </CtrlBtn>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: scrolled ? '100%' : 0,
        height: 1,
        background: 'var(--accent)',
        transition: 'width 0.5s ease',
        opacity: 0.6,
      }} />
    </motion.header>
  )
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      style={{
        position: 'relative',
        color: 'var(--text-muted)',
        textDecoration: 'none',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '8px 18px',
        transition: 'color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
    >
      {children}
    </a>
  )
}

function CtrlBtn({ children, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      {...props}
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        padding: '5px 10px',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        transition: 'all 0.2s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.color = 'var(--accent)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.color = 'var(--text-muted)'
      }}
    >
      {children}
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}
