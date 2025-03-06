import { demos } from "@/data";
import type { MetadataRoute } from "next";

const latestUpdate = demos.map((d) => d.added).at(-1);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://examples.genkit.dev",
      lastModified: latestUpdate,
      changeFrequency: "daily",
      priority: 1,
    },
    ...demos.map((d) => ({
      url: `https://examples.genkit.dev/${d.id}`,
      lastModified: d.added,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
