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
  AlertTriangle, BarChart3, Bell, Brain, Calendar, Cloud, CloudRain, Droplets, Leaf, ListTodo, Map, Plus, Sun, TrendingUp, Wind, Zap, Trash2, Loader2
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

// --- ENHANCED MOCK DATA ---
const mockWeatherData = {
  current: { temp: 29, feelsLike: 32, condition: "Sunny", humidity: 60, wind: 15 },
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
  { id: 4, text: "Check water levels in main reservoir", completed: false, priority: "low" },
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
const moistureData = [
    { day: 'Mon', value: 65 }, { day: 'Tue', value: 68 }, { day: 'Wed', value: 70 },
    { day: 'Thu', value: 67 }, { day: 'Fri', value: 69 }, { day: 'Sat', value: 72 }, { day: 'Sun', value: 68 }
];

interface UserProfile { fullName: string; email: string; city?: string; }
interface WeatherData {
  current: { temp: number; feelsLike: number; condition: string; humidity: number; wind: number };
  forecast: { day: string; high: number; low: number; condition: string }[];
}


// --- DASHBOARD COMPONENT ---
export default function DashboardPage() {
  const { t } = useLanguage()
  const [tasks, setTasks] = useState(initialTasks)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [newTaskText, setNewTaskText] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    async function fetchAndLoadData() {
      setWeatherLoading(true);
      try {
        const profileResponse = await fetch('/api/profile');
        let city = 'Noida';
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
          if (profileData.city) {
            city = profileData.city;
          }
        }
        
        const weatherResponse = await fetch(`/api/weather?city=${city}`);
        if(weatherResponse.ok) {
          setWeatherData(await weatherResponse.json());
        } else {
          console.error("Failed to fetch weather data");
          setWeatherData(null);
        }
      } catch (error) { 
        console.error("Error loading dashboard data:", error);
        setWeatherData(null);
      } finally {
        setWeatherLoading(false);
      }
    }
    fetchAndLoadData();
  }, [])

  const handleTaskToggle = (id: number) => setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  const handleAddTask = () => {
    if(newTaskText.trim()) {
      const newTask = { id: Date.now(), text: newTaskText, completed: false, priority: 'medium' };
      setTasks([newTask, ...tasks]);
      setNewTaskText("");
    }
  }
  const handleClearCompleted = () => setTasks(tasks.filter(task => !task.completed));

  const getWeatherIcon = (condition: string, size = "h-6 w-6") => {
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes("sunny") || lowerCaseCondition.includes("clear")) return <Sun className={`${size} text-yellow-400`} />;
    if (lowerCaseCondition.includes("partly cloudy")) return <Cloud className={`${size} text-gray-400`} />;
    if (lowerCaseCondition.includes("cloudy") || lowerCaseCondition.includes("overcast")) return <Cloud className={`${size} text-gray-500`} />;
    if (lowerCaseCondition.includes("rain") || lowerCaseCondition.includes("showers") || lowerCaseCondition.includes("drizzle")) return <CloudRain className={`${size} text-blue-400`} />;
    return <Cloud className={`${size} text-gray-400`} />;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'border-l-red-500';
    if (priority === 'medium') return 'border-l-yellow-500';
    return 'border-l-gray-300';
  }

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length;
  const tasksProgress = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-cool-white/50 p-4 sm:p-6">
      <div className="container mx-auto max-w-screen-2xl space-y-6">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-deep-black">
              {t('dashboard.welcomeBack')}, {profile ? profile.fullName.split(' ')[0] : 'Farmer'}!
            </h1>
            <p className="text-muted-foreground">Here is your farm's health summary for today.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" className="bg-white text-sm h-9"><Calendar className="h-4 w-4 mr-2" />{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Button>
            <Dialog><DialogTrigger asChild><Button className="bg-primary hover:bg-primary/90 h-9"><Plus className="h-4 w-4 mr-2" />Add Task</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add a New Task</DialogTitle></DialogHeader><div className="py-4"><Input placeholder="e.g., Check irrigation pump in Field C" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)}/></div><DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><DialogClose asChild><Button onClick={handleAddTask}>Add Task</Button></DialogClose></DialogFooter></DialogContent></Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">3 High Priority</p><p className="text-xs text-muted-foreground mt-1">Check Field B immediately</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Avg. Soil Moisture (7d)</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">68.2%</p><ResponsiveContainer width="100%" height={40}><LineChart data={moistureData}><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} labelStyle={{ display: 'none' }} itemStyle={{ color: "#3b82f6" }}/><Line type="monotone" dataKey="value" stroke={"#3b82f6"} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Tasks Progress</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{completedTasksCount} / {totalTasksCount} Completed</p><Progress value={tasksProgress} className="mt-2 h-2" /></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><Map className="h-5 w-5 text-primary"/> Farm Layout</CardTitle><CardDescription>A visual overview of your fields and their current status.</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-4">{mockFarmLayout.map(field => (<div key={field.id} className={`p-4 rounded-lg border-2 ${field.alert ? 'border-red-500 bg-red-50 animate-pulse' : 'border-gray-200 bg-gray-50'}`}><div className="flex justify-between items-center"><p className="font-bold text-lg">Field {field.id}</p><Badge variant={field.status === 'good' ? 'default' : field.status === 'warning' ? 'destructive' : 'secondary'}>{field.status}</Badge></div><p className="text-muted-foreground">{field.crop}</p></div>))}</CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle className="flex items-center gap-2"><ListTodo className="h-5 w-5 text-primary"/> Today's Checklist</CardTitle><CardDescription>Your daily plan for managing farm activities.</CardDescription></div><Button variant="outline" size="sm" onClick={handleClearCompleted}><Trash2 className="h-4 w-4 mr-2"/>Clear Completed</Button></CardHeader><CardContent className="space-y-3">{tasks.length > 0 ? tasks.map(task => (<div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border-l-4 transition-colors ${getPriorityColor(task.priority)} ${task.completed ? 'bg-gray-100' : 'bg-white'}`}><Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => handleTaskToggle(task.id)} /><label htmlFor={`task-${task.id}`} className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.text}</label><Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}>{task.priority}</Badge></div>)) : <p className="text-sm text-muted-foreground text-center py-4">No tasks for today. Well done!</p>}</CardContent></Card>
            </div>
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Cloud className="h-5 w-5 text-primary"/> Weather in {profile?.city || 'your city'}</CardTitle></CardHeader>
                    {weatherLoading ? (<div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>) : weatherData ? (<>
                        <div className="p-6 bg-gradient-to-br from-blue-100 to-green-100">
                          <div className="flex items-center justify-between">
                            <div><p className="text-muted-foreground">Current Weather</p><p className="text-4xl font-bold text-deep-black">{weatherData.current.temp}°C</p><p className="font-medium">{weatherData.current.condition}</p></div>
                            {getWeatherIcon(weatherData.current.condition, 'h-16 w-16')}
                          </div>
                          <div className="flex justify-between text-sm mt-4"><span>Feels like: {weatherData.current.feelsLike}°</span><span>Humidity: {weatherData.current.humidity}%</span></div>
                        </div>
                        <CardContent className="p-6 space-y-3">
                            <h3 className="text-sm font-medium mb-2">5-Day Forecast</h3>
                            {weatherData.forecast.map(day => (<div key={day.day} className="flex items-center justify-between text-sm"><span className="font-medium w-12 text-muted-foreground">{day.day}</span>{getWeatherIcon(day.condition, 'h-5 w-5')}<span className="font-bold">{day.high}° <span className="text-muted-foreground">/ {day.low}°</span></span></div>))}
                        </CardContent>
                      </>) : (<div className="flex items-center justify-center h-64 text-red-500"><AlertTriangle className="h-6 w-6 mr-2"/> Could not load weather.</div>)}
                </Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/> Live Market Prices</CardTitle></CardHeader><CardContent className="space-y-3">{mockMarketPrices.map(crop => (<div key={crop.crop} className="flex items-center justify-between"><span className="font-medium">{crop.crop}</span><span className={`font-bold ${crop.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>₹{crop.price.toLocaleString('en-IN')}</span></div>))}</CardContent></Card>
            </div>
        </div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5 text-primary"/> Crop Health Overview</CardTitle></CardHeader><CardContent><div className="grid md:grid-cols-3 gap-6">{mockCropOverview.map(crop => (<div key={crop.name} className="p-4 border rounded-lg space-y-3"><div className="flex justify-between items-center"><h3 className="font-bold text-lg">{crop.name}</h3><Badge variant="outline">{crop.field}</Badge></div><div><div className="flex justify-between text-sm mb-1"><span>Health Score</span><span className="font-medium">{crop.health}%</span></div><Progress value={crop.health} /></div><div className="text-sm flex justify-between"><span className="text-muted-foreground">Growth Stage:</span><span className="font-medium">{crop.stage}</span></div><div className="text-sm flex justify-between"><span className="text-muted-foreground">Est. Harvest:</span><span className="font-medium">{crop.estHarvest}</span></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}