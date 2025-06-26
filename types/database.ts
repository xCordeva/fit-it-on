export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          trial_count: number
          plan: string
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          trial_count?: number
          plan?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          trial_count?: number
          plan?: string
          created_at?: string
        }
      }
      anon_trials: {
        Row: {
          id: string
          device_hash: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          device_hash: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          device_hash?: string
          image_url?: string
          created_at?: string
        }
      }
      fit_results: {
        Row: {
          id: string
          user_id: string
          input_url: string
          garment_url: string
          output_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          input_url: string
          garment_url: string
          output_url: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          input_url?: string
          garment_url?: string
          output_url?: string
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          payment_provider_id: string
          plan: string
          status: string
          renewal_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          payment_provider_id: string
          plan: string
          status: string
          renewal_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          payment_provider_id?: string
          plan?: string
          status?: string
          renewal_date?: string | null
          created_at?: string
        }
      }
    }
  }
}