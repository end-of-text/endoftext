export async function POST({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const requestData = await request.json();
	const prompt = requestData.prompt as string | undefined;
	const id = requestData.id as number | undefined;
	if (!prompt || !id) {
		return new Response('Internal Server Error', { status: 500 });
	}

	const res = await supabase
		.from('prompts')
		.update({
			prompt: prompt
		})
		.eq('id', id);

	if (res.error) {
		return new Response('Internal Server Error', { status: 500 });
	} else {
		return new Response(null, { status: 200 });
	}
}
