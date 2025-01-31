import genkitEndpoint from "@/lib/genkit-endpoint";

// import from "genkit/beta" to use the chat api
import { genkit } from "genkit/beta";

import { vertexAI, gemini } from "@genkit-ai/vertexai";
// import { googleAI, gemini } form "@genkit-ai/googleai"

const ai = genkit({
  plugins: [
    vertexAI(), // set GCLOUD_PROJECT and GCLOUD_LOCATION env variables
    // googleAI(), // set GOOGLE_API_KEY env variable
  ],
  model: gemini("gemini-1.5-flash"),
});

export const POST = genkitEndpoint(({ system, messages, prompt }) => {
  const chat = ai.chat({ messages, system });
  return chat.sendStream({ prompt });
});
