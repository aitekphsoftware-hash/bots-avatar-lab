import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import Sidebar from "@/components/Sidebar";
import Avatars from "./Avatars";
import VideoStudio from "./VideoStudio";
import VideoTranslate from "./VideoTranslate";
import Agents from "./Agents";
import Home from "./Home";
import { MediaLibrary } from "./MediaLibrary";
import Auth from "./Auth";
import Terms from "./Terms";
import Privacy from "./Privacy";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated: isAnonymousAuth, loading: anonymousLoading } = useAnonymousAuth();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading while checking auth
  if (loading || anonymousLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route
        path="/*"
        element={
          user || isAnonymousAuth ? (
            <div className="min-h-screen flex bg-background">
              <Sidebar className="w-64 flex-shrink-0" />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/avatars" element={<Avatars />} />
                <Route path="/video-studio" element={<VideoStudio />} />
                <Route path="/video-translate" element={<VideoTranslate />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/media-library" element={<MediaLibrary />} />
              </Routes>
            </div>
          ) : (
            <Auth />
          )
        }
      />
    </Routes>
  );
};

export default Index;
