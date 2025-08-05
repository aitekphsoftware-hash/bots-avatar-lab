-- Create device fingerprints table
CREATE TABLE public.device_fingerprints (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    fingerprint_hash TEXT NOT NULL UNIQUE,
    user_agent TEXT,
    screen_resolution TEXT,
    timezone TEXT,
    language TEXT,
    platform TEXT,
    total_accounts_created INTEGER NOT NULL DEFAULT 0,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create anonymous users table
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

-- Enable RLS on both tables
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_users ENABLE ROW LEVEL SECURITY;

-- Create policies for device fingerprints (only functions can access)
CREATE POLICY "Only functions can access device fingerprints" 
ON public.device_fingerprints 
FOR ALL 
USING (false);

-- Create policies for anonymous users (only functions can access)
CREATE POLICY "Only functions can access anonymous users" 
ON public.anonymous_users 
FOR ALL 
USING (false);

-- Create the missing get_or_create_device_fingerprint function
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
SET search_path TO 'public'
AS $function$
DECLARE
    fingerprint_id UUID;
BEGIN
    -- Try to find existing fingerprint
    SELECT id INTO fingerprint_id
    FROM public.device_fingerprints
    WHERE fingerprint_hash = fingerprint_hash_param;
    
    -- If not found, create new one
    IF fingerprint_id IS NULL THEN
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
    END IF;
    
    RETURN fingerprint_id;
END;
$function$;

-- Create triggers for updated_at columns
CREATE TRIGGER update_device_fingerprints_updated_at
    BEFORE UPDATE ON public.device_fingerprints
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_anonymous_users_updated_at
    BEFORE UPDATE ON public.anonymous_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();