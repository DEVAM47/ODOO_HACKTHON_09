-- 1. Create the Users table
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
  id text PRIMARY KEY,
  name text,
  email text,
  avatar text,
  "joinDate" text,
  "savedDestinations" jsonb,
  preferences jsonb
);

-- 2. Create the Trips table
DROP TABLE IF EXISTS public.trips CASCADE;
CREATE TABLE public.trips (
  id text PRIMARY KEY,
  name text,
  description text,
  "startDate" text,
  "endDate" text,
  "coverPhoto" text,
  status text,
  budget numeric,
  stops jsonb,
  budget_breakdown jsonb,
  notes jsonb,
  packing jsonb
);

-- 3. Insert default User
INSERT INTO public.users (id, name, email, avatar, "joinDate", "savedDestinations", preferences)
VALUES (
  'u1',
  'Alex Chen',
  'alex@traveloop.com',
  '',
  '2025-01-15',
  '["Tokyo", "Barcelona", "Bali"]',
  '{"currency": "USD", "darkMode": false, "notifications": true}'
);

-- 4. Insert default Trips
INSERT INTO public.trips (id, name, description, "startDate", "endDate", "coverPhoto", status, budget, stops, budget_breakdown, notes, packing)
VALUES 
(
  't1', 'Japan Adventure', 'Cherry blossom season exploration', '2025-04-01', '2025-04-14', 'assets/trips/japan.png', 'upcoming', 4500,
  '[{"id": "s1", "city": "Tokyo", "dates": "2025-04-01 → 2025-04-05", "country": "Japan", "activities": [{"id": "a1", "day": 1, "cost": 0, "name": "Visit Senso-ji Temple", "time": "09:00", "category": "sightseeing"}, {"id": "a2", "day": 1, "cost": 30, "name": "Tsukiji Fish Market", "time": "12:00", "category": "food"}, {"id": "a3", "day": 1, "cost": 0, "name": "Shibuya Crossing", "time": "16:00", "category": "sightseeing"}, {"id": "a4", "day": 2, "cost": 50, "name": "Akihabara Electronics", "time": "10:00", "category": "shopping"}, {"id": "a5", "day": 2, "cost": 0, "name": "Ueno Park Cherry Blossoms", "time": "14:00", "category": "nature"}]}, {"id": "s2", "city": "Kyoto", "dates": "2025-04-06 → 2025-04-10", "country": "Japan", "activities": [{"id": "a6", "day": 6, "cost": 0, "name": "Fushimi Inari Shrine", "time": "08:00", "category": "sightseeing"}, {"id": "a7", "day": 6, "cost": 45, "name": "Tea Ceremony", "time": "14:00", "category": "culture"}, {"id": "a8", "day": 7, "cost": 0, "name": "Arashiyama Bamboo Grove", "time": "09:00", "category": "nature"}]}, {"id": "s3", "city": "Osaka", "dates": "2025-04-11 → 2025-04-14", "country": "Japan", "activities": [{"id": "a9", "day": 11, "cost": 25, "name": "Dotonbori Street Food", "time": "11:00", "category": "food"}, {"id": "a10", "day": 11, "cost": 8, "name": "Osaka Castle", "time": "15:00", "category": "sightseeing"}]}]',
  '{"food": 600, "hotels": 1400, "flights": 1200, "shopping": 500, "transport": 500, "activities": 300}',
  '[{"id": "n1", "stop": "Tokyo", "content": "Remember to get a Suica card at the airport for easy metro access.", "timestamp": "2025-03-28"}, {"id": "n2", "stop": "Kyoto", "content": "Book the tea ceremony at Camellia Garden at least 3 days in advance.", "timestamp": "2025-03-29"}]',
  '{"clothing": [{"id": "p5", "name": "Rain Jacket", "packed": false}, {"id": "p6", "name": "Walking Shoes", "packed": true}, {"id": "p7", "name": "Casual Outfits (x5)", "packed": false}], "essentials": [{"id": "p1", "name": "Passport", "packed": true}, {"id": "p2", "name": "Travel Insurance Docs", "packed": true}, {"id": "p3", "name": "Credit Cards", "packed": false}, {"id": "p4", "name": "Phone Charger", "packed": true}], "toiletries": [{"id": "p8", "name": "Toothbrush", "packed": true}, {"id": "p9", "name": "Sunscreen", "packed": false}], "electronics": [{"id": "p10", "name": "Camera", "packed": false}, {"id": "p11", "name": "Portable Wi-Fi", "packed": false}]}'
),
(
  't2', 'Mediterranean Cruise', 'Island-hopping through the Mediterranean', '2025-06-15', '2025-06-28', 'assets/trips/mediterranean.png', 'planning', 6200,
  '[{"id": "s4", "city": "Barcelona", "dates": "2025-06-15 → 2025-06-18", "country": "Spain", "activities": [{"id": "a11", "day": 1, "cost": 26, "name": "Sagrada Familia", "time": "10:00", "category": "sightseeing"}, {"id": "a12", "day": 1, "cost": 15, "name": "La Boqueria Market", "time": "13:00", "category": "food"}]}, {"id": "s5", "city": "Rome", "dates": "2025-06-19 → 2025-06-23", "country": "Italy", "activities": [{"id": "a13", "day": 5, "cost": 18, "name": "Colosseum Tour", "time": "09:00", "category": "sightseeing"}]}, {"id": "s6", "city": "Santorini", "dates": "2025-06-24 → 2025-06-28", "country": "Greece", "activities": []}]',
  '{"food": 800, "hotels": 2000, "flights": 1800, "shopping": 600, "transport": 600, "activities": 400}',
  '[]',
  '{"clothing": [], "essentials": [], "toiletries": [], "electronics": []}'
),
(
  't3', 'Bali Retreat', 'Wellness and temples', '2024-11-01', '2024-11-10', 'assets/trips/bali.png', 'completed', 2800,
  '[{"id": "s7", "city": "Ubud", "dates": "2024-11-01 → 2024-11-06", "country": "Indonesia", "activities": [{"id": "a14", "day": 1, "cost": 5, "name": "Tegallalang Rice Terraces", "time": "08:00", "category": "nature"}, {"id": "a15", "day": 2, "cost": 25, "name": "Yoga Retreat", "time": "06:00", "category": "wellness"}]}, {"id": "s8", "city": "Seminyak", "dates": "2024-11-07 → 2024-11-10", "country": "Indonesia", "activities": []}]',
  '{"food": 400, "hotels": 700, "flights": 800, "shopping": 400, "transport": 200, "activities": 300}',
  '[]',
  '{"clothing": [], "essentials": [], "toiletries": [], "electronics": []}'
);

-- Allow public read/write access (for development only!)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on trips" ON public.trips FOR ALL USING (true) WITH CHECK (true);
