
-- Pest Detection table
CREATE TABLE IF NOT EXISTS pest_detections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    farm_id UUID REFERENCES farms(id),
    crop_id UUID REFERENCES crops(id),
    image_url TEXT NOT NULL,
    detected_pest TEXT,
    confidence_score DECIMAL NOT NULL DEFAULT 0.0,
    severity TEXT DEFAULT 'medium',
    treatment_recommendation TEXT,
    ai_model_version TEXT DEFAULT 'gemini-1.5-flash',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    session_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pest_detections_user_id ON pest_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_pest_detections_created_at ON pest_detections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);

-- Enable Row Level Security
ALTER TABLE pest_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pest_detections
CREATE POLICY "Users can view their own pest detections" ON pest_detections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pest detections" ON pest_detections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for analytics_events
CREATE POLICY "Users can insert their own analytics events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics events" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
