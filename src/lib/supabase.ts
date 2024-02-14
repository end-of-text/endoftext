export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
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
					id: string;
					name: string;
					show_labels: boolean;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id: string;
					name: string;
					show_labels?: boolean;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string;
					show_labels?: boolean;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'projects_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user_subscription';
						referencedColumns: ['id'];
					},
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
					model: string;
					parent_prompt_id: number | null;
					project_id: string;
					prompt: string;
					responseFormat: string;
					temperature: number;
				};
				Insert: {
					created_at?: string;
					id?: number;
					model?: string;
					parent_prompt_id?: number | null;
					project_id: string;
					prompt: string;
					responseFormat?: string;
					temperature?: number;
				};
				Update: {
					created_at?: string;
					id?: number;
					model?: string;
					parent_prompt_id?: number | null;
					project_id?: string;
					prompt?: string;
					responseFormat?: string;
					temperature?: number;
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
			suggestions: {
				Row: {
					created_at: string;
					description: string;
					id: number;
					identifier: string;
					name: string;
					prompt_id: number;
					required_input_type: string | null;
					target_spans: number[][] | null;
					type: string;
				};
				Insert: {
					created_at?: string;
					description: string;
					id?: number;
					identifier: string;
					name: string;
					prompt_id: number;
					required_input_type?: string | null;
					target_spans?: number[][] | null;
					type: string;
				};
				Update: {
					created_at?: string;
					description?: string;
					id?: number;
					identifier?: string;
					name?: string;
					prompt_id?: number;
					required_input_type?: string | null;
					target_spans?: number[][] | null;
					type?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'suggestions_prompt_id_fkey';
						columns: ['prompt_id'];
						isOneToOne: false;
						referencedRelation: 'prompts';
						referencedColumns: ['id'];
					}
				];
			};
			user_project: {
				Row: {
					added_at: string;
					id: number;
					project_id: string;
					user_id: string;
				};
				Insert: {
					added_at?: string;
					id?: number;
					project_id: string;
					user_id: string;
				};
				Update: {
					added_at?: string;
					id?: number;
					project_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_project_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_project_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user_subscription';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_project_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
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
			user_subscription: {
				Row: {
					id: string | null;
					status: string | null;
					stripe_id: string | null;
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
};

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
