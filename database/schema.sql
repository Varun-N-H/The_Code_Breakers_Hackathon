-- SafeLinkEdu Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- URL scans table
CREATE TABLE IF NOT EXISTS scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    url TEXT NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    status VARCHAR(20) NOT NULL CHECK (status IN ('safe', 'suspicious', 'dangerous')),
    reasons TEXT[] DEFAULT '{}',
    user_ip INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flagged domains table (for analytics)
CREATE TABLE IF NOT EXISTS flagged_domains (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status);
CREATE INDEX IF NOT EXISTS idx_scans_risk_score ON scans(risk_score);
CREATE INDEX IF NOT EXISTS idx_flagged_domains_count ON flagged_domains(count DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for flagged_domains
CREATE TRIGGER update_flagged_domains_updated_at 
    BEFORE UPDATE ON flagged_domains 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE flagged_domains ENABLE ROW LEVEL SECURITY;

-- Policy for admin_users (only authenticated admins can manage)
CREATE POLICY "Admin users can manage all admin users" ON admin_users
    FOR ALL USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

-- Policy for scans (everyone can read, only admins can write)
CREATE POLICY "Everyone can read scans" ON scans
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert scans" ON scans
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Admins can update scans" ON scans
    FOR UPDATE USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Admins can delete scans" ON scans
    FOR DELETE USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

-- Policy for flagged_domains (everyone can read, only admins can write)
CREATE POLICY "Everyone can read flagged domains" ON flagged_domains
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage flagged domains" ON flagged_domains
    FOR ALL USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

-- Create a default admin user (change the password in production!)
-- Password: admin123 (you should change this immediately)
INSERT INTO admin_users (email, password_hash) 
VALUES (
    'admin@safelinkedu.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe' -- admin123
) ON CONFLICT (email) DO NOTHING;

-- Create a function to update flagged domains when new scans are added
CREATE OR REPLACE FUNCTION update_flagged_domains()
RETURNS TRIGGER AS $$
BEGIN
    -- Extract domain from URL
    -- This is a simplified version - you might want to use a more robust URL parser
    IF NEW.status != 'safe' THEN
        INSERT INTO flagged_domains (domain, count)
        VALUES (
            regexp_replace(NEW.url, '^https?://([^/]+).*', '\1'),
            1
        )
        ON CONFLICT (domain) 
        DO UPDATE SET count = flagged_domains.count + 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update flagged domains
DROP TRIGGER IF EXISTS trigger_update_flagged_domains ON scans;
CREATE TRIGGER trigger_update_flagged_domains
    AFTER INSERT ON scans
    FOR EACH ROW
    EXECUTE FUNCTION update_flagged_domains();
