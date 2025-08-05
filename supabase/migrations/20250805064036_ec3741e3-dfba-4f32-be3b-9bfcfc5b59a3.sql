-- Create table for embedded preview URLs
CREATE TABLE public.preview_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.preview_urls ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Preview URLs are viewable by everyone"
  ON public.preview_urls
  FOR SELECT
  USING (is_active = true);

-- Create policy for authenticated users to manage URLs
CREATE POLICY "Authenticated users can manage preview URLs"
  ON public.preview_urls
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert initial URLs
INSERT INTO public.preview_urls (title, url, description) VALUES
  ('BotsRHere Main', 'https://botsrhere.aiteksoftware.site/', 'Main BotsRHere website'),
  ('Kiara Demo', 'https://botsrhere.aiteksoftware.site/kiara/', 'Kiara avatar demonstration');

-- Add trigger for updated_at
CREATE TRIGGER update_preview_urls_updated_at
  BEFORE UPDATE ON public.preview_urls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();