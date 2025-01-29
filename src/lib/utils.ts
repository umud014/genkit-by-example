import { clsx, type ClassValue } from "clsx";
import type { GenerateStreamResponse, MessageData, Part } from "genkit";
import { GenerateResponseChunkData } from "genkit/model";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toReadableStream(
  response: GenerateStreamResponse,
  transform?: (chunk: GenerateResponseChunkData & { output: unknown }) => any
) {
  return new ReadableStream({
    async pull(controller) {
      for await (const chunk of response.stream) {
        controller.enqueue(
          `data: ${JSON.stringify({
            message: transform ? transform(chunk) : { ...chunk.toJSON(), output: chunk.output },
          })}\n\n`
        );
      }
      controller.enqueue(`data: {"result": null}`);
      controller.close();
    },
  });
}

export async function* post<ReqData = unknown, ChunkData = unknown, ResultData = unknown>(
  path: string,
  data: ReqData
): AsyncIterable<{
  message: ChunkData;
  result: ResultData;
  error: { message: string; status: string };
}> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to POST to ${path}: ${response.status} ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body to read");
  }

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += new TextDecoder().decode(value);
    const lines = buffer.split("\n\n");
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line.startsWith("data: ")) {
        const jsonStr = line.substring("data: ".length);
        try {
          const chunk = JSON.parse(jsonStr);
          yield chunk; // Assuming the actual data is under the "message" key
        } catch (error) {
          console.error("Failed to parse JSON chunk:", jsonStr, error);
        }
      }
    }
    buffer = lines[lines.length - 1];
  }
}

export function applyChunk(
  chunk: GenerateResponseChunkData,
  setter: (handler: (messages: MessageData[]) => MessageData[]) => void
) {
  setter((messages) => {
    const out = [...messages];
    const existingParts = out[chunk.index!]?.content || [];
    out.splice(chunk.index!, 1, {
      role: chunk.role!,
      content: [...existingParts, ...chunk.content],
    });
    console.log("IN SETTER RETURNING", out);
    return out;
  });
}

export function compactParts(parts: Part[]): Part[] {
  const out: Part[] = [];
  for (const part of parts) {
    const lastPart = out.at(-1);
    if (lastPart?.text && part.text) lastPart.text += part.text;
    else out.push(part);
  }
  return out;
}
