// D-ID API integration for BotsRHere via Supabase Edge Functions
import { supabase } from "@/integrations/supabase/client";

export interface Avatar {
  id: string;
  name: string;
  image_url: string;
  gender: 'male' | 'female';
  age_group: 'adult' | 'young_adult' | 'senior';
  style: 'standard' | 'premium';
}

export interface VideoRequest {
  script: {
    type: 'text';
    subtitles?: boolean;
    input: string;
    provider?: {
      type: 'microsoft' | 'amazon';
      voice_id: string;
    };
  };
  config?: {
    fluent?: boolean;
    pad_audio?: number;
    stitch?: boolean;
  };
  source_url: string;
}

export interface VideoResponse {
  id: string;
  status: 'created' | 'done' | 'error' | 'started';
  result_url?: string;
  error?: string;
  created_at: string;
  modified_at: string;
}

export interface ClipsResponse {
  clips: Array<{
    id: string;
    object: string;
    created_at: string;
    modified_at: string;
    presenter_id: string;
    driver_id: string;
    script: {
      type: string;
      input: string;
    };
    config: {
      result_format: string;
    };
    status: string;
    result_url?: string;
  }>;
}

class DIDApi {
  constructor() {
    // API calls now go through Supabase Edge Functions for security
  }

  private async makeSecureRequest(functionName: string, options: any = {}) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, options);
      
      if (error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
  }

  // Get available avatars/presenters
  async getAvatars(): Promise<Avatar[]> {
    try {
      const response = await this.makeSecureRequest('d-id-avatars');
      // Transform the response to match our Avatar interface
      return response.presenters?.map((presenter: any) => {
        // Extract clean name from presenter_id
        const cleanName = this.extractAvatarName(presenter.presenter_id);
        return {
          id: presenter.presenter_id,
          name: cleanName,
          image_url: presenter.thumbnail_url || presenter.image_url,
          gender: presenter.gender || 'unknown',
          age_group: 'adult',
          style: presenter.type === 'premium' ? 'premium' : 'standard'
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching avatars:', error);
      return [];
    }
  }

  private extractAvatarName(presenterId: string): string {
    // Extract name from presenter ID patterns like "v2_public_Adam@36wCtvjdAi"
    const parts = presenterId.split('_');
    if (parts.length >= 3) {
      const namePart = parts[2].split('@')[0];
      // Handle names with descriptors like "Adam_BlackShirt_Library"
      const nameComponents = namePart.split('_');
      return nameComponents[0]; // Return just the first name
    }
    return presenterId;
  }

  // Create a new video with talking avatar
  async createTalk(request: VideoRequest): Promise<VideoResponse> {
    return this.makeSecureRequest('d-id-create-talk', {
      body: request,
    });
  }

  // Get video status - using old implementation for now
  async getTalkStatus(talkId: string): Promise<VideoResponse> {
    // This would need to be implemented as an edge function too
    throw new Error('getTalkStatus not implemented through edge functions yet');
  }

  // Create clips - using old implementation for now
  async createClip(clipData: {
    presenter_id: string;
    script: {
      type: 'text';
      input: string;
    };
    config?: {
      result_format?: 'mp4' | 'gif' | 'mov';
    };
  }) {
    // This would need to be implemented as an edge function too
    throw new Error('createClip not implemented through edge functions yet');
  }

  // Get clips - using old implementation for now
  async getClips(): Promise<ClipsResponse> {
    // This would need to be implemented as an edge function too
    throw new Error('getClips not implemented through edge functions yet');
  }

  // Get specific clip - using old implementation for now
  async getClip(clipId: string) {
    // This would need to be implemented as an edge function too
    throw new Error('getClip not implemented through edge functions yet');
  }

  // Upload image - using old implementation for now
  async uploadImage(imageFile: File): Promise<{ url: string }> {
    // This would need to be implemented as an edge function too
    throw new Error('uploadImage not implemented through edge functions yet');
  }

  // Create a new agent/presenter
  async createAgent(agentData: {
    name: string;
    source_url: string;
    driver_id?: string;
    gender?: 'male' | 'female';
    age?: 'young_adult' | 'adult' | 'senior';
  }) {
    return this.makeSecureRequest('d-id-create-agent', {
      body: {
        source_url: agentData.source_url,
        driver_id: agentData.driver_id || 'Vcq0R4a8F0',
        config: {
          result_format: 'mp4'
        }
      },
    });
  }

  // Get voices/voices endpoint
  async getVoices() {
    return this.makeSecureRequest('d-id-voices');
  }
}

export const didApi = new DIDApi();