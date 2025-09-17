// Mock database implementation using in-memory storage
// In production, this would connect to a real database

export interface Farm {
  id: string
  name: string
  ownerId: string
  location: string
  size: number
  soilType: string
  irrigationType: string
  createdAt: Date
}

export interface Crop {
  id: string
  farmId: string
  name: string
  variety: string
  plantingDate: Date
  expectedHarvestDate: Date
  area: number
  status: "planted" | "growing" | "harvested" | "failed"
  createdAt: Date
}

export interface SensorReading {
  id: string
  farmId: string
  sensorType: "soil_moisture" | "temperature" | "humidity" | "ph" | "light"
  value: number
  unit: string
  timestamp: Date
}

export interface WeatherData {
  id: string
  location: string
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  timestamp: Date
}

export interface Recommendation {
  id: string
  farmId: string
  cropId?: string
  type: "irrigation" | "fertilizer" | "pesticide" | "harvest" | "general"
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "applied" | "dismissed"
  createdAt: Date
}

export interface PestAlert {
  id: string
  farmId: string
  cropId: string
  pestType: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  imageUrl?: string
  location: string
  status: "active" | "treated" | "resolved"
  createdAt: Date
}

// Mock data storage
const farms: Farm[] = [
  {
    id: "farm-001",
    name: "Green Valley Farm",
    ownerId: "1",
    location: "Punjab, India",
    size: 25.5,
    soilType: "Loamy",
    irrigationType: "Drip",
    createdAt: new Date("2024-01-15"),
  },
]

const crops: Crop[] = [
  {
    id: "crop-001",
    farmId: "farm-001",
    name: "Wheat",
    variety: "HD-2967",
    plantingDate: new Date("2024-11-15"),
    expectedHarvestDate: new Date("2025-04-15"),
    area: 10.5,
    status: "growing",
    createdAt: new Date("2024-11-15"),
  },
  {
    id: "crop-002",
    farmId: "farm-001",
    name: "Rice",
    variety: "Basmati-370",
    plantingDate: new Date("2024-06-20"),
    expectedHarvestDate: new Date("2024-10-20"),
    area: 15,
    status: "harvested",
    createdAt: new Date("2024-06-20"),
  },
]

const sensorReadings: SensorReading[] = [
  {
    id: "sensor-001",
    farmId: "farm-001",
    sensorType: "soil_moisture",
    value: 65,
    unit: "%",
    timestamp: new Date(),
  },
  {
    id: "sensor-002",
    farmId: "farm-001",
    sensorType: "temperature",
    value: 28.5,
    unit: "°C",
    timestamp: new Date(),
  },
]

const recommendations: Recommendation[] = [
  {
    id: "rec-001",
    farmId: "farm-001",
    cropId: "crop-001",
    type: "irrigation",
    title: "Increase Irrigation",
    description: "Soil moisture levels are below optimal. Increase irrigation by 20%.",
    priority: "high",
    status: "pending",
    createdAt: new Date(),
  },
]

const pestAlerts: PestAlert[] = [
  {
    id: "pest-001",
    farmId: "farm-001",
    cropId: "crop-001",
    pestType: "Aphids",
    severity: "medium",
    description: "Aphid infestation detected in wheat crop section A",
    location: "Section A, North Field",
    status: "active",
    createdAt: new Date(),
  },
]

// Database operations
export const db = {
  // Farms
  getFarms: async (ownerId: string): Promise<Farm[]> => {
    return farms.filter((farm) => farm.ownerId === ownerId)
  },

  getFarm: async (id: string): Promise<Farm | null> => {
    return farms.find((farm) => farm.id === id) || null
  },

  createFarm: async (farmData: Omit<Farm, "id" | "createdAt">): Promise<Farm> => {
    const newFarm: Farm = {
      ...farmData,
      id: `farm-${farms.length + 1}`,
      createdAt: new Date(),
    }
    farms.push(newFarm)
    return newFarm
  },

  // Crops
  getCrops: async (farmId: string): Promise<Crop[]> => {
    return crops.filter((crop) => crop.farmId === farmId)
  },

  getCrop: async (id: string): Promise<Crop | null> => {
    return crops.find((crop) => crop.id === id) || null
  },

  createCrop: async (cropData: Omit<Crop, "id" | "createdAt">): Promise<Crop> => {
    const newCrop: Crop = {
      ...cropData,
      id: `crop-${crops.length + 1}`,
      createdAt: new Date(),
    }
    crops.push(newCrop)
    return newCrop
  },

  // Sensor Readings
  getSensorReadings: async (farmId: string, sensorType?: string): Promise<SensorReading[]> => {
    let readings = sensorReadings.filter((reading) => reading.farmId === farmId)
    if (sensorType) {
      readings = readings.filter((reading) => reading.sensorType === sensorType)
    }
    return readings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  },

  addSensorReading: async (readingData: Omit<SensorReading, "id">): Promise<SensorReading> => {
    const newReading: SensorReading = {
      ...readingData,
      id: `sensor-${sensorReadings.length + 1}`,
    }
    sensorReadings.push(newReading)
    return newReading
  },

  // Recommendations
  getRecommendations: async (farmId: string): Promise<Recommendation[]> => {
    return recommendations
      .filter((rec) => rec.farmId === farmId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  createRecommendation: async (recData: Omit<Recommendation, "id" | "createdAt">): Promise<Recommendation> => {
    const newRec: Recommendation = {
      ...recData,
      id: `rec-${recommendations.length + 1}`,
      createdAt: new Date(),
    }
    recommendations.push(newRec)
    return newRec
  },

  // Pest Alerts
  getPestAlerts: async (farmId: string): Promise<PestAlert[]> => {
    return pestAlerts
      .filter((alert) => alert.farmId === farmId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  createPestAlert: async (alertData: Omit<PestAlert, "id" | "createdAt">): Promise<PestAlert> => {
    const newAlert: PestAlert = {
      ...alertData,
      id: `pest-${pestAlerts.length + 1}`,
      createdAt: new Date(),
    }
    pestAlerts.push(newAlert)
    return newAlert
  },
}
