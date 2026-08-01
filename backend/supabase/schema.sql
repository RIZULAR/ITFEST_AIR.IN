-- ==========================================
-- HARVEY SMART AGRICULTURE DATABASE SCHEMA
-- Supabase PostgreSQL Setup
-- ==========================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Fields Table
CREATE TABLE IF NOT EXISTS public.fields (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'f-' || uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    growth_stage VARCHAR(50) NOT NULL,
    area_ha NUMERIC(6, 2) NOT NULL DEFAULT 1.0,
    coordinates JSONB NOT NULL DEFAULT '[]'::jsonb,
    center JSONB NOT NULL DEFAULT '{"lat": -7.253, "lng": 112.761}'::jsonb,
    last_irrigated DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Schedules Table
CREATE TABLE IF NOT EXISTS public.schedules (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'sch-' || uuid_generate_v4(),
    field_id VARCHAR(50) REFERENCES public.fields(id) ON DELETE CASCADE,
    field_name VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    water_volume_liters NUMERIC(10, 2) NOT NULL DEFAULT 10000,
    status VARCHAR(50) NOT NULL DEFAULT 'Dijadwalkan',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Allow public read access to fields and schedules (For MVP)
CREATE POLICY "Allow public read access to fields" ON public.fields FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to fields" ON public.fields FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to fields" ON public.fields FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to fields" ON public.fields FOR DELETE USING (true);

CREATE POLICY "Allow public read access to schedules" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to schedules" ON public.schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to schedules" ON public.schedules FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to schedules" ON public.schedules FOR DELETE USING (true);

-- Enable Realtime replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.fields;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedules;
