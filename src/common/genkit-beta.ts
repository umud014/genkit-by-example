import { z } from "genkit";
// this example requires beta features
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

// !!!END

export { ai, z };
