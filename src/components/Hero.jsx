import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../context/AdminContext'
export default function Hero() {
  const { t, i18n } = useTranslation()
  const { data } = useAdmin()
  const isFr = i18n.language === 'fr'

  const kicker  = isFr ? (data.profile.kicker  || t('hero.kicker'))  : t('hero.kicker')
  const role    = isFr ? (data.profile.role     || t('hero.role'))    : t('hero.role')
  const tagline = isFr ? (data.profile.tagline  || t('hero.tagline')) : t('hero.tagline')

  return (
    <section
      id="hero-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 48px',
        maxWidth: 1200,
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1, maxWidth: 660 }}
      >
        {/* Kicker line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <span style={{
            display: 'inline-block',
            width: 28, height: 1.5,
            background: 'var(--blue)',
          }} />
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'var(--blue)',
          }}>
            {kicker}
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(52px, 8.5vw, 118px)',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
          marginBottom: 24,
          color: 'var(--text)',
        }}>
          {data.profile.name}
        </h1>

        {/* Role with accent bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <span style={{
            display: 'inline-block',
            width: 3, height: 28,
            background: 'var(--accent)',
            borderRadius: 2,
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(20px, 2.8vw, 34px)',
            letterSpacing: '0.04em',
            color: 'var(--text)',
          }}>
            {role}
          </span>
        </div>

        <p style={{
          maxWidth: 520,
          fontSize: 17,
          lineHeight: 1.75,
          color: 'var(--text-muted)',
          textWrap: 'pretty',
          marginBottom: 42,
        }}>
          {tagline}
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a
            href="#experience"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontSize: 14,
              textDecoration: 'none',
              color: '#fff',
              background: 'var(--accent)',
              padding: '14px 30px',
              borderRadius: 2,
              whiteSpace: 'nowrap',
              transition: 'background 0.2s, transform 0.15s',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#c94009'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'none' }}
          >
            {t('hero.cta')}
            <span style={{ opacity: 0.7, fontSize: 16 }}>→</span>
          </a>
          <a
            href="#contact"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontSize: 14,
              textDecoration: 'none',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              padding: '14px 30px',
              borderRadius: 2,
              whiteSpace: 'nowrap',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
          >
            {t('hero.contact')}
          </a>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: -80, left: 0,
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <div style={{ position: 'relative', width: 1, height: 48, background: 'var(--border)', overflow: 'hidden' }}>
            <motion.div
              animate={{ y: ['0%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '50%',
                background: 'var(--accent)',
              }}
            />
          </div>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11, letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
