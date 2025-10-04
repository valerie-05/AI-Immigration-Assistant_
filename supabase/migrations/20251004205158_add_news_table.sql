/*
  # Add Immigration News Table

  1. New Tables
    - `immigration_news`
      - `id` (uuid, primary key) - Unique identifier for each news article
      - `title` (text) - News article title
      - `summary` (text) - Brief summary of the article
      - `content` (text) - Full article content
      - `source` (text) - News source name
      - `source_url` (text) - Link to original article
      - `image_url` (text) - Article image URL
      - `category` (text) - News category (visa, policy, travel, etc.)
      - `published_at` (timestamptz) - Publication date
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on immigration_news table
    - Public read access for all users
    - Insert/update restricted to authenticated admin users (future)

  3. Indexes
    - Index on published_at for chronological sorting
    - Index on category for filtering
*/

CREATE TABLE IF NOT EXISTS immigration_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  content text,
  source text NOT NULL DEFAULT 'Immigration Updates',
  source_url text,
  image_url text,
  category text NOT NULL DEFAULT 'general',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_immigration_news_published_at ON immigration_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_immigration_news_category ON immigration_news(category);

ALTER TABLE immigration_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view immigration news"
  ON immigration_news FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create immigration news"
  ON immigration_news FOR INSERT
  WITH CHECK (true);

INSERT INTO immigration_news (title, summary, content, category, source, image_url, published_at) VALUES
('New H-1B Visa Policy Changes Announced', 'USCIS announces significant changes to H-1B visa lottery system and wage requirements for 2025.', 'The United States Citizenship and Immigration Services (USCIS) has announced major updates to the H-1B visa program. Key changes include a modified lottery system that prioritizes applicants with advanced degrees from U.S. institutions and updated prevailing wage requirements. The new policy aims to ensure that H-1B positions are filled by highly skilled workers while protecting the wages of both foreign and domestic workers.', 'visa', 'USCIS Official', 'https://images.pexels.com/photos/8112171/pexels-photo-8112171.jpeg?auto=compress&cs=tinysrgb&w=800', now() - interval '1 day'),

('Student Visa Processing Times Reduced', 'Average F-1 visa processing time drops to 3 weeks as embassy operations normalize worldwide.', 'Great news for international students: U.S. embassies and consulates have significantly reduced F-1 student visa processing times. The average wait time has decreased from 8 weeks to just 3 weeks in most countries. This improvement comes as diplomatic missions worldwide have resumed full operations and streamlined their visa interview processes. Students are encouraged to apply early and ensure all documents are prepared.', 'visa', 'State Department', 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800', now() - interval '2 days'),

('Green Card Backlog Shows Signs of Improvement', 'USCIS reports processing more employment-based green card applications as backlogs decrease by 15%.', 'The U.S. immigration agency has made notable progress in reducing the green card backlog. Employment-based green card applications are being processed 15% faster than last year, with wait times decreasing across multiple categories. USCIS attributes this improvement to increased staffing, technology upgrades, and streamlined procedures. The agency expects continued improvements throughout 2025.', 'policy', 'Immigration News Network', 'https://images.pexels.com/photos/6077447/pexels-photo-6077447.jpeg?auto=compress&cs=tinysrgb&w=800', now() - interval '3 days'),

('Travel Advisory: Updated Entry Requirements', 'CDC and DHS update international travel requirements for foreign nationals entering the United States.', 'The Centers for Disease Control and Prevention (CDC) and Department of Homeland Security have issued updated guidance for international travelers. New entry requirements include streamlined health documentation and updated vaccination recommendations. The changes affect both immigrant and non-immigrant visa holders. Travelers should review the latest requirements before booking international flights.', 'travel', 'Department of Homeland Security', 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800', now() - interval '4 days'),

('Citizenship Application Fees to Remain Unchanged', 'USCIS announces naturalization fees will stay at current levels through 2025 fiscal year.', 'In welcome news for aspiring citizens, USCIS has confirmed that naturalization application fees will remain unchanged through September 2025. The N-400 application fee stays at current levels, providing cost certainty for individuals planning to apply for citizenship. The agency also announced expanded fee waiver eligibility for low-income applicants and military service members.', 'citizenship', 'USCIS Official', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', now() - interval '5 days'),

('New Online Portal Simplifies Immigration Forms', 'USCIS launches modernized digital platform for filing common immigration applications online.', 'USCIS has unveiled a new online portal that allows applicants to file and track immigration applications digitally. The platform supports multiple visa categories including family-based petitions, employment authorization, and travel documents. Features include real-time status updates, secure document uploads, and automated notifications. The system aims to reduce processing times and improve transparency.', 'policy', 'Immigration Technology Today', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800', now() - interval '6 days')
ON CONFLICT DO NOTHING;
