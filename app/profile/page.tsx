"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Edit, Save, Camera, Phone, MapPin, Briefcase, Languages, Leaf } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

// Mock user profile data - in a real app, this would be fetched
const mockUserProfile = {
  fullName: "John Farmer",
  email: "farmer@example.com",
  phone: "+91 98765 43210",
  location: "Punjab, India",
  farmSize: 25.5,
  experience: 15,
  language: "en",
  avatar: "https://github.com/shadcn.png",
}

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [profile, setProfile] = useState(mockUserProfile)
  const { t } = useLanguage()

  // In a real application, you would fetch the user profile
  useEffect(() => {
    // async function fetchProfile() {
    //   const response = await fetch('/api/profile');
    //   const data = await response.json();
    //   setProfile(data);
    // }
    // fetchProfile();
  }, [])

  const handleInputChange = (field: string, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    // In a real application, you would send a POST/PUT request to your API
    // await fetch('/api/profile', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profile),
    // });
    console.log("Saving profile:", profile)
    setIsEditMode(false)
  }

  return (
    <div className="min-h-screen bg-cool-white/50 p-6">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <User className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">My Profile</CardTitle>
                  <CardDescription>View and manage your personal and farm details.</CardDescription>
                </div>
              </div>
              <Button
                variant={isEditMode ? "default" : "outline"}
                onClick={() => (isEditMode ? handleSave() : setIsEditMode(true))}
                className={isEditMode ? "bg-primary hover:bg-primary/90" : ""}
              >
                {isEditMode ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditMode ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={profile.avatar} alt={profile.fullName} />
                  <AvatarFallback>{profile.fullName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                {isEditMode && (
                  <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-primary hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2"><User className="h-4 w-4" /> Full Name</Label>
                  <Input id="fullName" value={profile.fullName} disabled={!isEditMode} onChange={e => handleInputChange('fullName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone Number</Label>
                  <Input id="phone" value={profile.phone} disabled={!isEditMode} onChange={e => handleInputChange('phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Location</Label>
                  <Input id="location" value={profile.location} disabled={!isEditMode} onChange={e => handleInputChange('location', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2"><Languages className="h-4 w-4" /> Preferred Language</Label>
                  <Select value={profile.language} disabled={!isEditMode} onValueChange={value => handleInputChange('language', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Farm Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Farm Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="farmSize" className="flex items-center gap-2"><Leaf className="h-4 w-4" /> Farm Size (hectares)</Label>
                  <Input id="farmSize" type="number" value={profile.farmSize} disabled={!isEditMode} onChange={e => handleInputChange('farmSize', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience" className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Years of Experience</Label>
                  <Input id="experience" type="number" value={profile.experience} disabled={!isEditMode} onChange={e => handleInputChange('experience', parseInt(e.target.value))} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}