export interface Helper {
  id: number | string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  languages: string[];
  specialties: string[];
  availability: string;
  verified: boolean;
  image: string;
  responseTime: string;
  description: string;
  category: string;
  experience: number;
  location: string;
  timezone: string;
  videoEnabled: boolean;
  voiceEnabled: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  helper_count: number;
  available_count: number;
}

export interface Message {
  id: number;
  sender: 'user' | 'ai' | 'helper' | 'bot';
  content: string;
  timestamp: Date;
  type?: 'text' | 'voice' | 'video';
  audioUrl?: string;
  contacts?: any[];
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  description: string;
  phone?: string;
  website?: string;
  country: string;
  category: string;
  available_24_7: boolean;
  languages: string[];
}

export interface Session {
  id: string;
  user_id: string;
  helper_id: string;
  category_id: string;
  session_type: 'chat' | 'voice' | 'video' | 'ai_avatar';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  scheduled_at?: Date;
  started_at?: Date;
  ended_at?: Date;
  duration_minutes?: number;
  amount_paid?: number;
  payment_method?: string;
  blockchain_tx_hash?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  timezone: string;
  is_helper: boolean;
  trust_score: number;
  total_sessions: number;
  created_at: Date;
  updated_at: Date;
}