-- Helper functions for anonymous user system

-- Function to get anonymous session
CREATE OR REPLACE FUNCTION public.get_anonymous_session(
  session_id_param TEXT,
  user_id_param TEXT
)
RETURNS TABLE (
  id UUID,
  session_id TEXT,
  total_tokens INTEGER,
  used_tokens INTEGER,
  remaining_tokens INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.session_id,
    au.total_tokens,
    au.used_tokens,
    au.remaining_tokens,
    au.created_at
  FROM public.anonymous_users au
  WHERE au.session_id = session_id_param AND au.id::text = user_id_param;
END;
$$;

-- Function to get anonymous session by ID
CREATE OR REPLACE FUNCTION public.get_anonymous_session_by_id(
  user_id_param TEXT
)
RETURNS TABLE (
  id UUID,
  session_id TEXT,
  total_tokens INTEGER,
  used_tokens INTEGER,
  remaining_tokens INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.session_id,
    au.total_tokens,
    au.used_tokens,
    au.remaining_tokens,
    au.created_at
  FROM public.anonymous_users au
  WHERE au.id::text = user_id_param;
END;
$$;

-- Function to consume anonymous tokens
CREATE OR REPLACE FUNCTION public.consume_anonymous_tokens(
  user_id_param TEXT,
  tokens_param INTEGER,
  activity_param TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_tokens INTEGER;
BEGIN
  -- Get current remaining tokens
  SELECT remaining_tokens INTO current_tokens
  FROM public.anonymous_users
  WHERE id::text = user_id_param;
  
  -- Check if user has enough tokens
  IF current_tokens < tokens_param THEN
    RETURN false;
  END IF;
  
  -- Update tokens
  UPDATE public.anonymous_users
  SET used_tokens = used_tokens + tokens_param
  WHERE id::text = user_id_param;
  
  RETURN true;
END;
$$;

-- Function to get DID avatars
CREATE OR REPLACE FUNCTION public.get_did_avatars()
RETURNS TABLE (
  id UUID,
  did_avatar_id TEXT,
  name TEXT,
  gender TEXT,
  style TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    da.id,
    da.did_avatar_id,
    da.name,
    da.gender,
    da.style,
    da.image_url,
    da.thumbnail_url,
    da.is_active,
    da.created_at,
    da.updated_at
  FROM public.did_avatars da
  WHERE da.is_active = true
  ORDER BY da.name;
END;
$$;

-- Function to get DID voices
CREATE OR REPLACE FUNCTION public.get_did_voices()
RETURNS TABLE (
  id UUID,
  voice_id TEXT,
  name TEXT,
  gender TEXT,
  language TEXT,
  provider TEXT,
  preview_url TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dv.id,
    dv.voice_id,
    dv.name,
    dv.gender,
    dv.language,
    dv.provider,
    dv.preview_url,
    dv.is_active,
    dv.created_at,
    dv.updated_at
  FROM public.did_voices dv
  WHERE dv.is_active = true
  ORDER BY dv.name;
END;
$$;

-- Function to sync DID data (placeholder for now)
CREATE OR REPLACE FUNCTION public.sync_did_data()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avatar_count INTEGER;
  voice_count INTEGER;
BEGIN
  -- For now, just insert some sample data if tables are empty
  SELECT COUNT(*) INTO avatar_count FROM public.did_avatars WHERE is_active = true;
  SELECT COUNT(*) INTO voice_count FROM public.did_voices WHERE is_active = true;
  
  -- Insert sample avatars if none exist
  IF avatar_count = 0 THEN
    INSERT INTO public.did_avatars (did_avatar_id, name, gender, style, image_url, thumbnail_url) VALUES
    ('amy-jcu7bZhOLy', 'Amy', 'female', 'modern', 'https://create-images-results.d-id.com/DefaultPresenters/Amy/image.jpeg', 'https://create-images-results.d-id.com/DefaultPresenters/Amy/thumbnail.jpeg'),
    ('daniel-LnLF0TFM2b', 'Daniel', 'male', 'professional', 'https://create-images-results.d-id.com/DefaultPresenters/Daniel/image.jpeg', 'https://create-images-results.d-id.com/DefaultPresenters/Daniel/thumbnail.jpeg'),
    ('sarah-G8F3mK9pHd', 'Sarah', 'female', 'casual', 'https://create-images-results.d-id.com/DefaultPresenters/Sarah/image.jpeg', 'https://create-images-results.d-id.com/DefaultPresenters/Sarah/thumbnail.jpeg'),
    ('james-R2N7qL8vFt', 'James', 'male', 'business', 'https://create-images-results.d-id.com/DefaultPresenters/James/image.jpeg', 'https://create-images-results.d-id.com/DefaultPresenters/James/thumbnail.jpeg');
  END IF;
  
  -- Insert sample voices if none exist
  IF voice_count = 0 THEN
    INSERT INTO public.did_voices (voice_id, name, gender, language, provider) VALUES
    ('en-US-JennyNeural', 'Jenny (Neural)', 'female', 'en-US', 'microsoft'),
    ('en-US-GuyNeural', 'Guy (Neural)', 'male', 'en-US', 'microsoft'),
    ('en-US-AriaNeural', 'Aria (Neural)', 'female', 'en-US', 'microsoft'),
    ('en-GB-SoniaNeural', 'Sonia (Neural)', 'female', 'en-GB', 'microsoft'),
    ('en-GB-RyanNeural', 'Ryan (Neural)', 'male', 'en-GB', 'microsoft');
  END IF;
  
  RETURN true;
END;
$$;