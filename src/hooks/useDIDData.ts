import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DIDAvatar {
  id: string;
  did_avatar_id: string;
  name: string;
  gender?: string;
  style?: string;
  image_url: string;
  thumbnail_url?: string;
  is_active: boolean;
}

export interface DIDVoice {
  id: string;
  voice_id: string;
  name: string;
  gender?: string;
  language?: string;
  provider?: string;
  preview_url?: string;
  is_active: boolean;
}

export const useDIDData = () => {
  const [avatars, setAvatars] = useState<DIDAvatar[]>([]);
  const [voices, setVoices] = useState<DIDVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Fetch avatars from Supabase (fallback first)
  const fetchAvatarsFromSupabase = async (): Promise<DIDAvatar[]> => {
    try {
      const { data, error } = await supabase.rpc('get_did_avatars');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching avatars from Supabase:', error);
      return [];
    }
  };

  // Fetch voices from Supabase (fallback first)
  const fetchVoicesFromSupabase = async (): Promise<DIDVoice[]> => {
    try {
      const { data, error } = await supabase.rpc('get_did_voices');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching voices from Supabase:', error);
      return [];
    }
  };

  // Sync D-ID data to Supabase
  const syncDIDData = async () => {
    try {
      console.log('Syncing D-ID data...');
      
      // Call the sync function on the server
      const { data, error } = await supabase.rpc('sync_did_data');
      
      if (error) {
        throw error;
      }
      
      setLastSyncTime(new Date().toISOString());
      console.log('D-ID data sync completed');

    } catch (error) {
      console.error('Error syncing D-ID data:', error);
    }
  };

  // Load data (try Supabase first, fall back to D-ID API if needed)
  const loadData = async () => {
    setLoading(true);
    
    try {
      // First, try to get data from Supabase
      const [supabaseAvatars, supabaseVoices] = await Promise.all([
        fetchAvatarsFromSupabase(),
        fetchVoicesFromSupabase()
      ]);

      // If we have data in Supabase, use it
      if (supabaseAvatars.length > 0) {
        setAvatars(supabaseAvatars);
      }
      
      if (supabaseVoices.length > 0) {
        setVoices(supabaseVoices);
      }

      // If no data in Supabase or data is old, sync from D-ID
      if (supabaseAvatars.length === 0 || supabaseVoices.length === 0) {
        await syncDIDData();
        
        // Refetch after sync
        const [newAvatars, newVoices] = await Promise.all([
          fetchAvatarsFromSupabase(),
          fetchVoicesFromSupabase()
        ]);
        
        setAvatars(newAvatars);
        setVoices(newVoices);
      }

    } catch (error) {
      console.error('Error loading D-ID data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if sync is needed (data older than 24 hours)
  const isSyncNeeded = (): boolean => {
    if (!lastSyncTime) return true;
    
    const lastSync = new Date(lastSyncTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff > 24;
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    avatars,
    voices,
    loading,
    lastSyncTime,
    syncDIDData,
    isSyncNeeded,
    refetch: loadData
  };
};