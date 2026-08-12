export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ad_slot_floors: {
        Row: {
          created_at: string | null
          floor_price_cents: number
          slot_id: string
        }
        Insert: {
          created_at?: string | null
          floor_price_cents: number
          slot_id: string
        }
        Update: {
          created_at?: string | null
          floor_price_cents?: number
          slot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_slot_floors_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: true
            referencedRelation: "ad_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_slots: {
        Row: {
          air_date: string
          auto_accept_highest_bid: boolean
          created_at: string | null
          deadline: string
          episode_title: string | null
          id: string
          podcaster_id: string
          price_cents: number
          slot_length_seconds: number
          status: string
        }
        Insert: {
          air_date: string
          auto_accept_highest_bid?: boolean
          created_at?: string | null
          deadline: string
          episode_title?: string | null
          id?: string
          podcaster_id: string
          price_cents: number
          slot_length_seconds: number
          status?: string
        }
        Update: {
          air_date?: string
          auto_accept_highest_bid?: boolean
          created_at?: string | null
          deadline?: string
          episode_title?: string | null
          id?: string
          podcaster_id?: string
          price_cents?: number
          slot_length_seconds?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_slots_podcaster_id_fkey"
            columns: ["podcaster_id"]
            isOneToOne: false
            referencedRelation: "podcaster_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_submissions: {
        Row: {
          advertiser_id: string
          bid_amount_cents: number
          created_at: string | null
          generated_audio_url: string | null
          id: string
          rejection_reason: string | null
          script_text: string
          slot_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          advertiser_id: string
          bid_amount_cents: number
          created_at?: string | null
          generated_audio_url?: string | null
          id?: string
          rejection_reason?: string | null
          script_text: string
          slot_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          advertiser_id?: string
          bid_amount_cents?: number
          created_at?: string | null
          generated_audio_url?: string | null
          id?: string
          rejection_reason?: string | null
          script_text?: string
          slot_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_submissions_advertiser_id_fkey"
            columns: ["advertiser_id"]
            isOneToOne: false
            referencedRelation: "advertiser_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_submissions_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "ad_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      advertiser_profiles: {
        Row: {
          company_name: string
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          company_name: string
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          company_name?: string
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      podcaster_profiles: {
        Row: {
          ad_categories_blocked: string[] | null
          avg_downloads: number | null
          category: string | null
          downloads_screenshot_path: string | null
          downloads_verification_status: string
          downloads_verified_value: number | null
          id: string
          rss_feed_url: string | null
          show_name: string
          stripe_connect_account_id: string | null
        }
        Insert: {
          ad_categories_blocked?: string[] | null
          avg_downloads?: number | null
          category?: string | null
          downloads_screenshot_path?: string | null
          downloads_verification_status?: string
          downloads_verified_value?: number | null
          id: string
          rss_feed_url?: string | null
          show_name: string
          stripe_connect_account_id?: string | null
        }
        Update: {
          ad_categories_blocked?: string[] | null
          avg_downloads?: number | null
          category?: string | null
          downloads_screenshot_path?: string | null
          downloads_verification_status?: string
          downloads_verified_value?: number | null
          id?: string
          rss_feed_url?: string | null
          show_name?: string
          stripe_connect_account_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "podcaster_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id: string
          role: string
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_cents: number
          created_at: string | null
          id: string
          platform_fee_cents: number
          status: string | null
          stripe_payment_intent_id: string | null
          submission_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string | null
          id?: string
          platform_fee_cents: number
          status?: string | null
          stripe_payment_intent_id?: string | null
          submission_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string | null
          id?: string
          platform_fee_cents?: number
          status?: string | null
          stripe_payment_intent_id?: string | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "ad_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_profiles: {
        Row: {
          consent_signed_at: string | null
          created_at: string | null
          elevenlabs_voice_id: string
          id: string
          podcaster_id: string
          sample_audio_urls: string[] | null
          status: string | null
        }
        Insert: {
          consent_signed_at?: string | null
          created_at?: string | null
          elevenlabs_voice_id: string
          id?: string
          podcaster_id: string
          sample_audio_urls?: string[] | null
          status?: string | null
        }
        Update: {
          consent_signed_at?: string | null
          created_at?: string | null
          elevenlabs_voice_id?: string
          id?: string
          podcaster_id?: string
          sample_audio_urls?: string[] | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_profiles_podcaster_id_fkey"
            columns: ["podcaster_id"]
            isOneToOne: false
            referencedRelation: "podcaster_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_signups: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string
          show_or_company_name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          role: string
          show_or_company_name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string
          show_or_company_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _apply_accept: {
        Args: { target_slot_id: string; target_submission_id: string }
        Returns: undefined
      }
      accept_submission: {
        Args: { target_submission_id: string }
        Returns: undefined
      }
      advertiser_submitted_to_slot: {
        Args: { target_slot_id: string }
        Returns: boolean
      }
      auto_accept_expired_slots: { Args: never; Returns: undefined }
      is_bid_below_floor: {
        Args: { bid_cents: number; target_slot_id: string }
        Returns: boolean
      }
      is_podcaster_of_slot: {
        Args: { target_slot_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
