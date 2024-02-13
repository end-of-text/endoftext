# endoftext

AI-powered prompt editor.

## Generating Supabase Types

1. Login to Supabase from your CLI
   `npx supabase login`

2. Generate the types file:
   `npx supabase gen types typescript --project-id vlbickgjjltwdqecarux --schema public > src/lib/supabase.ts`

3. Run prettier:
   `npm run format`

You can use the types by importing the `Tables` type from supabase and passing the table name as follows:
`Tables<'instance'>`
