export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_briefings: {
        Row: {
          additional_info: string | null
          company_name: string | null
          contact_info: string | null
          conversation_log: Json | null
          created_at: string | null
          description: string | null
          design_preferences: string | null
          differentials: string | null
          evaluation_comment: string | null
          historico_conversa: Json | null
          id: string
          mission: string | null
          products_services: string | null
          session_id: string
          slogan: string | null
          social_proof: string | null
          status: string | null
          target_audience: string | null
          updated_at: string | null
          uploaded_files: string[] | null
          user_evaluation: number | null
          user_name: string | null
          user_whatsapp: string | null
          values: string | null
          vision: string | null
          website_objective: string | null
        }
        Insert: {
          additional_info?: string | null
          company_name?: string | null
          contact_info?: string | null
          conversation_log?: Json | null
          created_at?: string | null
          description?: string | null
          design_preferences?: string | null
          differentials?: string | null
          evaluation_comment?: string | null
          historico_conversa?: Json | null
          id?: string
          mission?: string | null
          products_services?: string | null
          session_id: string
          slogan?: string | null
          social_proof?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
          uploaded_files?: string[] | null
          user_evaluation?: number | null
          user_name?: string | null
          user_whatsapp?: string | null
          values?: string | null
          vision?: string | null
          website_objective?: string | null
        }
        Update: {
          additional_info?: string | null
          company_name?: string | null
          contact_info?: string | null
          conversation_log?: Json | null
          created_at?: string | null
          description?: string | null
          design_preferences?: string | null
          differentials?: string | null
          evaluation_comment?: string | null
          historico_conversa?: Json | null
          id?: string
          mission?: string | null
          products_services?: string | null
          session_id?: string
          slogan?: string | null
          social_proof?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
          uploaded_files?: string[] | null
          user_evaluation?: number | null
          user_name?: string | null
          user_whatsapp?: string | null
          values?: string | null
          vision?: string | null
          website_objective?: string | null
        }
        Relationships: []
      }
      transcripts: {
        Row: {
          action_items: Json | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          key_questions: Json | null
          owner: string | null
          participants: Json | null
          participants_count: number | null
          raw_data: Json | null
          report_url: string | null
          session_id: string
          start_time: string | null
          summary: string | null
          title: string | null
          topics: Json | null
          transcript: string | null
          trigger: string | null
          updated_at: string | null
        }
        Insert: {
          action_items?: Json | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          key_questions?: Json | null
          owner?: string | null
          participants?: Json | null
          participants_count?: number | null
          raw_data?: Json | null
          report_url?: string | null
          session_id: string
          start_time?: string | null
          summary?: string | null
          title?: string | null
          topics?: Json | null
          transcript?: string | null
          trigger?: string | null
          updated_at?: string | null
        }
        Update: {
          action_items?: Json | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          key_questions?: Json | null
          owner?: string | null
          participants?: Json | null
          participants_count?: number | null
          raw_data?: Json | null
          report_url?: string | null
          session_id?: string
          start_time?: string | null
          summary?: string | null
          title?: string | null
          topics?: Json | null
          transcript?: string | null
          trigger?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
