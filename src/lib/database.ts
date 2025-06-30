import { supabase } from './supabase';
import { Helper, Category } from '../types';

// Profile operations
export const createProfile = async (userId: string, userData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        ...userData
      }
    ]);
  return { data, error };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// Categories operations
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  return { data, error };
};

// Demo Helpers operations (for testing/demo purposes)
export const getDemoHelpersByCategory = async (categoryName: string, filters: any = {}) => {
  let query = supabase
    .from('demo_helpers_with_stats')
    .select('*')
    .eq('category_name', categoryName);

  // Apply filters
  if (filters.available) {
    query = query.eq('availability_status', 'online');
  }
  if (filters.topRated) {
    query = query.gte('average_rating', 4.5);
  }
  if (filters.affordable) {
    query = query.lte('hourly_rate', 70);
  }
  if (filters.videoEnabled) {
    query = query.eq('video_enabled', true);
  }
  if (filters.voiceAI) {
    query = query.eq('voice_enabled', true);
  }

  const { data, error } = await query.order('average_rating', { ascending: false });
  return { data, error };
};

export const getAllDemoHelpers = async (filters: any = {}) => {
  let query = supabase
    .from('demo_helpers_with_stats')
    .select('*');

  // Apply filters
  if (filters.available) {
    query = query.eq('availability_status', 'online');
  }
  if (filters.topRated) {
    query = query.gte('average_rating', 4.5);
  }
  if (filters.affordable) {
    query = query.lte('hourly_rate', 70);
  }
  if (filters.videoEnabled) {
    query = query.eq('video_enabled', true);
  }
  if (filters.voiceAI) {
    query = query.eq('voice_enabled', true);
  }

  const { data, error } = await query.order('average_rating', { ascending: false });
  return { data, error };
};

// Helpers operations (for real helpers)
export const getHelpersByCategory = async (categoryName: string, filters: any = {}) => {
  let query = supabase
    .from('helpers')
    .select(`
      *,
      profiles!helpers_user_id_fkey(first_name, last_name, avatar_url, location),
      helper_specialties!inner(
        specialty_name,
        categories!inner(name)
      )
    `)
    .eq('helper_specialties.categories.name', categoryName);

  // Apply filters
  if (filters.available) {
    query = query.eq('availability_status', 'online');
  }
  if (filters.topRated) {
    query = query.gte('average_rating', 4.5);
  }
  if (filters.affordable) {
    query = query.lte('hourly_rate', 70);
  }
  if (filters.videoEnabled) {
    query = query.eq('video_enabled', true);
  }
  if (filters.voiceAI) {
    query = query.eq('voice_enabled', true);
  }

  const { data, error } = await query.order('average_rating', { ascending: false });
  return { data, error };
};

export const getAllHelpers = async (filters: any = {}) => {
  // First try to get real helpers
  let query = supabase
    .from('helpers')
    .select(`
      *,
      profiles!helpers_user_id_fkey(first_name, last_name, avatar_url, location),
      helper_specialties(
        specialty_name,
        categories(name, color)
      )
    `);

  // Apply filters
  if (filters.available) {
    query = query.eq('availability_status', 'online');
  }
  if (filters.topRated) {
    query = query.gte('average_rating', 4.5);
  }
  if (filters.affordable) {
    query = query.lte('hourly_rate', 70);
  }
  if (filters.videoEnabled) {
    query = query.eq('video_enabled', true);
  }
  if (filters.voiceAI) {
    query = query.eq('voice_enabled', true);
  }

  const { data: realHelpers, error: realError } = await query.order('average_rating', { ascending: false });
  
  // If no real helpers found, fall back to demo helpers
  if (!realHelpers || realHelpers.length === 0) {
    return getAllDemoHelpers(filters);
  }
  
  return { data: realHelpers, error: realError };
};

// AI Knowledge operations
export const getAIKnowledge = async (categoryName?: string) => {
  let query = supabase
    .from('ai_knowledge_base')
    .select(`
      *,
      categories(name, color)
    `);
  
  if (categoryName) {
    query = query.eq('categories.name', categoryName);
  }
  
  const { data, error } = await query.order('topic');
  return { data, error };
};

export const searchAIKnowledge = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('ai_knowledge_base')
    .select(`
      *,
      categories(name, color)
    `)
    .or(`content.ilike.%${searchTerm}%,topic.ilike.%${searchTerm}%,keywords.cs.{${searchTerm}}`)
    .order('confidence_level', { ascending: false });
  
  return { data, error };
};

// Sessions operations
export const createSession = async (sessionData: any) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert([sessionData]);
  return { data, error };
};

export const getUserSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      helpers(
        *,
        profiles!helpers_user_id_fkey(first_name, last_name, avatar_url)
      ),
      categories(name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Messages operations
export const getSessionMessages = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)
    `)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  return { data, error };
};

export const sendMessage = async (messageData: any) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData]);
  return { data, error };
};

// Emergency contacts operations
export const getEmergencyContacts = async (category?: string) => {
  let query = supabase
    .from('emergency_contacts')
    .select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('name');
  return { data, error };
};

export const searchEmergencyContacts = async (searchTerm: string, userCountry?: string) => {
  let query = supabase
    .from('emergency_contacts')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
  
  if (userCountry) {
    query = query.or(`country.eq.${userCountry},country.eq.Global`);
  }
  
  const { data, error } = await query.order('available_24_7', { ascending: false });
  return { data, error };
};

// Reviews operations
export const createReview = async (reviewData: any) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData]);
  return { data, error };
};

export const getHelperReviews = async (helperId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles!reviews_reviewer_id_fkey(first_name, last_name, avatar_url)
    `)
    .eq('helper_id', helperId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getDemoHelperReviews = async (helperId: string) => {
  const { data, error } = await supabase
    .from('demo_reviews')
    .select('*')
    .eq('helper_id', helperId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Subscription operations
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  return { data, error };
};

export const createSubscription = async (subscriptionData: any) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([subscriptionData]);
  return { data, error };
};

// Helper statistics
export const getHelperStats = async () => {
  const { data, error } = await supabase
    .from('helpers')
    .select(`
      id,
      availability_status,
      average_rating,
      total_reviews,
      helper_specialties(
        categories(name)
      )
    `);
  
  return { data, error };
};

// Update category counts
export const updateCategoryCounts = async () => {
  const { data, error } = await supabase.rpc('update_category_counts');
  return { data, error };
};

// Helper registration
export const createHelperProfile = async (helperData: any) => {
  const { data, error } = await supabase
    .from('helpers')
    .insert([helperData]);
  return { data, error };
};

export const addHelperSpecialties = async (helperId: string, specialties: any[]) => {
  const { data, error } = await supabase
    .from('helper_specialties')
    .insert(specialties.map(specialty => ({
      helper_id: helperId,
      category_id: specialty.category_id,
      specialty_name: specialty.name
    })));
  return { data, error };
};