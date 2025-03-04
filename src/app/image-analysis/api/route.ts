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

import { ai, z } from "@/common/genkit";

// !!!START

import { simpleEndpoint } from "@/lib/genkit-endpoint";
import type { Part } from "genkit";
import { ImageObjectSchema } from "../schema";

interface Input {
  system: Part[]; // default: "Identify the objects in the provided image."
  imageUrl: string; // base64-encoded data uri
}

export const POST = simpleEndpoint<Input>(async ({ system, imageUrl }) => {
  const { output } = await ai.generate({
    system, // default: "Identify all of the ojects in the provided image."
    prompt: [{ media: { url: imageUrl } }], // base64-encoded data uri
    output: {
      schema: z.object({
        objects: z
          .array(ImageObjectSchema)
          .describe("list of objects in the image"),
      }),
    },
  });

  return output;
});
