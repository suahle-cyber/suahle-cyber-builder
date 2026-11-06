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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          alias: string
          company: string | null
          created_at: string
          id: string
          is_example: boolean
          memo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alias: string
          company?: string | null
          created_at?: string
          id?: string
          is_example?: boolean
          memo?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          alias?: string
          company?: string | null
          created_at?: string
          id?: string
          is_example?: boolean
          memo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      followups: {
        Row: {
          contacted_on: string | null
          created_at: string
          customer_id: string
          evidence_signal_id: string | null
          hypothesis_id: string
          id: string
          is_example: boolean
          notified_at: string | null
          question: string
          question_edited: boolean
          recommended_on: string
          skipped_reason: string | null
          status: string
          updated_at: string
          user_id: string
          within_7_days: boolean | null
        }
        Insert: {
          contacted_on?: string | null
          created_at?: string
          customer_id: string
          evidence_signal_id?: string | null
          hypothesis_id: string
          id?: string
          is_example?: boolean
          notified_at?: string | null
          question: string
          question_edited?: boolean
          recommended_on?: string
          skipped_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          within_7_days?: boolean | null
        }
        Update: {
          contacted_on?: string | null
          created_at?: string
          customer_id?: string
          evidence_signal_id?: string | null
          hypothesis_id?: string
          id?: string
          is_example?: boolean
          notified_at?: string | null
          question?: string
          question_edited?: boolean
          recommended_on?: string
          skipped_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          within_7_days?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "followups_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followups_evidence_signal_id_fkey"
            columns: ["evidence_signal_id"]
            isOneToOne: false
            referencedRelation: "signals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followups_hypothesis_id_fkey"
            columns: ["hypothesis_id"]
            isOneToOne: false
            referencedRelation: "hypotheses"
            referencedColumns: ["id"]
          },
        ]
      }
      hypotheses: {
        Row: {
          created_at: string
          evidence_state: string
          id: string
          is_example: boolean
          statement: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          evidence_state?: string
          id?: string
          is_example?: boolean
          statement: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          evidence_state?: string
          id?: string
          is_example?: boolean
          statement?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          analysis_status: string
          analyzed_at: string | null
          body: string
          created_at: string
          customer_id: string
          id: string
          interview_date: string
          is_example: boolean
          source: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_status?: string
          analyzed_at?: string | null
          body: string
          created_at?: string
          customer_id: string
          id?: string
          interview_date?: string
          is_example?: boolean
          source?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          analysis_status?: string
          analyzed_at?: string | null
          body?: string
          created_at?: string
          customer_id?: string
          id?: string
          interview_date?: string
          is_example?: boolean
          source?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      signals: {
        Row: {
          created_at: string
          hypothesis_id: string | null
          id: string
          interview_id: string
          is_example: boolean
          kind: string
          quote: string
          summary: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hypothesis_id?: string | null
          id?: string
          interview_id: string
          is_example?: boolean
          kind: string
          quote: string
          summary: string
          user_id?: string
        }
        Update: {
          created_at?: string
          hypothesis_id?: string | null
          id?: string
          interview_id?: string
          is_example?: boolean
          kind?: string
          quote?: string
          summary?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signals_hypothesis_id_fkey"
            columns: ["hypothesis_id"]
            isOneToOne: false
            referencedRelation: "hypotheses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      kst_today: { Args: never; Returns: string }
      seed_example_data: { Args: never; Returns: undefined }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
