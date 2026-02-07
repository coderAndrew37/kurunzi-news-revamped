import "server-only";
import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID!;
const dataset = process.env.SANITY_DATASET!;
const apiVersion = "2024-01-01";
const token = process.env.SANITY_WRTE_TOKEN!;

export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // CDN not allowed for private datasets
  token, // REQUIRED
});
