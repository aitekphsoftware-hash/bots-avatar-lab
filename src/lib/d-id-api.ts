// D-ID API integration for BotsRHere
const D_ID_BASE_URL = 'https://api.d-id.com';
const API_KEY = 'Y29kZXh4eGhvc3RAZ21haWwuY29t:259e8IoCoDHpSrJ_Qwe9n';

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
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = D_ID_BASE_URL;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  // Get available avatars/presenters
  async getAvatars(): Promise<Avatar[]> {
    try {
      const response = await this.makeRequest('/clips/presenters');
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
    return this.makeRequest('/talks', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get video status
  async getTalkStatus(talkId: string): Promise<VideoResponse> {
    return this.makeRequest(`/talks/${talkId}`);
  }

  // Create clips (premium feature)
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
    return this.makeRequest('/clips', {
      method: 'POST',
      body: JSON.stringify(clipData),
    });
  }

  // Get clips
  async getClips(): Promise<ClipsResponse> {
    return this.makeRequest('/clips');
  }

  // Get specific clip
  async getClip(clipId: string) {
    return this.makeRequest(`/clips/${clipId}`);
  }

  // Upload image for custom avatar
  async uploadImage(imageFile: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${this.baseUrl}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  // Create a new agent/presenter
  async createAgent(agentData: {
    name: string;
    source_url: string;
    driver_id?: string;
    gender?: 'male' | 'female';
    age?: 'young_adult' | 'adult' | 'senior';
  }) {
    return this.makeRequest('/clips/presenters', {
      method: 'POST',
      body: JSON.stringify({
        source_url: agentData.source_url,
        driver_id: agentData.driver_id || 'Vcq0R4a8F0',
        config: {
          result_format: 'mp4'
        }
      }),
    });
  }

  // Get voices/voices endpoint
  async getVoices() {
    return this.makeRequest('/voices');
  }
}

export const didApi = new DIDApi();