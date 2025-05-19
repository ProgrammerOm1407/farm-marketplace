export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_type: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          bio: string | null
          website: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_type: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          bio?: string | null
          website?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_type?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          bio?: string | null
          website?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
