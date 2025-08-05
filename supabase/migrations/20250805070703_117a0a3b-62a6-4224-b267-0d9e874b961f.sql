-- Create table for storing D-ID avatars as backup
CREATE TABLE public.did_avatars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  did_avatar_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  gender TEXT,
  style TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing D-ID voices as backup
CREATE TABLE public.did_voices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  voice_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  gender TEXT,
  language TEXT,
  provider TEXT,
  preview_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for device tracking
CREATE TABLE public.device_fingerprints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint_hash TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  screen_resolution TEXT,
  timezone TEXT,
  language TEXT,
  platform TEXT,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_accounts_created INTEGER NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT false
);

-- Create table for anonymous users
CREATE TABLE public.anonymous_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_fingerprint_id UUID NOT NULL REFERENCES public.device_fingerprints(id),
  session_id TEXT NOT NULL UNIQUE,
  total_tokens INTEGER NOT NULL DEFAULT 500,
  used_tokens INTEGER NOT NULL DEFAULT 0,
  remaining_tokens INTEGER GENERATED ALWAYS AS (total_tokens - used_tokens) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.did_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.did_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_users ENABLE ROW LEVEL SECURITY;

-- RLS policies for did_avatars (public read)
CREATE POLICY "Anyone can view active avatars" 
ON public.did_avatars 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage avatars" 
ON public.did_avatars 
FOR ALL 
USING (auth.role() = 'authenticated');

-- RLS policies for did_voices (public read)
CREATE POLICY "Anyone can view active voices" 
ON public.did_voices 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage voices" 
ON public.did_voices 
FOR ALL 
USING (auth.role() = 'authenticated');

-- RLS policies for device_fingerprints
CREATE POLICY "Users can view their own device fingerprint" 
ON public.device_fingerprints 
FOR SELECT 
USING (true); -- Allow reading for anonymous users

CREATE POLICY "Anyone can insert device fingerprints" 
ON public.device_fingerprints 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update device fingerprints" 
ON public.device_fingerprints 
FOR UPDATE 
USING (true);

-- RLS policies for anonymous_users
CREATE POLICY "Anonymous users can view their own data" 
ON public.anonymous_users 
FOR SELECT 
USING (true);

CREATE POLICY "Anonymous users can insert their own data" 
ON public.anonymous_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anonymous users can update their own data" 
ON public.anonymous_users 
FOR UPDATE 
USING (true);

-- Create triggers for timestamp updates
CREATE TRIGGER update_did_avatars_updated_at
BEFORE UPDATE ON public.did_avatars
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_did_voices_updated_at
BEFORE UPDATE ON public.did_voices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_anonymous_users_updated_at
BEFORE UPDATE ON public.anonymous_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create or get device fingerprint
CREATE OR REPLACE FUNCTION public.get_or_create_device_fingerprint(
  fingerprint_hash_param TEXT,
  user_agent_param TEXT DEFAULT NULL,
  screen_resolution_param TEXT DEFAULT NULL,
  timezone_param TEXT DEFAULT NULL,
  language_param TEXT DEFAULT NULL,
  platform_param TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  fingerprint_id UUID;
BEGIN
  -- Try to get existing fingerprint
  SELECT id INTO fingerprint_id
  FROM public.device_fingerprints
  WHERE fingerprint_hash = fingerprint_hash_param;
  
  IF fingerprint_id IS NULL THEN
    -- Create new fingerprint
    INSERT INTO public.device_fingerprints (
      fingerprint_hash,
      user_agent,
      screen_resolution,
      timezone,
      language,
      platform
    ) VALUES (
      fingerprint_hash_param,
      user_agent_param,
      screen_resolution_param,
      timezone_param,
      language_param,
      platform_param
    ) RETURNING id INTO fingerprint_id;
  ELSE
    -- Update last seen
    UPDATE public.device_fingerprints 
    SET last_seen = now()
    WHERE id = fingerprint_id;
  END IF;
  
  RETURN fingerprint_id;
END;
$$;

-- Function to create anonymous user session
CREATE OR REPLACE FUNCTION public.create_anonymous_session(
  fingerprint_hash_param TEXT,
  session_id_param TEXT,
  user_agent_param TEXT DEFAULT NULL,
  screen_resolution_param TEXT DEFAULT NULL,
  timezone_param TEXT DEFAULT NULL,
  language_param TEXT DEFAULT NULL,
  platform_param TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  fingerprint_id UUID;
  anonymous_user_id UUID;
  accounts_count INTEGER;
BEGIN
  -- Get or create device fingerprint
  fingerprint_id := public.get_or_create_device_fingerprint(
    fingerprint_hash_param,
    user_agent_param,
    screen_resolution_param,
    timezone_param,
    language_param,
    platform_param
  );
  
  -- Check if device is blocked or has too many accounts
  SELECT total_accounts_created, is_blocked INTO accounts_count, is_blocked
  FROM public.device_fingerprints
  WHERE id = fingerprint_id;
  
  -- Block if too many accounts (more than 3)
  IF accounts_count >= 3 THEN
    UPDATE public.device_fingerprints 
    SET is_blocked = true 
    WHERE id = fingerprint_id;
    
    RAISE EXCEPTION 'Device blocked due to excessive account creation';
  END IF;
  
  -- Create anonymous user session
  INSERT INTO public.anonymous_users (
    device_fingerprint_id,
    session_id,
    total_tokens,
    used_tokens
  ) VALUES (
    fingerprint_id,
    session_id_param,
    CASE 
      WHEN accounts_count = 0 THEN 500  -- First time: 500 tokens
      WHEN accounts_count = 1 THEN 250  -- Second time: 250 tokens  
      ELSE 100                          -- Third time: 100 tokens
    END,
    0
  ) RETURNING id INTO anonymous_user_id;
  
  -- Increment account count
  UPDATE public.device_fingerprints 
  SET total_accounts_created = total_accounts_created + 1
  WHERE id = fingerprint_id;
  
  RETURN anonymous_user_id;
END;
$$;