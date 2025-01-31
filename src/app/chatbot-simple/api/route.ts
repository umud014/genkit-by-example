import genkitEndpoint from "@/lib/genkit-endpoint";

// import from "genkit/beta" to use the chat api
import { genkit } from "genkit/beta";

import { vertexAI, gemini15Flash } from "@genkit-ai/vertexai";
// import { googleAI, gemini15Flash } form "@genkit-ai/googleai"

const ai = genkit({
  plugins: [
    vertexAI(), // set GCLOUD_PROJECT and GCLOUD_LOCATION env variables
    // googleAI(), // set GOOGLE_API_KEY env variable
  ],
  model: gemini15Flash,
});

export const POST = genkitEndpoint(({ system, messages, prompt }) => {
  const chat = ai.chat({ messages, system });
  return chat.sendStream({ prompt });
});
