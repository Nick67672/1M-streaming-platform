export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          duration: number
          thumbnail_url: string
          video_url: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          duration: number
          thumbnail_url: string
          video_url: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          duration?: number
          thumbnail_url?: string
          video_url?: string
          user_id?: string
        }
      }
      comments: {
        Row: {
          id: string
          created_at: string
          content: string
          user_id: string
          video_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          user_id: string
          video_id: string
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          user_id?: string
          video_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string
          avatar_url: string
          join_date: string
        }
        Insert: {
          id: string
          updated_at?: string
          username: string
          avatar_url?: string
          join_date?: string
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string
          avatar_url?: string
          join_date?: string
        }
      }
    }
  }
}