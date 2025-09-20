
import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get("type") // 'prices', 'subsidies', 'weather', 'schemes'
    const state = searchParams.get("state") || "default"
    const crop = searchParams.get("crop")

    // Mock government data - In production, integrate with:
    // 1. Ministry of Agriculture & Farmers Welfare APIs
    // 2. Agricultural Marketing Division (AGMARKNET)
    // 3. India Meteorological Department (IMD)
    // 4. National Sample Survey Office (NSSO) data
    
    // Real agricultural data from government sources
    const stateWiseCropData = {
      UP: [
        { name: "Rice (Paddy)", msp: 1940, marketPrice: 1980, type: "Cereal", waterReq: "1200-2000 mm/season", yield: "3-6 t/acre", fertilizer: "NPK 80-40-40 kg/ha", climate: "Warm, humid; 20-35°C" },
        { name: "Wheat", msp: 2125, marketPrice: 2180, type: "Cereal", waterReq: "450-650 mm/season", yield: "2-3 t/acre", fertilizer: "NPK 120-60-40 kg/ha", climate: "Cool, temperate; 10-25°C" },
        { name: "Sugarcane", msp: 290, marketPrice: 305, type: "Cash crop", waterReq: "1500-2500 mm/season", yield: "300-800 t/acre", fertilizer: "NPK 150-200-100 kg/ha", climate: "Tropical to subtropical; 20-35°C" },
        { name: "Mustard", msp: 5050, marketPrice: 5200, type: "Oilseed", waterReq: "400-600 mm/season", yield: "0.6-1 t/acre", fertilizer: "NPK 60-40-20 kg/ha", climate: "Cool season; 10-25°C" }
      ],
      Punjab: [
        { name: "Wheat", msp: 2125, marketPrice: 2200, type: "Cereal", waterReq: "300-500 mm/season", yield: "20-25 qtl/acre", fertilizer: "NPK 80-120:40:0 kg/ha", climate: "Cool season 10-25°C" },
        { name: "Rice (Paddy)", msp: 1940, marketPrice: 2000, type: "Cereal", waterReq: "3.5-4.0 acre-feet/acre", yield: "25-40 qtl/acre", fertilizer: "NPK 100-120:50-60:30-40 kg/ha", climate: "Warm, humid: 20-35°C" },
        { name: "Cotton", msp: 5515, marketPrice: 5700, type: "Cash crop", waterReq: "600-900 mm", yield: "5-8 qtl lint/acre", fertilizer: "NPK 60-80:40:40 kg/ha", climate: "Warm: 20-34°C" }
      ],
      Maharashtra: [
        { name: "Soybean", msp: 3950, marketPrice: 4150, type: "Oilseed/Pulse", waterReq: "450-650 mm", yield: "15-20 qtl/acre", fertilizer: "30:60:30 NPK", climate: "Temp: 25-30°C" },
        { name: "Cotton", msp: 5515, marketPrice: 5650, type: "Cash crop", waterReq: "600-900 mm", yield: "5-15 qtl/acre", fertilizer: "80:40:40 NPK", climate: "Temp: 21-30°C" },
        { name: "Sugarcane", msp: 290, marketPrice: 305, type: "Cash crop", waterReq: "1500-2500 mm", yield: "800-1000 qtl/acre", fertilizer: "250:115:115 NPK", climate: "Temp: 20-35°C" }
      ],
      Haryana: [
        { name: "Wheat", msp: 2125, marketPrice: 2190, type: "Cereal", waterReq: "400-650 mm", yield: "8-20 qtl/acre", fertilizer: "N 40-60 kg/acre", climate: "Temp 10-25°C" },
        { name: "Rice", msp: 1940, marketPrice: 2010, type: "Cereal", waterReq: "1000-1500 mm", yield: "12-30 qtl/acre", fertilizer: "N 40-80 kg/acre", climate: "Temp 20-32°C" },
        { name: "Sugarcane", msp: 290, marketPrice: 300, type: "Cash crop", waterReq: "1200-2500 mm", yield: "60-200 qtl/acre", fertilizer: "N 80-150 kg/acre", climate: "Temp 20-35°C" }
      ],
      Bihar: [
        { name: "Rice", msp: 1940, marketPrice: 1970, type: "Cereal", waterReq: "1000-1500 mm", yield: "12-30 qtl/acre", fertilizer: "N 40-80 kg/acre", climate: "Temp 20-32°C" },
        { name: "Wheat", msp: 2125, marketPrice: 2160, type: "Cereal", waterReq: "400-650 mm", yield: "8-20 qtl/acre", fertilizer: "N 40-60 kg/acre", climate: "Temp 10-25°C" },
        { name: "Maize", msp: 1870, marketPrice: 1930, type: "Cereal", waterReq: "500-800 mm", yield: "8-25 qtl/acre", fertilizer: "Urea ~30-60 kg/acre", climate: "Temp 18-30°C" }
      ]
    }

    const governmentData = {
      prices: {
        lastUpdated: new Date().toISOString(),
        source: "AGMARKNET - Agricultural Marketing Division & State Agricultural Departments",
        stateWiseData: stateWiseCropData,
        crops: stateWiseCropData[state as keyof typeof stateWiseCropData] || stateWiseCropData.UP
      },
      subsidies: {
        lastUpdated: new Date().toISOString(),
        source: "Ministry of Agriculture & Farmers Welfare",
        schemes: [
          {
            name: "PM-KISAN",
            description: "Direct income support to farmers",
            eligibility: "All farmers with cultivable land",
            benefit: "₹6000/year in 3 installments",
            applicationUrl: "https://pmkisan.gov.in",
            documentsRequired: ["Aadhaar", "Bank Account", "Land Records"]
          },
          {
            name: "Pradhan Mantri Fasal Bima Yojana",
            description: "Crop Insurance Scheme",
            eligibility: "All farmers",
            benefit: "Insurance coverage up to sum insured",
            applicationUrl: "https://pmfby.gov.in",
            documentsRequired: ["Aadhaar", "Bank Account", "Land Records", "Sowing Certificate"]
          },
          {
            name: "Kisan Credit Card",
            description: "Credit support for agriculture",
            eligibility: "Farmers with land records",
            benefit: "Credit limit based on land holding",
            applicationUrl: "Bank branches",
            documentsRequired: ["Land Records", "Aadhaar", "PAN Card"]
          }
        ]
      },
      weather: {
        lastUpdated: new Date().toISOString(),
        source: "India Meteorological Department (IMD)",
        alerts: [
          {
            type: "rainfall",
            severity: "medium",
            message: "Moderate to heavy rainfall expected in next 48 hours",
            validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            regions: ["North India", "Punjab", "Haryana", "Western UP"]
          },
          {
            type: "temperature",
            severity: "low",
            message: "Temperature may drop by 3-5°C",
            validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
            regions: ["Delhi NCR", "Eastern Rajasthan"]
          }
        ],
        forecast: {
          next7Days: [
            { date: "2024-01-15", maxTemp: 22, minTemp: 8, humidity: 65, rainfall: 0 },
            { date: "2024-01-16", maxTemp: 20, minTemp: 6, humidity: 70, rainfall: 5 },
            { date: "2024-01-17", maxTemp: 18, minTemp: 5, humidity: 75, rainfall: 12 }
          ]
        }
      },
      soilHealth: {
        lastUpdated: new Date().toISOString(),
        source: "Soil Health Card Scheme - Government of India",
        recommendations: {
          nitrogen: "Medium - Apply 120 kg/ha",
          phosphorus: "Low - Apply 60 kg/ha", 
          potash: "High - Apply 40 kg/ha",
          organicCarbon: "Medium - Apply organic manure",
          pH: "Slightly alkaline - Apply gypsum"
        },
        testingCenters: [
          {
            name: "District Soil Testing Laboratory",
            address: "Agriculture Department, District Headquarters",
            phone: "011-XXXXXXXX",
            services: ["Soil Health Card", "Nutrient Analysis", "pH Testing"]
          }
        ]
      }
    }

    let responseData = {}
    
    switch (dataType) {
      case 'prices':
        responseData = governmentData.prices
        break
      case 'subsidies':
        responseData = governmentData.subsidies
        break
      case 'weather':
        responseData = governmentData.weather
        break
      case 'soil':
        responseData = governmentData.soilHealth
        break
      default:
        responseData = governmentData
    }

    // If specific crop is requested, filter price data
    if (crop && dataType === 'prices') {
      const filteredPrices = {
        ...governmentData.prices,
        crops: governmentData.prices.crops.filter(c => 
          c.name.toLowerCase().includes(crop.toLowerCase())
        )
      }
      responseData = filteredPrices
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      generatedAt: new Date().toISOString(),
      disclaimer: "This is demo data. In production, integrate with official government APIs."
    })

  } catch (error) {
    console.error("Government data fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch government data" }, { status: 500 })
  }
}
