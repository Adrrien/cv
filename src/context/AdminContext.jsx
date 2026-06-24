import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const KEY = 'cv3d_data_v1'
const DATA_VERSION = 2

const defaults = () => ({
  dataVersion: DATA_VERSION,
  profile: {
    name: 'Adrrien CHANDRAKUMAR',
    kicker: 'Étudiant · M1 Architecture & Développement logiciel',
    role: 'Apprenti Ingénieur logiciel',
    tagline: "Développeur passionné par l'expérience utilisateur, la data, le cloud et la création de produits numériques utiles. J'aime transformer des idées en solutions simples, fiables et intuitives.",
    email: 'adrrien.chandrakumar@gmail.com',
    github: 'https://github.com/Adrrien',
    linkedin: 'https://linkedin.com/in/adrrien-chandrakumar',
  },
  experiences: [
    { id: 'e1', title: 'Apprenti Ingénieur logiciel', org: 'Société Générale', date: 'Sept. 2024 — Présent', desc: 'Participation au développement d\'une nouvelle interface de gestion data interne au groupe\n.', logo: '', tags: ['Agile', 'Jenkins', 'React', 'TypeScript', 'Java Spring'] },
    { id: 'e2', title: 'Développeur Web (Stage)', org: 'Mercialys', date: 'Juin 2024 - Aout 2024', desc: "Refonte complète de l'intranet.", logo: '', tags: ['Agile', 'Wordpress', 'PHP'] },
    { id: 'e3', title: 'Employé CSC', org: 'Boulanger SA', date: 'Nov. 2023 - Avril 2024', desc: "Gestion de la clientèle au Service Après Vente, en Caisse et en financement", logo: '', tags: ['Organisation', 'Financements', 'Communication'] },
    { id: 'e4', title: 'Développeur Web (Stage)',  org: 'Pangée ONG', date: 'Mai. 2023 - Juillet 2023', desc: "Assistance à l'équipe de développement en place", logo: '', tags: ['Base de donnée', 'Odoo', 'Wordpress', 'Photoshop'] },
  ],
  formations: [
    { id: 'f1', title: 'Master', org: 'Efrei - Grande école du numérique', date: '2025 — 2027', desc: 'Architecture & Développement logiciel.', logo: '' },
    { id: 'f2', title: 'Licence', org: 'Efrei - Grande école du numérique', date: '2023 — 2025', desc: 'Sciences & Ingénierie - Informatique', logo: '' },
    { id: 'f3', title: 'Echange', org: 'APU - Asia Pacific University of Technology', date: 'Avril 2024 — Juin 2024', desc: 'Business Intelligence, Design thinking & Digital transformation', logo: '' },
  ],
  skills: [
    { id: 's1', name: 'Java', category: 'Développement' },
    { id: 's2', name: 'Spring Boot', category: 'Développement' },
    { id: 's3', name: 'JavaScript', category: 'Développement' },
    { id: 's4', name: 'TypeScript', category: 'Développement' },
    { id: 's5', name: 'React', category: 'Frontend' },
    { id: 's6', name: 'Next.js', category: 'Frontend' },

    { id: 's7', name: 'Docker', category: 'DevOps & Cloud' },
    { id: 's8', name: 'Jenkins', category: 'DevOps & Cloud' },
    { id: 's9', name: 'CI/CD', category: 'DevOps & Cloud' },
    { id: 's10', name: 'Git', category: 'DevOps & Cloud' },

    { id: 's11', name: 'Linux', category: 'Systèmes' },
    { id: 's12', name: 'Bash', category: 'Systèmes' },

    { id: 's13', name: 'PostgreSQL', category: 'Base de données' },
    { id: 's14', name: 'Elasticsearch', category: 'Big Data' },
    { id: 's15', name: 'Kibana', category: 'Big Data' },

    { id: 's16', name: 'UX/UI', category: 'Conception' },
  ]
})

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [data, setDataState] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const p = JSON.parse(raw)
        if (
          p?.dataVersion === DATA_VERSION &&
          p?.profile &&
          Array.isArray(p?.experiences) &&
          Array.isArray(p?.formations) &&
          Array.isArray(p?.skills)
        ) {
          return p
        }
      }
    } catch {}
    return defaults()
  })
  const [adminOpen, setAdminOpen] = useState(false)

  const setData = useCallback((updater) => {
    setDataState(prev => {
      const next = updater(JSON.parse(JSON.stringify(prev)))
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        setAdminOpen(o => !o)
      }
      if (e.key === 'Escape') setAdminOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const api = {
    data,
    adminOpen,
    setAdminOpen,
    updateProfile: (field, val) => setData(d => { d.profile[field] = val; return d }),
    addExperience: () => setData(d => {
      d.experiences.push({ id: 'e' + Date.now(), title: 'Nouveau poste', org: 'Entreprise', date: '2025', desc: '', logo: '', tags: [] })
      return d
    }),
    addFormation: () => setData(d => {
      d.formations.push({ id: 'f' + Date.now(), title: 'Nouvelle formation', org: 'École', date: '2025', desc: '', logo: '' })
      return d
    }),
    updateItem: (kind, id, field, val) => setData(d => {
      const arr = kind === 'exp' ? d.experiences : d.formations
      const it = arr.find(x => x.id === id)
      if (it) it[field] = val
      return d
    }),
    deleteItem: (kind, id) => setData(d => {
      if (kind === 'exp') d.experiences = d.experiences.filter(x => x.id !== id)
      else d.formations = d.formations.filter(x => x.id !== id)
      return d
    }),
    setLogo: (kind, id, dataUrl) => setData(d => {
      const arr = kind === 'exp' ? d.experiences : d.formations
      const it = arr.find(x => x.id === id)
      if (it) it.logo = dataUrl
      return d
    }),
    addSkill: () => setData(d => {
      d.skills.push({ id: 's' + Date.now(), name: 'Nouvelle', category: 'Catégorie' })
      return d
    }),
    updateSkill: (id, field, val) => setData(d => {
      const sk = d.skills.find(x => x.id === id)
      if (sk) sk[field] = val
      return d
    }),
    deleteSkill: (id) => setData(d => {
      d.skills = d.skills.filter(x => x.id !== id)
      return d
    }),
    exportData: () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const u = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = u; a.download = 'cv-data.json'; a.click()
      setTimeout(() => URL.revokeObjectURL(u), 1000)
    },
    importData: (file) => {
      const fr = new FileReader()
      fr.onload = () => {
        try {
          const p = JSON.parse(fr.result)
          if (p?.profile) {
            const next = { ...p, dataVersion: DATA_VERSION }
            try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
            setDataState(next)
          }
        } catch { alert('JSON invalide') }
      }
      fr.readAsText(file)
    },
  }

  return <AdminContext.Provider value={api}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  return useContext(AdminContext)
}
