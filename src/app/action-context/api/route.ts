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

import { ai, z } from "@/common/genkit-beta";

// !!!START

import genkitEndpoint from "@/lib/genkit-endpoint";
import { GROUPS, UPCOMING_EVENTS } from "../data";

const upcomingEvents = ai.defineTool(
  {
    name: "upcomingEvents",
    description:
      "list upcoming events available for the current user. groupId is optional -- the tool will return all available events if it is not provided",
    inputSchema: z.object({
      groupId: z
        .string()
        .optional()
        .describe(
          'restrict event lookup only to a specific group. use "*" to search for all groups'
        ),
    }),
  },
  async ({ groupId }, { context }) => {
    if (groupId && !context.auth)
      return { error: "The user needs to authenticate to see group events." };
    // return only public events for unauthenticated
    if (!context.auth) return UPCOMING_EVENTS.filter((e) => e.public);
    if (groupId && !GROUPS[groupId])
      return { error: `Group '${groupId}' does not exist.` };
    if (groupId && !GROUPS[groupId].includes(context.auth?.uid))
      return {
        error: `User '${context.auth?.uid}' is not a member of the group '${groupId}' and cannot send it messages.`,
      };
    return UPCOMING_EVENTS.filter(
      (e) => e.public || GROUPS[e.group!].includes(context.auth?.uid)
    ).filter((e) => !groupId || e.group === groupId);
  }
);

const SYSTEM_PROMPT = `You are a helpful assistant and animal nutrition expert. Use Markdown formatting when replying. When using tools, assume the user wants to look in all groups unless they specifically mention one.

Available Groups: ${Object.keys(GROUPS).join(", ")}`;

export const POST = genkitEndpoint(async ({ messages, prompt, context }) => {
  const chat = ai.chat({
    system: `${SYSTEM_PROMPT}\n\nUser Info: ${JSON.stringify(
      context?.auth || "Current user is unauthenticated."
    )}`,
    messages,
    tools: [upcomingEvents],
    context,
  });
  return chat.sendStream({ prompt });
});
