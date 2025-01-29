import { genkit } from "genkit";
import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import genkitEndpoint from "@/lib/genkit-endpoint";

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

export const POST = genkitEndpoint(({ system, messages, prompt }) =>
  ai.generateStream({
    system: system || "You are a helpful assistant. Try to answer the user's queries.",
    messages: messages || [],
    prompt,
  })
);
