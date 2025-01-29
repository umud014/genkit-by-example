import type { GenerateResponseData, MessageData } from "genkit";
import type { GenerateRequest } from "./schema";
import type { GenerateResponseChunkData } from "genkit/model";
import { useEffect, useState } from "react";
import { postAndStreamJSON } from "./utils";

export interface AgentHookOptions {
  /** The URL endpoint of the agent e.g. `/api/agent`. */
  endpoint: string;
}

type ChunkData = {
  message?: GenerateResponseChunkData;
  error?: { message: string; status: string };
  result?: GenerateResponseData;
};

export default function useAgent<T = GenerateRequest>({ endpoint }: AgentHookOptions) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [pendingMessages, setPendingMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChunkData["error"] | null>(null);

  useEffect(() => {
    if (!isLoading && pendingMessages.length) {
      setMessages([...messages, ...pendingMessages]);
      setPendingMessages([]);
    }
  }, [pendingMessages, isLoading]);

  const send = async (request: T, userMessage?: MessageData) => {
    userMessage =
      userMessage || (request as any).prompt
        ? { role: "user", content: (request as any).prompt }
        : undefined;
    if (userMessage) setMessages([...messages, userMessage]);

    setIsLoading(true);
    const stream = postAndStreamJSON<T, ChunkData>(endpoint, request);
    const newMessages: MessageData[] = [];
    for await (const chunk of stream) {
      console.log(chunk);
      if (chunk.message) {
        const message = chunk.message;
        console.log(message.role, message.index, message.content[0]);
        newMessages.splice(message.index!, 1, {
          role: message.role!,
          content: [...(newMessages[message.index!]?.content || []), ...message.content],
        });
        setPendingMessages([...newMessages]);
      } else if (chunk.error) {
        setError(chunk.error);
      }
    }
    setIsLoading(false);
  };

  return { isLoading, error, messages: [...messages, ...pendingMessages], setMessages, send };
}
