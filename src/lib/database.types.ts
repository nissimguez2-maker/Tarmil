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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      friend_overlaps: {
        Row: {
          destination_id: string | null
          detail: string
          friend_initial: string
          friend_name: string
          id: string
          lat: number
          lng: number
          overlap_end: string | null
          overlap_start: string | null
          status: string
          zone_label: string
        }
        Insert: {
          destination_id?: string | null
          detail: string
          friend_initial: string
          friend_name: string
          id: string
          lat: number
          lng: number
          overlap_end?: string | null
          overlap_start?: string | null
          status: string
          zone_label: string
        }
        Update: {
          destination_id?: string | null
          detail?: string
          friend_initial?: string
          friend_name?: string
          id?: string
          lat?: number
          lng?: number
          overlap_end?: string | null
          overlap_start?: string | null
          status?: string
          zone_label?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          category: string
          destination_id: string
          english_description: string
          english_name: string
          friend_visits: Json
          friends_know: number
          hebrew_description: string
          hebrew_name: string
          id: string
          lat: number
          lng: number
          rating: number
          tarmil_pick: boolean
        }
        Insert: {
          category: string
          destination_id: string
          english_description: string
          english_name: string
          friend_visits?: Json
          friends_know?: number
          hebrew_description: string
          hebrew_name: string
          id: string
          lat: number
          lng: number
          rating: number
          tarmil_pick?: boolean
        }
        Update: {
          category?: string
          destination_id?: string
          english_description?: string
          english_name?: string
          friend_visits?: Json
          friends_know?: number
          hebrew_description?: string
          hebrew_name?: string
          id?: string
          lat?: number
          lng?: number
          rating?: number
          tarmil_pick?: boolean
        }
        Relationships: []
      }
      planned_stops: {
        Row: {
          arrival_date: string
          departure_date: string
          friend_overlap_ids: string[]
          id: string
          lat: number
          lng: number
          name_en: string
          name_he: string
          nights: number
          note: string | null
          privacy: string
          saved_place_ids: string[]
          type: string
        }
        Insert: {
          arrival_date: string
          departure_date: string
          friend_overlap_ids?: string[]
          id: string
          lat: number
          lng: number
          name_en: string
          name_he: string
          nights: number
          note?: string | null
          privacy: string
          saved_place_ids?: string[]
          type: string
        }
        Update: {
          arrival_date?: string
          departure_date?: string
          friend_overlap_ids?: string[]
          id?: string
          lat?: number
          lng?: number
          name_en?: string
          name_he?: string
          nights?: number
          note?: string | null
          privacy?: string
          saved_place_ids?: string[]
          type?: string
        }
        Relationships: []
      }
      trip_waypoints: {
        Row: {
          id: string
          kind: string
          lat: number
          lng: number
          order_index: number
        }
        Insert: {
          id: string
          kind: string
          lat: number
          lng: number
          order_index: number
        }
        Update: {
          id?: string
          kind?: string
          lat?: number
          lng?: number
          order_index?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_demo_state: { Args: never; Returns: undefined }
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
