
'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  Droplets,
  Thermometer,
  Zap,
  Leaf,
  Download,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Database,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
  const [date, setDate] = useState<Date>()
  const [dateRange, setDateRange] = useState("7")
  const [exportFormat, setExportFormat] = useState("")

  const sensorData = [
    { id: 1, name: "Field A - North", type: "Soil Moisture", value: 68, unit: "%", status: "optimal", trend: "up" },
    { id: 2, name: "Field A - South", type: "Temperature", value: 24, unit: "°C", status: "good", trend: "stable" },
    { id: 3, name: "Field B - East", type: "pH Level", value: 6.8, unit: "pH", status: "optimal", trend: "down" },
    { id: 4, name: "Field B - West", type: "Nutrients", value: 85, unit: "%", status: "good", trend: "up" },
    { id: 5, name: "Greenhouse 1", type: "Humidity", value: 72, unit: "%", status: "warning", trend: "up" },
    {
      id: 6,
      name: "Greenhouse 2",
      type: "Light Intensity",
      value: 450,
      unit: "lux",
      status: "optimal",
      trend: "stable",
    },
  ]

  const weeklyData = [
    { day: "Mon", moisture: 65, temp: 22, ph: 6.5, nutrients: 80 },
    { day: "Tue", moisture: 68, temp: 24, ph: 6.7, nutrients: 82 },
    { day: "Wed", moisture: 70, temp: 26, ph: 6.8, nutrients: 85 },
    { day: "Thu", moisture: 67, temp: 23, ph: 6.6, nutrients: 83 },
    { day: "Fri", moisture: 69, temp: 25, ph: 6.9, nutrients: 87 },
    { day: "Sat", moisture: 72, temp: 27, ph: 7.0, nutrients: 89 },
    { day: "Sun", moisture: 68, temp: 24, ph: 6.8, nutrients: 85 },
  ]

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "Greenhouse 1 humidity above optimal range",
      time: "2 hours ago",
      field: "Greenhouse 1",
    },
    { id: 2, type: "info", message: "Irrigation scheduled for Field A", time: "4 hours ago", field: "Field A" },
    { id: 3, type: "success", message: "Nutrient levels improved in Field B", time: "6 hours ago", field: "Field B" },
  ]

  // Government data integration from real agricultural data
  const [selectedState, setSelectedState] = useState("UP")
  
  const governmentCropData = {
    UP: [
      { crop: "Rice (Paddy)", type: "Cereal", waterReq: "1200-2000 mm/season", yield: "3-6 t/acre", msp: 1940, marketPrice: 1980 },
      { crop: "Wheat", type: "Cereal", waterReq: "450-650 mm/season", yield: "2-3 t/acre", msp: 2125, marketPrice: 2180 },
      { crop: "Maize", type: "Cereal", waterReq: "450-700 mm/season", yield: "2-4 t/acre", msp: 1870, marketPrice: 1920 },
      { crop: "Sugarcane", type: "Cashcrop", waterReq: "1500-2500 mm/season", yield: "300-800 t/acre", msp: 290, marketPrice: 305 },
      { crop: "Mustard", type: "Oilseed", waterReq: "400-600 mm/season", yield: "0.6-1 t/acre", msp: 5050, marketPrice: 5200 },
      { crop: "Soybean", type: "Oilseed/Legume", waterReq: "500-700 mm/season", yield: "0.6-1 t/acre", msp: 3950, marketPrice: 4100 }
    ],
    Punjab: [
      { crop: "Wheat", type: "Cereal", waterReq: "300-500 mm/season", yield: "20-25 qtl/acre", msp: 2125, marketPrice: 2200 },
      { crop: "Rice (Paddy)", type: "Cereal", waterReq: "3.5-4.0 acre-feet/acre", yield: "25-40 qtl/acre", msp: 1940, marketPrice: 2000 },
      { crop: "Maize", type: "Cereal", waterReq: "3-5 irrigations", yield: "10-20 qtl/acre", msp: 1870, marketPrice: 1950 },
      { crop: "Cotton", type: "Cashcrop", waterReq: "600-900 mm", yield: "5-8 qtl lint/acre", msp: 5515, marketPrice: 5700 },
      { crop: "Sugarcane", type: "Cashcrop", waterReq: "Very high irrigation", yield: "300-400 qtl/acre", msp: 290, marketPrice: 310 }
    ],
    Maharashtra: [
      { crop: "Soybean", type: "Oilseed/Pulse", waterReq: "450-650 mm", yield: "15-20 qtl/acre", msp: 3950, marketPrice: 4150 },
      { crop: "Cotton", type: "Cashcrop", waterReq: "600-900 mm", yield: "5-15 qtl/acre", msp: 5515, marketPrice: 5650 },
      { crop: "Sugarcane", type: "Cashcrop", waterReq: "1500-2500 mm", yield: "800-1000 qtl/acre", msp: 290, marketPrice: 305 },
      { crop: "Rice", type: "Cereal", waterReq: "1100-1250 mm", yield: "25-35 qtl/acre", msp: 1940, marketPrice: 1990 },
      { crop: "Wheat", type: "Cereal", waterReq: "300-400 mm", yield: "30-40 qtl/acre", msp: 2125, marketPrice: 2170 }
    ],
    Haryana: [
      { crop: "Wheat", type: "Cereal", waterReq: "400-650 mm", yield: "8-20 qtl/acre", msp: 2125, marketPrice: 2190 },
      { crop: "Rice", type: "Cereal", waterReq: "1000-1500 mm", yield: "12-30 qtl/acre", msp: 1940, marketPrice: 2010 },
      { crop: "Sugarcane", type: "Cashcrop", waterReq: "1200-2500 mm", yield: "60-200 qtl/acre", msp: 290, marketPrice: 300 },
      { crop: "Cotton", type: "Cashcrop", waterReq: "600-900 mm", yield: "8-20 qtl lint/acre", msp: 5515, marketPrice: 5680 },
      { crop: "Mustard", type: "Oilseed", waterReq: "300-600 mm", yield: "3-7 qtl/acre", msp: 5050, marketPrice: 5150 }
    ],
    Bihar: [
      { crop: "Rice", type: "Cereal", waterReq: "1000-1500 mm", yield: "12-30 qtl/acre", msp: 1940, marketPrice: 1970 },
      { crop: "Wheat", type: "Cereal", waterReq: "400-650 mm", yield: "8-20 qtl/acre", msp: 2125, marketPrice: 2160 },
      { crop: "Maize", type: "Cereal", waterReq: "500-800 mm", yield: "8-25 qtl/acre", msp: 1870, marketPrice: 1930 },
      { crop: "Sugarcane", type: "Cashcrop", waterReq: "1200-2500 mm", yield: "60-200 qtl/acre", msp: 290, marketPrice: 295 },
      { crop: "Pigeon Pea", type: "Pulse", waterReq: "350-600 mm", yield: "2-6 qtl/acre", msp: 6300, marketPrice: 6500 }
    ]
  }

  const governmentData = {
    cropPrices: governmentCropData[selectedState as keyof typeof governmentCropData].map(crop => ({
      crop: crop.crop,
      currentPrice: crop.marketPrice,
      govBenchmark: crop.msp,
      variance: `+${(((crop.marketPrice - crop.msp) / crop.msp) * 100).toFixed(1)}%`,
      yield: crop.yield,
      waterReq: crop.waterReq,
      type: crop.type
    })),
    subsidies: [
      { scheme: "PM-KISAN", amount: 6000, status: "eligible", description: "Direct income support" },
      { scheme: "Pradhan Mantri Fasal Bima Yojana", amount: 12000, status: "applied", description: "Crop insurance coverage" },
      { scheme: "Fertilizer Subsidy", coverage: "40-50%", status: "active", description: "Subsidized fertilizers" },
      { scheme: "Kisan Credit Card", amount: "Based on land", status: "eligible", description: "Credit support" },
    ],
    weatherAlerts: [
      { type: "rainfall", message: "Moderate to heavy rainfall expected in next 48 hours", severity: "medium", regions: ["North India", "Punjab", "Haryana"] },
      { type: "temperature", message: "Temperature may drop by 3-5°C", severity: "low", regions: ["Delhi NCR", "Eastern Rajasthan"] },
      { type: "humidity", message: "High humidity favorable for fungal diseases", severity: "medium", regions: ["Coastal areas", "Eastern states"] }
    ],
    stateData: {
      [selectedState]: {
        majorCrops: governmentCropData[selectedState as keyof typeof governmentCropData].slice(0, 6),
        totalFarmers: selectedState === "UP" ? "2.3 Crore" : selectedState === "Punjab" ? "10.2 Lakh" : "1.5 Crore",
        avgLandHolding: selectedState === "UP" ? "0.78 hectares" : selectedState === "Punjab" ? "3.62 hectares" : "1.2 hectares",
        irrigationCoverage: selectedState === "UP" ? "77%" : selectedState === "Punjab" ? "98%" : "45%"
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const generateReportData = () => {
    const reportData = {
      sensors: sensorData,
      weeklyTrends: weeklyData,
      alerts: alerts,
      governmentData: governmentData,
      generatedAt: new Date().toISOString(),
      dateRange: dateRange,
      selectedDate: date?.toISOString(),
    }
    return reportData
  }

  const exportToPDF = () => {
    const reportData = generateReportData()
    
    // Create comprehensive HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Farm Analytics Report - ${selectedState}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { background: #f3f4f6; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
          .section { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f9fafb; font-weight: bold; }
          .metric { display: inline-block; margin: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
          .alert { padding: 10px; margin: 5px 0; border-left: 4px solid #f59e0b; background: #fef3c7; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Comprehensive Farm Analytics Report</h1>
          <p><strong>State:</strong> ${selectedState}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Date Range:</strong> Last ${dateRange} days</p>
          <p><strong>Selected Date:</strong> ${date ? format(date, "PPP") : 'Not selected'}</p>
        </div>
        
        <div class="section">
          <h2>IoT Sensor Data Summary</h2>
          <table>
            <tr><th>Sensor Location</th><th>Parameter</th><th>Current Value</th><th>Status</th><th>Trend</th></tr>
            ${sensorData.map(sensor => `
              <tr>
                <td>${sensor.name}</td>
                <td>${sensor.type}</td>
                <td>${sensor.value}${sensor.unit}</td>
                <td style="color: ${sensor.status === 'optimal' ? 'green' : sensor.status === 'warning' ? 'orange' : 'blue'}">${sensor.status}</td>
                <td>${sensor.trend}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="section">
          <h2>Government Agricultural Data - ${selectedState}</h2>
          <h3>State Agricultural Profile</h3>
          <div class="metric"><strong>Total Farmers:</strong> ${governmentData.stateData[selectedState]?.totalFarmers || 'N/A'}</div>
          <div class="metric"><strong>Avg Land Holding:</strong> ${governmentData.stateData[selectedState]?.avgLandHolding || 'N/A'}</div>
          <div class="metric"><strong>Irrigation Coverage:</strong> ${governmentData.stateData[selectedState]?.irrigationCoverage || 'N/A'}</div>
          
          <h3>Major Crops - Market Prices vs MSP</h3>
          <table>
            <tr><th>Crop</th><th>Type</th><th>Market Price (₹)</th><th>MSP (₹)</th><th>Variance</th><th>Water Requirement</th><th>Expected Yield</th></tr>
            ${governmentData.cropPrices.map(crop => `
              <tr>
                <td>${crop.crop}</td>
                <td>${crop.type}</td>
                <td>₹${crop.currentPrice}</td>
                <td>₹${crop.govBenchmark}</td>
                <td style="color: green">${crop.variance}</td>
                <td>${crop.waterReq}</td>
                <td>${crop.yield}</td>
              </tr>
            `).join('')}
          </table>
          
          <h3>Available Government Schemes</h3>
          <table>
            <tr><th>Scheme</th><th>Benefit</th><th>Status</th><th>Description</th></tr>
            ${governmentData.subsidies.map(subsidy => `
              <tr>
                <td>${subsidy.scheme}</td>
                <td>${subsidy.amount ? `₹${subsidy.amount}` : subsidy.coverage}</td>
                <td>${subsidy.status}</td>
                <td>${subsidy.description || 'Government support scheme'}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="section">
          <h2>Weather Alerts & Advisory</h2>
          ${governmentData.weatherAlerts.map(alert => `
            <div class="alert">
              <strong>${alert.type.toUpperCase()}:</strong> ${alert.message}
              <br><strong>Affected Regions:</strong> ${alert.regions?.join(', ') || 'General'}
              <br><strong>Severity:</strong> ${alert.severity}
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>Weekly Sensor Trends</h2>
          <table>
            <tr><th>Day</th><th>Soil Moisture (%)</th><th>Temperature (°C)</th><th>pH Level</th><th>Nutrients (%)</th></tr>
            ${weeklyData.map(day => `
              <tr>
                <td>${day.day}</td>
                <td>${day.moisture}%</td>
                <td>${day.temp}°C</td>
                <td>${day.ph}</td>
                <td>${day.nutrients}%</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="section">
          <h2>Recommendations</h2>
          <ul>
            <li>Monitor soil moisture levels in Field A - adjust irrigation schedule based on weather forecasts</li>
            <li>Consider crop rotation with legumes to improve soil nitrogen content</li>
            <li>Apply for available government schemes like PM-KISAN and crop insurance</li>
            <li>Implement precision agriculture techniques to optimize resource usage</li>
            <li>Regular soil testing recommended for nutrient management</li>
          </ul>
        </div>
        
        <footer style="margin-top: 30px; padding: 20px; background: #f3f4f6; text-align: center;">
          <p>This report combines IoT sensor data with official government agricultural data</p>
          <p>Generated by Smart Agriculture Platform | © ${new Date().getFullYear()}</p>
        </footer>
      </body>
      </html>
    `
    
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(htmlBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comprehensive-farm-report-${selectedState}-${new Date().toISOString().split('T')[0]}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToExcel = () => {
    const reportData = generateReportData()
    
    // Create CSV format for Excel compatibility
    const csvContent = [
      // Headers
      ['Sensor Analytics Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [`Date Range: Last ${dateRange} days`],
      [''],
      ['Sensor Data'],
      ['Name', 'Type', 'Value', 'Unit', 'Status', 'Trend'],
      ...sensorData.map(sensor => [
        sensor.name, 
        sensor.type, 
        sensor.value.toString(), 
        sensor.unit, 
        sensor.status, 
        sensor.trend
      ]),
      [''],
      ['Government Crop Prices'],
      ['Crop', 'Current Price', 'Government Benchmark', 'Variance'],
      ...governmentData.cropPrices.map(crop => [
        crop.crop,
        crop.currentPrice.toString(),
        crop.govBenchmark.toString(),
        crop.variance
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `farm-analytics-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    const reportData = generateReportData()
    
    const csvContent = [
      ['timestamp', 'sensor_name', 'sensor_type', 'value', 'unit', 'status'],
      ...sensorData.map(sensor => [
        new Date().toISOString(),
        sensor.name,
        sensor.type,
        sensor.value.toString(),
        sensor.unit,
        sensor.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sensor-data-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const reportData = generateReportData()
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `farm-analytics-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToXML = () => {
    const reportData = generateReportData()
    
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<FarmAnalyticsReport>
  <Header>
    <State>${selectedState}</State>
    <GeneratedAt>${new Date().toISOString()}</GeneratedAt>
    <DateRange>${dateRange} days</DateRange>
    <SelectedDate>${date?.toISOString() || 'Not selected'}</SelectedDate>
  </Header>
  
  <SensorData>
    ${sensorData.map(sensor => `
    <Sensor>
      <Name>${sensor.name}</Name>
      <Type>${sensor.type}</Type>
      <Value>${sensor.value}</Value>
      <Unit>${sensor.unit}</Unit>
      <Status>${sensor.status}</Status>
      <Trend>${sensor.trend}</Trend>
    </Sensor>`).join('')}
  </SensorData>
  
  <GovernmentData>
    <StateInfo>
      <TotalFarmers>${governmentData.stateData[selectedState]?.totalFarmers || 'N/A'}</TotalFarmers>
      <AvgLandHolding>${governmentData.stateData[selectedState]?.avgLandHolding || 'N/A'}</AvgLandHolding>
      <IrrigationCoverage>${governmentData.stateData[selectedState]?.irrigationCoverage || 'N/A'}</IrrigationCoverage>
    </StateInfo>
    
    <CropPrices>
      ${governmentData.cropPrices.map(crop => `
      <Crop>
        <Name>${crop.crop}</Name>
        <Type>${crop.type}</Type>
        <MarketPrice>${crop.currentPrice}</MarketPrice>
        <MSP>${crop.govBenchmark}</MSP>
        <Variance>${crop.variance}</Variance>
        <WaterRequirement>${crop.waterReq}</WaterRequirement>
        <ExpectedYield>${crop.yield}</ExpectedYield>
      </Crop>`).join('')}
    </CropPrices>
    
    <GovernmentSchemes>
      ${governmentData.subsidies.map(subsidy => `
      <Scheme>
        <Name>${subsidy.scheme}</Name>
        <Benefit>${subsidy.amount ? `₹${subsidy.amount}` : subsidy.coverage}</Benefit>
        <Status>${subsidy.status}</Status>
        <Description>${subsidy.description || 'Government support scheme'}</Description>
      </Scheme>`).join('')}
    </GovernmentSchemes>
    
    <WeatherAlerts>
      ${governmentData.weatherAlerts.map(alert => `
      <Alert>
        <Type>${alert.type}</Type>
        <Message>${alert.message}</Message>
        <Severity>${alert.severity}</Severity>
        <Regions>${alert.regions?.join(', ') || 'General'}</Regions>
      </Alert>`).join('')}
    </WeatherAlerts>
  </GovernmentData>
</FarmAnalyticsReport>`

    const blob = new Blob([xmlContent], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `farm-analytics-${selectedState}-${new Date().toISOString().split('T')[0]}.xml`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportComprehensive = () => {
    // Export all formats as a ZIP-like package
    const formats = ['pdf', 'excel', 'csv', 'json', 'xml']
    formats.forEach(format => {
      setTimeout(() => {
        handleExport(format)
      }, 100) // Small delay between exports
    })
    alert(`Exporting comprehensive report in all formats for ${selectedState}`)
  }

  const handleExport = (format: string) => {
    switch (format) {
      case 'pdf':
        exportToPDF()
        break
      case 'excel':
        exportToExcel()
        break
      case 'csv':
        exportToCSV()
        break
      case 'json':
        exportToJSON()
        break
      case 'xml':
        exportToXML()
        break
      case 'comprehensive':
        exportComprehensive()
        break
      default:
        alert('Please select an export format')
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time IoT sensor monitoring and government data insights</p>
        </div>
        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex items-center gap-2 bg-transparent",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UP">Uttar Pradesh</SelectItem>
              <SelectItem value="Punjab">Punjab</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
              <SelectItem value="Haryana">Haryana</SelectItem>
              <SelectItem value="Bihar">Bihar</SelectItem>
            </SelectContent>
          </Select>

          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Export Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Report</SelectItem>
              <SelectItem value="excel">Excel (CSV)</SelectItem>
              <SelectItem value="csv">Raw CSV</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
              <SelectItem value="xml">XML Data</SelectItem>
              <SelectItem value="comprehensive">Complete Report</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            onClick={() => handleExport(exportFormat)}
            disabled={!exportFormat}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sensors</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Soil Moisture</CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Optimal range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24°C</div>
            <p className="text-xs text-muted-foreground">+1°C from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crop Health Score</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Excellent condition</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sensors">Live Sensors</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="government">Gov Data</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Sensor Data</CardTitle>
              <CardDescription>Live readings from all connected IoT sensors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensorData.map((sensor) => (
                  <Card key={sensor.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
                          <CardDescription className="text-xs">{sensor.type}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(sensor.status)}>{sensor.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                          {sensor.value}
                          {sensor.unit}
                        </div>
                        {getTrendIcon(sensor.trend)}
                      </div>
                      <Progress value={sensor.value} className="mt-3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trends</CardTitle>
              <CardDescription>{dateRange}-day historical data analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Soil Moisture Trend</h4>
                    <div className="space-y-2">
                      {weeklyData.map((day) => (
                        <div key={day.day} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{day.day}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={day.moisture} className="w-20" />
                            <span className="text-sm font-medium">{day.moisture}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3">Temperature Trend</h4>
                    <div className="space-y-2">
                      {weeklyData.map((day) => (
                        <div key={day.day} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{day.day}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(day.temp / 35) * 100} className="w-20" />
                            <span className="text-sm font-medium">{day.temp}°C</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System notifications and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                    {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                    {alert.type === "info" && <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.field}
                        </Badge>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="government" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Government Agricultural Data - {selectedState}</h3>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UP">Uttar Pradesh</SelectItem>
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Haryana">Haryana</SelectItem>
                <SelectItem value="Bihar">Bihar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Farmers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {governmentData.stateData[selectedState]?.totalFarmers || 'N/A'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Land Holding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {governmentData.stateData[selectedState]?.avgLandHolding || 'N/A'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Irrigation Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {governmentData.stateData[selectedState]?.irrigationCoverage || 'N/A'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Crop Market Analysis - {selectedState}
                </CardTitle>
                <CardDescription>Market prices vs MSP with yield potential and water requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {governmentData.cropPrices.map((crop, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{crop.crop}</p>
                          <Badge variant="outline" className="text-xs">{crop.type}</Badge>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">{crop.variance}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>Market: ₹{crop.currentPrice}</div>
                        <div>MSP: ₹{crop.govBenchmark}</div>
                        <div>Yield: {crop.yield}</div>
                        <div>Water: {crop.waterReq}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Government Schemes & Subsidies</CardTitle>
                <CardDescription>Available agricultural support programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {governmentData.subsidies.map((subsidy, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{subsidy.scheme}</p>
                          <p className="text-sm text-gray-600">{subsidy.description}</p>
                        </div>
                        <Badge className={
                          subsidy.status === 'eligible' ? 'bg-green-100 text-green-800' :
                          subsidy.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {subsidy.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-blue-600">
                        {subsidy.amount ? `₹${subsidy.amount}` : subsidy.coverage}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weather Alerts from Meteorological Department</CardTitle>
              <CardDescription>Government weather warnings and advisories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {governmentData.weatherAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <Badge className="mt-1" variant="outline">{alert.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Create detailed analytics reports for your farm data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Available Reports</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Weekly Performance Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Monthly Trend Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Leaf className="h-4 w-4 mr-2" />
                      Crop Health Assessment
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Droplets className="h-4 w-4 mr-2" />
                      Irrigation Efficiency Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Database className="h-4 w-4 mr-2" />
                      Government Data Analysis
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Quick Export Options</h4>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleExport('pdf')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent"
                      onClick={() => handleExport('excel')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as Excel
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent"
                      onClick={() => handleExport('csv')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent"
                      onClick={() => handleExport('json')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as JSON
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
