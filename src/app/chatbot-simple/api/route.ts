import { genkit } from "genkit/beta";

import genkitEndpoint from "@/lib/genkit-endpoint";
import { vertexAI, gemini15Flash } from "@genkit-ai/vertexai";

const ai = genkit({
  plugins: [
    vertexAI({ projectId: "bleigh-genkit-test", location: "us-central1" }),
  ],
  model: gemini15Flash,
});

export const POST = genkitEndpoint(({ system, messages, prompt }) => {
  const chat = ai.chat({ messages, system });
  return chat.sendStream({ prompt });
});
