-- AgriNetra Database Schema
-- This script creates all the necessary tables for the Smart Crop Advisory System

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- User roles enum
CREATE TYPE user_role AS ENUM ('farmer', 'expert', 'admin');

-- Crop categories enum
CREATE TYPE crop_category AS ENUM ('cereals', 'pulses', 'oilseeds', 'vegetables', 'fruits', 'spices', 'cash_crops');

-- Sensor types enum
CREATE TYPE sensor_type AS ENUM ('soil_moisture', 'temperature', 'humidity', 'ph', 'nitrogen', 'phosphorus', 'potassium');

-- Alert severity enum
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'farmer',
    location TEXT,
    farm_size DECIMAL,
    experience_years INTEGER,
    preferred_language TEXT DEFAULT 'en',
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regions table
CREATE TABLE regions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    climate_zone TEXT,
    avg_rainfall DECIMAL,
    soil_type TEXT,
    coordinates POINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crops table
CREATE TABLE crops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    scientific_name TEXT,
    category crop_category NOT NULL,
    growing_season TEXT,
    water_requirement TEXT,
    soil_ph_min DECIMAL,
    soil_ph_max DECIMAL,
    temperature_min DECIMAL,
    temperature_max DECIMAL,
    growth_duration_days INTEGER,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farms table
CREATE TABLE farms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    coordinates POINT,
    area_hectares DECIMAL NOT NULL,
    soil_type TEXT,
    irrigation_type TEXT,
    region_id UUID REFERENCES regions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crop recommendations table
CREATE TABLE crop_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id),
    season TEXT NOT NULL,
    confidence_score DECIMAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    reasoning TEXT,
    weather_factors JSONB,
    soil_factors JSONB,
    market_factors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IoT sensors table
CREATE TABLE sensors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    sensor_type sensor_type NOT NULL,
    device_id TEXT UNIQUE NOT NULL,
    location_name TEXT,
    coordinates POINT,
    is_active BOOLEAN DEFAULT TRUE,
    calibration_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sensor readings table
CREATE TABLE sensor_readings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sensor_id UUID REFERENCES sensors(id) ON DELETE CASCADE,
    value DECIMAL NOT NULL,
    unit TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    quality_score DECIMAL CHECK (quality_score >= 0 AND quality_score <= 1)
);

-- Weather data table
CREATE TABLE weather_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    region_id UUID REFERENCES regions(id),
    date DATE NOT NULL,
    temperature_max DECIMAL,
    temperature_min DECIMAL,
    humidity DECIMAL,
    rainfall DECIMAL,
    wind_speed DECIMAL,
    pressure DECIMAL,
    uv_index DECIMAL,
    weather_condition TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(region_id, date)
);

-- Pest and disease detection table
CREATE TABLE pest_detections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id),
    image_url TEXT NOT NULL,
    detected_pest TEXT,
    confidence_score DECIMAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    severity TEXT,
    treatment_recommendation TEXT,
    ai_model_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expert consultations table
CREATE TABLE consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    expert_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    category TEXT,
    images JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation messages table
CREATE TABLE consultation_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachments JSONB,
    is_ai_response BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity alert_severity DEFAULT 'medium',
    category TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    action_required BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_farms_user_id ON farms(user_id);
CREATE INDEX idx_farms_region_id ON farms(region_id);
CREATE INDEX idx_crop_recommendations_user_id ON crop_recommendations(user_id);
CREATE INDEX idx_crop_recommendations_created_at ON crop_recommendations(created_at);
CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp);
CREATE INDEX idx_weather_data_region_date ON weather_data(region_id, date);
CREATE INDEX idx_pest_detections_user_id ON pest_detections(user_id);
CREATE INDEX idx_pest_detections_created_at ON pest_detections(created_at);
CREATE INDEX idx_consultations_farmer_id ON consultations(farmer_id);
CREATE INDEX idx_consultations_expert_id ON consultations(expert_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultation_messages_consultation_id ON consultation_messages(consultation_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Farms: Users can manage their own farms
CREATE POLICY "Users can view own farms" ON farms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farms" ON farms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own farms" ON farms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own farms" ON farms FOR DELETE USING (auth.uid() = user_id);

-- Crop recommendations: Users can view their own recommendations
CREATE POLICY "Users can view own recommendations" ON crop_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON crop_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sensors: Users can manage sensors on their farms
CREATE POLICY "Users can view own farm sensors" ON sensors FOR SELECT USING (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = sensors.farm_id AND farms.user_id = auth.uid())
);
CREATE POLICY "Users can insert own farm sensors" ON sensors FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = sensors.farm_id AND farms.user_id = auth.uid())
);

-- Sensor readings: Users can view readings from their sensors
CREATE POLICY "Users can view own sensor readings" ON sensor_readings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM sensors 
        JOIN farms ON farms.id = sensors.farm_id 
        WHERE sensors.id = sensor_readings.sensor_id AND farms.user_id = auth.uid()
    )
);

-- Pest detections: Users can manage their own detections
CREATE POLICY "Users can view own pest detections" ON pest_detections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pest detections" ON pest_detections FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Consultations: Farmers can view their consultations, experts can view assigned consultations
CREATE POLICY "Farmers can view own consultations" ON consultations FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Experts can view assigned consultations" ON consultations FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Farmers can insert consultations" ON consultations FOR INSERT WITH CHECK (auth.uid() = farmer_id);

-- Consultation messages: Participants can view and send messages
CREATE POLICY "Consultation participants can view messages" ON consultation_messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM consultations 
        WHERE consultations.id = consultation_messages.consultation_id 
        AND (consultations.farmer_id = auth.uid() OR consultations.expert_id = auth.uid())
    )
);
CREATE POLICY "Consultation participants can send messages" ON consultation_messages FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM consultations 
        WHERE consultations.id = consultation_messages.consultation_id 
        AND (consultations.farmer_id = auth.uid() OR consultations.expert_id = auth.uid())
    ) AND auth.uid() = sender_id
);

-- Alerts: Users can view their own alerts
CREATE POLICY "Users can view own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE USING (auth.uid() = user_id);

-- Analytics: Users can insert their own events
CREATE POLICY "Users can insert own analytics" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
