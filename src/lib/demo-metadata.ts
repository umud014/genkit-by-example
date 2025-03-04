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

import { findDemo } from "@/data";
import { Metadata } from "next";

export function demoMetadata(id: string): () => Promise<Metadata> {
  const demo = findDemo(id);
  return async function () {
    if (!demo) return {};
    return {
      title: demo.name,
      description: demo.description,
      openGraph: {
        images: [
          `${process.env.SITE_ORIGIN || "http://localhost:3000"}/api/og?title=${
            demo.name
          }`,
        ],
        description: demo.description,
        title: `Genkit by Example - ${demo.name}`,
      },
    };
  };
}
