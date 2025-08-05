-- Create video templates table for D-ID
CREATE TABLE public.video_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  thumbnail_url TEXT,
  script_template TEXT NOT NULL,
  background_type TEXT DEFAULT 'solid', -- solid, gradient, image
  background_value TEXT, -- color hex, gradient css, or image url
  style_preset TEXT DEFAULT 'professional', -- professional, casual, creative, minimal
  duration_estimate INTEGER DEFAULT 30, -- estimated duration in seconds
  tags TEXT[], -- array of tags for filtering
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create public videos table for sharing video examples
CREATE TABLE public.public_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'example',
  template_id UUID REFERENCES public.video_templates(id),
  avatar_used TEXT, -- D-ID avatar ID used
  script_used TEXT, -- Script that was used
  duration INTEGER, -- actual duration in seconds
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for video templates (publicly readable)
CREATE POLICY "Video templates are viewable by everyone" 
ON public.video_templates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can create templates" 
ON public.video_templates 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update templates" 
ON public.video_templates 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create policies for public videos (publicly readable)
CREATE POLICY "Public videos are viewable by everyone" 
ON public.public_videos 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can create public videos" 
ON public.public_videos 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update public videos" 
ON public.public_videos 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_video_templates_category ON public.video_templates(category);
CREATE INDEX idx_video_templates_tags ON public.video_templates USING GIN(tags);
CREATE INDEX idx_public_videos_category ON public.public_videos(category);
CREATE INDEX idx_public_videos_tags ON public.public_videos USING GIN(tags);
CREATE INDEX idx_public_videos_featured ON public.public_videos(is_featured) WHERE is_featured = true;

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_video_templates_updated_at
BEFORE UPDATE ON public.video_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_public_videos_updated_at
BEFORE UPDATE ON public.public_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample video templates
INSERT INTO public.video_templates (name, description, category, script_template, style_preset, tags) VALUES
('Business Introduction', 'Professional introduction template for business purposes', 'business', 'Hello, I''m {name} and I''m excited to introduce our company {company}. We specialize in {specialty} and have been serving clients for {years} years. Our mission is to {mission}. Thank you for your time!', 'professional', ARRAY['business', 'introduction', 'corporate']),

('Product Demo', 'Showcase your product features and benefits', 'marketing', 'Introducing {product_name} - the {description}. Key features include {feature1}, {feature2}, and {feature3}. With {product_name}, you can {benefit1} and {benefit2}. Try it today and see the difference!', 'professional', ARRAY['product', 'demo', 'marketing', 'sales']),

('Educational Explainer', 'Explain complex topics in simple terms', 'education', 'Today we''re going to learn about {topic}. {topic} is important because {importance}. Let me break this down into simple steps: First, {step1}. Second, {step2}. Finally, {step3}. Remember, {key_takeaway}.', 'casual', ARRAY['education', 'tutorial', 'explainer']),

('Event Announcement', 'Announce upcoming events and occasions', 'announcement', 'We''re thrilled to announce {event_name} happening on {date} at {location}. Join us for {description}. Highlights include {highlight1}, {highlight2}, and {highlight3}. Register now at {website} or call {phone}!', 'creative', ARRAY['event', 'announcement', 'invitation']),

('Welcome Message', 'Warm welcome for new customers or team members', 'welcome', 'Welcome to {organization}! We''re so glad you''re here. As a new {role}, you''ll be working with {team} on {projects}. Your first step is to {first_step}. If you have any questions, feel free to reach out to {contact}. Welcome aboard!', 'casual', ARRAY['welcome', 'onboarding', 'introduction']),

('News Update', 'Share important news and updates', 'news', 'Good {time_of_day}! Here''s your {frequency} update on {topic}. Today''s highlights: {news1}, {news2}, and {news3}. In other news, {additional_info}. That''s all for now. Stay tuned for more updates!', 'professional', ARRAY['news', 'update', 'information']),

('Sales Pitch', 'Compelling sales presentation template', 'sales', 'Are you struggling with {problem}? You''re not alone. {statistic} of people face this challenge. That''s why we created {solution}. With {solution}, you can {benefit1}, {benefit2}, and save {savings}. Don''t wait - {call_to_action}!', 'professional', ARRAY['sales', 'pitch', 'marketing', 'conversion']),

('Thank You Message', 'Express gratitude to customers or partners', 'gratitude', 'Thank you so much for {reason}. Your {action} means the world to us. Because of supporters like you, we''ve been able to {achievement}. We''re committed to {commitment} and look forward to {future_plans}. Thank you again!', 'casual', ARRAY['thanks', 'gratitude', 'appreciation']);

-- Insert sample public videos (these would be actual video URLs in production)
INSERT INTO public.public_videos (title, description, video_url, thumbnail_url, category, tags) VALUES
('Business Introduction Example', 'See how a professional business introduction looks', 'https://example.com/business-intro.mp4', 'https://example.com/business-intro-thumb.jpg', 'example', ARRAY['business', 'example', 'introduction']),

('Product Demo Example', 'Watch this product demonstration in action', 'https://example.com/product-demo.mp4', 'https://example.com/product-demo-thumb.jpg', 'example', ARRAY['product', 'demo', 'example']),

('Educational Video Example', 'Learn how to create educational content', 'https://example.com/education.mp4', 'https://example.com/education-thumb.jpg', 'example', ARRAY['education', 'tutorial', 'example']);