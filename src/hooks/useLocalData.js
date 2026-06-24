import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function useLocalData() {
  const { t, i18n } = useTranslation()
  const [experiences, setExperiences] = useState([])
  const [education, setEducation] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('cv-data')
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setExperiences(parsed.experiences || [])
        setEducation(parsed.education || [])
      } catch (e) {
        console.error('Erreur chargement localStorage:', e)
        setExperiences(t('experiences', { returnObjects: true }) || [])
        setEducation(t('education', { returnObjects: true }) || [])
      }
    } else {
      setExperiences(t('experiences', { returnObjects: true }) || [])
      setEducation(t('education', { returnObjects: true }) || [])
    }
  }, [t])

  return { experiences, education }
}
