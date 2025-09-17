"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Phone, Video, Star, Clock, MessageCircle, Bot, User, Paperclip, ImageIcon } from "lucide-react"
import { useState } from "react"

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [activeChat, setActiveChat] = useState("ai-assistant")

  const experts = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Crop Disease Specialist",
      rating: 4.9,
      experience: "15 years",
      status: "online",
      avatar: "/female-agricultural-expert.jpg",
      consultations: 1250,
      responseTime: "< 2 hours",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      specialty: "Soil & Nutrition Expert",
      rating: 4.8,
      experience: "20 years",
      status: "busy",
      avatar: "/placeholder-el3ls.png",
      consultations: 980,
      responseTime: "< 4 hours",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pest Management",
      rating: 4.9,
      experience: "12 years",
      status: "online",
      avatar: "/placeholder-d28fe.png",
      consultations: 750,
      responseTime: "< 1 hour",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Irrigation & Water Management",
      rating: 4.7,
      experience: "18 years",
      status: "offline",
      avatar: "/placeholder-g13so.png",
      consultations: 650,
      responseTime: "< 6 hours",
    },
  ]

  const chatHistory = [
    {
      id: 1,
      sender: "ai",
      message: "Hello! I'm your AgriNetra AI assistant. How can I help you with your farming needs today?",
      timestamp: "10:30 AM",
      type: "text",
    },
    {
      id: 2,
      sender: "user",
      message: "I'm seeing some yellowing on my tomato leaves. What could be causing this?",
      timestamp: "10:32 AM",
      type: "text",
    },
    {
      id: 3,
      sender: "ai",
      message:
        "Yellowing tomato leaves can indicate several issues. The most common causes are:\n\n1. **Nitrogen deficiency** - starts with lower leaves\n2. **Overwatering** - leads to root problems\n3. **Disease** - like early blight or fusarium wilt\n4. **Natural aging** - normal for older leaves\n\nCan you tell me more about the pattern? Are the yellow leaves at the bottom or throughout the plant?",
      timestamp: "10:33 AM",
      type: "text",
    },
    {
      id: 4,
      sender: "user",
      message: "It's mainly the lower leaves, and I've been watering quite frequently lately.",
      timestamp: "10:35 AM",
      type: "text",
    },
    {
      id: 5,
      sender: "ai",
      message:
        "Based on your description, this sounds like it could be **nitrogen deficiency** combined with possible **overwatering**. Here's what I recommend:\n\n**Immediate actions:**\n• Reduce watering frequency - let soil dry between waterings\n• Apply nitrogen-rich fertilizer (10-5-5 NPK ratio)\n• Remove yellowed leaves to prevent disease spread\n\n**Monitoring:**\n• Check soil moisture with your finger 2 inches deep\n• Look for new growth in 7-10 days\n\nWould you like me to connect you with Dr. Sarah Johnson, our crop disease specialist, for a more detailed consultation?",
      timestamp: "10:36 AM",
      type: "text",
    },
  ]

  const recentChats = [
    {
      id: 1,
      name: "AI Assistant",
      lastMessage: "Would you like me to connect you with Dr. Sarah...",
      time: "10:36 AM",
      unread: 0,
      type: "ai",
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      lastMessage: "The soil test results look good. I recommend...",
      time: "Yesterday",
      unread: 2,
      type: "expert",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      lastMessage: "Those pest traps should be checked weekly...",
      time: "2 days ago",
      unread: 0,
      type: "expert",
    },
    {
      id: 4,
      name: "Community Chat",
      lastMessage: "Has anyone tried organic pesticides for...",
      time: "3 days ago",
      unread: 5,
      type: "community",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      setMessage("")
    }
  }

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expert Chat</h1>
          <p className="text-gray-600 mt-2">Get instant help from AI and agricultural experts</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Chat List Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {recentChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 ${
                      activeChat === "ai-assistant" && chat.type === "ai"
                        ? "border-l-green-500 bg-green-50"
                        : "border-l-transparent"
                    }`}
                    onClick={() => setActiveChat(chat.type === "ai" ? "ai-assistant" : `expert-${chat.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {chat.type === "ai" ? (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-green-600" />
                          </div>
                        ) : (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/expert-consultation.png" />
                            <AvatarFallback>
                              {chat.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {chat.unread > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{chat.name}</p>
                        <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                        <p className="text-xs text-gray-400">{chat.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Assistant</CardTitle>
                    <CardDescription>Always available • Instant responses</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${chat.sender === "user" ? "order-2" : "order-1"}`}>
                      <div
                        className={`p-3 rounded-lg ${
                          chat.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">{chat.timestamp}</p>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        chat.sender === "user" ? "order-1 ml-2 bg-blue-100" : "order-2 mr-2 bg-green-100"
                      }`}
                    >
                      {chat.sender === "user" ? (
                        <User className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Experts Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Available Experts</CardTitle>
              <CardDescription>Connect with agricultural specialists</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-4">
                {experts.map((expert) => (
                  <div key={expert.id} className="border rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {expert.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(expert.status)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{expert.name}</p>
                        <p className="text-xs text-gray-600">{expert.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{expert.rating}</span>
                          <span className="text-xs text-gray-400">({expert.consultations})</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{expert.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <Video className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
