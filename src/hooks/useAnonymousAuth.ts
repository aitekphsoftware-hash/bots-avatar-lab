import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateDeviceFingerprint, generateSessionId, STORAGE_KEYS } from '@/lib/device-fingerprint';

interface AnonymousSession {
  id: string;
  sessionId: string;
  totalTokens: number;
  usedTokens: number;
  remainingTokens: number;
}

export const useAnonymousAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anonymousSession, setAnonymousSession] = useState<AnonymousSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing anonymous session
  const checkExistingSession = async () => {
    const storedSessionId = localStorage.getItem(STORAGE_KEYS.ANONYMOUS_SESSION);
    const storedUserId = localStorage.getItem(STORAGE_KEYS.ANONYMOUS_USER_ID);

    if (storedSessionId && storedUserId) {
      try {
        // Use raw SQL query since the table isn't in the generated types yet
        const { data, error } = await supabase
          .rpc('get_anonymous_session', {
            session_id_param: storedSessionId,
            user_id_param: storedUserId
          });

        if (data && !error) {
          const sessionData = Array.isArray(data) ? data[0] : data;
          if (sessionData) {
            setAnonymousSession({
              id: sessionData.id,
              sessionId: sessionData.session_id,
              totalTokens: sessionData.total_tokens,
              usedTokens: sessionData.used_tokens,
              remainingTokens: sessionData.remaining_tokens
            });
            setIsAuthenticated(true);
            setLoading(false);
            return true;
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      }
    }

    return false;
  };

  // Create new anonymous session
  const createAnonymousSession = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      const fingerprint = generateDeviceFingerprint();
      const sessionId = generateSessionId();

      // Store device fingerprint
      localStorage.setItem(STORAGE_KEYS.DEVICE_FINGERPRINT, JSON.stringify(fingerprint));

      // Call Supabase function to create anonymous session
      const { data, error } = await supabase.rpc('create_anonymous_session', {
        fingerprint_hash_param: fingerprint.hash,
        session_id_param: sessionId,
        user_agent_param: fingerprint.userAgent,
        screen_resolution_param: fingerprint.screenResolution,
        timezone_param: fingerprint.timezone,
        language_param: fingerprint.language,
        platform_param: fingerprint.platform
      });

      if (error) {
        throw error;
      }

      // Get the created session details using the returned ID
      const { data: sessionData, error: sessionError } = await supabase
        .rpc('get_anonymous_session_by_id', {
          user_id_param: data
        });

      if (sessionError) {
        throw sessionError;
      }

      const session = Array.isArray(sessionData) ? sessionData[0] : sessionData;

      // Store session data
      localStorage.setItem(STORAGE_KEYS.ANONYMOUS_SESSION, sessionId);
      localStorage.setItem(STORAGE_KEYS.ANONYMOUS_USER_ID, data);

      const anonymousSessionData = {
        id: session.id,
        sessionId: session.session_id,
        totalTokens: session.total_tokens,
        usedTokens: session.used_tokens,
        remainingTokens: session.remaining_tokens
      };

      setAnonymousSession(anonymousSessionData);
      setIsAuthenticated(true);
      setLoading(false);

      toast({
        title: "Welcome!",
        description: `You have ${anonymousSessionData.remainingTokens} free tokens to get started.`,
      });

      return true;

    } catch (error: any) {
      console.error('Error creating anonymous session:', error);
      
      if (error.message.includes('Device blocked')) {
        toast({
          title: "Access Restricted",
          description: "This device has reached the maximum number of free accounts. Please sign up for a full account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Session Error",
          description: "Failed to create anonymous session. Please try again.",
          variant: "destructive",
        });
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Start guest session
  const startGuestSession = async () => {
    const hasExisting = await checkExistingSession();
    
    if (!hasExisting) {
      await createAnonymousSession();
    }
    
    setLoading(false);
  };

  // Consume tokens for anonymous user
  const consumeTokens = async (amount: number, activity: string): Promise<boolean> => {
    if (!anonymousSession) return false;

    try {
      const { data, error } = await supabase.rpc('consume_anonymous_tokens', {
        user_id_param: anonymousSession.id,
        tokens_param: amount,
        activity_param: activity
      });

      if (error) throw error;

      // Update local session state
      setAnonymousSession(prev => prev ? {
        ...prev,
        usedTokens: prev.usedTokens + amount,
        remainingTokens: prev.remainingTokens - amount
      } : null);

      return true;

    } catch (error) {
      console.error('Error consuming tokens:', error);
      return false;
    }
  };

  // Clear anonymous session
  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEYS.ANONYMOUS_SESSION);
    localStorage.removeItem(STORAGE_KEYS.ANONYMOUS_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.DEVICE_FINGERPRINT);
    setAnonymousSession(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkExistingSession().then((hasSession) => {
      if (!hasSession) {
        setLoading(false);
      }
    });
  }, []);

  return {
    isAuthenticated,
    anonymousSession,
    loading,
    startGuestSession,
    consumeTokens,
    clearSession
  };
};