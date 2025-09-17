
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wheat, Droplets, Thermometer, MapPin } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

const stateAgriculturalData = {
  'punjab': {
    majorCrops: ['Wheat', 'Rice', 'Sugarcane', 'Maize', 'Barley'],
    climateZone: 'Semi-arid',
    avgRainfall: '500mm',
    soilType: 'Alluvial',
    nickname: 'Granary of India',
    specialization: 'High mechanization and irrigation'
  },
  'haryana': {
    majorCrops: ['Wheat', 'Rice', 'Sunflower', 'Sugarcane', 'Cotton'],
    climateZone: 'Semi-arid',
    avgRainfall: '450mm',
    soilType: 'Alluvial',
    nickname: 'Green Revolution Belt',
    specialization: 'Modern farming techniques'
  },
  'maharashtra': {
    majorCrops: ['Cotton', 'Sugarcane', 'Grapes', 'Pomegranate', 'Mango'],
    climateZone: 'Tropical',
    avgRainfall: '1200mm',
    soilType: 'Black cotton',
    nickname: 'Cotton Leader',
    specialization: 'Horticulture and cash crops'
  },
  'tamil-nadu': {
    majorCrops: ['Rice', 'Sugarcane', 'Banana', 'Coconut', 'Cotton'],
    climateZone: 'Tropical',
    avgRainfall: '900mm',
    soilType: 'Red laterite',
    nickname: 'Rice & Horticulture Hub',
    specialization: 'Cauvery delta irrigation'
  },
  'west-bengal': {
    majorCrops: ['Rice', 'Jute', 'Tea', 'Vegetables', 'Potato'],
    climateZone: 'Tropical',
    avgRainfall: '1500mm',
    soilType: 'Alluvial',
    nickname: 'Rice & Jute Hub',
    specialization: 'Darjeeling tea cultivation'
  },
  'karnataka': {
    majorCrops: ['Coffee', 'Ragi', 'Maize', 'Cotton', 'Sugarcane'],
    climateZone: 'Tropical',
    avgRainfall: '600mm',
    soilType: 'Red soil',
    nickname: 'Coffee Land',
    specialization: 'Coffee hub of India'
  },
  'kerala': {
    majorCrops: ['Coconut', 'Rubber', 'Black Pepper', 'Cardamom', 'Banana'],
    climateZone: 'Tropical',
    avgRainfall: '2500mm',
    soilType: 'Laterite',
    nickname: 'Spice Garden',
    specialization: 'Spice cultivation'
  },
  'gujarat': {
    majorCrops: ['Cotton', 'Groundnut', 'Tobacco', 'Sugarcane', 'Wheat'],
    climateZone: 'Semi-arid',
    avgRainfall: '600mm',
    soilType: 'Black cotton',
    nickname: 'Cotton & Dairy Hub',
    specialization: 'Amul cooperative model'
  },
  'uttar-pradesh': {
    majorCrops: ['Wheat', 'Rice', 'Sugarcane', 'Pulses', 'Potato'],
    climateZone: 'Subtropical',
    avgRainfall: '800mm',
    soilType: 'Alluvial',
    nickname: 'Sugarcane Capital',
    specialization: 'Indo-Gangetic plains fertility'
  },
  'bihar': {
    majorCrops: ['Maize', 'Rice', 'Wheat', 'Pulses', 'Litchi'],
    climateZone: 'Subtropical',
    avgRainfall: '1200mm',
    soilType: 'Alluvial',
    nickname: 'Rice Bowl',
    specialization: 'Rich alluvial soil'
  },
  'rajasthan': {
    majorCrops: ['Bajra', 'Jowar', 'Pulses', 'Mustard', 'Cotton'],
    climateZone: 'Arid',
    avgRainfall: '300mm',
    soilType: 'Sandy',
    nickname: 'Millet State',
    specialization: 'Drought-resistant crops'
  },
  'odisha': {
    majorCrops: ['Rice', 'Pulses', 'Oilseeds', 'Vegetables', 'Fish'],
    climateZone: 'Tropical',
    avgRainfall: '1400mm',
    soilType: 'Red laterite',
    nickname: 'Rice & Fisheries',
    specialization: 'Aquaculture development'
  }
}

interface StateAgricultureInfoProps {
  stateCode: string
  className?: string
}

export default function StateAgricultureInfo({ stateCode, className = '' }: StateAgricultureInfoProps) {
  const { t } = useLanguage()
  const data = stateAgriculturalData[stateCode as keyof typeof stateAgriculturalData]

  if (!data) {
    return null
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          {t(`state.${stateCode}`) || data.nickname}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Major Crops */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Wheat className="h-4 w-4" />
            {t('agriculture.majorCrops') || 'Major Crops'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.majorCrops.map((crop) => (
              <Badge key={crop} variant="secondary" className="text-xs">
                {crop}
              </Badge>
            ))}
          </div>
        </div>

        {/* Climate & Conditions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              {t('agriculture.climate') || 'Climate'}
            </h4>
            <p className="text-sm text-gray-600">{data.climateZone}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              {t('agriculture.rainfall') || 'Rainfall'}
            </h4>
            <p className="text-sm text-gray-600">{data.avgRainfall}</p>
          </div>
        </div>

        {/* Soil Type */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            {t('agriculture.soilType') || 'Soil Type'}
          </h4>
          <p className="text-sm text-gray-600">{data.soilType}</p>
        </div>

        {/* Specialization */}
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-1">
            {t('agriculture.specialization') || 'Agricultural Specialization'}
          </h4>
          <p className="text-sm text-green-700">{data.specialization}</p>
        </div>
      </CardContent>
    </Card>
  )
}
