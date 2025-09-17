// IoT sensor data management and processing

export interface SensorDevice {
  id: string
  farmId: string
  name: string
  type: "soil_moisture" | "temperature" | "humidity" | "ph" | "light" | "weather_station"
  location: {
    latitude: number
    longitude: number
    description: string
  }
  status: "online" | "offline" | "maintenance"
  batteryLevel: number
  lastSeen: Date
  calibrationDate: Date
  thresholds: {
    min: number
    max: number
    unit: string
  }
}

export interface SensorAlert {
  id: string
  deviceId: string
  farmId: string
  type: "threshold_exceeded" | "device_offline" | "low_battery" | "calibration_due"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  value?: number
  threshold?: number
  createdAt: Date
  acknowledged: boolean
}

export interface IrrigationCommand {
  id: string
  farmId: string
  zoneId: string
  action: "start" | "stop" | "schedule"
  duration?: number // minutes
  scheduledTime?: Date
  status: "pending" | "executing" | "completed" | "failed"
  createdAt: Date
}

// Mock IoT devices
const devices: SensorDevice[] = [
  {
    id: "sensor-001",
    farmId: "farm-001",
    name: "Soil Moisture Sensor A1",
    type: "soil_moisture",
    location: {
      latitude: 30.7333,
      longitude: 76.7794,
      description: "North Field, Section A",
    },
    status: "online",
    batteryLevel: 85,
    lastSeen: new Date(),
    calibrationDate: new Date("2024-01-15"),
    thresholds: {
      min: 30,
      max: 80,
      unit: "%",
    },
  },
  {
    id: "sensor-002",
    farmId: "farm-001",
    name: "Temperature Sensor B1",
    type: "temperature",
    location: {
      latitude: 30.7335,
      longitude: 76.7796,
      description: "South Field, Section B",
    },
    status: "online",
    batteryLevel: 92,
    lastSeen: new Date(),
    calibrationDate: new Date("2024-02-01"),
    thresholds: {
      min: 15,
      max: 35,
      unit: "°C",
    },
  },
]

const sensorAlerts: SensorAlert[] = []
const irrigationCommands: IrrigationCommand[] = []

export const iotServices = {
  // Device management
  getDevices: async (farmId: string): Promise<SensorDevice[]> => {
    return devices.filter((device) => device.farmId === farmId)
  },

  getDevice: async (deviceId: string): Promise<SensorDevice | null> => {
    return devices.find((device) => device.id === deviceId) || null
  },

  updateDeviceStatus: async (deviceId: string, status: SensorDevice["status"]): Promise<boolean> => {
    const device = devices.find((d) => d.id === deviceId)
    if (device) {
      device.status = status
      device.lastSeen = new Date()
      return true
    }
    return false
  },

  // Sensor data processing
  processSensorData: async (data: {
    deviceId: string
    value: number
    timestamp: Date
  }): Promise<{
    processed: boolean
    alertGenerated: boolean
    alertId?: string
  }> => {
    const device = devices.find((d) => d.id === data.deviceId)
    if (!device) {
      return { processed: false, alertGenerated: false }
    }

    // Update device last seen
    device.lastSeen = data.timestamp

    // Check thresholds
    let alertGenerated = false
    let alertId: string | undefined

    if (data.value < device.thresholds.min || data.value > device.thresholds.max) {
      const alert: SensorAlert = {
        id: `alert-${sensorAlerts.length + 1}`,
        deviceId: data.deviceId,
        farmId: device.farmId,
        type: "threshold_exceeded",
        severity:
          data.value < device.thresholds.min * 0.5 || data.value > device.thresholds.max * 1.5 ? "high" : "medium",
        message: `${device.name} reading ${data.value}${device.thresholds.unit} is ${data.value < device.thresholds.min ? "below minimum" : "above maximum"} threshold`,
        value: data.value,
        threshold: data.value < device.thresholds.min ? device.thresholds.min : device.thresholds.max,
        createdAt: data.timestamp,
        acknowledged: false,
      }

      sensorAlerts.push(alert)
      alertGenerated = true
      alertId = alert.id
    }

    return {
      processed: true,
      alertGenerated,
      alertId,
    }
  },

  // Alert management
  getAlerts: async (farmId: string): Promise<SensorAlert[]> => {
    return sensorAlerts
      .filter((alert) => alert.farmId === farmId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  acknowledgeAlert: async (alertId: string): Promise<boolean> => {
    const alert = sensorAlerts.find((a) => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      return true
    }
    return false
  },

  // Irrigation control
  createIrrigationCommand: async (
    command: Omit<IrrigationCommand, "id" | "createdAt" | "status">,
  ): Promise<IrrigationCommand> => {
    const newCommand: IrrigationCommand = {
      ...command,
      id: `cmd-${irrigationCommands.length + 1}`,
      status: "pending",
      createdAt: new Date(),
    }

    irrigationCommands.push(newCommand)

    // Simulate command execution
    setTimeout(() => {
      newCommand.status = "executing"
      setTimeout(() => {
        newCommand.status = "completed"
      }, 2000)
    }, 1000)

    return newCommand
  },

  getIrrigationCommands: async (farmId: string): Promise<IrrigationCommand[]> => {
    return irrigationCommands
      .filter((cmd) => cmd.farmId === farmId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  // Device health monitoring
  checkDeviceHealth: async (
    farmId: string,
  ): Promise<{
    totalDevices: number
    onlineDevices: number
    offlineDevices: number
    lowBatteryDevices: number
    calibrationDueDevices: number
  }> => {
    const farmDevices = devices.filter((d) => d.farmId === farmId)
    const now = new Date()
    const calibrationThreshold = 90 * 24 * 60 * 60 * 1000 // 90 days

    return {
      totalDevices: farmDevices.length,
      onlineDevices: farmDevices.filter((d) => d.status === "online").length,
      offlineDevices: farmDevices.filter((d) => d.status === "offline").length,
      lowBatteryDevices: farmDevices.filter((d) => d.batteryLevel < 20).length,
      calibrationDueDevices: farmDevices.filter(
        (d) => now.getTime() - d.calibrationDate.getTime() > calibrationThreshold,
      ).length,
    }
  },

  // Automated irrigation based on sensor data
  autoIrrigate: async (farmId: string, soilMoistureThreshold = 30): Promise<IrrigationCommand[]> => {
    const farmDevices = devices.filter((d) => d.farmId === farmId && d.type === "soil_moisture")
    const commands: IrrigationCommand[] = []

    for (const device of farmDevices) {
      // Get latest sensor reading (mock)
      const latestReading = 25 + Math.random() * 50 // Mock reading

      if (latestReading < soilMoistureThreshold) {
        const command = await iotServices.createIrrigationCommand({
          farmId,
          zoneId: device.location.description,
          action: "start",
          duration: 30, // 30 minutes
        })
        commands.push(command)
      }
    }

    return commands
  },
}
