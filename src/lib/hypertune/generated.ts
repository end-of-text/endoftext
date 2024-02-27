/* eslint-disable */

import * as sdk from 'hypertune';

const queryCode = `query FullQuery{root{personaEditor convertToJSONEditor compressionEditor outputDescriptionEditor jsonDescriptionEditor jsonInstructionEditor separateInstructionsEditor noNegationEditor shorterEditor longerEditor}}`;

const query = {
	Query: {
		objectTypeName: 'Query',
		selection: {
			root: {
				fieldArguments: { __isPartialObject__: true },
				fieldQuery: {
					Root: {
						objectTypeName: 'Root',
						selection: {
							personaEditor: { fieldArguments: {}, fieldQuery: null },
							convertToJSONEditor: { fieldArguments: {}, fieldQuery: null },
							compressionEditor: { fieldArguments: {}, fieldQuery: null },
							outputDescriptionEditor: { fieldArguments: {}, fieldQuery: null },
							jsonDescriptionEditor: { fieldArguments: {}, fieldQuery: null },
							jsonInstructionEditor: { fieldArguments: {}, fieldQuery: null },
							separateInstructionsEditor: { fieldArguments: {}, fieldQuery: null },
							noNegationEditor: { fieldArguments: {}, fieldQuery: null },
							shorterEditor: { fieldArguments: {}, fieldQuery: null },
							longerEditor: { fieldArguments: {}, fieldQuery: null }
						}
					}
				}
			}
		}
	}
};

function mergeQueryAndArgs(
	query: sdk.Query<sdk.ObjectValueWithVariables>,
	queryArgs: sdk.ObjectValueWithVariables | null,
	unwrapObjectArgs = false
): sdk.Query<sdk.ObjectValueWithVariables> {
	return Object.fromEntries(
		Object.entries(query).map(([objectTypeName, fragment]) => {
			const objectArgs = unwrapObjectArgs
				? queryArgs && queryArgs[objectTypeName] && queryArgs[objectTypeName] instanceof Object
					? (queryArgs[objectTypeName] as sdk.ObjectValueWithVariables)
					: null
				: queryArgs;

			return [
				objectTypeName,
				{
					objectTypeName,
					selection: Object.fromEntries(
						Object.entries(fragment.selection).map(([fieldName, { fieldQuery }]) => {
							const fieldArgs =
								objectArgs && objectArgs[fieldName] && objectArgs[fieldName] instanceof Object
									? (objectArgs[fieldName] as sdk.ObjectValueWithVariables)
									: null;

							return [
								fieldName,
								{
									fieldArguments: {
										...(fieldArgs && fieldArgs.args
											? (fieldArgs.args as sdk.ObjectValueWithVariables)
											: {})
									},
									fieldQuery: fieldQuery ? mergeQueryAndArgs(fieldQuery, fieldArgs, true) : null
								}
							];
						})
					)
				}
			];
		})
	);
}

export const vercelFlagDefinitions = {
	personaEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EpersonaEditor'
	},
	convertToJSONEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EconvertToJSONEditor'
	},
	compressionEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EcompressionEditor'
	},
	outputDescriptionEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EoutputDescriptionEditor'
	},
	jsonDescriptionEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EjsonDescriptionEditor'
	},
	jsonInstructionEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EjsonInstructionEditor'
	},
	separateInstructionsEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EseparateInstructionsEditor'
	},
	noNegationEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EnoNegationEditor'
	},
	shorterEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EshorterEditor'
	},
	longerEditor: {
		options: [{ value: true }, { value: false }],
		origin:
			'https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3ElongerEditor'
	}
};

export type Rec = {};

export type Rec4 = {
	id: string;
	name: string;
	email: string;
};

export const EnvironmentEnumValues = ['DEVELOPMENT', 'STAGING', 'PRODUCTION'] as const;
export type Environment = (typeof EnvironmentEnumValues)[number];

export type Rec3 = {
	user: Rec4;
	environment: Environment;
};

export type Rec2 = {
	context: Rec3;
};

export type Root = {
	personaEditor: boolean;
	convertToJSONEditor: boolean;
	compressionEditor: boolean;
	outputDescriptionEditor: boolean;
	jsonDescriptionEditor: boolean;
	jsonInstructionEditor: boolean;
	separateInstructionsEditor: boolean;
	noNegationEditor: boolean;
	shorterEditor: boolean;
	longerEditor: boolean;
};

const rootFallback = {
	personaEditor: false,
	convertToJSONEditor: false,
	compressionEditor: false,
	outputDescriptionEditor: false,
	jsonDescriptionEditor: false,
	jsonInstructionEditor: false,
	separateInstructionsEditor: false,
	noNegationEditor: false,
	shorterEditor: false,
	longerEditor: false
};

export class RootNode extends sdk.Node {
	typeName = 'Root' as const;

	get(fallback: Root = rootFallback as Root): Root {
		const getQuery = null;
		return this.evaluate(getQuery, fallback) as Root;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EpersonaEditor})
	 */
	personaEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('personaEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EconvertToJSONEditor})
	 */
	convertToJSONEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('convertToJSONEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EcompressionEditor})
	 */
	compressionEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('compressionEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EoutputDescriptionEditor})
	 */
	outputDescriptionEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('outputDescriptionEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EjsonDescriptionEditor})
	 */
	jsonDescriptionEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('jsonDescriptionEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EjsonInstructionEditor})
	 */
	jsonInstructionEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('jsonInstructionEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EseparateInstructionsEditor})
	 */
	separateInstructionsEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('separateInstructionsEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EnoNegationEditor})
	 */
	noNegationEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('noNegationEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3EshorterEditor})
	 */
	shorterEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('shorterEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}

	/**
	 * [Open in UI]({@link https://app.hypertune.com/projects/3170/draft?view=logic&selected_field_path=root%3ElongerEditor})
	 */
	longerEditor(args: Rec = {}): sdk.BooleanNode {
		const props0 = this.getField('longerEditor', args);
		const expression0 = props0.expression;

		if (expression0 && expression0.type === 'BooleanExpression') {
			return new sdk.BooleanNode(props0);
		}

		const node = new sdk.BooleanNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}
}

/**
 * Welcome to Hypertune, the most powerful feature flag, A/B testing and app
 * configuration platform.
 *
 * Follow the quickstart: https://docs.hypertune.com/quickstart
 *
 * This is your schema, written in GraphQL. Use Boolean for feature flags,
 * custom enums for flags with more than two states, Int for numeric flags like
 * limits and timeouts, Strings for in-app copy, and custom object and list types
 * for more complex app configuration.
 *
 * Once you've defined your schema, head to the Logic tab.
 */
export type Query = {
	/**
	 * You can add arguments to any field in your schema, which you can then
	 * reference when defining your logic. We've added a 'context' argument on your
	 * root field already, which contains details of the current 'user'.
	 */
	root: Root;
};

const queryFallback = {
	root: {
		personaEditor: false,
		convertToJSONEditor: false,
		compressionEditor: false,
		outputDescriptionEditor: false,
		jsonDescriptionEditor: false,
		jsonInstructionEditor: false,
		separateInstructionsEditor: false,
		noNegationEditor: false,
		shorterEditor: false,
		longerEditor: false
	}
};

export type Rec6 = {
	args: Rec2;
};

export type Rec5 = {
	root: Rec6;
};

/**
 * Welcome to Hypertune, the most powerful feature flag, A/B testing and app
 * configuration platform.
 *
 * Follow the quickstart: https://docs.hypertune.com/quickstart
 *
 * This is your schema, written in GraphQL. Use Boolean for feature flags,
 * custom enums for flags with more than two states, Int for numeric flags like
 * limits and timeouts, Strings for in-app copy, and custom object and list types
 * for more complex app configuration.
 *
 * Once you've defined your schema, head to the Logic tab.
 */
export class QueryNode extends sdk.Node {
	typeName = 'Query' as const;

	get(args: Rec5, fallback: Query = queryFallback as Query): Query {
		const getQuery = mergeQueryAndArgs(query, args);
		return this.evaluate(getQuery, fallback) as Query;
	}

	/**
	 * You can add arguments to any field in your schema, which you can then
	 * reference when defining your logic. We've added a 'context' argument on your
	 * root field already, which contains details of the current 'user'.
	 */
	root(args: Rec2): RootNode {
		const props0 = this.getField('root', args);
		const expression0 = props0.expression;

		if (
			expression0 &&
			expression0.type === 'ObjectExpression' &&
			expression0.objectTypeName === 'Root'
		) {
			return new RootNode(props0);
		}

		const node = new RootNode(props0);
		node._logUnexpectedTypeError();
		return node;
	}
}

export function initializeHypertune(
	variableValues: Rec,
	options: sdk.InitializeOptions = {}
): QueryNode {
	const defaultOptions = {
		query,
		queryCode,
		variableValues
	};

	return sdk.initialize(QueryNode, { ...defaultOptions, ...options });
}
