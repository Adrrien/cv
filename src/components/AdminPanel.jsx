import { useState, useRef } from 'react'
import { useAdmin } from '../context/AdminContext'

const base = {
  background: '#11151e',
  border: '1px solid #232b3a',
  borderRadius: 4,
  color: '#e8ecf2',
  padding: '9px 11px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

function Inp({ value, onChange, style, ...rest }) {
  return (
    <input
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      style={{ ...base, ...(style || {}) }}
      {...rest}
    />
  )
}

function TA({ value, onChange, rows = 3, ...rest }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      style={{ ...base, marginTop: 8, resize: 'vertical', lineHeight: 1.5 }}
      {...rest}
    />
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontSize: 13,
      padding: '8px 14px',
      borderRadius: '4px 4px 0 0',
      cursor: 'pointer',
      border: '1px solid #1c2230',
      borderBottom: 'none',
      background: active ? '#11151e' : 'transparent',
      color: active ? '#E8520B' : '#7b8494',
    }}>
      {children}
    </button>
  )
}

function LangRow({ label, lang, accentColor, children, style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      {label && (
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#4a5568',
          marginBottom: 4,
        }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <span style={{
          flexShrink: 0,
          marginTop: 10,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          color: accentColor,
          opacity: 0.8,
          width: 18, textAlign: 'right',
        }}>
          {lang}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </div>
  )
}

function ItemCard({ item, kind, onUpdate, onDelete, onLogo }) {
  const fileRef = useRef(null)
  const accentColor = kind === 'exp' ? '#E8520B' : '#4899D0'
  const kindLabel = kind === 'exp' ? 'Expérience' : 'Formation'

  const getInitials = (s = '') => {
    const w = s.trim().split(/\s+/)
    return ((w[0]?.[0] ?? '') + (w[1]?.[0] ?? '')).toUpperCase() || '?'
  }

  return (
    <div style={{ border: '1px solid #1c2230', borderRadius: 6, padding: 14, background: '#0d1018' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div
          onClick={() => fileRef.current?.click()}
          title="Cliquer pour changer le logo"
          style={{
            flexShrink: 0,
            width: 42, height: 42, borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: accentColor,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, color: '#fff', fontSize: 15,
            cursor: 'pointer',
          }}
        >
          {item.logo
            ? <img src={item.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : getInitials(item.org)
          }
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0]
            if (!file) return
            const fr = new FileReader()
            fr.onload = () => onLogo(fr.result)
            fr.readAsDataURL(file)
          }}
        />
        <span style={{
          flex: 1,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 13, letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: accentColor,
        }}>
          {kindLabel}
        </span>
        <button
          onClick={onDelete}
          style={{
            background: 'none', border: '1px solid #3a2530',
            color: '#c2596f', width: 30, height: 30,
            borderRadius: 4, cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      <LangRow label="Titre" lang="FR" accentColor={accentColor}>
        <Inp value={item.title} onChange={v => onUpdate('title', v)} placeholder="Titre / Poste (FR)" />
      </LangRow>
      <LangRow label="" lang="EN" accentColor="#4899D0" style={{ marginTop: 6 }}>
        <Inp value={item.titleEn} onChange={v => onUpdate('titleEn', v)} placeholder="Title / Role (EN)" />
      </LangRow>
      <Inp value={item.org} onChange={v => onUpdate('org', v)} placeholder="Entreprise / École" style={{ marginTop: 8 }} />
      <Inp value={item.date} onChange={v => onUpdate('date', v)} placeholder="Dates (ex: 2023 — 2025)" style={{ marginTop: 8 }} />
      <LangRow label="Description" lang="FR" accentColor={accentColor} style={{ marginTop: 8 }}>
        <TA value={item.desc} onChange={v => onUpdate('desc', v)} rows={2} placeholder="Description (FR)" />
      </LangRow>
      <LangRow label="" lang="EN" accentColor="#4899D0" style={{ marginTop: 6 }}>
        <TA value={item.descEn} onChange={v => onUpdate('descEn', v)} rows={2} placeholder="Description (EN)" />
      </LangRow>
      {kind === 'exp' && (
        <Inp
          value={(item.tags || []).join(', ')}
          onChange={v => onUpdate('tags', v.split(',').map(t => t.trim()).filter(Boolean))}
          placeholder="Tags (séparés par des virgules)"
          style={{ marginTop: 8 }}
        />
      )}
    </div>
  )
}

export default function AdminPanel() {
  const admin = useAdmin()
  const [tab, setTab] = useState('profile')
  const importRef = useRef(null)

  if (!admin.adminOpen) return null

  const btnStyle = {
    fontFamily: "'Barlow Condensed', sans-serif",
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontSize: 13,
    padding: '10px 16px',
    borderRadius: 4,
    cursor: 'pointer',
    background: '#11151e',
    border: '1px solid #2a3242',
    color: '#cdd4df',
    flex: 1,
  }

  const d = admin.data

  const profileFields = [
    { field: 'name', label: 'Nom' },
    { field: 'kicker', label: 'Kicker / Titre court' },
    { field: 'role', label: 'Rôle' },
    { field: 'email', label: 'Email' },
    { field: 'github', label: 'GitHub (url)' },
    { field: 'linkedin', label: 'LinkedIn (url)' },
  ]

  return (
    <>
      <div
        onClick={() => admin.setAdminOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(2,3,6,0.6)',
          backdropFilter: 'blur(3px)',
        }}
      />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 440, maxWidth: '92vw',
        zIndex: 91,
        background: '#0a0c12',
        borderLeft: '1px solid #1c2230',
        overflowY: 'auto',
        boxShadow: '-30px 0 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          position: 'sticky', top: 0, zIndex: 2,
          background: '#0a0c12',
          borderBottom: '1px solid #161c28',
          padding: '18px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: 20,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#e8ecf2',
          }}>
            Édition <span style={{ color: '#E8520B' }}>·</span> Admin
          </div>
          <button
            onClick={() => admin.setAdminOpen(false)}
            style={{
              background: 'none', border: '1px solid #2a3242',
              color: '#9aa3b2', width: 32, height: 32,
              borderRadius: 4, cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, padding: '14px 22px 0' }}>
          {[
            { id: 'profile', label: 'Profil' },
            { id: 'experiences', label: 'Exp.' },
            { id: 'formations', label: 'Form.' },
            { id: 'skills', label: 'Skills' },
          ].map(({ id, label }) => (
            <TabBtn key={id} active={tab === id} onClick={() => setTab(id)}>
              {label}
            </TabBtn>
          ))}
        </div>

        <div style={{ padding: '20px 22px 40px' }}>

          {tab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {profileFields.map(({ field, label }) => (
                <label key={field} style={{
                  display: 'flex', flexDirection: 'column', gap: 5,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 13, letterSpacing: '0.16em',
                  textTransform: 'uppercase', color: '#7b8494',
                }}>
                  {label}
                  <Inp value={d.profile[field]} onChange={v => admin.updateProfile(field, v)} />
                </label>
              ))}
              <label style={{
                display: 'flex', flexDirection: 'column', gap: 5,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 13, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: '#7b8494',
              }}>
                Tagline
                <TA value={d.profile.tagline} onChange={v => admin.updateProfile('tagline', v)} rows={3} />
              </label>
            </div>
          )}

          {tab === 'experiences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {d.experiences.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  kind="exp"
                  onUpdate={(f, v) => admin.updateItem('exp', item.id, f, v)}
                  onDelete={() => admin.deleteItem('exp', item.id)}
                  onLogo={url => admin.setLogo('exp', item.id, url)}
                />
              ))}
              <button onClick={admin.addExperience} style={btnStyle}>+ Expérience</button>
            </div>
          )}

          {tab === 'formations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {d.formations.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  kind="edu"
                  onUpdate={(f, v) => admin.updateItem('edu', item.id, f, v)}
                  onDelete={() => admin.deleteItem('edu', item.id)}
                  onLogo={url => admin.setLogo('edu', item.id, url)}
                />
              ))}
              <button onClick={admin.addFormation} style={btnStyle}>+ Formation</button>
            </div>
          )}

          {tab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {d.skills.map(sk => (
                <div key={sk.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Inp
                    value={sk.name}
                    onChange={v => admin.updateSkill(sk.id, 'name', v)}
                    placeholder="Compétence"
                    style={{ flex: 1, width: 'auto' }}
                  />
                  <Inp
                    value={sk.category}
                    onChange={v => admin.updateSkill(sk.id, 'category', v)}
                    placeholder="Catégorie"
                    style={{ flex: 1, width: 'auto' }}
                  />
                  <button
                    onClick={() => admin.deleteSkill(sk.id)}
                    style={{
                      flexShrink: 0,
                      background: 'none', border: '1px solid #3a2530',
                      color: '#c2596f', width: 32, height: 32,
                      borderRadius: 4, cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={admin.addSkill} style={btnStyle}>+ Compétence</button>
            </div>
          )}

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid #161c28', display: 'flex', gap: 8 }}>
            <button onClick={admin.exportData} style={btnStyle}>Exporter JSON</button>
            <label style={{ ...btnStyle, textAlign: 'center', cursor: 'pointer' }}>
              Importer JSON
              <input
                type="file"
                accept="application/json"
                ref={importRef}
                style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) admin.importData(e.target.files[0]) }}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
