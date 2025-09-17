
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translate, getCurrentLanguage, setCurrentLanguage, getUserState, setUserState, getLanguagesForState } from '@/lib/i18n'

interface LanguageContextType {
  language: string
  userState: string
  availableLanguages: Array<{ code: string; name: string; nativeName: string }>
  setLanguage: (lang: string) => void
  setUserStateLocation: (state: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en')
  const [userState, setUserStateState] = useState('')
  const [availableLanguages, setAvailableLanguages] = useState<Array<{ code: string; name: string; nativeName: string }>>([])

  useEffect(() => {
    const savedLanguage = getCurrentLanguage()
    const savedState = getUserState()
    
    setLanguageState(savedLanguage)
    setUserStateState(savedState)
    
    if (savedState) {
      const stateLanguages = getLanguagesForState(savedState)
      setAvailableLanguages(stateLanguages)
    } else {
      // Default languages
      setAvailableLanguages([
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
      ])
    }
  }, [])

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    setCurrentLanguage(lang)
  }

  const setUserStateLocation = (state: string) => {
    setUserStateState(state)
    setUserState(state)
    
    // Update available languages based on state
    const stateLanguages = getLanguagesForState(state)
    setAvailableLanguages(stateLanguages)
    
    // If current language is not available for this state, switch to first available
    if (!stateLanguages.find(l => l.code === language)) {
      const firstLang = stateLanguages[0]?.code || 'en'
      setLanguage(firstLang)
    }
  }

  const t = (key: string) => translate(key, language)

  return React.createElement(
    LanguageContext.Provider,
    {
      value: {
        language,
        userState,
        availableLanguages,
        setLanguage,
        setUserStateLocation,
        t
      }
    },
    children
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
