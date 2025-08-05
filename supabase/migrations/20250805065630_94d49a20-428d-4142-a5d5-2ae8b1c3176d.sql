-- Create user_tokens table for tracking token usage
CREATE TABLE public.user_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_tokens INTEGER NOT NULL DEFAULT 500,
  used_tokens INTEGER NOT NULL DEFAULT 0,
  remaining_tokens INTEGER GENERATED ALWAYS AS (total_tokens - used_tokens) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for user_tokens
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_tokens
CREATE POLICY "Users can view their own tokens" 
ON public.user_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" 
ON public.user_tokens 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create token_usage_history table for tracking detailed usage
CREATE TABLE public.token_usage_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens_used INTEGER NOT NULL,
  activity_type TEXT NOT NULL,
  activity_description TEXT,
  cost_eur DECIMAL(10,4) DEFAULT 0.0000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for token_usage_history
ALTER TABLE public.token_usage_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for token_usage_history
CREATE POLICY "Users can view their own usage history" 
ON public.token_usage_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage history" 
ON public.token_usage_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_tokens_updated_at
  BEFORE UPDATE ON public.user_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to consume tokens and track usage
CREATE OR REPLACE FUNCTION public.consume_tokens(
  user_uuid UUID,
  tokens_to_consume INTEGER,
  activity_type TEXT,
  activity_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_tokens INTEGER;
  cost_calculation DECIMAL(10,4);
BEGIN
  -- Check if user is admin (unlimited tokens)
  IF public.is_admin(user_uuid) THEN
    -- Record usage for admin but don't deduct tokens
    INSERT INTO public.token_usage_history (user_id, tokens_used, activity_type, activity_description, cost_eur)
    VALUES (user_uuid, tokens_to_consume, activity_type, activity_description, 0.0000);
    RETURN true;
  END IF;
  
  -- Get current remaining tokens
  SELECT remaining_tokens INTO current_tokens 
  FROM public.user_tokens 
  WHERE user_id = user_uuid;
  
  -- Check if user has enough tokens
  IF current_tokens < tokens_to_consume THEN
    RETURN false;
  END IF;
  
  -- Calculate cost (€0.001 per token)
  cost_calculation := tokens_to_consume * 0.001;
  
  -- Update user tokens
  UPDATE public.user_tokens 
  SET used_tokens = used_tokens + tokens_to_consume
  WHERE user_id = user_uuid;
  
  -- Record usage history
  INSERT INTO public.token_usage_history (user_id, tokens_used, activity_type, activity_description, cost_eur)
  VALUES (user_uuid, tokens_to_consume, activity_type, activity_description, cost_calculation);
  
  RETURN true;
END;
$$;