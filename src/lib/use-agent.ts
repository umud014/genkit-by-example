/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { GenerateResponseData, MessageData, Part } from "genkit";
import type { GenerateRequest } from "./schema";
import type { GenerateResponseChunkData } from "genkit/model";
import { useEffect, useReducer } from "react";
import { post } from "./utils";
import Message from "@/components/message";

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
  | { type: "SET_MESSAGES"; payload: MessageData[] }
  | { type: "ADD_USER_MESSAGE"; payload: MessageData }
  | { type: "UPDATE_PENDING_MESSAGES"; payload: MessageData[] }
  | { type: "COMMIT_PENDING_MESSAGES" }
  | { type: "RESET_CONVERSATION" };

function condenseTextParts(message: MessageData) {
  return {
    ...message,
    content: message.content.reduce((out, part) => {
      if (out[out.length - 1]?.text && part.text) {
        out[out.length - 1] = { text: out[out.length - 1].text + part.text };
      } else {
        out.push(part);
      }
      return out;
    }, [] as Part[]),
  };
}

function reducer(state: State, action: Action): State {
  console.log(action.type);
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_USER_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "UPDATE_PENDING_MESSAGES":
      console.log(state.pendingMessages, action.payload);
      return {
        ...state,
        pendingMessages: [...action.payload],
      };
    case "COMMIT_PENDING_MESSAGES":
      console.log(
        "messages:",
        state.messages.length,
        "pending:",
        state.pendingMessages.length
      );
      if (state.error) {
        return { ...state, pendingMessages: [], isLoading: false };
      }

      return {
        ...state,
        messages: [...state.messages, ...state.pendingMessages],
        pendingMessages: [],
        isLoading: false,
      };
    case "RESET_CONVERSATION":
      return {
        ...state,
        messages: [],
        pendingMessages: [],
        isLoading: false,
        error: undefined,
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: [...action.payload],
        pendingMessages: [],
        isLoading: false,
      };
    default:
      return state;
  }
}

export default function useAgent<T extends GenerateRequest = GenerateRequest>({
  endpoint,
}: AgentHookOptions) {
  const [state, dispatch] = useReducer(reducer, {
    messages: [],
    pendingMessages: [],
    isLoading: false,
    error: null,
  });

  const send = async (request: T, userMessage?: MessageData) => {
    userMessage =
      userMessage || (request as any).prompt
        ? { role: "user", content: (request as any).prompt }
        : undefined;
    if (userMessage) {
      dispatch({ type: "ADD_USER_MESSAGE", payload: userMessage });
    }

    dispatch({ type: "SET_LOADING", payload: true });
    const stream = post<
      T,
      GenerateResponseChunkData,
      GenerateResponseData & { messages: MessageData[] }
    >(endpoint, {
      ...request,
      messages: request.messages?.filter((m) => m.role !== "system"),
    });
    const newMessages: MessageData[] = [];
    for await (const chunk of stream) {
      if (chunk.message) {
        console.log(
          chunk.message.role,
          chunk.message.index,
          chunk.message.content
        );
        const message = chunk.message;

        // Get existing message at index
        const existingMessage = newMessages[message.index!];

        // If there's an existing message, concatenate the content
        if (existingMessage) {
          existingMessage.content = [
            ...existingMessage.content,
            ...message.content,
          ];
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
          payload: newMessages.map((msg) => ({
            ...msg,
            content: [...msg.content],
          })),
        });
      } else if (chunk.error) {
        dispatch({
          type: "SET_ERROR",
          payload: {
            message: chunk.error.message,
            status: chunk.error.status?.toString() || "",
          },
        });
      } else if (chunk.result) {
        console.log("RESULT MESSAGES:", chunk.result.messages);
        dispatch({
          type: "SET_MESSAGES",
          payload: chunk.result.messages,
        });
      }
    }
  };

  console.log("MESSAGES:", state.messages);
  console.log("PENDING:", state.pendingMessages[0]?.content?.[0].text);
  return {
    isLoading: state.isLoading,
    error: state.error,
    messages: [...state.messages, ...state.pendingMessages].map(
      condenseTextParts
    ),
    resetConversation: () => dispatch({ type: "RESET_CONVERSATION" }),
    send,
  };
}
