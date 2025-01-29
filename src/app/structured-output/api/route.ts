import { genkit, z } from "genkit";
import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import genkitEndpoint from "@/lib/genkit-endpoint";
import { CharacterSheetSchema } from "../schema";

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

export const POST = genkitEndpoint({ schema: z.object({ prompt: z.string() }) }, ({ prompt }) =>
  ai.generateStream({
    prompt: `Generate an interesting Dungeons & Dragons character based on the following prompt: ${prompt}`,
    output: {
      schema: CharacterSheetSchema,
    },
  })
);
