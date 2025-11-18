import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Client for public operations
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for privileged operations
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey);

// Database table names
export const TABLES = {
  SCANS: 'scans',
  USERS: 'users',
  ADMIN_USERS: 'admin_users',
  FLAGGED_DOMAINS: 'flagged_domains'
};

// Types for database records
export interface ScanRecord {
  id?: string;
  url: string;
  risk_score: number;
  status: 'safe' | 'suspicious' | 'dangerous';
  reasons: string[];
  created_at?: string;
  user_ip?: string;
  user_agent?: string;
}

export interface AdminUser {
  id?: string;
  email: string;
  password_hash: string;
  created_at?: string;
  last_login?: string;
}

export interface FlaggedDomain {
  id?: string;
  domain: string;
  count: number;
  created_at?: string;
  updated_at?: string;
}
