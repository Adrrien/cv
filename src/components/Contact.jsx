import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../context/AdminContext'

export default function Contact() {
  const { t } = useTranslation()
  const { data } = useAdmin()
  const { email, github, linkedin } = data.profile

  const links = [
    { href: `mailto:${email}`, label: email },
    { href: github, label: 'GitHub', target: '_blank', rel: 'noopener' },
    { href: linkedin, label: 'LinkedIn', target: '_blank', rel: 'noopener' },
  ]

  return (
    <section id="contact" style={{ maxWidth: 920, margin: '0 auto', padding: '80px 40px 120px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 36 }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 15, letterSpacing: '0.4em',
          color: 'var(--accent)',
        }}>
          04
        </span>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(40px, 6vw, 72px)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: 'var(--text)',
        }}>
          {t('contact.title')}
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}
      >
        {links.map(({ href, label, target, rel }) => (
          <a
            key={label}
            href={href}
            target={target}
            rel={rel}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: '0.1em',
              fontSize: 17,
              textDecoration: 'none',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              padding: '16px 26px',
              borderRadius: 3,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            {label}
          </a>
        ))}
      </motion.div>

      <p style={{ marginTop: 60, fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
        {data.profile.name} ·{' '} 2026
      </p>
    </section>
  )
}
