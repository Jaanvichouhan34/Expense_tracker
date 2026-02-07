import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Expense = {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  created_at: string;
  updated_at: string;
};

export type AIInsight = {
  id: string;
  user_id: string;
  insight_text: string;
  insight_type: 'warning' | 'tip' | 'achievement';
  is_read: boolean;
  created_at: string;
};
