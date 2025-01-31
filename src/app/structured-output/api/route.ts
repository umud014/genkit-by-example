import genkitEndpoint from "@/lib/genkit-endpoint";

import { CharacterSheetSchema } from "../schema";

import { genkit, z } from "genkit";
import { vertexAI, gemini15Flash } from "@genkit-ai/vertexai";
// import { googleAI, gemini15Flash } form "@genkit-ai/googleai"

const ai = genkit({
  plugins: [
    vertexAI(), // set GCLOUD_PROJECT and GCLOUD_LOCATION env variables
    // googleAI(), // set GOOGLE_API_KEY env variable
  ],
  model: gemini15Flash,
});

export const POST = genkitEndpoint(
  { schema: z.object({ prompt: z.string() }) },
  ({ prompt }) =>
    ai.generateStream({
      prompt: `Generate an interesting Dungeons & Dragons character based on the following prompt: ${prompt}`,
      output: {
        schema: CharacterSheetSchema,
      },
    })
);
