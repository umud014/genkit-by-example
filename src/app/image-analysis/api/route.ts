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
import genkitEndpoint from "@/lib/genkit-endpoint";
import { RouteHandler } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { ImageObjectSchema } from "../schema";

// !!!START

const RequestSchema = z.object({
  imageUri: z.string().describe("base64 image uri"),
});

export const POST = genkitEndpoint(
  {
    schema: z.object({ imageUrl: z.string().describe("base64 image uri") }),
  },
  async ({ imageUrl }) =>
    ai.generateStream({
      prompt: [
        { text: "Identify all the objects in this image." },
        { media: { url: imageUrl } },
      ],
      output: {
        schema: z
          .array(ImageObjectSchema)
          .describe("an array of objects that were detected in the image"),
      },
    })
);
