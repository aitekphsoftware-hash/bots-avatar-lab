-- Function to create anonymous user session (fixed)
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
  device_blocked BOOLEAN;
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
  SELECT total_accounts_created, is_blocked INTO accounts_count, device_blocked
  FROM public.device_fingerprints
  WHERE id = fingerprint_id;
  
  -- Block if too many accounts (more than 3)
  IF accounts_count >= 3 OR device_blocked THEN
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