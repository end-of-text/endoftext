import { ENDOFTEXT_API_KEY } from '$env/static/private';

export async function fetchPrompt(projectId: string, promptId: string) {
	return await fetch(
		`https://app.endoftext.app/api/serve/project/${projectId}/prompt/${promptId}`,
		{
			headers: {
				'x-api-key': ENDOFTEXT_API_KEY
			}
		}
	);
}
