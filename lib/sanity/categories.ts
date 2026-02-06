// Map your Supabase 'category' strings to Sanity's internal '_id'
const CATEGORY_MAP: Record<string, string> = {
  politics: "f7ab7546-4168-4f3e-ada9-f94ae34a68f3",
  news: "be2099fa-634f-424c-a05b-d6644e1c4f37",
  "kurunzi-exclusive": "8e4f4dea-6df1-4688-93ab-c5e737454f5b",
  entertainment: "dc8494e1-f68f-4b69-b0fd-13a26c1d6a02",
};

export function getSanityCategoryId(supabaseSlug: string): string {
  const id = CATEGORY_MAP[supabaseSlug.toLowerCase()];
  if (!id) throw new Error(`Category ${supabaseSlug} not mapped to Sanity.`);
  return id;
}
