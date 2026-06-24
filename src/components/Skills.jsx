import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../context/AdminContext'

export default function Skills() {
  const { t } = useTranslation()
  const { data } = useAdmin()

  const groups = []
  const map = {}
  const palette = ['#E8520B', '#4899D0', '#1f6b9e', '#b8430a']
  data.skills.forEach((s, i) => {
    if (!map[s.category]) {
      map[s.category] = {
        category: s.category,
        color: palette[Object.keys(map).length % palette.length],
        items: [],
      }
      groups.push(map[s.category])
    }
    map[s.category].items.push(s)
  })

  return (
    <section id="skills" style={{ maxWidth: 920, margin: '0 auto', padding: '60px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 42 }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 15, letterSpacing: '0.4em',
          color: 'var(--blue)',
        }}>
          03
        </span>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(40px, 6vw, 72px)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: 'var(--text)',
        }}>
          {t('skills.title')}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {groups.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: gi * 0.08 }}
          >
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 14, letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: group.color,
              marginBottom: 14,
            }}>
              {group.category}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {group.items.map(sk => (
                <span
                  key={sk.id}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 16, letterSpacing: '0.05em',
                    padding: '8px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 2,
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = group.color }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  {sk.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
