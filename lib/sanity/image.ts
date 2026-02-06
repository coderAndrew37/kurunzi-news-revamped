import createImageUrlBuilder from "@sanity/image-url";

const projectId = process.env.SANITY_PROJECT_ID!;
const dataset = process.env.SANITY_DATASET!;

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: any) => {
  return imageBuilder.image(source).auto("format").fit("max");
};
