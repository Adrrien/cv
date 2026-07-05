import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'

const MOBILE_BP = 768

export default function Navbar({ theme, setTheme }) {
  const { t, i18n } = useTranslation()
  const { data } = useAdmin()
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BP)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BP
      setIsMobile(mobile)
      if (!mobile) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isLight = theme === 'light'
  const toggleTheme = () => setTheme(isLight ? 'dark' : 'light')
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')

  const navLinks = [
    { href: '#experience', label: t('nav.experience') },
    { href: '#education', label: t('nav.education') },
    { href: '#skills', label: t('nav.skills') },
    { href: '#contact', label: t('nav.contact') },
  ]

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '0 20px' : '0 48px',
          height: 60,
          background: (scrolled || menuOpen)
            ? (isLight ? 'rgba(238,242,248,0.95)' : 'rgba(6,10,20,0.95)')
            : 'transparent',
          backdropFilter: (scrolled || menuOpen) ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: (scrolled || menuOpen) ? 'blur(20px)' : 'none',
          borderBottom: (scrolled || menuOpen) ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'all 0.4s ease',
        }}
      >
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, zIndex: 110 }}>
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

        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {navLinks.map(({ href, label }) => (
              <NavLink key={href} href={href}>{label}</NavLink>
            ))}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, zIndex: 110 }}>
          <CtrlBtn onClick={toggleLang}>
            {i18n.language === 'fr' ? 'EN' : 'FR'}
          </CtrlBtn>
          <CtrlBtn onClick={toggleTheme} aria-label="Toggle theme">
            {isLight ? <MoonIcon /> : <SunIcon />}
          </CtrlBtn>
          {isMobile && (
            <CtrlBtn onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <HamburgerIcon open={menuOpen} />
            </CtrlBtn>
          )}
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0,
              zIndex: 99,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: isLight ? 'rgba(238,242,248,0.97)' : 'rgba(4,7,14,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* Accent top bar */}
            <div style={{
              position: 'absolute', top: 60, left: 0, right: 0,
              height: 1, background: 'var(--accent)', opacity: 0.3,
            }} />

            <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              {navLinks.map(({ href, label }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.06 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(36px, 10vw, 56px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    padding: '10px 0',
                    lineHeight: 1.1,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text)' }}
                >
                  <span style={{ color: 'var(--accent)', fontSize: '0.4em', verticalAlign: 'middle', marginRight: 12, opacity: 0.7 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {label}
                </motion.a>
              ))}
            </nav>

            {/* Bottom accent */}
            <div style={{
              position: 'absolute', bottom: 40,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11, letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              opacity: 0.5,
            }}>
              {data.profile.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

function HamburgerIcon({ open }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="0" y1="1" x2="16" y2="1"
        style={{ transform: open ? 'rotate(45deg) translate(3px, 5px)' : 'none', transition: 'transform 0.25s ease', transformOrigin: 'center' }} />
      <line x1="0" y1="6" x2="16" y2="6"
        style={{ opacity: open ? 0 : 1, transition: 'opacity 0.2s ease' }} />
      <line x1="0" y1="11" x2="16" y2="11"
        style={{ transform: open ? 'rotate(-45deg) translate(3px, -5px)' : 'none', transition: 'transform 0.25s ease', transformOrigin: 'center' }} />
    </svg>
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
