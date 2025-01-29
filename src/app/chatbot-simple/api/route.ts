import { genkit } from "genkit/beta";
import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import genkitEndpoint from "@/lib/genkit-endpoint";

const ai = genkit({
  plugins: [googleAI() as any],
  model: gemini15Flash,
});

export const POST = genkitEndpoint(({ system, messages, prompt }) => {
  const chat = ai.chat({ messages, system });
  return chat.sendStream({ prompt });
});
