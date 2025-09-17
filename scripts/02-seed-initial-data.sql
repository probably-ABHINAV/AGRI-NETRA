-- Seed initial data for AgriNetra

-- Insert sample regions (Indian states/regions)
INSERT INTO regions (name, state, country, climate_zone, avg_rainfall, soil_type) VALUES
('Punjab Plains', 'Punjab', 'India', 'Semi-arid', 500, 'Alluvial'),
('Maharashtra Plateau', 'Maharashtra', 'India', 'Tropical', 1200, 'Black cotton'),
('Tamil Nadu Coast', 'Tamil Nadu', 'India', 'Tropical', 900, 'Red laterite'),
('Uttar Pradesh Plains', 'Uttar Pradesh', 'India', 'Subtropical', 800, 'Alluvial'),
('Karnataka Plateau', 'Karnataka', 'India', 'Tropical', 600, 'Red soil'),
('West Bengal Delta', 'West Bengal', 'India', 'Tropical', 1500, 'Alluvial'),
('Rajasthan Desert', 'Rajasthan', 'India', 'Arid', 300, 'Sandy'),
('Kerala Coast', 'Kerala', 'India', 'Tropical', 2500, 'Laterite');

-- Insert sample crops
INSERT INTO crops (name, scientific_name, category, growing_season, water_requirement, soil_ph_min, soil_ph_max, temperature_min, temperature_max, growth_duration_days, description) VALUES
-- Cereals
('Rice', 'Oryza sativa', 'cereals', 'Kharif', 'High', 5.5, 7.0, 20, 35, 120, 'Staple cereal crop requiring flooded fields'),
('Wheat', 'Triticum aestivum', 'cereals', 'Rabi', 'Medium', 6.0, 7.5, 15, 25, 120, 'Winter cereal crop, major food grain'),
('Maize', 'Zea mays', 'cereals', 'Kharif', 'Medium', 5.8, 7.0, 18, 32, 90, 'Versatile cereal crop for food and feed'),
('Barley', 'Hordeum vulgare', 'cereals', 'Rabi', 'Low', 6.0, 7.8, 12, 22, 100, 'Hardy cereal crop for cooler regions'),

-- Pulses
('Chickpea', 'Cicer arietinum', 'pulses', 'Rabi', 'Low', 6.0, 7.5, 15, 25, 100, 'Important protein-rich pulse crop'),
('Pigeon Pea', 'Cajanus cajan', 'pulses', 'Kharif', 'Medium', 5.5, 7.0, 20, 30, 150, 'Long-duration pulse crop'),
('Black Gram', 'Vigna mungo', 'pulses', 'Kharif', 'Medium', 6.0, 7.0, 25, 35, 70, 'Short-duration pulse crop'),
('Green Gram', 'Vigna radiata', 'pulses', 'Kharif', 'Medium', 6.2, 7.2, 25, 35, 60, 'Quick-growing pulse crop'),

-- Oilseeds
('Groundnut', 'Arachis hypogaea', 'oilseeds', 'Kharif', 'Medium', 6.0, 7.0, 22, 30, 120, 'Important oilseed and protein crop'),
('Sunflower', 'Helianthus annuus', 'oilseeds', 'Rabi', 'Medium', 6.0, 7.5, 18, 25, 90, 'High-quality oil producing crop'),
('Mustard', 'Brassica juncea', 'oilseeds', 'Rabi', 'Low', 6.0, 7.0, 15, 25, 120, 'Cool season oilseed crop'),
('Sesame', 'Sesamum indicum', 'oilseeds', 'Kharif', 'Low', 5.5, 7.0, 25, 35, 90, 'Drought-tolerant oilseed crop'),

-- Vegetables
('Tomato', 'Solanum lycopersicum', 'vegetables', 'Year-round', 'High', 6.0, 7.0, 18, 29, 75, 'Popular vegetable crop for fresh market'),
('Onion', 'Allium cepa', 'vegetables', 'Rabi', 'Medium', 6.0, 7.5, 15, 25, 120, 'Important vegetable and spice crop'),
('Potato', 'Solanum tuberosum', 'vegetables', 'Rabi', 'Medium', 5.0, 6.5, 15, 22, 90, 'Major tuber crop for food'),
('Cabbage', 'Brassica oleracea', 'vegetables', 'Rabi', 'High', 6.0, 7.0, 15, 20, 80, 'Cool season leafy vegetable'),

-- Fruits
('Mango', 'Mangifera indica', 'fruits', 'Perennial', 'Medium', 5.5, 7.5, 24, 30, 365, 'King of fruits, tropical tree crop'),
('Banana', 'Musa acuminata', 'fruits', 'Year-round', 'High', 5.5, 7.0, 26, 30, 300, 'Popular tropical fruit crop'),
('Orange', 'Citrus sinensis', 'fruits', 'Perennial', 'Medium', 6.0, 7.5, 20, 30, 365, 'Citrus fruit rich in vitamin C'),
('Grapes', 'Vitis vinifera', 'fruits', 'Perennial', 'Medium', 6.0, 7.0, 15, 25, 365, 'Table and wine grape varieties'),

-- Spices
('Turmeric', 'Curcuma longa', 'spices', 'Kharif', 'High', 5.0, 7.5, 20, 30, 240, 'Important spice and medicinal crop'),
('Chili', 'Capsicum annuum', 'spices', 'Kharif', 'Medium', 6.0, 7.0, 20, 30, 120, 'Hot spice crop for culinary use'),
('Coriander', 'Coriandrum sativum', 'spices', 'Rabi', 'Low', 6.5, 7.5, 15, 25, 90, 'Aromatic spice and herb crop'),
('Cumin', 'Cuminum cyminum', 'spices', 'Rabi', 'Low', 7.0, 8.0, 20, 30, 120, 'Important spice crop for arid regions'),

-- Cash crops
('Cotton', 'Gossypium hirsutum', 'cash_crops', 'Kharif', 'Medium', 5.8, 8.0, 21, 30, 180, 'Major fiber crop for textile industry'),
('Sugarcane', 'Saccharum officinarum', 'cash_crops', 'Year-round', 'High', 6.0, 7.5, 26, 32, 365, 'Sugar producing perennial crop'),
('Tea', 'Camellia sinensis', 'cash_crops', 'Perennial', 'High', 4.5, 6.0, 20, 30, 365, 'Beverage crop for hilly regions'),
('Coffee', 'Coffea arabica', 'cash_crops', 'Perennial', 'High', 6.0, 7.0, 15, 25, 365, 'Beverage crop for tropical highlands');
