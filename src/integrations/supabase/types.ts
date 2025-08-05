export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      preview_urls: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      public_videos: {
        Row: {
          avatar_used: string | null
          category: string
          created_at: string
          description: string | null
          duration: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          script_used: string | null
          tags: string[] | null
          template_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          avatar_used?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          script_used?: string | null
          tags?: string[] | null
          template_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          avatar_used?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          script_used?: string | null
          tags?: string[] | null
          template_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_videos_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "video_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      token_usage_history: {
        Row: {
          activity_description: string | null
          activity_type: string
          cost_eur: number | null
          created_at: string
          id: string
          tokens_used: number
          user_id: string
        }
        Insert: {
          activity_description?: string | null
          activity_type: string
          cost_eur?: number | null
          created_at?: string
          id?: string
          tokens_used: number
          user_id: string
        }
        Update: {
          activity_description?: string | null
          activity_type?: string
          cost_eur?: number | null
          created_at?: string
          id?: string
          tokens_used?: number
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tokens: {
        Row: {
          created_at: string
          id: string
          remaining_tokens: number | null
          total_tokens: number
          updated_at: string
          used_tokens: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          remaining_tokens?: number | null
          total_tokens?: number
          updated_at?: string
          used_tokens?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          remaining_tokens?: number | null
          total_tokens?: number
          updated_at?: string
          used_tokens?: number
          user_id?: string
        }
        Relationships: []
      }
      video_templates: {
        Row: {
          background_type: string | null
          background_value: string | null
          category: string
          created_at: string
          description: string | null
          duration_estimate: number | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          name: string
          script_template: string
          style_preset: string | null
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          background_type?: string | null
          background_value?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration_estimate?: number | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name: string
          script_template: string
          style_preset?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          background_type?: string | null
          background_value?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration_estimate?: number | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name?: string
          script_template?: string
          style_preset?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_anonymous_tokens: {
        Args: {
          user_id_param: string
          tokens_param: number
          activity_param: string
        }
        Returns: boolean
      }
      consume_tokens: {
        Args: {
          user_uuid: string
          tokens_to_consume: number
          activity_type: string
          activity_description?: string
        }
        Returns: boolean
      }
      create_anonymous_session: {
        Args: {
          fingerprint_hash_param: string
          session_id_param: string
          user_agent_param?: string
          screen_resolution_param?: string
          timezone_param?: string
          language_param?: string
          platform_param?: string
        }
        Returns: string
      }
      get_anonymous_session: {
        Args: { session_id_param: string; user_id_param: string }
        Returns: {
          id: string
          session_id: string
          total_tokens: number
          used_tokens: number
          remaining_tokens: number
          created_at: string
        }[]
      }
      get_anonymous_session_by_id: {
        Args: { user_id_param: string }
        Returns: {
          id: string
          session_id: string
          total_tokens: number
          used_tokens: number
          remaining_tokens: number
          created_at: string
        }[]
      }
      get_did_avatars: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          did_avatar_id: string
          name: string
          gender: string
          style: string
          image_url: string
          thumbnail_url: string
          is_active: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_did_voices: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          voice_id: string
          name: string
          gender: string
          language: string
          provider: string
          preview_url: string
          is_active: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_user_remaining_tokens: {
        Args: { user_uuid: string }
        Returns: number
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      sync_did_data: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
