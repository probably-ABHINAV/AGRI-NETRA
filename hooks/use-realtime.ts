"use client"

import { useEffect, useState, useCallback } from "react"
import { realtimeService, type WebSocketMessage, type RealtimeSubscription } from "@/lib/websocket"

export function useRealtime(
  farmId: string,
  userId: string,
  types: WebSocketMessage["type"][] = ["sensor_data", "alert"],
) {
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [latestData, setLatestData] = useState<Record<string, any>>({})

  const handleMessage = useCallback((message: WebSocketMessage) => {
    setMessages((prev) => [message, ...prev.slice(0, 49)]) // Keep last 50 messages

    // Update latest data by type
    setLatestData((prev) => ({
      ...prev,
      [message.type]: message.data,
    }))
  }, [])

  useEffect(() => {
    if (!farmId || !userId) return

    const subscription: RealtimeSubscription = {
      farmId,
      userId,
      types,
      callback: handleMessage,
    }

    const subscriptionId = realtimeService.subscribe(subscription)
    setIsConnected(true)

    return () => {
      realtimeService.unsubscribe(farmId, userId)
      setIsConnected(false)
    }
  }, [farmId, userId, types, handleMessage])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isConnected,
    latestData,
    clearMessages,
  }
}
