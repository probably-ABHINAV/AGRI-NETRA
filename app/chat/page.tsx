"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Phone, Video, Star, Clock, MessageCircle, Bot, User, Paperclip, ImageIcon, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from "next/link"

interface ChatMessage {
  id: number;
  sender: "ai" | "user";
  message: string;
  timestamp: string;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "ai",
      message: "Hello! I'm your AgriNetra AI assistant. How can I help you with your farming needs today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const [activeChat, setActiveChat] = useState("ai-assistant")
  const experts = [ { id: 1, name: "Dr. Sarah Johnson", specialty: "Crop Disease Specialist", rating: 4.9, experience: "15 years", status: "online", avatar: "/female-agricultural-expert.jpg", consultations: 1250, responseTime: "< 2 hours", }, { id: 2, name: "Prof. Michael Chen", specialty: "Soil & Nutrition Expert", rating: 4.8, experience: "20 years", status: "busy", avatar: "/placeholder-el3ls.png", consultations: 980, responseTime: "< 4 hours", }, { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pest Management", rating: 4.9, experience: "12 years", status: "online", avatar: "/placeholder-d28fe.png", consultations: 750, responseTime: "< 1 hour", }, { id: 4, name: "Dr. James Wilson", specialty: "Irrigation & Water Management", rating: 4.7, experience: "18 years", status: "offline", avatar: "/placeholder-g13so.png", consultations: 650, responseTime: "< 6 hours", }, ]
  const recentChats = [ { id: 1, name: "AI Assistant", lastMessage: "How can I help you today?", time: "Online", unread: 0, type: "ai", }, { id: 2, name: "Dr. Sarah Johnson", lastMessage: "The soil test results look good.", time: "Yesterday", unread: 2, type: "expert", }, { id: 3, name: "Dr. Emily Rodriguez", lastMessage: "Those pest traps should be checked...", time: "2 days ago", unread: 0, type: "expert", }, { id: 4, name: "Community Chat", lastMessage: "Has anyone tried organic pesticides...", time: "3 days ago", unread: 5, type: "community", }, ]
  const getStatusColor = (status: string) => { switch (status) { case "online": return "bg-green-500"; case "busy": return "bg-yellow-500"; case "offline": return "bg-gray-400"; default: return "bg-gray-400" } }

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Add user message to UI immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const messageToSend = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedMessages.slice(0, -1), // Send history *before* the new user message
          message: messageToSend,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        message: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        message: `Sorry, I encountered an error. ${error instanceof Error ? error.message : ''}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expert Chat</h1>
          <p className="text-gray-600 mt-2">Get instant help from AI and agricultural experts</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg">Conversations</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {recentChats.map((chat) => (
                  <div key={chat.id} className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 ${activeChat === "ai-assistant" && chat.type === "ai" ? "border-l-green-500 bg-green-50" : "border-l-transparent"}`} onClick={() => setActiveChat(chat.type === "ai" ? "ai-assistant" : `expert-${chat.id}`)}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {chat.type === "ai" ? (<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><Bot className="h-4 w-4 text-green-600" /></div>) : (<Avatar className="w-8 h-8"><AvatarImage src="/expert-consultation.png" /><AvatarFallback>{chat.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>)}
                        {chat.unread > 0 && (<Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">{chat.unread}</Badge>)}
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

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Bot className="h-5 w-5 text-green-600" /></div>
                  <div><CardTitle className="text-lg">AI Assistant</CardTitle><CardDescription>Always available • Powered by Gemini</CardDescription></div>
                </div>
                <div className="flex gap-2"><Button variant="outline" size="sm"><Phone className="h-4 w-4" /></Button><Button variant="outline" size="sm"><Video className="h-4 w-4" /></Button></div>
              </div>
            </CardHeader>

            <CardContent ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((chat) => (
                  <div key={chat.id} className={`flex gap-3 ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {chat.sender === "ai" && (<Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4"/></AvatarFallback></Avatar>)}
                    <div className="max-w-[80%]">
                      <div className={`p-3 rounded-lg ${chat.sender === "user" ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-900"}`}>
                        <div className="prose prose-sm max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.message}</ReactMarkdown></div>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 px-1 ${chat.sender === 'user' ? 'text-right' : 'text-left'}`}>{chat.timestamp}</p>
                    </div>
                    {chat.sender === "user" && (<Avatar className="h-8 w-8"><AvatarFallback className="bg-blue-100 text-blue-600"><User className="h-4 w-4"/></AvatarFallback></Avatar>)}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4"/></AvatarFallback></Avatar>
                        <div className="p-3 rounded-lg bg-gray-100 flex items-center"><Loader2 className="h-4 w-4 animate-spin"/></div>
                    </div>
                )}
              </div>
            </CardContent>

            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><Paperclip className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm"><ImageIcon className="h-4 w-4" /></Button>
                <Input placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()} className="flex-1" disabled={isLoading} />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="bg-green-600 hover:bg-green-700"><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg">Available Experts</CardTitle><CardDescription>Connect with agricultural specialists</CardDescription></CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-4">
                {experts.map((expert) => (
                  <div key={expert.id} className="border rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="relative"><Avatar className="w-10 h-10"><AvatarImage src={expert.avatar || "/placeholder.svg"} /><AvatarFallback>{expert.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar><div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(expert.status)}`}/></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{expert.name}</p>
                        <p className="text-xs text-gray-600">{expert.specialty}</p>
                        <div className="flex items-center gap-1 mt-1"><Star className="h-3 w-3 text-yellow-500 fill-current" /><span className="text-xs text-gray-600">{expert.rating}</span><span className="text-xs text-gray-400">({expert.consultations})</span></div>
                        <div className="flex items-center gap-1 mt-1"><Clock className="h-3 w-3 text-gray-400" /><span className="text-xs text-gray-500">{expert.responseTime}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent"><MessageCircle className="h-3 w-3 mr-1" />Chat</Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700"><Video className="h-3 w-3 mr-1" />Call</Button>
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