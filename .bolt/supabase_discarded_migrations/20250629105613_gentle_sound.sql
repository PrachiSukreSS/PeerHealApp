/*
  # Demo Helpers and Reviews System
  
  1. New Tables
    - `demo_helpers` - Demo helper profiles for testing
    - `demo_reviews` - Reviews for demo helpers
  
  2. Data Population
    - Insert 16 demo helpers across all categories
    - Generate realistic reviews for each helper
    - Update category counts
  
  3. Performance
    - Add indexes for efficient querying
    - Create view for combined helper stats
*/

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can view demo helpers" ON demo_helpers;
    DROP POLICY IF EXISTS "Anyone can view demo reviews" ON demo_reviews;
EXCEPTION 
    WHEN undefined_table THEN NULL;
END $$;

-- Create demo helpers table if it doesn't exist
CREATE TABLE IF NOT EXISTS demo_helpers (
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

-- Create demo reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS demo_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  helper_id uuid REFERENCES demo_helpers(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE demo_helpers ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view demo helpers" ON demo_helpers FOR SELECT USING (true);
CREATE POLICY "Anyone can view demo reviews" ON demo_reviews FOR SELECT USING (true);

-- Clear existing data to avoid duplicates
DELETE FROM demo_reviews;
DELETE FROM demo_helpers;

-- Insert demo helpers for Mental Health
INSERT INTO demo_helpers (
  first_name, last_name, title, description, hourly_rate, experience_years,
  languages, specialties, category_name, avatar_url, location, availability_status,
  average_rating, total_reviews, response_time
) VALUES
('Dr. Sarah', 'Chen', 'Licensed Clinical Psychologist', 
 'Specializing in anxiety, depression, and trauma recovery with 8+ years of experience. I use evidence-based approaches including CBT and mindfulness techniques to help clients develop coping strategies and build resilience.',
 75.00, 8, ARRAY['English', 'Mandarin'], ARRAY['Anxiety Disorders', 'Depression', 'Trauma Recovery', 'Mindfulness'],
 'mental-health', 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?w=150&h=150&fit=crop&crop=face',
 'San Francisco, CA', 'online', 4.9, 127, '< 10 min'),

('Marcus', 'Williams', 'Mental Health Counselor & Peer Support Specialist',
 'Lived experience with anxiety and depression. I provide compassionate peer support and practical coping strategies. Certified in crisis intervention and suicide prevention.',
 45.00, 5, ARRAY['English', 'Spanish'], ARRAY['Peer Support', 'Crisis Intervention', 'Anxiety', 'Depression'],
 'mental-health', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop&crop=face',
 'Austin, TX', 'online', 4.8, 94, '< 15 min'),

('Dr. Priya', 'Patel', 'Psychiatrist & Mindfulness Expert',
 'Board-certified psychiatrist with expertise in medication management and mindfulness-based interventions. I help clients integrate holistic approaches with traditional treatment.',
 120.00, 12, ARRAY['English', 'Hindi', 'Gujarati'], ARRAY['Medication Management', 'Mindfulness', 'Bipolar Disorder', 'ADHD'],
 'mental-health', 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?w=150&h=150&fit=crop&crop=face',
 'New York, NY', 'busy', 4.9, 156, '< 30 min'),

-- Career helpers
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
 'Chicago, IL', 'busy', 4.9, 145, '< 25 min'),

-- Relationships helpers
('Dr. Emily', 'Watson', 'Licensed Marriage & Family Therapist',
 'Specialized in couples therapy, family dynamics, and communication skills. I help individuals and couples build stronger, healthier relationships through evidence-based approaches.',
 90.00, 9, ARRAY['English'], ARRAY['Couples Therapy', 'Family Therapy', 'Communication Skills', 'Conflict Resolution'],
 'relationships', 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?w=150&h=150&fit=crop&crop=face',
 'Portland, OR', 'online', 4.9, 167, '< 20 min'),

('Carlos', 'Mendez', 'Relationship Coach & Dating Expert',
 'Certified relationship coach helping singles build confidence in dating and relationships. Focus on authentic connection, communication skills, and overcoming dating anxiety.',
 55.00, 6, ARRAY['English', 'Spanish'], ARRAY['Dating Confidence', 'Communication', 'Social Anxiety', 'Authentic Connection'],
 'relationships', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=150&h=150&fit=crop&crop=face',
 'Miami, FL', 'online', 4.7, 89, '< 15 min'),

('Isabella', 'Martinez', 'Family Counselor & Relationship Therapist',
 'Bilingual family counselor specializing in multicultural relationships, family dynamics, and communication across generations. Warm, empathetic approach to healing.',
 70.00, 8, ARRAY['English', 'Spanish'], ARRAY['Family Counseling', 'Multicultural Relationships', 'Generational Trauma', 'Communication'],
 'relationships', 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?w=150&h=150&fit=crop&crop=face',
 'Phoenix, AZ', 'online', 4.8, 112, '< 25 min'),

-- Life Transitions helpers
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
 'Minneapolis, MN', 'online', 4.9, 189, '< 15 min'),

-- Education helpers
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

-- Community helpers
('Sophia', 'Lee', 'Social Skills Coach & Community Builder',
 'Specialized in helping introverts and those with social anxiety build confidence and meaningful connections. Former community organizer with expertise in social skills development.',
 55.00, 6, ARRAY['English', 'Korean'], ARRAY['Social Skills', 'Social Anxiety', 'Community Building', 'Networking'],
 'community', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?w=150&h=150&fit=crop&crop=face',
 'Los Angeles, CA', 'online', 4.8, 87, '< 15 min'),

('Michael', 'Brown', 'Community Organizer & Social Worker',
 'Licensed social worker with 10+ years in community development. I help people find their place in their communities and build supportive social networks.',
 65.00, 10, ARRAY['English'], ARRAY['Community Development', 'Social Work', 'Support Networks', 'Volunteer Coordination'],
 'community', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?w=150&h=150&fit=crop&crop=face',
 'Atlanta, GA', 'busy', 4.7, 134, '< 25 min'),

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

-- Update category counts based on demo helpers
UPDATE categories SET 
  helper_count = (
    SELECT COUNT(*) 
    FROM demo_helpers dh 
    WHERE dh.category_name = categories.name
  ),
  available_count = (
    SELECT COUNT(*) 
    FROM demo_helpers dh 
    WHERE dh.category_name = categories.name 
    AND dh.availability_status = 'online'
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_helpers_category ON demo_helpers(category_name);
CREATE INDEX IF NOT EXISTS idx_demo_helpers_availability ON demo_helpers(availability_status);
CREATE INDEX IF NOT EXISTS idx_demo_helpers_verified ON demo_helpers(verified);
CREATE INDEX IF NOT EXISTS idx_demo_helpers_rating ON demo_helpers(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_demo_reviews_helper ON demo_reviews(helper_id);
CREATE INDEX IF NOT EXISTS idx_demo_reviews_rating ON demo_reviews(rating DESC);

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