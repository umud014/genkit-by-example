import type { GenerateResponseData, MessageData } from "genkit";
import type { GenerateRequest } from "./schema";
import type { GenerateResponseChunkData } from "genkit/model";
import { useEffect, useReducer } from "react";
import { post } from "./utils";

export interface AgentHookOptions {
  /** The URL endpoint of the agent e.g. `/api/agent`. */
  endpoint: string;
}

type ChunkData = {
  message?: GenerateResponseChunkData;
  error?: { message: string; status: string };
  result?: GenerateResponseData;
};

type State = {
  messages: MessageData[];
  pendingMessages: MessageData[];
  isLoading: boolean;
  error: ChunkData["error"] | null;
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: ChunkData["error"] | null }
  | { type: "ADD_USER_MESSAGE"; payload: MessageData }
  | { type: "UPDATE_PENDING_MESSAGES"; payload: MessageData[] }
  | { type: "COMMIT_PENDING_MESSAGES" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload, error: undefined };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_USER_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "UPDATE_PENDING_MESSAGES":
      return { ...state, pendingMessages: action.payload };
    case "COMMIT_PENDING_MESSAGES":
      if (!state.isLoading && state.pendingMessages.length) {
        return {
          ...state,
          messages: [...state.messages, ...state.pendingMessages],
          pendingMessages: [],
        };
      }
      return state;
    default:
      return state;
  }
}

export default function useAgent<T = GenerateRequest>({
  endpoint,
}: AgentHookOptions) {
  const [state, dispatch] = useReducer(reducer, {
    messages: [],
    pendingMessages: [],
    isLoading: false,
    error: null,
  });

  // Only commit messages when loading ends
  useEffect(() => {
    if (!state.isLoading) {
      dispatch({ type: "COMMIT_PENDING_MESSAGES" });
    }
  }, [state.isLoading]);

  const send = async (request: T, userMessage?: MessageData) => {
    userMessage =
      userMessage || (request as any).prompt
        ? { role: "user", content: (request as any).prompt }
        : undefined;
    if (userMessage) {
      dispatch({ type: "ADD_USER_MESSAGE", payload: userMessage });
    }

    dispatch({ type: "SET_LOADING", payload: true });
    const stream = post<T, GenerateResponseChunkData, GenerateResponseData>(
      endpoint,
      request
    );
    const newMessages: MessageData[] = [];
    for await (const chunk of stream) {
      if (chunk.message) {
        const message = chunk.message;
        console.log(message.role, message.index, message.content[0]);

        // Get existing message at index
        const existingMessage = newMessages[message.index!];

        // If there's an existing message, concatenate the content
        if (existingMessage) {
          const lastContent =
            existingMessage.content[existingMessage.content.length - 1];
          const newContent = message.content[0];

          if (lastContent.text && newContent.text) {
            // Concatenate text content
            lastContent.text += newContent.text;
          } else {
            // Add as new content if different type
            existingMessage.content.push(...message.content);
          }
        } else {
          // Create new message if none exists
          newMessages.splice(message.index!, 1, {
            role: message.role!,
            content: [...message.content],
          });
        }

        // Create a new array reference to trigger update
        dispatch({
          type: "UPDATE_PENDING_MESSAGES",
          payload: newMessages.map((msg) => ({ ...msg })),
        });
      } else if (chunk.error) {
        dispatch({
          type: "SET_ERROR",
          payload: {
            message: chunk.error.message,
            status: chunk.error.status?.toString() || "",
          },
        });
      }
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  console.log("messages:", JSON.stringify(state.messages));
  console.log("pendingMessages:", JSON.stringify(state.pendingMessages));
  return {
    isLoading: state.isLoading,
    error: state.error,
    messages: [...state.messages, ...state.pendingMessages],
    setMessages: (messages: MessageData[]) => {
      dispatch({ type: "UPDATE_PENDING_MESSAGES", payload: [] });
      dispatch({
        type: "ADD_USER_MESSAGE",
        payload: messages[messages.length - 1],
      });
    },
    send,
  };
}
