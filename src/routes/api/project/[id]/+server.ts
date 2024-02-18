export async function DELETE({ params, locals: { supabase } }) {
	await supabase.from('projects').delete().eq('id', params.id);
	return new Response(null, { status: 200 });
}
