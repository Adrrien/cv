import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../context/AdminContext'

export default function Hero() {
  const { t } = useTranslation()
  const { data } = useAdmin()

  return (
    <section
      id="hero-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 40px',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span style={{
          display: 'block',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 16,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'var(--blue)',
          marginBottom: 18,
        }}>
          {data.profile.kicker}
        </span>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(56px, 9vw, 128px)',
          lineHeight: 0.92,
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
          marginBottom: 22,
          color: 'var(--text)',
        }}>
          {data.profile.name}
        </h1>
        <span style={{
          display: 'block',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 500,
          fontSize: 'clamp(22px, 3vw, 38px)',
          letterSpacing: '0.04em',
          color: 'var(--text)',
          marginBottom: 24,
        }}>
          {data.profile.role}
        </span>
        <p style={{
          maxWidth: 560,
          fontSize: 18,
          lineHeight: 1.7,
          color: 'var(--text-muted)',
          textWrap: 'pretty',
        }}>
          {data.profile.tagline}
        </p>

        <div style={{ display: 'flex', gap: 16, marginTop: 38, flexWrap: 'wrap' }}>
          <a
            href="#experience"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontSize: 15,
              textDecoration: 'none',
              color: '#fff',
              background: 'var(--accent)',
              padding: '14px 28px',
              borderRadius: 2,
              whiteSpace: 'nowrap',
            }}
          >
            {t('hero.cta')}
          </a>
          <a
            href="#contact"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontSize: 15,
              textDecoration: 'none',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              padding: '14px 28px',
              borderRadius: 2,
              whiteSpace: 'nowrap',
            }}
          >
            {t('hero.contact')}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
