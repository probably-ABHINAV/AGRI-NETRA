// WebSocket service for real-time features
// In production, this would use a proper WebSocket server like Socket.io

export interface WebSocketMessage {
  type: "sensor_data" | "alert" | "irrigation_status" | "weather_update" | "pest_detection"
  farmId: string
  data: any
  timestamp: Date
}

export interface RealtimeSubscription {
  farmId: string
  userId: string
  types: WebSocketMessage["type"][]
  callback: (message: WebSocketMessage) => void
}

class RealtimeService {
  private subscriptions: Map<string, RealtimeSubscription[]> = new Map()
  private simulationIntervals: Map<string, NodeJS.Timeout> = new Map()

  // Subscribe to real-time updates for a farm
  subscribe(subscription: RealtimeSubscription): string {
    const subscriptionId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    if (!this.subscriptions.has(subscription.farmId)) {
      this.subscriptions.set(subscription.farmId, [])
    }

    this.subscriptions.get(subscription.farmId)!.push({
      ...subscription,
    })

    // Start simulation for this farm if not already running
    if (!this.simulationIntervals.has(subscription.farmId)) {
      this.startSimulation(subscription.farmId)
    }

    return subscriptionId
  }

  // Unsubscribe from updates
  unsubscribe(farmId: string, userId: string) {
    const subs = this.subscriptions.get(farmId)
    if (subs) {
      const filtered = subs.filter((sub) => sub.userId !== userId)
      if (filtered.length === 0) {
        this.subscriptions.delete(farmId)
        this.stopSimulation(farmId)
      } else {
        this.subscriptions.set(farmId, filtered)
      }
    }
  }

  // Broadcast message to all subscribers
  broadcast(message: WebSocketMessage) {
    const subs = this.subscriptions.get(message.farmId)
    if (subs) {
      subs.forEach((sub) => {
        if (sub.types.includes(message.type)) {
          sub.callback(message)
        }
      })
    }
  }

  // Start simulation of real-time data for a farm
  private startSimulation(farmId: string) {
    const interval = setInterval(() => {
      // Simulate sensor data updates
      if (Math.random() > 0.3) {
        this.broadcast({
          type: "sensor_data",
          farmId,
          data: {
            sensorId: "sensor-001",
            sensorType: "soil_moisture",
            value: 40 + Math.random() * 40,
            unit: "%",
            location: "North Field, Section A",
          },
          timestamp: new Date(),
        })
      }

      // Simulate temperature updates
      if (Math.random() > 0.4) {
        this.broadcast({
          type: "sensor_data",
          farmId,
          data: {
            sensorId: "sensor-002",
            sensorType: "temperature",
            value: 20 + Math.random() * 15,
            unit: "°C",
            location: "South Field, Section B",
          },
          timestamp: new Date(),
        })
      }

      // Simulate alerts occasionally
      if (Math.random() > 0.9) {
        this.broadcast({
          type: "alert",
          farmId,
          data: {
            id: `alert-${Date.now()}`,
            type: "threshold_exceeded",
            severity: "medium",
            message: "Soil moisture below optimal level in North Field",
            deviceId: "sensor-001",
          },
          timestamp: new Date(),
        })
      }

      // Simulate weather updates
      if (Math.random() > 0.8) {
        this.broadcast({
          type: "weather_update",
          farmId,
          data: {
            temperature: 25 + Math.random() * 10,
            humidity: 60 + Math.random() * 30,
            windSpeed: 5 + Math.random() * 10,
            conditions: Math.random() > 0.5 ? "Partly Cloudy" : "Sunny",
          },
          timestamp: new Date(),
        })
      }
    }, 5000) // Update every 5 seconds

    this.simulationIntervals.set(farmId, interval)
  }

  // Stop simulation for a farm
  private stopSimulation(farmId: string) {
    const interval = this.simulationIntervals.get(farmId)
    if (interval) {
      clearInterval(interval)
      this.simulationIntervals.delete(farmId)
    }
  }

  // Get current subscribers count
  getSubscribersCount(farmId: string): number {
    return this.subscriptions.get(farmId)?.length || 0
  }
}

export const realtimeService = new RealtimeService()
