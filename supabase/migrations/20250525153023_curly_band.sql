/*
  # Initial Schema Setup for 1M Streaming Platform

  1. New Tables
    - `videos` - Stores video information including title, description, duration, URLs, etc.
    - `comments` - Stores user comments on videos
    - `profiles` - Stores user profile information
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own data
    - Add policies for public access to videos
  
  3. Functions
    - `increment_video_views` - Safe function to increment view count
*/

-- Create tables
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  duration numeric NOT NULL,
  thumbnail_url text,
  video_url text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  views integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  content text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now(),
  username text NOT NULL,
  avatar_url text,
  join_date timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for videos
CREATE POLICY "Videos are viewable by everyone" 
  ON videos 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own videos" 
  ON videos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" 
  ON videos 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" 
  ON comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own comments" 
  ON comments 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON comments 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON comments 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Function to increment video views
CREATE OR REPLACE FUNCTION increment_video_views(video_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET views = views + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data for testing
INSERT INTO videos (title, description, duration, thumbnail_url, video_url, user_id, views)
VALUES 
  ('Introduction to React', 'Learn the basics of React in this comprehensive tutorial', 1823, 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg', 'https://example.com/videos/react-intro.mp4', NULL, 1245),
  ('Building a REST API with Node.js', 'Step-by-step guide to creating a REST API', 2412, 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg', 'https://example.com/videos/node-api.mp4', NULL, 892),
  ('CSS Grid Layout Tutorial', 'Master CSS Grid layout with practical examples', 1532, 'https://images.pexels.com/photos/11035541/pexels-photo-11035541.jpeg', 'https://example.com/videos/css-grid.mp4', NULL, 3102),
  ('TypeScript for Beginners', 'Get started with TypeScript in this beginner-friendly guide', 1975, 'https://images.pexels.com/photos/11035382/pexels-photo-11035382.jpeg', 'https://example.com/videos/typescript-basics.mp4', NULL, 678),
  ('Advanced JavaScript Patterns', 'Deep dive into advanced JavaScript patterns and techniques', 3245, 'https://images.pexels.com/photos/11035474/pexels-photo-11035474.jpeg', 'https://example.com/videos/js-patterns.mp4', NULL, 1567),
  ('Responsive Web Design Principles', 'Learn how to create responsive websites from scratch', 2134, 'https://images.pexels.com/photos/11035383/pexels-photo-11035383.jpeg', 'https://example.com/videos/responsive-design.mp4', NULL, 2341),
  ('GraphQL vs REST', 'Comparing GraphQL and REST APIs with practical examples', 1856, 'https://images.pexels.com/photos/11035476/pexels-photo-11035476.jpeg', 'https://example.com/videos/graphql-rest.mp4', NULL, 983),
  ('Docker for Developers', 'Getting started with Docker containerization', 2565, 'https://images.pexels.com/photos/11035386/pexels-photo-11035386.jpeg', 'https://example.com/videos/docker-intro.mp4', NULL, 1287),
  ('React Hooks in Depth', 'Mastering React Hooks with practical applications', 2187, 'https://images.pexels.com/photos/11035478/pexels-photo-11035478.jpeg', 'https://example.com/videos/react-hooks.mp4', NULL, 2154),
  ('Full-Stack Development with MERN', 'Building a complete application with MongoDB, Express, React and Node.js', 3576, 'https://images.pexels.com/photos/11035388/pexels-photo-11035388.jpeg', 'https://example.com/videos/mern-stack.mp4', NULL, 1876),
  ('Understanding Redux', 'Deep dive into Redux state management', 1943, 'https://images.pexels.com/photos/11035480/pexels-photo-11035480.jpeg', 'https://example.com/videos/redux-guide.mp4', NULL, 1054),
  ('Next.js for Server-Side Rendering', 'Using Next.js for powerful React applications', 2367, 'https://images.pexels.com/photos/11035390/pexels-photo-11035390.jpeg', 'https://example.com/videos/nextjs-ssr.mp4', NULL, 1432);