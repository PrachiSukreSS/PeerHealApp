/*
  # Create Emergency Contacts Table

  1. New Tables
    - `emergency_contacts`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `phone` (text, nullable)
      - `website` (text, nullable)
      - `country` (text, nullable)
      - `region` (text, nullable)
      - `category` (text, not null with check constraint)
      - `available_24_7` (boolean, default false)
      - `languages` (text array, default empty array)
      - `created_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `emergency_contacts` table
    - Add policy for anyone to read emergency contacts (public access for safety)

  3. Indexes
    - Add indexes for category and country for efficient filtering

  4. Sample Data
    - Insert comprehensive emergency contacts for various categories and countries
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
  created_at timestamptz DEFAULT now()
);

-- Add check constraint for category
ALTER TABLE emergency_contacts 
ADD CONSTRAINT emergency_contacts_category_check 
CHECK (category = ANY (ARRAY['suicide'::text, 'crisis'::text, 'domestic_violence'::text, 'substance_abuse'::text, 'mental_health'::text, 'general'::text]));

-- Enable RLS
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (emergency contacts should be publicly accessible)
CREATE POLICY "Anyone can view emergency contacts"
  ON emergency_contacts
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_category ON emergency_contacts USING btree (category);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_country ON emergency_contacts USING btree (country);

-- Insert comprehensive sample emergency contacts
INSERT INTO emergency_contacts (name, description, phone, website, country, region, category, available_24_7, languages) VALUES
-- Suicide Prevention
('988 Suicide & Crisis Lifeline', 'Free and confidential emotional support to people in suicidal crisis or emotional distress 24 hours a day, 7 days a week', '988', 'https://988lifeline.org', 'United States', 'North America', 'suicide', true, ARRAY['English', 'Spanish']),
('Crisis Text Line', 'Free, 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the US', '741741', 'https://www.crisistextline.org', 'United States', 'North America', 'suicide', true, ARRAY['English']),
('Samaritans', 'Confidential support for people experiencing feelings of distress or despair', '116123', 'https://www.samaritans.org', 'United Kingdom', 'Europe', 'suicide', true, ARRAY['English']),
('Lifeline Australia', 'Crisis support and suicide prevention services', '13 11 14', 'https://www.lifeline.org.au', 'Australia', 'Oceania', 'suicide', true, ARRAY['English']),
('Centre for Suicide Prevention', 'Suicide prevention resources and support', '1-833-456-4566', 'https://www.suicideinfo.ca', 'Canada', 'North America', 'suicide', true, ARRAY['English', 'French']),

-- Crisis Support
('NAMI National Helpline', 'Information, referrals and support for people with mental health conditions', '1-800-950-6264', 'https://www.nami.org', 'United States', 'North America', 'crisis', false, ARRAY['English', 'Spanish']),
('Mental Health America Crisis Resources', 'Crisis resources and mental health support', NULL, 'https://www.mhanational.org/crisis-resources', 'United States', 'North America', 'crisis', true, ARRAY['English']),
('Crisis Services Canada', 'Distress and crisis intervention services', '1-833-456-4566', 'https://www.crisisservicescanada.ca', 'Canada', 'North America', 'crisis', true, ARRAY['English', 'French']),
('Mind Crisis Resources', 'Mental health crisis support and information', '0300 123 3393', 'https://www.mind.org.uk', 'United Kingdom', 'Europe', 'crisis', false, ARRAY['English']),

-- Mental Health
('SAMHSA National Helpline', 'Treatment referral and information service for mental health and substance use disorders', '1-800-662-4357', 'https://www.samhsa.gov/find-help/national-helpline', 'United States', 'North America', 'mental_health', true, ARRAY['English', 'Spanish']),
('Mental Health Foundation', 'Mental health information, support and resources', NULL, 'https://www.mentalhealth.org.uk', 'United Kingdom', 'Europe', 'mental_health', false, ARRAY['English']),
('Beyond Blue', 'Support for anxiety, depression and suicide prevention', '1300 22 4636', 'https://www.beyondblue.org.au', 'Australia', 'Oceania', 'mental_health', true, ARRAY['English']),
('Canadian Mental Health Association', 'Mental health support and resources', NULL, 'https://cmha.ca', 'Canada', 'North America', 'mental_health', false, ARRAY['English', 'French']),

-- Domestic Violence
('National Domestic Violence Hotline', 'Confidential support for domestic violence survivors', '1-800-799-7233', 'https://www.thehotline.org', 'United States', 'North America', 'domestic_violence', true, ARRAY['English', 'Spanish']),
('National Sexual Assault Hotline', 'Support for sexual assault survivors', '1-800-656-4673', 'https://www.rainn.org', 'United States', 'North America', 'domestic_violence', true, ARRAY['English']),
('Women''s Aid', 'Support for women experiencing domestic abuse', '0808 2000 247', 'https://www.womensaid.org.uk', 'United Kingdom', 'Europe', 'domestic_violence', true, ARRAY['English']),
('1800RESPECT', 'National sexual assault, domestic violence counselling service', '1800 737 732', 'https://www.1800respect.org.au', 'Australia', 'Oceania', 'domestic_violence', true, ARRAY['English']),

-- Substance Abuse
('SAMHSA Treatment Locator', 'Find substance abuse treatment facilities', '1-800-662-4357', 'https://findtreatment.samhsa.gov', 'United States', 'North America', 'substance_abuse', true, ARRAY['English', 'Spanish']),
('Narcotics Anonymous', 'Support for people recovering from drug addiction', NULL, 'https://www.na.org', 'Global', 'Global', 'substance_abuse', false, ARRAY['English', 'Spanish', 'French', 'German']),
('Alcoholics Anonymous', 'Support for people recovering from alcohol addiction', NULL, 'https://www.aa.org', 'Global', 'Global', 'substance_abuse', false, ARRAY['English', 'Spanish', 'French']),
('FRANK Drug Advice', 'Honest information about drugs', '0300 123 6600', 'https://www.talktofrank.com', 'United Kingdom', 'Europe', 'substance_abuse', true, ARRAY['English']),

-- General Support
('211', 'Information and referral service for health and human services', '211', 'https://www.211.org', 'United States', 'North America', 'general', true, ARRAY['English', 'Spanish']),
('United Way', 'Community support and resources', '211', 'https://www.unitedway.org', 'United States', 'North America', 'general', false, ARRAY['English']),
('Citizens Advice', 'Free, confidential advice on legal, debt, consumer, housing and other problems', '03444 111 444', 'https://www.citizensadvice.org.uk', 'United Kingdom', 'Europe', 'general', false, ARRAY['English']),
('Helplines Partnership', 'Directory of helplines and support services', NULL, 'https://www.helplines.org', 'United Kingdom', 'Europe', 'general', false, ARRAY['English']),

-- International/Global Resources
('International Association for Suicide Prevention', 'Global suicide prevention resources', NULL, 'https://www.iasp.info/resources/Crisis_Centres', 'Global', 'Global', 'suicide', false, ARRAY['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']),
('Befrienders Worldwide', 'Emotional support to prevent suicide worldwide', NULL, 'https://www.befrienders.org', 'Global', 'Global', 'crisis', false, ARRAY['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic']),
('World Health Organization Mental Health', 'Global mental health resources and information', NULL, 'https://www.who.int/health-topics/mental-disorders', 'Global', 'Global', 'mental_health', false, ARRAY['English', 'Spanish', 'French', 'Arabic', 'Chinese', 'Russian']);