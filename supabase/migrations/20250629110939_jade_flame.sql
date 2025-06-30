/*
  # Complete PeerHeal Database Schema
  
  1. New Tables
    - `profiles` - User profile information
    - `helpers` - Peer helper profiles and credentials
    - `categories` - Support categories (mental health, career, etc.)
    - `sessions` - Support sessions between users and helpers
    - `messages` - Chat messages within sessions
    - `reviews` - Helper reviews and ratings
    - `subscriptions` - User subscription plans
    - `emergency_contacts` - Emergency contact database
    - `helper_specialties` - Many-to-many relationship for helper specialties
    - `ai_knowledge_base` - AI knowledge for category-specific information
    - `demo_helpers` - Demo helper data for testing
    - `demo_reviews` - Demo reviews for testing

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Features
    - Blockchain verification tracking
    - AI session logging
    - Payment integration ready
    - Emergency contact system
    - Demo data for immediate functionality
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies and tables if they exist
DO $$ 
BEGIN
    -- Drop policies first
    DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    DROP POLICY IF EXISTS "Anyone can view helpers" ON helpers;
    DROP POLICY IF EXISTS "Helpers can update own profile" ON helpers;
    DROP POLICY IF EXISTS "Users can become helpers" ON helpers;
    DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
    DROP POLICY IF EXISTS "Users can view own sessions" ON sessions;
    DROP POLICY IF EXISTS "Users can create sessions" ON sessions;
    DROP POLICY IF EXISTS "Participants can update sessions" ON sessions;
    DROP POLICY IF EXISTS "Session participants can view messages" ON messages;
    DROP POLICY IF EXISTS "Session participants can send messages" ON messages;
    DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
    DROP POLICY IF EXISTS "Users can create reviews for their sessions" ON reviews;
    DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can manage own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Anyone can view emergency contacts" ON emergency_contacts;
    DROP POLICY IF EXISTS "Anyone can view helper specialties" ON helper_specialties;
    DROP POLICY IF EXISTS "Anyone can view AI knowledge" ON ai_knowledge_base;
    DROP POLICY IF EXISTS "Anyone can view demo helpers" ON demo_helpers;
    DROP POLICY IF EXISTS "Anyone can view demo reviews" ON demo_reviews;
    
    -- Drop tables if they exist
    DROP TABLE IF EXISTS demo_reviews CASCADE;
    DROP TABLE IF EXISTS demo_helpers CASCADE;
    DROP TABLE IF EXISTS ai_knowledge_base CASCADE;
    DROP TABLE IF EXISTS helper_specialties CASCADE;
    DROP TABLE IF EXISTS emergency_contacts CASCADE;
    DROP TABLE IF EXISTS subscriptions CASCADE;
    DROP TABLE IF EXISTS reviews CASCADE;
    DROP TABLE IF EXISTS messages CASCADE;
    DROP TABLE IF EXISTS sessions CASCADE;
    DROP TABLE IF EXISTS helpers CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS profiles CASCADE;
    
    -- Drop views if they exist
    DROP VIEW IF EXISTS demo_helpers_with_stats CASCADE;
EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_object THEN NULL;
END $$;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text,
  bio text,
  location text,
  timezone text DEFAULT 'UTC',
  is_helper boolean DEFAULT false,
  trust_score decimal(3,2) DEFAULT 0.00,
  total_sessions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  helper_count integer DEFAULT 0,
  available_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Helpers table
CREATE TABLE helpers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  hourly_rate decimal(10,2) NOT NULL,
  experience_years integer NOT NULL,
  languages text[] DEFAULT '{}',
  availability_status text DEFAULT 'offline',
  response_time text DEFAULT '< 1 hour',
  verified boolean DEFAULT false,
  blockchain_verified boolean DEFAULT false,
  video_enabled boolean DEFAULT true,
  voice_enabled boolean DEFAULT true,
  ai_avatar_enabled boolean DEFAULT false,
  total_reviews integer DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Helper specialties junction table
CREATE TABLE helper_specialties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  helper_id uuid REFERENCES helpers(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  specialty_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(helper_id, category_id, specialty_name)
);

-- Sessions table
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  helper_id uuid REFERENCES helpers(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  session_type text NOT NULL CHECK (session_type IN ('chat', 'voice', 'video', 'ai_avatar')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes integer,
  amount_paid decimal(10,2),
  payment_method text,
  blockchain_tx_hash text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id),
  sender_type text NOT NULL CHECK (sender_type IN ('user', 'helper', 'ai')),
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'video', 'file')),
  audio_url text,
  file_url text,
  ai_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  helper_id uuid REFERENCES helpers(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type text NOT NULL CHECK (plan_type IN ('basic', 'pro', 'premium')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  revenue_cat_id text,
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Emergency contacts table
CREATE TABLE emergency_contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  phone text,
  website text,
  country text,
  region text,
  category text NOT NULL CHECK (category IN ('suicide', 'crisis', 'domestic_violence', 'substance_abuse', 'mental_health', 'general')),
  available_24_7 boolean DEFAULT false,
  languages text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- AI knowledge base table
CREATE TABLE ai_knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  topic text NOT NULL,
  content text NOT NULL,
  keywords text[] DEFAULT '{}',
  confidence_level decimal(3,2) DEFAULT 0.80,
  source text DEFAULT 'Expert Knowledge',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Demo helpers table for immediate functionality
CREATE TABLE demo_helpers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  hourly_rate decimal(10,2) NOT NULL,
  experience_years integer NOT NULL,
  languages text[] DEFAULT '{}',
  specialties text[] DEFAULT '{}',
  category_name text NOT NULL,
  avatar_url text,
  location text DEFAULT 'Global',
  verified boolean DEFAULT true,
  blockchain_verified boolean DEFAULT true,
  availability_status text DEFAULT 'online',
  average_rating decimal(3,2) DEFAULT 4.8,
  total_reviews integer DEFAULT 89,
  response_time text DEFAULT '< 15 min',
  video_enabled boolean DEFAULT true,
  voice_enabled boolean DEFAULT true,
  ai_avatar_enabled boolean DEFAULT true,
  trust_score decimal(3,2) DEFAULT 4.8,
  total_sessions integer DEFAULT 150,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Demo reviews table
CREATE TABLE demo_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  helper_id uuid REFERENCES demo_helpers(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE helper_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_helpers ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view helpers" ON helpers FOR SELECT USING (true);
CREATE POLICY "Helpers can update own profile" ON helpers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can become helpers" ON helpers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);

CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT USING (auth.uid() = user_id OR auth.uid() = (SELECT user_id FROM helpers WHERE id = helper_id));
CREATE POLICY "Users can create sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Participants can update sessions" ON sessions FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = (SELECT user_id FROM helpers WHERE id = helper_id));

CREATE POLICY "Session participants can view messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM sessions s 
    WHERE s.id = session_id 
    AND (s.user_id = auth.uid() OR s.helper_id IN (SELECT id FROM helpers WHERE user_id = auth.uid()))
  )
);
CREATE POLICY "Session participants can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM sessions s 
    WHERE s.id = session_id 
    AND (s.user_id = auth.uid() OR s.helper_id IN (SELECT id FROM helpers WHERE user_id = auth.uid()))
  )
);

CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their sessions" ON reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND 
  EXISTS (SELECT 1 FROM sessions WHERE id = session_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subscriptions" ON subscriptions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view emergency contacts" ON emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Anyone can view helper specialties" ON helper_specialties FOR SELECT USING (true);
CREATE POLICY "Anyone can view AI knowledge" ON ai_knowledge_base FOR SELECT USING (true);
CREATE POLICY "Anyone can view demo helpers" ON demo_helpers FOR SELECT USING (true);
CREATE POLICY "Anyone can view demo reviews" ON demo_reviews FOR SELECT USING (true);

-- Insert initial categories
INSERT INTO categories (name, description, icon, color, helper_count, available_count) VALUES
('mental-health', 'Anxiety, depression, stress management, and emotional wellbeing', 'Brain', 'blue', 3, 2),
('career', 'Job search, career transitions, workplace challenges, and growth', 'Briefcase', 'green', 3, 3),
('relationships', 'Dating, marriage, family dynamics, and social connections', 'Heart', 'pink', 3, 2),
('life-transitions', 'Moving, divorce, parenthood, retirement, and major changes', 'Home', 'purple', 3, 1),
('education', 'Academic challenges, skill development, and learning disabilities', 'GraduationCap', 'indigo', 3, 2),
('community', 'Social anxiety, making friends, community involvement, and belonging', 'Users', 'teal', 3, 3);

-- Insert emergency contacts
INSERT INTO emergency_contacts (name, description, phone, website, country, region, category, available_24_7, languages) VALUES
('National Suicide Prevention Lifeline', 'Free and confidential emotional support', '988', 'https://suicidepreventionlifeline.org', 'US', 'National', 'suicide', true, ARRAY['English', 'Spanish']),
('Crisis Text Line', 'Free crisis support via text message', '741741', 'https://crisistextline.org', 'US', 'National', 'crisis', true, ARRAY['English']),
('National Domestic Violence Hotline', 'Support for domestic violence survivors', '1-800-799-7233', 'https://thehotline.org', 'US', 'National', 'domestic_violence', true, ARRAY['English', 'Spanish']),
('SAMHSA National Helpline', 'Treatment referral and information service', '1-800-662-4357', 'https://samhsa.gov', 'US', 'National', 'substance_abuse', true, ARRAY['English', 'Spanish']),
('Samaritans', 'Emotional support for anyone in distress', '116 123', 'https://samaritans.org', 'UK', 'National', 'suicide', true, ARRAY['English']),
('Lifeline Australia', 'Crisis support and suicide prevention', '13 11 14', 'https://lifeline.org.au', 'AU', 'National', 'suicide', true, ARRAY['English']);

-- Insert comprehensive demo helpers
INSERT INTO demo_helpers (
  first_name, last_name, title, description, hourly_rate, experience_years,
  languages, specialties, category_name, avatar_url, location, availability_status,
  average_rating, total_reviews, response_time
) VALUES
-- Mental Health Helpers
('Dr. Sarah', 'Chen', 'Licensed Clinical Psychologist', 
 'Specializing in anxiety, depression, and trauma recovery with 8+ years of experience. I use evidence-based approaches including CBT and mindfulness techniques to help clients develop coping strategies and build resilience.',
 75.00, 8, ARRAY['English', 'Mandarin'], ARRAY['Anxiety Disorders', 'Depression', 'Trauma Recovery', 'Mindfulness'],
 'mental-health', 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?w=150&h=150&fit=crop&crop=face',
 'San Francisco, CA', 'online', 4.9, 127, '< 10 min'),

('Marcus', 'Williams', 'Mental Health Counselor & Peer Support Specialist',
 'Lived experience with anxiety and depression. I provide compassionate peer support and practical coping strategies. Certified in crisis intervention and suicide prevention.',
 45.00, 5, ARRAY['English', 'Spanish'], ARRAY['Peer Support', 'Crisis Intervention', 'Anxiety', 'Depression'],
 'mental-health', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop&crop=face',
 'Austin, TX', 'busy', 4.8, 94, '< 15 min'),

('Dr. Priya', 'Patel', 'Psychiatrist & Mindfulness Expert',
 'Board-certified psychiatrist with expertise in medication management and mindfulness-based interventions. I help clients integrate holistic approaches with traditional treatment.',
 120.00, 12, ARRAY['English', 'Hindi', 'Gujarati'], ARRAY['Medication Management', 'Mindfulness', 'Bipolar Disorder', 'ADHD'],
 'mental-health', 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?w=150&h=150&fit=crop&crop=face',
 'New York, NY', 'online', 4.9, 156, '< 30 min'),

-- Career Helpers
('Jennifer', 'Rodriguez', 'Senior Career Coach & HR Director',
 'Former Fortune 500 HR Director with 15+ years helping professionals navigate career transitions, salary negotiations, and leadership development. Specialized in tech and healthcare industries.',
 85.00, 15, ARRAY['English', 'Spanish'], ARRAY['Career Transitions', 'Salary Negotiation', 'Leadership Development', 'Tech Careers'],
 'career', 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?w=150&h=150&fit=crop&crop=face',
 'Seattle, WA', 'online', 4.9, 203, '< 20 min'),

('David', 'Kim', 'Tech Career Mentor & Software Engineer',
 'Senior Software Engineer at Google with experience mentoring junior developers. I help with coding interviews, career growth in tech, and transitioning into software engineering.',
 65.00, 10, ARRAY['English', 'Korean'], ARRAY['Software Engineering', 'Coding Interviews', 'Tech Career Growth', 'Mentorship'],
 'career', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?w=150&h=150&fit=crop&crop=face',
 'Mountain View, CA', 'online', 4.8, 178, '< 15 min'),

('Amanda', 'Foster', 'Executive Coach & Business Consultant',
 'Certified executive coach helping mid-career professionals advance to leadership roles. Expertise in personal branding, networking strategies, and executive presence.',
 95.00, 12, ARRAY['English'], ARRAY['Executive Coaching', 'Leadership', 'Personal Branding', 'Networking'],
 'career', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?w=150&h=150&fit=crop&crop=face',
 'Chicago, IL', 'online', 4.9, 145, '< 25 min'),

-- Relationship Helpers
('Dr. Emily', 'Watson', 'Licensed Marriage & Family Therapist',
 'Specialized in couples therapy, family dynamics, and communication skills. I help individuals and couples build stronger, healthier relationships through evidence-based approaches.',
 90.00, 9, ARRAY['English'], ARRAY['Couples Therapy', 'Family Therapy', 'Communication Skills', 'Conflict Resolution'],
 'relationships', 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?w=150&h=150&fit=crop&crop=face',
 'Portland, OR', 'online', 4.9, 167, '< 20 min'),

('Carlos', 'Mendez', 'Relationship Coach & Dating Expert',
 'Certified relationship coach helping singles build confidence in dating and relationships. Focus on authentic connection, communication skills, and overcoming dating anxiety.',
 55.00, 6, ARRAY['English', 'Spanish'], ARRAY['Dating Confidence', 'Communication', 'Social Anxiety', 'Authentic Connection'],
 'relationships', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=150&h=150&fit=crop&crop=face',
 'Miami, FL', 'busy', 4.7, 89, '< 15 min'),

('Isabella', 'Martinez', 'Family Counselor & Relationship Therapist',
 'Bilingual family counselor specializing in multicultural relationships, family dynamics, and communication across generations. Warm, empathetic approach to healing.',
 70.00, 8, ARRAY['English', 'Spanish'], ARRAY['Family Counseling', 'Multicultural Relationships', 'Generational Trauma', 'Communication'],
 'relationships', 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?w=150&h=150&fit=crop&crop=face',
 'Phoenix, AZ', 'online', 4.8, 112, '< 25 min'),

-- Life Transition Helpers
('Lisa', 'Thompson', 'Life Transition Coach & Therapist',
 'Specialized in helping people navigate major life changes including divorce, career shifts, empty nest syndrome, and retirement. Compassionate support during difficult transitions.',
 70.00, 11, ARRAY['English'], ARRAY['Divorce Support', 'Career Transitions', 'Empty Nest', 'Retirement Planning'],
 'life-transitions', 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?w=150&h=150&fit=crop&crop=face',
 'Denver, CO', 'online', 4.8, 134, '< 30 min'),

('Robert', 'Johnson', 'Grief Counselor & Life Coach',
 'Experienced in helping individuals process grief, loss, and major life transitions. I provide compassionate support and practical tools for moving forward after significant changes.',
 60.00, 8, ARRAY['English'], ARRAY['Grief Counseling', 'Loss Support', 'Life Transitions', 'Coping Strategies'],
 'life-transitions', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?w=150&h=150&fit=crop&crop=face',
 'Nashville, TN', 'busy', 4.7, 98, '< 20 min'),

('Dr. Rachel', 'Green', 'Transition Psychologist & Life Coach',
 'Clinical psychologist specializing in major life transitions, identity shifts, and personal growth. Helping clients find meaning and purpose during times of change.',
 85.00, 13, ARRAY['English'], ARRAY['Identity Development', 'Purpose Finding', 'Major Transitions', 'Personal Growth'],
 'life-transitions', 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?w=150&h=150&fit=crop&crop=face',
 'Minneapolis, MN', 'offline', 4.9, 189, '< 15 min'),

-- Education Helpers
('Prof. Maria', 'Santos', 'Educational Psychologist & Learning Specialist',
 'PhD in Educational Psychology with expertise in learning disabilities, ADHD support, and academic success strategies. I help students of all ages overcome learning challenges.',
 80.00, 14, ARRAY['English', 'Spanish', 'Portuguese'], ARRAY['Learning Disabilities', 'ADHD Support', 'Study Strategies', 'Academic Success'],
 'education', 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?w=150&h=150&fit=crop&crop=face',
 'Boston, MA', 'online', 4.9, 201, '< 20 min'),

('James', 'Wright', 'Academic Coach & Test Prep Specialist',
 'Former university professor turned academic coach. Specialized in test anxiety, study skills, and helping students achieve their academic goals through personalized strategies.',
 50.00, 7, ARRAY['English'], ARRAY['Test Preparation', 'Study Skills', 'Academic Coaching', 'Test Anxiety'],
 'education', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop&crop=face',
 'Philadelphia, PA', 'online', 4.8, 156, '< 25 min'),

('Dr. Kevin', 'Liu', 'Learning Disabilities Specialist',
 'Specialized in supporting students with dyslexia, ADHD, and other learning differences. Evidence-based strategies for academic success and confidence building.',
 75.00, 9, ARRAY['English', 'Mandarin'], ARRAY['Dyslexia Support', 'ADHD Coaching', 'Learning Strategies', 'Confidence Building'],
 'education', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?w=150&h=150&fit=crop&crop=face',
 'San Diego, CA', 'busy', 4.8, 143, '< 30 min'),

-- Community Helpers
('Sophia', 'Lee', 'Social Skills Coach & Community Builder',
 'Specialized in helping introverts and those with social anxiety build confidence and meaningful connections. Former community organizer with expertise in social skills development.',
 55.00, 6, ARRAY['English', 'Korean'], ARRAY['Social Skills', 'Social Anxiety', 'Community Building', 'Networking'],
 'community', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?w=150&h=150&fit=crop&crop=face',
 'Los Angeles, CA', 'online', 4.8, 87, '< 15 min'),

('Michael', 'Brown', 'Community Organizer & Social Worker',
 'Licensed social worker with 10+ years in community development. I help people find their place in their communities and build supportive social networks.',
 65.00, 10, ARRAY['English'], ARRAY['Community Development', 'Social Work', 'Support Networks', 'Volunteer Coordination'],
 'community', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?w=150&h=150&fit=crop&crop=face',
 'Atlanta, GA', 'online', 4.7, 134, '< 25 min'),

('Ana', 'Gutierrez', 'Social Connection Facilitator',
 'Helping people overcome loneliness and build meaningful friendships. Specialized in social anxiety, introversion support, and creating inclusive communities.',
 48.00, 5, ARRAY['English', 'Spanish'], ARRAY['Friendship Building', 'Loneliness Support', 'Social Anxiety', 'Inclusive Communities'],
 'community', 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?w=150&h=150&fit=crop&crop=face',
 'San Antonio, TX', 'online', 4.9, 76, '< 10 min');

-- Insert sample reviews for demo helpers
DO $$
DECLARE
    helper_record RECORD;
    review_comments TEXT[] := ARRAY[
        'Incredibly helpful and understanding. Really made a difference in my life. Highly recommend!',
        'Professional, knowledgeable, and compassionate. Felt heard and supported throughout our sessions.',
        'Great experience. Practical advice and genuine care. Would definitely book again.',
        'Excellent helper! Patient, insightful, and really helped me work through my challenges.',
        'Amazing support during a difficult time. Very grateful for their expertise and kindness.',
        'Highly skilled and empathetic. Provided tools that I still use today.',
        'Wonderful experience. Made me feel comfortable and provided valuable insights.',
        'Outstanding helper! Professional yet warm approach. Exceeded my expectations.'
    ];
    reviewer_names TEXT[] := ARRAY[
        'Sarah M.', 'John D.', 'Maria L.', 'David K.', 'Jennifer R.', 'Michael S.', 'Lisa W.', 'Robert T.'
    ];
BEGIN
    FOR helper_record IN SELECT id FROM demo_helpers LOOP
        -- Insert 2-4 reviews per helper
        FOR i IN 1..(2 + floor(random() * 3)::int) LOOP
            INSERT INTO demo_reviews (helper_id, reviewer_name, rating, comment, helpful_count, created_at)
            VALUES (
                helper_record.id,
                reviewer_names[1 + floor(random() * array_length(reviewer_names, 1))::int],
                4 + floor(random() * 2)::int, -- Rating between 4-5
                review_comments[1 + floor(random() * array_length(review_comments, 1))::int],
                floor(random() * 20)::int, -- 0-19 helpful votes
                now() - (random() * interval '90 days') -- Random date within last 90 days
            );
        END LOOP;
    END LOOP;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_helpers_category ON demo_helpers(category_name);
CREATE INDEX IF NOT EXISTS idx_demo_helpers_availability ON demo_helpers(availability_status);
CREATE INDEX IF NOT EXISTS idx_demo_helpers_verified ON demo_helpers(verified);
CREATE INDEX IF NOT EXISTS idx_demo_helpers_rating ON demo_helpers(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_demo_reviews_helper ON demo_reviews(helper_id);
CREATE INDEX IF NOT EXISTS idx_demo_reviews_rating ON demo_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_category ON ai_knowledge_base(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_keywords ON ai_knowledge_base USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_category ON emergency_contacts(category);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_country ON emergency_contacts(country);

-- Create a view that combines demo helpers with their reviews for easy querying
CREATE OR REPLACE VIEW demo_helpers_with_stats AS
SELECT 
  dh.*,
  COALESCE(AVG(dr.rating), dh.average_rating) as computed_rating,
  COALESCE(COUNT(dr.id), dh.total_reviews) as computed_reviews,
  c.color as category_color,
  c.icon as category_icon
FROM demo_helpers dh
LEFT JOIN demo_reviews dr ON dh.id = dr.helper_id
LEFT JOIN categories c ON dh.category_name = c.name
GROUP BY dh.id, c.color, c.icon;

-- Insert AI knowledge base data
DO $$
DECLARE
    cat_id uuid;
BEGIN
    -- Mental Health AI Knowledge
    SELECT id INTO cat_id FROM categories WHERE name = 'mental-health';
    IF cat_id IS NOT NULL THEN
        INSERT INTO ai_knowledge_base (category_id, topic, content, keywords, confidence_level) VALUES
        (cat_id, 'Anxiety Management Techniques', 'Anxiety is a normal stress response, but when it becomes overwhelming, there are evidence-based techniques to manage it. Deep breathing exercises (4-7-8 technique), grounding techniques (5-4-3-2-1 method), and progressive muscle relaxation can provide immediate relief. Regular exercise, adequate sleep (7-9 hours), and limiting caffeine can help long-term. Cognitive Behavioral Therapy (CBT) is highly effective for anxiety disorders.', ARRAY['anxiety', 'panic', 'stress', 'breathing', 'grounding', 'CBT'], 0.95),
        (cat_id, 'Depression Support Strategies', 'Depression affects over 280 million people worldwide and is highly treatable. Key evidence-based strategies include maintaining daily routine, staying connected with supportive people, engaging in regular physical activity (30 min daily), practicing self-compassion, and challenging negative thought patterns. Professional help through therapy (CBT, IPT) and medication can be very effective. Crisis support is available 24/7.', ARRAY['depression', 'sadness', 'hopelessness', 'therapy', 'medication', 'routine'], 0.95);
    END IF;

    -- Career AI Knowledge
    SELECT id INTO cat_id FROM categories WHERE name = 'career';
    IF cat_id IS NOT NULL THEN
        INSERT INTO ai_knowledge_base (category_id, topic, content, keywords, confidence_level) VALUES
        (cat_id, 'Effective Job Search Strategy', 'Effective job searching involves multiple channels: networking accounts for 70% of job placements, online applications, recruitment agencies, and direct company outreach. Tailor your resume for each application using keywords from job descriptions. Prepare compelling stories for interviews using the STAR method (Situation, Task, Action, Result). Follow up professionally within a week.', ARRAY['job search', 'networking', 'resume', 'interview', 'STAR method', 'applications'], 0.93),
        (cat_id, 'Career Transition Planning', 'Career changes are increasingly common (average person changes careers 5-7 times). Start by assessing your transferable skills, values, and interests. Research target industries through informational interviews, industry reports, and LinkedIn. Build relevant experience through volunteering, side projects, or additional training. Create a transition timeline with financial planning.', ARRAY['career change', 'transition', 'transferable skills', 'networking', 'planning'], 0.91);
    END IF;

    -- Add more AI knowledge for other categories...
END $$;