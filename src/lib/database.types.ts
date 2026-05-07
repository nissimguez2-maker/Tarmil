export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_state: {
        Row: { key: string; updated_at: string; value: Json }
        Insert: { key: string; updated_at?: string; value: Json }
        Update: { key?: string; updated_at?: string; value?: Json }
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
          photo_url?: string
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
      trip_waypoints: {
        Row: { id: string; kind: string; lat: number; lng: number; order_index: number }
        Insert: { id: string; kind: string; lat: number; lng: number; order_index: number }
        Update: { id?: string; kind?: string; lat?: number; lng?: number; order_index?: number }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { reset_demo_state: { Args: never; Returns: undefined } }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
