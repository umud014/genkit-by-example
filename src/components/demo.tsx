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

import { promises } from "fs";
import { mustFindDemo } from "@/data";
import DemoContent from "./demo-content";

async function loadReadme(demoName: string): Promise<string> {
  const file = await promises.readFile(`src/app/${demoName}/README.md`, {
    encoding: "utf8",
  });
  return file.split("\n").slice(2).join("\n").trim();
}

async function loadSourceFiles(
  demoName: string,
  filenames: string[]
): Promise<{ name: string; source: string }[]> {
  return Promise.all(
    filenames.map(async (fn) => ({
      name: fn,
      source: await promises.readFile(`src/app/${demoName}/${fn}`, {
        encoding: "utf8",
      }),
    }))
  );
}

export default async function Demo({
  id,
  Config,
  children,
  sourceFiles,
}: {
  id: string;
  Config?: React.ComponentType;
  children: React.ReactNode;
  sourceFiles?: string[];
}) {
  const { name } = mustFindDemo(id);
  const readme = await loadReadme(id);
  const files = await loadSourceFiles(id, sourceFiles || ["api/route.ts"]);

  return (
    <DemoContent
      id={id}
      name={name}
      Config={Config}
      readme={readme}
      files={files}
    >
      {children}
    </DemoContent>
  );
}
