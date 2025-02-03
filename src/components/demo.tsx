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

const START_MARKER = "\n// !!!START\n";
const END_MARKER = "\n// !!!END\n";

function trimSource(source: string) {
  const startIndex = source.indexOf(START_MARKER);
  const endIndex = source.indexOf(END_MARKER);
  if (startIndex >= 0)
    source = source.substring(startIndex + START_MARKER.length);
  if (endIndex >= 0) source = source.substring(0, endIndex);
  return source.trim();
}

async function loadSourceFile(
  demoId: string,
  nameOrCombine: string | { name: string; combine: string[] }
): Promise<{ name: string; source: string }> {
  if (typeof nameOrCombine === "string") {
    const name = nameOrCombine;
    return {
      name: nameOrCombine,
      source: await promises.readFile(
        name.startsWith("@/")
          ? `src${name.substring(1)}`
          : `src/app/${demoId}/${name}`,
        {
          encoding: "utf8",
        }
      )!,
    };
  }

  const source = (
    await Promise.all(
      nameOrCombine.combine.map((fn) => loadSourceFile(demoId, fn))
    )
  )
    .map((f) => trimSource(f.source))
    .join("\n\n");
  return { name: nameOrCombine.name, source };
}

async function loadSourceFiles(
  demoId: string,
  filenames: (string | { name: string; combine: string[] })[]
): Promise<{ name: string; source: string }[]> {
  return Promise.all(filenames.map((fn) => loadSourceFile(demoId, fn)));
}

export default async function Demo({
  id,
  Config,
  children,
}: {
  id: string;
  Config?: React.ComponentType;
  children: React.ReactNode;
}) {
  const { name, files: fileArgs } = mustFindDemo(id);
  const readme = await loadReadme(id);
  const files = await loadSourceFiles(id, fileArgs);

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
