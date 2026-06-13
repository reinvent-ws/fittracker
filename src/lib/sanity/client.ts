import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Client safe config
const config = {
  projectId: "y0vrawvs",
  dataset: "production",
  apiVersion: "2026-05-15",
  useCdn: false,
};

export const client = createClient(config);

const adminConfig = {
  ...config,
  token: process.env.SANITY_API_TOKEN,
};

export const adminClient = createClient(adminConfig);

// Image URL builder
const builder = imageUrlBuilder(config);
export const urlFor = (source: string) => builder.image(source);
