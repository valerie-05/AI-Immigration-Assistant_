/*
  # AI Immigration Assistant Database Schema

  1. New Tables
    - `chat_sessions`
      - `id` (uuid, primary key) - Unique identifier for each chat session
      - `user_id` (uuid) - User identifier (for future auth integration)
      - `title` (text) - Chat session title
      - `created_at` (timestamptz) - Session creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `messages`
      - `id` (uuid, primary key) - Unique message identifier
      - `session_id` (uuid, foreign key) - References chat_sessions
      - `role` (text) - Message role: 'user' or 'assistant'
      - `content` (text) - Message content
      - `created_at` (timestamptz) - Message timestamp

  2. Security
    - Enable RLS on both tables
    - Public read/write access for MVP (can be restricted later with auth)
    
  3. Indexes
    - Index on session_id for efficient message queries
    - Index on created_at for chronological sorting
*/

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (MVP - can be restricted later)
CREATE POLICY "Anyone can view chat sessions"
  ON chat_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update chat sessions"
  ON chat_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete chat sessions"
  ON chat_sessions FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete messages"
  ON messages FOR DELETE
  USING (true);