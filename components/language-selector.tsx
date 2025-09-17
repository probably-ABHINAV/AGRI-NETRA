'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, MapPin } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

const states = [
  { code: 'punjab', name: 'Punjab', nativeName: 'ਪੰਜਾਬ' },
  { code: 'haryana', name: 'Haryana', nativeName: 'हरियाणा' },
  { code: 'uttar-pradesh', name: 'Uttar Pradesh', nativeName: 'उत्तर प्रदेश' },
  { code: 'madhya-pradesh', name: 'Madhya Pradesh', nativeName: 'मध्य प्रदेश' },
  { code: 'maharashtra', name: 'Maharashtra', nativeName: 'महाराष्ट्र' },
  { code: 'bihar', name: 'Bihar', nativeName: 'बिहार' },
  { code: 'west-bengal', name: 'West Bengal', nativeName: 'পশ্চিমবঙ্গ' },
  { code: 'andhra-pradesh', name: 'Andhra Pradesh', nativeName: 'ఆంధ్రప్రదేశ్' },
  { code: 'telangana', name: 'Telangana', nativeName: 'తెలంగాణ' },
  { code: 'gujarat', name: 'Gujarat', nativeName: 'ગુજરાત' },
  { code: 'tamil-nadu', name: 'Tamil Nadu', nativeName: 'தமிழ்நாடு' },
  { code: 'kerala', name: 'Kerala', nativeName: 'കേരളം' },
  { code: 'karnataka', name: 'Karnataka', nativeName: 'ಕರ್ನಾಟಕ' },
  { code: 'rajasthan', name: 'Rajasthan', nativeName: 'राजस्थान' },
  { code: 'odisha', name: 'Odisha', nativeName: 'ଓଡ଼ିଶା' },
]

interface LanguageSelectorProps {
  showStateSelector?: boolean
  compact?: boolean
}

export default function LanguageSelector({ showStateSelector = true, compact = false }: LanguageSelectorProps) {
  const { language, userState, availableLanguages, setLanguage, setUserStateLocation, t } = useLanguage()
  const [tempState, setTempState] = useState(userState)
  const [loading, setLoading] = useState(false) // Added loading state

  const handleStateChange = (newState: string) => {
    setTempState(newState)
    setUserStateLocation(newState)
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {showStateSelector && (
          <Select value={userState} onValueChange={handleStateChange}>
            <SelectTrigger className="w-32">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-36">
            <Globe className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.nativeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-green-600" />
          {t('common.selectLanguage') || 'Select Language & State'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showStateSelector && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t('common.selectState') || 'Select Your State'}
            </label>
            <Select value={userState} onValueChange={handleStateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your state..." />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.code} value={state.code}>
                    <div className="flex flex-col">
                      <span>{state.name}</span>
                      <span className="text-xs text-gray-500">{state.nativeName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t('common.selectLanguage') || 'Select Language'}
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex justify-between items-center w-full">
                    <span>{lang.name}</span>
                    <span className="text-sm font-medium">{lang.nativeName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {userState && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              {t(`state.${userState}`) || `Agricultural region: ${states.find(s => s.code === userState)?.name}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}