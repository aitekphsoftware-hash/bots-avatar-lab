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

-- Update handle_new_user to assign admin role for developer@botsrhere.com
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
$function$;