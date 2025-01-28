import { toReadableStream } from "@/lib/utils";
import { genkit } from "genkit";
import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import { SimpleChatbotRequestSchema } from "../schema";

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

export async function POST(request: Request) {
  const { system, history, content } = SimpleChatbotRequestSchema.parse(await request.json());

  const response = await ai.generateStream({
    system: system || "You are a helpful assistant. Try to answer the user's queries.",
    messages: history || [],
    prompt: content,
  });

  return new Response(toReadableStream(response), {
    headers: { "content-type": "text/event-stream" },
  });
}
