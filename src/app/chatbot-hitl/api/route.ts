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
import { AnswerSchema, QuestionSchema } from "../schema";
import { DEFAULT_SYSTEM_MESSAGE } from "../constants";

const askQuestion = ai.defineInterrupt({
  name: "askQuestion",
  description:
    "Use this to directly ask the user a question. The user will see a custom form with the options. The response of this function call will be the user's answer.",
  inputSchema: QuestionSchema,
  outputSchema: AnswerSchema,
});

export const POST = genkitEndpoint(({ system, messages, prompt, resume }) => {
  const chat = ai.chat({
    system: system || DEFAULT_SYSTEM_MESSAGE,
    tools: [askQuestion],
    messages,
  });
  return chat.sendStream({ prompt, resume });
});
