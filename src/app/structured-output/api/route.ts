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

import genkitEndpoint from "@/lib/genkit-endpoint";

import { CharacterSheetSchema } from "../schema";

import { genkit, z } from "genkit";
import { vertexAI, gemini } from "@genkit-ai/vertexai";
// import { googleAI, gemini } form "@genkit-ai/googleai"

const ai = genkit({
  plugins: [
    vertexAI(), // set GCLOUD_PROJECT and GCLOUD_LOCATION env variables
    // googleAI(), // set GOOGLE_API_KEY env variable
  ],
  model: gemini("gemini-1.5-flash"),
});

export const POST = genkitEndpoint(
  { schema: z.object({ prompt: z.string() }) },
  ({ prompt }) =>
    ai.generateStream({
      prompt: `Generate an interesting Dungeons & Dragons character based on the following prompt: ${prompt}`,
      output: {
        schema: CharacterSheetSchema,
      },
    })
);
