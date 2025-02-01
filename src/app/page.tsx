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

import { Card, CardContent } from "@/components/ui/card";
import { demos } from "@/data";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Add GenAI to your web/mobile app",
  description:
    "Pre-built examples of using Firebase Genkit to build a variety of AI-powered features for Next.js applications.",
};

export default function Home() {
  return (
    <div className="my-4 max-w-screen-md mx-auto">
      <h1 className="text-4xl text-center mt-6 mb-4 font-semibold flex justify-center">
        <Image
          src="/banner.png"
          alt="Firebase Genkit"
          width={600}
          height={200}
        />
      </h1>
      <p>
        This repository contains a set of pre-built examples of using Firebase
        Genkit to build a variety of AI-powered features for Next.js
        applications.
      </p>
      <p className="mt-4">
        Each example highlights a specific feature or pattern of Genkit and
        includes source code references and a working demo. Choose an example
        from the menu on the left or click a link below to get started:
      </p>
      <Card className="p-4 mt-6">
        <table>
          <tbody>
            {demos.map((d) => (
              <tr
                className="border-b border-zinc-800 last:border-none"
                key={d.id}
              >
                <th scope="col" className="text-nowrap text-lg p-2">
                  <Link
                    href={`/${d.id}`}
                    className="block p-4 hover:bg-orange-500/10 text-orange-200 rounded-lg"
                  >
                    {d.name}
                  </Link>
                </th>
                <td className="text-sm p-2">{d.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
