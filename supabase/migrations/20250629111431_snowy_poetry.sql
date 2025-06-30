/*
  # Create emergency_contacts table

  1. New Tables
    - emergency_contacts table with all required fields
  2. Security
    - Enable RLS and add public access policy
  3. Indexes
    - Add performance indexes
  4. Sample Data
    - Insert essential emergency contacts
*/

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  phone text,
  website text,
  country text,
  region text,
  category text NOT NULL,
  available_24_7 boolean DEFAULT false,
  languages text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT emergency_contacts_category_check CHECK (category = ANY (ARRAY['suicide'::text, 'crisis'::text, 'domestic_violence'::text, 'substance_abuse'::text, 'mental_health'::text, 'general'::text]))
);

-- Enable RLS
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (emergency contacts should be publicly accessible)
CREATE POLICY "Anyone can view emergency contacts"
  ON emergency_contacts
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_category ON emergency_contacts USING btree (category);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_country ON emergency_contacts USING btree (country);

-- Insert essential emergency contacts
INSERT INTO emergency_contacts (name, description, phone, website, country, category, available_24_7, languages) VALUES
-- Suicide Prevention
('988 Suicide & Crisis Lifeline', 'Free and confidential emotional support to people in suicidal crisis or emotional distress 24 hours a day, 7 days a week', '988', 'https://988lifeline.org', 'United States', 'suicide', true, ARRAY['English', 'Spanish']),
('Crisis Text Line', 'Free, 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the US', '741741', 'https://www.crisistextline.org', 'United States', 'crisis', true, ARRAY['English', 'Spanish']),
('International Association for Suicide Prevention', 'Global directory of crisis centers and suicide prevention resources', NULL, 'https://www.iasp.info/resources/Crisis_Centres', 'Global', 'suicide', false, ARRAY['Multiple']),

-- Mental Health
('NAMI National Helpline', 'Information, resource referrals and support for people living with mental health conditions', '1-800-950-6264', 'https://www.nami.org/help', 'United States', 'mental_health', false, ARRAY['English', 'Spanish']),
('SAMHSA National Helpline', 'Treatment referral and information service for mental health and substance use disorders', '1-800-662-4357', 'https://www.samhsa.gov/find-help/national-helpline', 'United States', 'mental_health', true, ARRAY['English', 'Spanish']),

-- Domestic Violence
('National Domestic Violence Hotline', 'Confidential support for domestic violence survivors and their loved ones', '1-800-799-7233', 'https://www.thehotline.org', 'United States', 'domestic_violence', true, ARRAY['English', 'Spanish']),
('National Sexual Assault Hotline', 'Free, confidential support for survivors of sexual assault', '1-800-656-4673', 'https://www.rainn.org', 'United States', 'domestic_violence', true, ARRAY['English', 'Spanish']),

-- Substance Abuse
('SAMHSA Treatment Locator', 'Find substance abuse treatment facilities and programs', '1-800-662-4357', 'https://findtreatment.samhsa.gov', 'United States', 'substance_abuse', true, ARRAY['English', 'Spanish']),
('Narcotics Anonymous', 'Fellowship of people who share their experience, strength, and hope with each other', NULL, 'https://www.na.org', 'Global', 'substance_abuse', false, ARRAY['Multiple']),

-- Crisis Support
('Crisis Support Services', 'Immediate crisis intervention and emotional support', NULL, 'https://www.crisiscenter.com', 'Global', 'crisis', true, ARRAY['English']),
('Befrienders Worldwide', 'Emotional support to prevent suicide around the world', NULL, 'https://www.befrienders.org', 'Global', 'crisis', true, ARRAY['Multiple']),

-- General Support
('211', 'Information and referral service that connects people with local resources', '211', 'https://www.211.org', 'United States', 'general', true, ARRAY['English', 'Spanish']),
('Mental Health America', 'Leading community-based nonprofit dedicated to addressing mental health needs', NULL, 'https://www.mhanational.org', 'United States', 'general', false, ARRAY['English']),

-- International Resources
('Samaritans', 'Emotional support for anyone in emotional distress, struggling to cope, or at risk of suicide', '116123', 'https://www.samaritans.org', 'United Kingdom', 'suicide', true, ARRAY['English']),
('Lifeline Australia', 'Crisis support and suicide prevention services', '13-11-14', 'https://www.lifeline.org.au', 'Australia', 'suicide', true, ARRAY['English']),
('Kids Help Phone', 'Professional counseling, information and referrals and volunteer-led, text-based support', '1-800-668-6868', 'https://kidshelpphone.ca', 'Canada', 'crisis', true, ARRAY['English', 'French']),
('Centre for Suicide Prevention', 'Suicide prevention training, research, and resource development', NULL, 'https://www.suicideinfo.ca', 'Canada', 'suicide', false, ARRAY['English', 'French']);