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
      activity_posts: {
        Row: {
          author_friend_id: string | null
          body_he: string
          created_at: string
          destination_id: string | null
          id: string
          kind: string
          payload: Json
          reply_count: number
        }
        Insert: {
          author_friend_id?: string | null
          body_he: string
          created_at?: string
          destination_id?: string | null
          id: string
          kind: string
          payload?: Json
          reply_count?: number
        }
        Update: {
          author_friend_id?: string | null
          body_he?: string
          created_at?: string
          destination_id?: string | null
          id?: string
          kind?: string
          payload?: Json
          reply_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_posts_author_friend_id_fkey"
            columns: ["author_friend_id"]
            isOneToOne: false
            referencedRelation: "friend_overlaps"
            referencedColumns: ["id"]
          },
        ]
      }
      app_state: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      dm_messages: {
        Row: {
          body: string
          created_at: string
          dm_thread_id: string
          from_friend: boolean
          id: string
        }
        Insert: {
          body: string
          created_at?: string
          dm_thread_id: string
          from_friend: boolean
          id?: string
        }
        Update: {
          body?: string
          created_at?: string
          dm_thread_id?: string
          from_friend?: boolean
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_messages_dm_thread_id_fkey"
            columns: ["dm_thread_id"]
            isOneToOne: false
            referencedRelation: "dm_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_threads: {
        Row: {
          friend_id: string
          id: string
          last_message_at: string
          last_message_preview_he: string
          unread_count: number
        }
        Insert: {
          friend_id: string
          id: string
          last_message_at?: string
          last_message_preview_he?: string
          unread_count?: number
        }
        Update: {
          friend_id?: string
          id?: string
          last_message_at?: string
          last_message_preview_he?: string
          unread_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "dm_threads_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: true
            referencedRelation: "friend_overlaps"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_thread_replies: {
        Row: {
          author_friend_id: string | null
          body: string
          created_at: string
          id: string
          thread_id: string
        }
        Insert: {
          author_friend_id?: string | null
          body: string
          created_at?: string
          id?: string
          thread_id: string
        }
        Update: {
          author_friend_id?: string | null
          body?: string
          created_at?: string
          id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_thread_replies_author_friend_id_fkey"
            columns: ["author_friend_id"]
            isOneToOne: false
            referencedRelation: "friend_overlaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_thread_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_friend_id: string | null
          body: string
          created_at: string
          follow_count: number
          forum_id: string
          id: string
          pinned: boolean
          reply_count: number
          subject: Database["public"]["Enums"]["forum_subject"]
          title: string
        }
        Insert: {
          author_friend_id?: string | null
          body: string
          created_at?: string
          follow_count?: number
          forum_id: string
          id: string
          pinned?: boolean
          reply_count?: number
          subject?: Database["public"]["Enums"]["forum_subject"]
          title: string
        }
        Update: {
          author_friend_id?: string | null
          body?: string
          created_at?: string
          follow_count?: number
          forum_id?: string
          id?: string
          pinned?: boolean
          reply_count?: number
          subject?: Database["public"]["Enums"]["forum_subject"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_author_friend_id_fkey"
            columns: ["author_friend_id"]
            isOneToOne: false
            referencedRelation: "friend_overlaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_threads_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "forums"
            referencedColumns: ["id"]
          },
        ]
      }
      forums: {
        Row: {
          city_label: string | null
          created_at: string
          destination_id: string | null
          hero_blurb_he: string
          id: string
          is_recommended: boolean
          kind: string
          last_activity_at: string
          member_count: number
          name_en: string
          name_he: string
          slug: string
          subject: Database["public"]["Enums"]["forum_subject"] | null
        }
        Insert: {
          city_label?: string | null
          created_at?: string
          destination_id?: string | null
          hero_blurb_he: string
          id: string
          is_recommended?: boolean
          kind: string
          last_activity_at?: string
          member_count?: number
          name_en: string
          name_he: string
          slug: string
          subject?: Database["public"]["Enums"]["forum_subject"] | null
        }
        Update: {
          city_label?: string | null
          created_at?: string
          destination_id?: string | null
          hero_blurb_he?: string
          id?: string
          is_recommended?: boolean
          kind?: string
          last_activity_at?: string
          member_count?: number
          name_en?: string
          name_he?: string
          slug?: string
          subject?: Database["public"]["Enums"]["forum_subject"] | null
        }
        Relationships: []
      }
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
          past_trips: Json
          photo_url: string
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
          past_trips?: Json
          photo_url: string
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
          past_trips?: Json
          photo_url?: string
          status?: string
          zone_label?: string
        }
        Relationships: []
      }
      group_chat_members: {
        Row: {
          chat_id: string
          friend_id: string
          joined_at: string
        }
        Insert: {
          chat_id: string
          friend_id: string
          joined_at?: string
        }
        Update: {
          chat_id?: string
          friend_id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_chat_members_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_chat_members_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "friend_overlaps"
            referencedColumns: ["id"]
          },
        ]
      }
      group_chats: {
        Row: {
          city_label: string | null
          created_at: string
          destination_id: string | null
          id: string
          last_message_at: string
          name_he: string
        }
        Insert: {
          city_label?: string | null
          created_at?: string
          destination_id?: string | null
          id: string
          last_message_at?: string
          name_he: string
        }
        Update: {
          city_label?: string | null
          created_at?: string
          destination_id?: string | null
          id?: string
          last_message_at?: string
          name_he?: string
        }
        Relationships: []
      }
      group_messages: {
        Row: {
          author_friend_id: string | null
          body: string
          chat_id: string
          created_at: string
          id: string
        }
        Insert: {
          author_friend_id?: string | null
          body: string
          chat_id: string
          created_at?: string
          id?: string
        }
        Update: {
          author_friend_id?: string | null
          body?: string
          chat_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_author_friend_id_fkey"
            columns: ["author_friend_id"]
            isOneToOne: false
            referencedRelation: "friend_overlaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      place_reviews: {
        Row: {
          created_at: string
          id: number
          place_id: string
          rating: number
          reviewer_friend_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          place_id: string
          rating: number
          reviewer_friend_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          place_id?: string
          rating?: number
          reviewer_friend_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_reviews_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "place_reviews_reviewer_friend_id_fkey"
            columns: ["reviewer_friend_id"]
            isOneToOne: false
            referencedRelation: "friend_overlaps"
            referencedColumns: ["id"]
          },
        ]
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
          image_url: string | null
          lat: number
          lng: number
          paid_placement: boolean
          phone: string | null
          rating: number
          reservation_url: string | null
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
          image_url?: string | null
          lat: number
          lng: number
          paid_placement?: boolean
          phone?: string | null
          rating: number
          reservation_url?: string | null
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
          image_url?: string | null
          lat?: number
          lng?: number
          paid_placement?: boolean
          phone?: string | null
          rating?: number
          reservation_url?: string | null
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
      reactions: {
        Row: {
          actor_friend_id: string | null
          created_at: string
          emoji: string
          id: string
          target_id: string
          target_type: string
        }
        Insert: {
          actor_friend_id?: string | null
          created_at?: string
          emoji: string
          id?: string
          target_id: string
          target_type: string
        }
        Update: {
          actor_friend_id?: string | null
          created_at?: string
          emoji?: string
          id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_actor_friend_id_fkey"
            columns: ["actor_friend_id"]
            isOneToOne: false
            referencedRelation: "friend_overlaps"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_replies: {
        Row: {
          author_initial: string
          author_name: string
          body: string
          created_at: string
          id: string
          thread_id: string
        }
        Insert: {
          author_initial: string
          author_name: string
          body: string
          created_at?: string
          id?: string
          thread_id: string
        }
        Update: {
          author_initial?: string
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          author_initial: string
          author_name: string
          body: string
          city_label: string | null
          created_at: string
          destination_id: string | null
          follow_count: number
          friend_id: string | null
          id: string
          kind: string
          reply_count: number
          title: string
          trip_season: string | null
          trip_year: number | null
        }
        Insert: {
          author_initial: string
          author_name: string
          body: string
          city_label?: string | null
          created_at?: string
          destination_id?: string | null
          follow_count?: number
          friend_id?: string | null
          id: string
          kind: string
          reply_count?: number
          title: string
          trip_season?: string | null
          trip_year?: number | null
        }
        Update: {
          author_initial?: string
          author_name?: string
          body?: string
          city_label?: string | null
          created_at?: string
          destination_id?: string | null
          follow_count?: number
          friend_id?: string | null
          id?: string
          kind?: string
          reply_count?: number
          title?: string
          trip_season?: string | null
          trip_year?: number | null
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
      forum_subject:
        | "kosher_chabad"
        | "parties"
        | "treks_activities"
        | "restaurants"
        | "meetups"
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
      forum_subject: [
        "kosher_chabad",
        "parties",
        "treks_activities",
        "restaurants",
        "meetups",
      ],
    },
  },
} as const
