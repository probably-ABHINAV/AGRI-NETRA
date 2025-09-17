// Mock AI services for AgriNetra
// In production, these would integrate with real AI/ML models

export interface CropRecommendation {
  cropName: string
  variety: string
  confidence: number
  reasons: string[]
  expectedYield: number
  plantingWindow: {
    start: Date
    end: Date
  }
  requirements: {
    soilType: string[]
    waterRequirement: string
    fertilizer: string[]
    climate: string
  }
}

export interface PestDetection {
  pestName: string
  confidence: number
  severity: "low" | "medium" | "high" | "critical"
  description: string
  treatment: string[]
  preventiveMeasures: string[]
  affectedArea: number
}

export interface WeatherPrediction {
  date: Date
  temperature: {
    min: number
    max: number
  }
  humidity: number
  rainfall: number
  windSpeed: number
  conditions: string
  farmingAdvice: string
}

export interface SoilAnalysis {
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  organicMatter: number
  moisture: number
  recommendations: string[]
  suitableCrops: string[]
}

// Mock AI service implementations
export const aiServices = {
  // Crop recommendation based on location, soil, and season
  getCropRecommendations: async (
    location: string,
    soilType: string,
    season: string,
    farmSize: number,
  ): Promise<CropRecommendation[]> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const recommendations: CropRecommendation[] = [
      {
        cropName: "Wheat",
        variety: "HD-3086",
        confidence: 0.92,
        reasons: [
          "Optimal soil conditions for wheat cultivation",
          "Favorable climate in your region",
          "High market demand",
          "Suitable for your farm size",
        ],
        expectedYield: 4.2,
        plantingWindow: {
          start: new Date("2024-11-01"),
          end: new Date("2024-12-15"),
        },
        requirements: {
          soilType: ["Loamy", "Clay-loam"],
          waterRequirement: "Medium (400-500mm)",
          fertilizer: ["NPK 12:32:16", "Urea", "DAP"],
          climate: "Cool, dry winters",
        },
      },
      {
        cropName: "Mustard",
        variety: "Pusa Bold",
        confidence: 0.87,
        reasons: [
          "Drought resistant variety",
          "Short growing season",
          "Good oil content",
          "Suitable for intercropping",
        ],
        expectedYield: 1.8,
        plantingWindow: {
          start: new Date("2024-10-15"),
          end: new Date("2024-11-30"),
        },
        requirements: {
          soilType: ["Sandy-loam", "Loamy"],
          waterRequirement: "Low (300-400mm)",
          fertilizer: ["NPK 18:46:0", "Sulphur"],
          climate: "Cool, dry conditions",
        },
      },
    ]

    return recommendations
  },

  // Pest detection from image analysis
  detectPestFromImage: async (imageUrl: string, cropType: string): Promise<PestDetection[]> => {
    // Simulate AI image processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const detections: PestDetection[] = [
      {
        pestName: "Aphids",
        confidence: 0.89,
        severity: "medium",
        description:
          "Small, soft-bodied insects found on leaves and stems. They suck plant juices and can transmit viruses.",
        treatment: [
          "Apply neem oil spray (5ml per liter)",
          "Use insecticidal soap solution",
          "Introduce ladybugs as biological control",
          "Remove heavily infested plants",
        ],
        preventiveMeasures: [
          "Regular monitoring of crops",
          "Maintain proper plant spacing",
          "Remove weeds around the field",
          "Use reflective mulch",
        ],
        affectedArea: 15.5,
      },
    ]

    return detections
  },

  // Weather-based farming advice
  getWeatherPrediction: async (location: string, days = 7): Promise<WeatherPrediction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const predictions: WeatherPrediction[] = []
    const baseDate = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + i)

      predictions.push({
        date,
        temperature: {
          min: 18 + Math.random() * 5,
          max: 28 + Math.random() * 8,
        },
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() > 0.7 ? Math.random() * 20 : 0,
        windSpeed: 5 + Math.random() * 10,
        conditions: Math.random() > 0.3 ? "Partly Cloudy" : "Sunny",
        farmingAdvice:
          i === 0
            ? "Good day for field inspection and spraying operations"
            : i === 1
              ? "Ideal conditions for irrigation"
              : "Monitor soil moisture levels",
      })
    }

    return predictions
  },

  // Soil analysis and recommendations
  analyzeSoil: async (sensorData: {
    ph: number
    moisture: number
    temperature: number
  }): Promise<SoilAnalysis> => {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const analysis: SoilAnalysis = {
      ph: sensorData.ph,
      nitrogen: 45 + Math.random() * 30,
      phosphorus: 25 + Math.random() * 20,
      potassium: 180 + Math.random() * 50,
      organicMatter: 2.1 + Math.random() * 1.5,
      moisture: sensorData.moisture,
      recommendations: [
        sensorData.ph < 6.5 ? "Apply lime to increase soil pH" : "Soil pH is optimal",
        sensorData.moisture < 40 ? "Increase irrigation frequency" : "Soil moisture is adequate",
        "Apply organic compost to improve soil structure",
        "Consider split application of nitrogen fertilizer",
      ],
      suitableCrops: ["Wheat", "Rice", "Sugarcane", "Cotton", "Mustard"],
    }

    return analysis
  },

  // Market price prediction
  getPricePrediction: async (
    cropName: string,
    location: string,
  ): Promise<{
    currentPrice: number
    predictedPrice: number
    trend: "up" | "down" | "stable"
    confidence: number
    factors: string[]
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      currentPrice: 2200 + Math.random() * 500,
      predictedPrice: 2300 + Math.random() * 600,
      trend: Math.random() > 0.5 ? "up" : "down",
      confidence: 0.75 + Math.random() * 0.2,
      factors: [
        "Seasonal demand increase",
        "Weather conditions in major producing states",
        "Export demand from neighboring countries",
        "Government procurement policies",
      ],
    }
  },
}
