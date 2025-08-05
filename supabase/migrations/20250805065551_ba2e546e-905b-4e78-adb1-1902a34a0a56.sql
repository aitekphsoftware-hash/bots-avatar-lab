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
  type TEXT NOT NULL DEFAULT 'info',
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

-- Create admin roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;

-- Function to get remaining tokens (returns -1 for unlimited/admin)
CREATE OR REPLACE FUNCTION public.get_user_remaining_tokens(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT CASE 
    WHEN public.is_admin(user_uuid) THEN -1
    ELSE COALESCE(
      (SELECT remaining_tokens FROM public.user_tokens WHERE user_id = user_uuid),
      0
    )
  END;
$$;

-- Update handle_new_user to create tokens and assign admin role for developer@botsrhere.com
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
  
  -- Insert initial tokens (500 free tokens for regular users)
  INSERT INTO public.user_tokens (user_id, total_tokens, used_tokens)
  VALUES (NEW.id, 500, 0);
  
  -- Assign admin role if it's the developer email
  IF NEW.email = 'developer@botsrhere.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
    
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.id,
      'Admin Access Granted',
      'Welcome! You have been granted administrator privileges with unlimited token usage.',
      'success'
    );
  ELSE
    -- Regular user role and welcome notification
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.id,
      'Welcome to BotsRHere!',
      'Your account has been created successfully. You have received 500 free tokens to get started with AI avatar creation and video generation.',
      'success'
    );
  END IF;
  
  RETURN NEW;
END;
$function$

-- Create trigger for updating timestamps
CREATE TRIGGER update_user_tokens_updated_at
BEFORE UPDATE ON public.user_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();