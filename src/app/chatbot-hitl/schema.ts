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

import { z } from "genkit";

export const QuestionSchema = z.object({
  question: z.string().describe("the text question to display to the user"),
  choices: z
    .array(z.string())
    .describe("choices for a multiple choice question"),
  allowMultiple: z
    .boolean()
    .optional()
    .describe("when true, allows the user to select multiple options"),
  allowCustom: z
    .boolean()
    .optional()
    .describe("when true, allows the user to write-in their own answer"),
});
export type Question = z.infer<typeof QuestionSchema>;

export const AnswerSchema = z.object({
  answer: z.union([z.array(z.string()), z.string()]),
});
export type Answer = z.infer<typeof AnswerSchema>;
