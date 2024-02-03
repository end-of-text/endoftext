export async function DELETE({ params, locals: { supabase, getSession } }) {
	const session = getSession();
	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const res = await supabase.from('instances').delete().eq('id', params.id).select();

	if (res.error) {
		return new Response(res.error.message, { status: 500 });
	}
	return new Response(null, { status: 200 });
}
