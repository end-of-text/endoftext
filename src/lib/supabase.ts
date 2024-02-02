export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			instances: {
				Row: {
					created_at: string;
					id: number;
					input: string;
					label: string | null;
					project_id: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					input: string;
					label?: string | null;
					project_id: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					input?: string;
					label?: string | null;
					project_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'instances_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					}
				];
			};
			metrics: {
				Row: {
					created_at: string;
					id: number;
					metric: number;
					metric_name: string;
					prediction_id: number;
				};
				Insert: {
					created_at?: string;
					id?: number;
					metric: number;
					metric_name: string;
					prediction_id: number;
				};
				Update: {
					created_at?: string;
					id?: number;
					metric?: number;
					metric_name?: string;
					prediction_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'metrics_prediction_id_fkey';
						columns: ['prediction_id'];
						isOneToOne: false;
						referencedRelation: 'predictions';
						referencedColumns: ['id'];
					}
				];
			};
			predictions: {
				Row: {
					created_at: string;
					id: number;
					instance_id: number;
					prediction: string;
					prompt_id: number;
				};
				Insert: {
					created_at?: string;
					id?: number;
					instance_id: number;
					prediction: string;
					prompt_id: number;
				};
				Update: {
					created_at?: string;
					id?: number;
					instance_id?: number;
					prediction?: string;
					prompt_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'predictions_instance_id_fkey';
						columns: ['instance_id'];
						isOneToOne: false;
						referencedRelation: 'instances';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'predictions_prompt_id_fkey';
						columns: ['prompt_id'];
						isOneToOne: false;
						referencedRelation: 'prompts';
						referencedColumns: ['id'];
					}
				];
			};
			projects: {
				Row: {
					created_at: string;
					id: string | null;
					name: string;
					pk: number;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string | null;
					name: string;
					pk?: number;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string | null;
					name?: string;
					pk?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'projects_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			prompts: {
				Row: {
					created_at: string;
					id: number;
					project_id: string;
					prompt: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					project_id: string;
					prompt: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					project_id?: string;
					prompt?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'prompts_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					}
				];
			};
			users: {
				Row: {
					created_at: string;
					email: string;
					id: string;
				};
				Insert: {
					created_at?: string;
					email: string;
					id: string;
				};
				Update: {
					created_at?: string;
					email?: string;
					id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'users_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database['public']['Tables'] & Database['public']['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
				Database['public']['Views'])
		? (Database['public']['Tables'] &
				Database['public']['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof Database['public']['Enums']
		? Database['public']['Enums'][PublicEnumNameOrOptions]
		: never;
