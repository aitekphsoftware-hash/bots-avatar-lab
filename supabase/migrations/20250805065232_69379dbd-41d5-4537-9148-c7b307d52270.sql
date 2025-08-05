-- Create tokens table for tracking user token consumption
CREATE TABLE public.user_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_tokens INTEGER NOT NULL DEFAULT 500,
  used_tokens INTEGER NOT NULL DEFAULT 0,
  remaining_tokens INTEGER GENERATED ALWAYS AS (total_tokens - used_tokens) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_tokens
CREATE POLICY "Users can view their own tokens" 
ON public.user_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own token usage" 
ON public.user_tokens 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert tokens for new users" 
ON public.user_tokens 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create token usage history table
CREATE TABLE public.token_usage_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_used TEXT NOT NULL,
  tokens_consumed INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.token_usage_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for token_usage_history
CREATE POLICY "Users can view their own token history" 
ON public.token_usage_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert token usage records" 
ON public.token_usage_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
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

CREATE POLICY "System can insert notifications for users" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update the handle_new_user function to create initial tokens
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  
  -- Insert initial tokens (500 free tokens)
  INSERT INTO public.user_tokens (user_id, total_tokens, used_tokens)
  VALUES (NEW.id, 500, 0);
  
  -- Insert welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'Welcome to BotsRHere!',
    'Your account has been created successfully. You have received 500 free tokens to get started with AI avatar creation and video generation.',
    'success'
  );
  
  RETURN NEW;
END;
$function$

-- Create trigger for updating timestamps
CREATE TRIGGER update_user_tokens_updated_at
BEFORE UPDATE ON public.user_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();