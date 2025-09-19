"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import {
  AlertTriangle, BarChart3, Bell, Brain, Calendar, Cloud, CloudRain, Droplets, Leaf, ListTodo, Map, Plus, Sun, TrendingUp, Wind, Zap
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

// --- ENHANCED MOCK DATA ---

const mockWeatherData = {
  current: { temp: 29, condition: "Sunny", humidity: 60, wind: 15 },
  forecast: [
    { day: "Mon", high: 32, low: 24, condition: "Sunny" },
    { day: "Tue", high: 33, low: 25, condition: "Partly Cloudy" },
    { day: "Wed", high: 31, low: 23, condition: "Scattered Showers" },
    { day: "Thu", high: 30, low: 22, condition: "Rainy" },
    { day: "Fri", high: 32, low: 24, condition: "Sunny" },
  ],
}
const initialTasks = [
  { id: 1, text: "Irrigate Field A (Wheat)", completed: false, priority: "high" },
  { id: 2, text: "Apply NPK fertilizer to Field B (Rice)", completed: false, priority: "high" },
  { id: 3, text: "Scout for pests in Tomato patch", completed: true, priority: "medium" },
]
const mockMarketPrices = [
  { crop: "Wheat", price: 2150, trend: "up" },
  { crop: "Rice (Basmati)", price: 3800, trend: "down" },
  { crop: "Tomato", price: 1800, trend: "up" },
]
const mockFarmLayout = [
  { id: "A", crop: "Wheat", status: "good", alert: false },
  { id: "B", crop: "Rice", status: "warning", alert: true },
  { id: "C", crop: "Tomato", status: "good", alert: false },
  { id: "D", crop: "Fallow", status: "neutral", alert: false },
]
const mockCropOverview = [
    { name: "Wheat", field: "Field A", health: 95, stage: "Flowering", estHarvest: "45 days" },
    { name: "Rice", field: "Field B", health: 78, stage: "Tillering", estHarvest: "60 days" },
    { name: "Tomato", field: "Field C", health: 92, stage: "Fruiting", estHarvest: "25 days" },
]

// NEW: Data for sparkline charts
const moistureData = [
    { day: 'Mon', value: 65 }, { day: 'Tue', value: 68 }, { day: 'Wed', value: 70 },
    { day: 'Thu', value: 67 }, { day: 'Fri', value: 69 }, { day: 'Sat', value: 72 }, { day: 'Sun', value: 68 }
];
const tempData = [
    { day: 'Mon', value: 28 }, { day: 'Tue', value: 29 }, { day: 'Wed', value: 31 },
    { day: 'Thu', value: 30 }, { day: 'Fri', value: 32 }, { day: 'Sat', value: 33 }, { day: 'Sun', value: 29 }
];

interface UserProfile {
  fullName: string;
  email: string;
}

// --- Reusable Chart Component ---
const StatChart = ({ data, color }: { data: any[], color: string }) => (
    <ResponsiveContainer width="100%" height={40}>
        <LineChart data={data}>
            <Tooltip
                contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem'
                }}
                labelStyle={{ display: 'none' }}
                itemStyle={{ color: color }}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
    </ResponsiveContainer>
);


// --- DASHBOARD COMPONENT ---
export default function DashboardPage() {
  const { t } = useLanguage()
  const [tasks, setTasks] = useState(initialTasks)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) setProfile(await response.json());
      } catch (error) { console.error("Failed to fetch profile:", error); }
    }
    fetchProfile();
  }, [])

  const handleTaskToggle = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }
  
  const handleAddTask = () => {
    if(newTaskText.trim()) {
      const newTask = {
        id: Date.now(),
        text: newTaskText,
        completed: false,
        priority: 'medium'
      };
      setTasks([newTask, ...tasks]);
      setNewTaskText("");
    }
  }

  const getWeatherIcon = (condition: string, size = "h-6 w-6") => {
    switch (condition.toLowerCase()) {
      case "sunny": return <Sun className={`${size} text-yellow-500`} />;
      case "partly cloudy": return <Cloud className={`${size} text-gray-500`} />;
      case "scattered showers":
      case "rainy": return <CloudRain className={`${size} text-blue-500`} />;
      default: return <Cloud className={`${size} text-gray-500`} />;
    }
  }

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'border-l-red-500';
    if (priority === 'medium') return 'border-l-yellow-500';
    return 'border-l-gray-300';
  }

  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-cool-white/50 p-4 sm:p-6">
      <div className="container mx-auto max-w-screen-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-deep-black">
              {t('dashboard.welcomeBack')}, {profile ? profile.fullName.split(' ')[0] : 'Farmer'}!
            </h1>
            <p className="text-muted-foreground">Here's your farm's health at a glance.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" className="bg-white text-sm h-9">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 h-9">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a New Task</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input 
                            placeholder="e.g., Check irrigation pump in Field C" 
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                           <Button onClick={handleAddTask}>Add Task</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* At a Glance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Avg. Temperature (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">29.5°C</p>
                    <StatChart data={tempData} color="#f59e0b" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">3 High Priority</p>
                    <p className="text-xs text-muted-foreground mt-1">Check Field B immediately</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Avg. Soil Moisture (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">68.2%</p>
                    <StatChart data={moistureData} color="#3b82f6" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{pendingTasksCount} Tasks</p>
                    <p className="text-xs text-muted-foreground mt-1">{initialTasks.length - pendingTasksCount} tasks completed today</p>
                </CardContent>
            </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5 text-primary"/> Farm Layout</CardTitle>
                        <CardDescription>A visual overview of your fields and their current status.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        {mockFarmLayout.map(field => (
                            <div key={field.id} className={`p-4 rounded-lg border-2 ${field.alert ? 'border-red-500 bg-red-50 animate-pulse' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-lg">Field {field.id}</p>
                                    <Badge variant={field.status === 'good' ? 'default' : field.status === 'warning' ? 'destructive' : 'secondary'}>{field.status}</Badge>
                                </div>
                                <p className="text-muted-foreground">{field.crop}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListTodo className="h-5 w-5 text-primary"/> Today's Checklist</CardTitle>
                        <CardDescription>Your daily checklist for managing farm activities.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {tasks.map(task => (
                            <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${getPriorityColor(task.priority)} ${task.completed ? 'bg-gray-100' : 'bg-white'}`}>
                                <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => handleTaskToggle(task.id)} />
                                <label htmlFor={`task-${task.id}`} className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.text}</label>
                                <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}>{task.priority}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Cloud className="h-5 w-5 text-primary"/> Weather Forecast</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {mockWeatherData.forecast.map(day => (
                            <div key={day.day} className="flex items-center justify-between">
                                <span className="font-medium w-12">{day.day}</span>
                                {getWeatherIcon(day.condition, 'h-5 w-5')}
                                <span className="text-muted-foreground">{day.low}° / {day.high}°C</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/> Live Market Watch</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {mockMarketPrices.map(crop => (
                            <div key={crop.crop} className="flex items-center justify-between">
                                <span className="font-medium">{crop.crop}</span>
                                <span className={`font-bold ${crop.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>₹{crop.price.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-20 flex-col gap-1" asChild><Link href="/crop-recommendations"><Brain/>Crop Advice</Link></Button>
                        <Button variant="outline" className="h-20 flex-col gap-1" asChild><Link href="/pest-detection"><Bell/>Pest Alert</Link></Button>
                        <Button variant="outline" className="h-20 flex-col gap-1" asChild><Link href="/sensors"><Zap/>Sensors</Link></Button>
                        <Button variant="outline" className="h-20 flex-col gap-1" asChild><Link href="/analytics"><BarChart3/>Analytics</Link></Button>
                    </CardContent>
                </Card>
            </div>
        </div>
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5 text-primary"/> Crop Health Overview</CardTitle></CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                    {mockCropOverview.map(crop => (
                        <div key={crop.name} className="p-4 border rounded-lg space-y-3">
                            <div className="flex justify-between items-center"><h3 className="font-bold text-lg">{crop.name}</h3><Badge variant="outline">{crop.field}</Badge></div>
                            <div>
                                <div className="flex justify-between text-sm mb-1"><span>Health Score</span><span className="font-medium">{crop.health}%</span></div>
                                <Progress value={crop.health} />
                            </div>
                            <div className="text-sm flex justify-between"><span className="text-muted-foreground">Growth Stage:</span><span className="font-medium">{crop.stage}</span></div>
                            <div className="text-sm flex justify-between"><span className="text-muted-foreground">Est. Harvest:</span><span className="font-medium">{crop.estHarvest}</span></div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}